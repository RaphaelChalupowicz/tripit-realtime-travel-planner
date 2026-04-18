import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { appUser, signOut, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-4 rounded border p-4">
        <p>
          <strong>Name:</strong> {appUser?.firstName} {appUser?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {appUser?.email}
        </p>
        <p>
          <strong>Admin:</strong> {appUser?.isAdmin ? "Yes" : "No"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 rounded bg-red-600 px-4 py-2 text-white"
        disabled={isLoading}
      >
        Sign out
      </button>
    </div>
  );
}
