export function ActivitiesPage() {
  return (
    <div className="mt-2 flex flex-1 flex-col gap-2">
      <h1 className="text-xl font-semibold tracking-tight">Activities</h1>
      <p className="text-sm text-slate-300">
        This page will list your Strava activities and let you dive into details for each workout.
      </p>
      <div className="mt-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-xs text-slate-400">
        Once your account is connected and data synced, recent activities will appear here with
        filters and charts.
      </div>
    </div>
  );
}

