import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function ProtectedRoute() {
  const { isLoading, isAuthenticated, appUser, hasInitialized } =
    useAuthStore();
  const location = useLocation();

  if (isLoading && !hasInitialized) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated || !appUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    !appUser.isOnboardingCompleted &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
}
