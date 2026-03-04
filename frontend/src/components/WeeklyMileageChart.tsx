import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { WeeklyMileagePoint } from "../api/client";

type Props = {
  data: WeeklyMileagePoint[];
};

function formatWeekLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatKm(meters: number) {
  return (meters / 1000).toFixed(1);
}

export function WeeklyMileageChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        ...p,
        weekLabel: formatWeekLabel(p.week_start),
        distanceKm: Number(formatKm(p.distance_m)),
      })),
    [data],
  );

  if (!chartData.length) {
    return (
      <div className="flex min-h-[140px] items-center justify-center text-xs text-slate-500">
        Weekly mileage will appear here once your activities are synced.
      </div>
    );
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="mileageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="weekLabel"
            tickMargin={6}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}k`}
            width={28}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderRadius: 8,
              border: "1px solid #1e293b",
              fontSize: 12,
            }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(value: number) => [`${value.toFixed(1)} km`, "Distance"]}
          />
          <Area
            type="monotone"
            dataKey="distanceKm"
            stroke="#fb923c"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#mileageGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

