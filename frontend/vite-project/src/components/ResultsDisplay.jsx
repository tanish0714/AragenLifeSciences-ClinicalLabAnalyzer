
import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ListFilter,
  SlidersHorizontal,
} from "lucide-react";
import ResultCard from "./ResultCard";

const FILTERS = [
  {
    key: "All",
    label: "All Results",
    icon: Activity,
  },
  {
    key: "Critical",
    label: "Critical",
    icon: AlertCircle,
  },
  {
    key: "Warning",
    label: "Warning",
    icon: AlertTriangle,
  },
  {
    key: "Normal",
    label: "Normal",
    icon: CheckCircle2,
  },
];

const SEVERITY_ORDER = {
  Critical: 0,
  Warning: 1,
  Normal: 2,
};

export default function ResultsDisplay({ results = [] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const getSeverity = (result) =>
    result?.severity || result?.status || "Normal";

  const filterCounts = useMemo(() => {
    return results.reduce(
      (accumulator, result) => {
        const severity = getSeverity(result);

        if (accumulator[severity] !== undefined) {
          accumulator[severity] += 1;
        }

        accumulator.All += 1;

        return accumulator;
      },
      {
        All: 0,
        Critical: 0,
        Warning: 0,
        Normal: 0,
      },
    );
  }, [results]);

  const filteredResults = useMemo(() => {
    const filtered =
      activeFilter === "All"
        ? [...results]
        : results.filter(
            (result) => getSeverity(result) === activeFilter,
          );

    return filtered.sort(
      (a, b) =>
        (SEVERITY_ORDER[getSeverity(a)] ?? 99) -
        (SEVERITY_ORDER[getSeverity(b)] ?? 99),
    );
  }, [results, activeFilter]);

  return (
    <section
      id="analysis"
      className="w-full scroll-mt-24 px-0 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.05] px-3.5 py-2">
            <Activity
              size={15}
              strokeWidth={1.8}
              className="text-blue-300"
            />

            <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-blue-200">
              Analysis Results
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Clinical assessment
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Review severity, reference ranges, classifications, and
            AI-generated explanations for each laboratory result.
          </p>
        </div>

        {/* Results Toolbar */}
        {results.length > 0 && (
          <div className="mb-6 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-3 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Filter Buttons */}
              <div className="flex w-full overflow-x-auto rounded-xl border border-white/[0.06] bg-zinc-950/50 p-1 scrollbar-hide lg:w-auto">
                {FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  const count = filterCounts[filter.key];

                  const isActive = activeFilter === filter.key;

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      className={`flex min-w-max items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4 ${
                        isActive
                          ? "bg-white text-zinc-950 shadow-lg"
                          : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.9} />

                      <span>{filter.label}</span>

                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                          isActive
                            ? "bg-zinc-950/10 text-zinc-700"
                            : "bg-white/[0.05] text-zinc-600"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Toolbar Info */}
              <div className="flex items-center justify-between gap-3 px-1 sm:justify-end">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <ListFilter size={15} />

                  <span>
                    Showing{" "}
                    <span className="font-medium text-zinc-300">
                      {filteredResults.length}
                    </span>{" "}
                    {filteredResults.length === 1
                      ? "result"
                      : "results"}
                  </span>
                </div>

                <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <SlidersHorizontal size={15} />
                  <span>Severity sorted</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filteredResults.length > 0 ? (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <div
                key={result.id ?? `${getSeverity(result)}-${index}`}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <ResultCard result={result} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-zinc-900/30 px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                {results.length === 0 ? (
                  <Activity
                    size={24}
                    strokeWidth={1.6}
                    className="text-zinc-600"
                  />
                ) : (
                  <ListFilter
                    size={24}
                    strokeWidth={1.6}
                    className="text-zinc-600"
                  />
                )}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-zinc-300">
                {results.length === 0
                  ? "No analysis results yet"
                  : `No ${activeFilter.toLowerCase()} results`}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {results.length === 0
                  ? "Submit laboratory values above to see your clinical assessment here."
                  : "Try another severity filter to view the available laboratory results."}
              </p>

              {results.length > 0 && activeFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("All")}
                  className="mt-5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-white"
                >
                  View all results
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Explanation */}
        {results.length > 0 && (
          <div className="mt-7 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
            <span className="text-xs text-zinc-600 sm:text-sm">
              Results are prioritized by clinical severity.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

            <span className="text-xs text-zinc-600 sm:text-sm">
              Expand a result to view its AI explanation.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

