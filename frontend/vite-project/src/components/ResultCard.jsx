
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  Info,
  Sparkles,
} from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import ExplanationPanel from "./ExplainationPanel";

const SEVERITY_CONFIG = {
  Critical: {
    icon: AlertCircle,
    description: "Requires immediate attention",
    accent: "text-red-400",
    iconBg: "bg-red-400/[0.08]",
    border: "border-red-400/[0.14]",
    glow: "bg-red-400/[0.04]",
    line: "bg-red-400",
  },

  Warning: {
    icon: AlertTriangle,
    description: "Outside the normal range",
    accent: "text-amber-400",
    iconBg: "bg-amber-400/[0.08]",
    border: "border-amber-400/[0.14]",
    glow: "bg-amber-400/[0.035]",
    line: "bg-amber-400",
  },

  Normal: {
    icon: CheckCircle2,
    description: "Within the reference range",
    accent: "text-emerald-400",
    iconBg: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/[0.12]",
    glow: "bg-emerald-400/[0.025]",
    line: "bg-emerald-400",
  },
};

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    if (Number.isInteger(numericValue)) {
      return numericValue.toString();
    }

    return numericValue.toFixed(2).replace(/\.?0+$/, "");
  }

  return String(value);
}

export default function ResultCard({ result = {} }) {
  const severity = result.severity || result.status || "Normal";

  const config =
    SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Normal;

  const Icon = config.icon;

  const [isExpanded, setIsExpanded] = useState(
    severity === "Critical" || severity === "Warning",
  );

  const testName =
    result.testName ||
    result.test_name ||
    result.name ||
    "Laboratory Test";

  const value = formatValue(result.value);

  const unit = result.unit || "";

  const referenceRange =
    result.referenceRange ||
    result.reference_range ||
    result.range ||
    "Not available";

  const classification =
    result.classification ||
    result.status ||
    severity;

  const explanation =
    result.explanation ||
    result.aiExplanation ||
    result.ai_explanation ||
    "";

  const nextStep =
    result.nextStep ||
    result.next_step ||
    result.suggestedNextStep ||
    "";

  return (
    <article
      className={
        "group relative overflow-hidden rounded-2xl border " +
        config.border +
        " bg-zinc-900/60 shadow-xl shadow-black/[0.12] backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900/75"
      }
    >
      {/* Severity Accent */}
      <div
        className={
          "absolute left-0 top-0 h-full w-[2px] " +
          config.line +
          " opacity-70"
        }
      />

      {/* Ambient Severity Glow */}
      <div
        className={
          "pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full " +
          config.glow +
          " blur-3xl"
        }
      />

      <div className="relative">
        {/* Main Result */}
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Test Information */}
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] " +
                  config.iconBg
                }
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className={config.accent}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {testName}
                  </h3>

                  <SeverityBadge severity={severity} />
                </div>

                <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                  {config.description}
                </p>
              </div>
            </div>

            {/* Value */}
            <div className="flex items-center justify-between gap-5 lg:justify-end">
              <div className="text-left lg:text-right">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-600">
                  Measured value
                </p>

                <div className="mt-1 flex items-baseline gap-1.5 lg:justify-end">
                  <span className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {value}
                  </span>

                  {unit && (
                    <span className="text-sm font-medium text-zinc-500">
                      {unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Expand Button */}
              <button
                type="button"
                onClick={() =>
                  setIsExpanded((current) => !current)
                }
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded
                    ? `Collapse ${testName} details`
                    : `Expand ${testName} details`
                }
                className={
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-500 transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-zinc-200 " +
                  (isExpanded ? "rotate-180" : "")
                }
              >
                <ChevronDown size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {/* Reference Range */}
            <div className="rounded-xl border border-white/[0.05] bg-zinc-950/35 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Info
                  size={14}
                  strokeWidth={1.8}
                  className="text-zinc-600"
                />

                <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-600">
                  Reference range
                </span>
              </div>

              <p className="mt-1.5 text-[15px] font-medium text-zinc-200">
                {referenceRange}
              </p>
            </div>

            {/* Classification */}
            <div className="rounded-xl border border-white/[0.05] bg-zinc-950/35 px-4 py-3.5">
              <div className="flex items-center gap-2">
                <FlaskConical
                  size={14}
                  strokeWidth={1.8}
                  className="text-zinc-600"
                />

                <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-600">
                  Classification
                </span>
              </div>

              <p
                className={
                  "mt-1.5 text-[15px] font-semibold " +
                  config.accent
                }
              >
                {classification}
              </p>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div
          className={
            "grid transition-[grid-template-rows,opacity] duration-300 " +
            (isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0")
          }
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/[0.06] bg-zinc-950/20 p-5 sm:p-6 lg:p-7">
              {/* Explanation Header */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/[0.08]">
                  <Sparkles
                    size={15}
                    strokeWidth={1.8}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    AI Explanation
                  </p>

                  <p className="text-xs text-zinc-600">
                    Explainable analysis of this result
                  </p>
                </div>
              </div>

              {/* Explanation Content */}
              {explanation || nextStep ? (
                <ExplanationPanel
                  explanation={explanation}
                  nextStep={nextStep}
                  severity={severity}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] px-4 py-5">
                  <p className="text-sm leading-6 text-zinc-600">
                    AI explanation will be available after the
                    laboratory result has been analyzed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

