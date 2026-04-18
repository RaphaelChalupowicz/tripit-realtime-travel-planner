import { useEffect, useState } from "react";
import { getHealth } from "../../services/healthService";

export default function HealthCheck() {
  const [message, setMessage] = useState<string>("Checking API...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getHealth().then((result) => {
      if (!active) {
        return;
      }

      if (result.success && result.data) {
        setMessage(result.data.message);
        setError(null);
        return;
      }

      setMessage("API call failed");
      setError(result.error ?? "Unknown error");
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <img src="./favicon.png" alt="TripIt Logo" className="h-24 w-24" />
      <h1 className="text-2xl font-semibold">TripIt</h1>
      <p className="text-lg">{message}</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
