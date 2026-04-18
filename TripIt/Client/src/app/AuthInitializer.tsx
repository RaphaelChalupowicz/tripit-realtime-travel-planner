import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../features/auth/authStore";

export default function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      initializeAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  return null;
}
