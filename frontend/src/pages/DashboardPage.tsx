import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { askAI, fetchSummary, fetchWeeklyMileage, type AIResponse, type SummaryResponse } from "../api/client";
import { WeeklyMileageChart } from "../components/WeeklyMileageChart";

export function DashboardPage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [mileage, setMileage] = useState<ReturnType<typeof Array.from> | any[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingMileage, setLoadingMileage] = useState(true);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<AIResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingSummary(true);
    fetchSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoadingSummary(false));

    setLoadingMileage(true);
    fetchWeeklyMileage()
      .then(setMileage)
      .catch(() => setMileage([]))
      .finally(() => setLoadingMileage(false));
  }, []);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await askAI(aiQuestion.trim());
      setAiAnswer(res);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

  const distanceKm =
    summary && summary.distance_m
      ? (summary.distance_m / 1000).toFixed(1)
      : "—";
  const hours =
    summary && summary.moving_time_s
      ? (summary.moving_time_s / 3600).toFixed(1)
      : "—";
  const elevation =
    summary && summary.elevation_gain_m
      ? summary.elevation_gain_m.toFixed(0)
      : "—";
  const activities =
    summary && summary.activity_count
      ? summary.activity_count.toString()
      : "—";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="mt-2 flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-slate-300">
          Recent training load, weekly mileage, and AI-generated insights based on your Strava
          activities.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Last 4 weeks</p>
          <p className="mt-1 text-lg font-semibold">
            {loadingSummary ? "…" : `${distanceKm} km`}
          </p>
          <p className="text-xs text-slate-500">Distance</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Last 4 weeks</p>
          <p className="mt-1 text-lg font-semibold">
            {loadingSummary ? "…" : `${hours} h`}
          </p>
          <p className="text-xs text-slate-500">Moving time</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Last 4 weeks</p>
          <p className="mt-1 text-lg font-semibold">
            {loadingSummary ? "…" : `${elevation} m`}
          </p>
          <p className="text-xs text-slate-500">Elevation gain</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Last 4 weeks</p>
          <p className="mt-1 text-lg font-semibold">
            {loadingSummary ? "…" : activities}
          </p>
          <p className="text-xs text-slate-500">Activities</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Weekly mileage</h2>
          <span className="text-xs text-slate-500">Last 8 weeks</span>
        </div>
        {loadingMileage ? (
          <div className="flex min-h-[140px] items-center justify-center text-xs text-slate-500">
            Loading mileage…
          </div>
        ) : (
          <WeeklyMileageChart data={mileage as any} />
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">AI Assistant</h2>
          <Link
            to="/connect"
            className="text-xs font-medium text-orange-400 hover:text-orange-300"
          >
            Connect Strava →
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          Ask anything about your training, like &quot;How has my weekly mileage changed in the last
          3 months?&quot; or &quot;Am I doing enough elevation for a trail marathon?&quot;
        </p>
        <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/70 p-2">
          <textarea
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            rows={2}
            placeholder="Type a question about your Strava data…"
            className="w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-orange-400"
          />
          <div className="flex items-center justify-between gap-2">
            {aiError && <p className="text-xs text-red-400">{aiError}</p>}
            <button
              type="button"
              onClick={handleAskAI}
              disabled={aiLoading || !aiQuestion.trim()}
              className="ml-auto rounded-full bg-orange-500 px-4 py-1 text-xs font-medium text-white shadow hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {aiLoading ? "Asking…" : "Ask AI"}
            </button>
          </div>
          {aiAnswer && (
            <div className="mt-1 flex flex-col gap-1 rounded-md bg-slate-950/60 p-2 text-xs text-slate-200">
              <p>{aiAnswer.summary_text}</p>
              {aiAnswer.insights.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-[11px] text-slate-300">
                  {aiAnswer.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

