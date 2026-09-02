
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";

const summaryConfig = [
  {
    key: "critical",
    label: "Critical",
    description: "Requires immediate attention",
    icon: AlertCircle,
    iconClass: "text-red-400",
    iconBg: "bg-red-400/[0.08]",
    border: "border-red-400/[0.12]",
    accent: "bg-red-400",
  },
  {
    key: "warning",
    label: "Warning",
    description: "Outside the normal range",
    icon: AlertTriangle,
    iconClass: "text-amber-400",
    iconBg: "bg-amber-400/[0.08]",
    border: "border-amber-400/[0.12]",
    accent: "bg-amber-400",
  },
  {
    key: "normal",
    label: "Normal",
    description: "Within the reference range",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    iconBg: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/[0.12]",
    accent: "bg-emerald-400",
  },
];

export default function SummaryCards({
  results = [],
  summary = null,
}) {
  /*
   * Prefer the backend-generated summary.
   *
   * The backend is the source of truth for the analysis result,
   * so the frontend should display those values instead of
   * duplicating summary/business logic.
   *
   * The fallback keeps the component resilient if summary is
   * temporarily unavailable.
   */
  const counts = summary
    ? {
        critical: summary.critical ?? 0,
        warning: summary.warning ?? 0,
        normal: summary.normal ?? 0,
      }
    : {
        critical: results.filter(
          (result) => result?.severity === "Critical",
        ).length,
        warning: results.filter(
          (result) => result?.severity === "Warning",
        ).length,
        normal: results.filter(
          (result) => result?.severity === "Normal",
        ).length,
      };

  const total = summary?.total ?? results.length;

  return (
    <section className="w-full px-0 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="mb-7 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Activity
                size={17}
                strokeWidth={1.8}
                className="text-violet-400"
              />

              <span className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-500">
                Analysis Overview
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Results at a glance
            </h2>
          </div>

          {/* Total Results */}
          <div className="flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-violet-400" />

            <span className="text-sm font-medium text-zinc-400">
              {total} {total === 1 ? "result" : "results"} analyzed
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {summaryConfig.map((item) => {
            const Icon = item.icon;
            const count = counts[item.key];
            const percentage =
              total > 0 ? (count / total) * 100 : 0;

            return (
              <div
                key={item.key}
                className={`group relative overflow-hidden rounded-2xl border ${item.border} bg-zinc-900/60 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900/80 sm:p-6`}
              >
                {/* Top Accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-px opacity-60 ${item.accent}`}
                />

                {/* Background Glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full ${item.iconBg} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative">
                  {/* Card Top */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.05] ${item.iconBg}`}
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                        className={item.iconClass}
                      />
                    </div>

                    <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  {/* Count */}
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      {String(count).padStart(2, "0")}
                    </span>

                    <span
                      className={`mb-1.5 text-sm font-medium ${item.iconClass}`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-[15px] leading-6 text-zinc-500">
                    {item.description}
                  </p>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${item.accent} transition-all duration-700`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {total === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] px-5 py-4 text-center">
            <p className="text-sm text-zinc-600">
              Analysis results will appear here once you submit
              your laboratory values.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

