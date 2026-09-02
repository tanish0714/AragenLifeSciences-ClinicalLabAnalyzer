
import {
  ArrowUpRight,
  Lightbulb,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";

const SEVERITY_STYLES = {
  Critical: {
    icon: ShieldAlert,
    iconClass: "text-red-400",
    iconBg: "bg-red-400/[0.08]",
    border: "border-red-400/[0.10]",
  },

  Warning: {
    icon: Lightbulb,
    iconClass: "text-amber-400",
    iconBg: "bg-amber-400/[0.08]",
    border: "border-amber-400/[0.10]",
  },

  Normal: {
    icon: MessageSquareText,
    iconClass: "text-emerald-400",
    iconBg: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/[0.10]",
  },
};

export default function ExplanationPanel({
  explanation = "",
  nextStep = "",
  severity = "Normal",
}) {
  const style =
    SEVERITY_STYLES[severity] || SEVERITY_STYLES.Normal;

  const Icon = style.icon;

  return (
    <div className="space-y-4">
      {/* AI Explanation */}
      {explanation && (
        <div
          className={
            "rounded-xl border " +
            style.border +
            " bg-white/[0.015] p-4 sm:p-5"
          }
        >
          <div className="flex items-start gap-3">
            <div
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                style.iconBg
              }
            >
              <Icon
                size={17}
                strokeWidth={1.8}
                className={style.iconClass}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                What this result means
              </p>

              <p className="mt-2 text-[15px] leading-7 text-zinc-300 sm:text-base">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Next Step */}
      {nextStep && (
        <div className="relative overflow-hidden rounded-xl border border-violet-400/[0.12] bg-gradient-to-br from-violet-500/[0.07] via-violet-500/[0.025] to-blue-500/[0.06] p-4 sm:p-5">
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/[0.08] blur-3xl" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/[0.10]">
              <ArrowUpRight
                size={17}
                strokeWidth={1.9}
                className="text-violet-300"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-300/70">
                Suggested next step
              </p>

              <p className="mt-2 text-[15px] leading-7 text-zinc-300 sm:text-base">
                {nextStep}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Note */}
      <div className="flex items-start gap-2.5 px-1 pt-1">
        <ShieldAlert
          size={14}
          strokeWidth={1.7}
          className="mt-0.5 shrink-0 text-zinc-700"
        />

        <p className="text-xs leading-5 text-zinc-600">
          This explanation is intended to help interpret the laboratory
          result and is not a medical diagnosis. Clinical decisions should
          be made with an appropriate healthcare professional.
        </p>
      </div>
    </div>
  );
}

