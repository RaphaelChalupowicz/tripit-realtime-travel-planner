import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(`Failed to sign in. \n ${error}`);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign in with Google.");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <form onSubmit={handleEmailLogin} className="space-y-4">
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
          Sign in
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full rounded border p-3"
        disabled={isLoading}
      >
        Continue with Google
      </button>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <p className="mt-6 text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
