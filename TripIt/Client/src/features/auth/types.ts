import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  externalAuthId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string | null;
  isAdmin: boolean;
  isOnboardingCompleted: boolean;
};

export type AuthState = {
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasInitialized: boolean;
};

export type SyncUserRequest = {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};
