
import {
  BrainCircuit,
  CheckCircle2,
  FlaskConical,
  Loader2,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    label: "Validating laboratory data",
    icon: FlaskConical,
  },
  {
    label: "Classifying result severity",
    icon: CheckCircle2,
  },
  {
    label: "Generating AI explanations",
    icon: BrainCircuit,
  },
];

export default function LoadingState() {
  return (
    <section
      id="analysis-loading"
      className="w-full px-0 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-violet-400/[0.12] bg-zinc-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-500/[0.08] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />

          <div className="relative">
            {/* AI Icon */}
            <div className="flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.07] shadow-lg shadow-violet-500/[0.05]">
                <Sparkles
                  size={27}
                  strokeWidth={1.7}
                  className="text-violet-300"
                />

                <span className="absolute inset-0 animate-ping rounded-2xl border border-violet-400/10" />
              </div>
            </div>

            {/* Heading */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Analyzing laboratory results
                </h2>

                <Loader2
                  size={20}
                  strokeWidth={2}
                  className="animate-spin text-violet-400"
                />
              </div>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                Our analysis pipeline is validating your data, determining
                severity, and preparing explainable AI insights.
              </p>
            </div>

            {/* Processing Steps */}
            <div className="mx-auto mt-8 max-w-2xl space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-zinc-950/35 px-4 py-3.5 sm:px-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/[0.06]">
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className="text-violet-300"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-300 sm:text-[15px]">
                        {step.label}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden text-xs text-zinc-700 sm:block">
                        Step {index + 1}
                      </span>

                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-40" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pipeline */}
            <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-700 sm:gap-3">
              <span>Classify</span>

              <span className="h-px w-8 bg-zinc-800 sm:w-12" />

              <span>Route</span>

              <span className="h-px w-8 bg-zinc-800 sm:w-12" />

              <span>Explain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

