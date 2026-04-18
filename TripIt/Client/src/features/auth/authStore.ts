import { create } from "zustand";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import {
  deleteCurrentUser,
  completeProfile as completeProfileApi,
  getCurrentUser,
  syncUser,
} from "./authApi";
import type { AppUser, AuthState } from "./types";

type CompleteProfilePayload = {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
};

type AuthStore = AuthState & {
  initializeAuth: () => Promise<void>;
  setSessionData: (
    session: Session | null,
    supabaseUser: SupabaseUser | null,
  ) => void;
  setAppUser: (appUser: AppUser | null) => void;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  completeProfile: (payload: CompleteProfilePayload) => Promise<void>;
};

let initPromise: Promise<void> | null = null;

async function deleteLocalUserIfPossible(): Promise<void> {
  try {
    await deleteCurrentUser();
  } catch (error) {
    console.warn("Failed to delete local user during auth cleanup:", error);
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  supabaseUser: null,
  appUser: null,
  isLoading: true,
  isAuthenticated: false,
  hasInitialized: false,

  setSessionData: (session, supabaseUser) =>
    set({
      session,
      supabaseUser,
      isAuthenticated: !!session && !!supabaseUser,
    }),

  setAppUser: (appUser) =>
    set({
      appUser,
    }),

  initializeAuth: async () => {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const shouldShowLoading = !get().hasInitialized;

      if (shouldShowLoading) {
        set({ isLoading: true });
      }

      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          await deleteLocalUserIfPossible();
          await supabase.auth.signOut();

          set({
            session: null,
            supabaseUser: null,
            appUser: null,
            isAuthenticated: false,
            hasInitialized: true,
            isLoading: false,
          });
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const supabaseUser = session?.user ?? currentUser;

        if (!session) {
          await deleteLocalUserIfPossible();
          await supabase.auth.signOut();

          set({
            session: null,
            supabaseUser: null,
            appUser: null,
            isAuthenticated: false,
            hasInitialized: true,
            isLoading: false,
          });
          return;
        }

        set({
          session,
          supabaseUser,
          isAuthenticated: !!session && !!supabaseUser,
        });

        await syncUser({
          firstName:
            (supabaseUser.user_metadata?.first_name as string) ?? undefined,
          lastName:
            (supabaseUser.user_metadata?.last_name as string) ?? undefined,
          profileImageUrl:
            (supabaseUser.user_metadata?.avatar_url as string) ??
            (supabaseUser.user_metadata?.picture as string) ??
            undefined,
        });

        const appUser = await getCurrentUser();

        set({
          appUser,
          hasInitialized: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("initializeAuth failed:", error);

        await deleteLocalUserIfPossible();
        await supabase.auth.signOut();

        set({
          session: null,
          supabaseUser: null,
          appUser: null,
          isAuthenticated: false,
          hasInitialized: true,
          isLoading: false,
        });
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  signUpWithEmail: async (email, password, firstName, lastName) => {
    set({ isLoading: true });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName ?? "",
          last_name: lastName ?? "",
        },
      },
    });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    await get().initializeAuth();
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    await get().initializeAuth();
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    const { error } = await supabase.auth.signOut();

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    set({
      session: null,
      supabaseUser: null,
      appUser: null,
      isAuthenticated: false,
      hasInitialized: true,
      isLoading: false,
    });
  },

  completeProfile: async (payload: CompleteProfilePayload) => {
    set({ isLoading: true });

    try {
      const updatedUser = await completeProfileApi(payload);

      set({
        appUser: updatedUser,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
