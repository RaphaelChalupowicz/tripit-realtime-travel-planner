import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signUpWithEmail(email, password, firstName, lastName);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to register.");
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to continue with Google.");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full rounded border p-3"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-3 text-white"
          disabled={isLoading}
        >
          Create account
        </button>
      </form>

      <button
        onClick={handleGoogleRegister}
        className="mt-4 w-full rounded border p-3"
        disabled={isLoading}
      >
        Continue with Google
      </button>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
}
