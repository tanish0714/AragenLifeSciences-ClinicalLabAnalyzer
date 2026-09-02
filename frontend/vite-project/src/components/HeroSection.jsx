
import {
  ArrowRight,
  CircleHelp,
  ShieldCheck,
  Sparkles,
  Activity,
  FileCheck2,
} from "lucide-react";

export default function HeroSection({ onAnalyzeClick }) {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[120px]" />

        <div className="absolute bottom-[-15%] left-[10%] h-[350px] w-[450px] rounded-full bg-blue-600/[0.06] blur-[110px]" />

        <div className="absolute right-[5%] top-[25%] h-[280px] w-[280px] rounded-full bg-fuchsia-600/[0.04] blur-[100px]" />
      </div>

      {/* Subtle Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        {/* Status / Eyebrow */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-4 py-2">
          <Sparkles
            size={15}
            strokeWidth={1.8}
            className="text-violet-300"
          />

          <span className="text-[13px] font-medium tracking-wide text-violet-200 sm:text-sm">
            Explainable AI for Clinical Laboratory Results
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mx-auto max-w-5xl text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[68px]">
          Turn lab results into
          <br className="hidden sm:block" />
          <span className="gradient-text"> actionable insight.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8 lg:text-[19px]">
          Analyze clinical laboratory results with explainable AI. Understand
          what each result means, why it was flagged, and what deserves
          attention — all in one clear workspace.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={onAnalyzeClick}
            className="group flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-zinc-950 shadow-xl shadow-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-2xl hover:shadow-white/[0.08] sm:w-auto sm:px-7"
          >
            Start Analysis

            <ArrowRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() => {
              const element = document.querySelector("#documentation");

              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-3 text-[15px] font-medium text-zinc-300 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white sm:w-auto sm:px-7"
          >
            <CircleHelp size={17} strokeWidth={1.8} />

            How it works
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 text-sm text-zinc-500 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.06]">
              <ShieldCheck
                size={15}
                strokeWidth={1.8}
                className="text-emerald-400"
              />
            </div>

            <span>Explainable results</span>
          </div>

          <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/[0.06]">
              <FileCheck2
                size={15}
                strokeWidth={1.8}
                className="text-blue-400"
              />
            </div>

            <span>Reference-range based</span>
          </div>

          <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-400/[0.06]">
              <Activity
                size={15}
                strokeWidth={1.8}
                className="text-violet-400"
              />
            </div>

            <span>AI-powered explanations</span>
          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-16 w-full max-w-5xl sm:mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-2 shadow-2xl shadow-black/30 backdrop-blur-sm">
            {/* Window Header */}
            <div className="flex h-10 items-center justify-between border-b border-white/[0.06] px-3 sm:px-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-medium text-zinc-500">
                  Analysis workspace
                </span>
              </div>

              <div className="w-12" />
            </div>

            {/* Preview Content */}
            <div className="grid gap-3 p-3 sm:grid-cols-3 sm:p-5">
              {/* Critical */}
              <div className="rounded-xl border border-red-400/10 bg-red-400/[0.025] p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">
                    Critical
                  </span>

                  <span className="rounded-full border border-red-400/15 bg-red-400/[0.07] px-2 py-1 text-[11px] font-medium text-red-300">
                    02
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">2</p>

                <div className="mt-3 h-1 rounded-full bg-zinc-800">
                  <div className="h-1 w-[25%] rounded-full bg-red-400/70" />
                </div>
              </div>

              {/* Warning */}
              <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">
                    Warning
                  </span>

                  <span className="rounded-full border border-amber-400/15 bg-amber-400/[0.07] px-2 py-1 text-[11px] font-medium text-amber-300">
                    03
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">3</p>

                <div className="mt-3 h-1 rounded-full bg-zinc-800">
                  <div className="h-1 w-[38%] rounded-full bg-amber-400/70" />
                </div>
              </div>

              {/* Normal */}
              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">
                    Normal
                  </span>

                  <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2 py-1 text-[11px] font-medium text-emerald-300">
                    08
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold text-white">8</p>

                <div className="mt-3 h-1 rounded-full bg-zinc-800">
                  <div className="h-1 w-[72%] rounded-full bg-emerald-400/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Caption */}
          <p className="mt-4 text-center text-xs text-zinc-600 sm:text-sm">
            Classify · Route · Explain
          </p>
        </div>
      </div>
    </section>
  );
}

