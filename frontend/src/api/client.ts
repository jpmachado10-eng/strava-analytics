const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function handleJson<ResponseType>(res: Response): Promise<ResponseType> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return (await res.json()) as ResponseType;
}

export type SummaryResponse = {
  activity_count: number;
  distance_m: number;
  moving_time_s: number;
  elevation_gain_m: number;
  since: string;
};

export type WeeklyMileagePoint = {
  week_start: string;
  distance_m: number;
};

export type AIResponse = {
  summary_text: string;
  suggested_charts: string[];
  insights: string[];
};

const DEFAULT_USER_ID = 1;

export async function fetchSummary(range = "last_4_weeks", userId = DEFAULT_USER_ID) {
  const url = new URL(`${API_BASE_URL}/analytics/summary`);
  url.searchParams.set("user_id", String(userId));
  url.searchParams.set("range", range);
  return handleJson<SummaryResponse>(await fetch(url));
}

export async function fetchWeeklyMileage(weeks = 8, userId = DEFAULT_USER_ID) {
  const url = new URL(`${API_BASE_URL}/analytics/weekly-mileage`);
  url.searchParams.set("user_id", String(userId));
  url.searchParams.set("weeks", String(weeks));
  return handleJson<WeeklyMileagePoint[]>(await fetch(url));
}

export async function askAI(question: string, userId = DEFAULT_USER_ID) {
  const res = await fetch(`${API_BASE_URL}/analytics/ai-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, user_id: userId }),
  });
  return handleJson<AIResponse>(res);
}

