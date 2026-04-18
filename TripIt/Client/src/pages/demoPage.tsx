import { Link } from "react-router-dom";

export default function Demo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <img src="./favicon.png" alt="TripIt Logo" className="h-24 w-24" />
      <h1 className="text-2xl font-semibold">TripIt</h1>
      <p className="text-sm text-slate-600">Realtime travel planner workspace</p>
      <Link
        to="/health-check"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Run API Health Check
      </Link>
    </div>
  );
}
