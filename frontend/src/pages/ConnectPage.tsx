import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export function ConnectPage() {
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/strava/login`)
      .then((r) => r.json())
      .then((data) => setAuthorizeUrl(data.authorize_url))
      .catch(() => setAuthorizeUrl(null));
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Connect your Strava</h1>
      <p className="max-w-sm text-sm text-slate-300">
        Link your Strava account so we can pull your activities and build personalized analytics
        dashboards for you.
      </p>
      <button
        type="button"
        disabled={!authorizeUrl}
        onClick={() => authorizeUrl && window.location.assign(authorizeUrl)}
        className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {authorizeUrl ? "Connect with Strava" : "Loading..."}
      </button>
    </div>
  );
}

