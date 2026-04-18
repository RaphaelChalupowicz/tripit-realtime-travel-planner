import { Navigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

export default function HomePage() {
  const { isLoading, isAuthenticated, appUser } = useAuthStore();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isAuthenticated && appUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold">TripIt</h1>

        <div className="flex gap-3">
          <Link to="/login" className="rounded border px-4 py-2">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              TripIt — making trips should be easy!
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Plan trips visually, organize your itinerary, manage your budget,
              and collaborate with friends or family in real time.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="rounded bg-black px-5 py-3 text-white"
              >
                Start Planning
              </Link>
              <Link to="/login" className="rounded border px-5 py-3">
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border p-8 shadow-sm">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                📍 Visual trip map with destinations
              </div>
              <div className="rounded-lg border p-4">
                🗓️ Day-by-day itinerary builder
              </div>
              <div className="rounded-lg border p-4">
                💸 Budget and expense tracking
              </div>
              <div className="rounded-lg border p-4">
                👥 Share trips with editors or viewers
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h3 className="text-3xl font-bold">Why TripIt?</h3>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border p-6">
              <h4 className="text-xl font-semibold">Collaborative</h4>
              <p className="mt-3 text-gray-600">
                Plan trips with friends and family in one shared workspace.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h4 className="text-xl font-semibold">Organized</h4>
              <p className="mt-3 text-gray-600">
                Keep maps, notes, itinerary, and budget together.
              </p>
            </div>

            <div className="rounded-2xl border p-6">
              <h4 className="text-xl font-semibold">Responsive</h4>
              <p className="mt-3 text-gray-600">
                Use it comfortably on desktop, tablet, or phone.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24 rounded-2xl bg-gray-100 p-10 text-center">
          <h3 className="text-3xl font-bold">Start your next trip today</h3>
          <p className="mt-4 text-gray-600">
            Create a trip, invite collaborators, and keep everything in one
            place.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded bg-black px-5 py-3 text-white"
          >
            Create Free Account
          </Link>
        </section>
      </main>
    </div>
  );
}
