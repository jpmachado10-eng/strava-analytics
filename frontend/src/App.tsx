import { Route, Routes, NavLink } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { ConnectPage } from "./pages/ConnectPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">Strava Analytics</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 pb-16">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </main>

      <nav className="sticky bottom-0 z-10 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-around py-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 ${
                isActive ? "text-orange-400" : "text-slate-400"
              }`
            }
          >
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 ${
                isActive ? "text-orange-400" : "text-slate-400"
              }`
            }
          >
            <span>Activities</span>
          </NavLink>
          <NavLink
            to="/connect"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 ${
                isActive ? "text-orange-400" : "text-slate-400"
              }`
            }
          >
            <span>Connect</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

