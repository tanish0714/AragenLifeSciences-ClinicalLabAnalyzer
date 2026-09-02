import { useState } from "react";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LabInput from "./components/LabInput";
import SummaryCards from "./components/SummaryCards";
import ResultsDisplay from "./components/ResultsDisplay";
import LoadingState from "./components/LoadingState";

import { useLabAnalysis } from "./hooks/useLabAnalysis";


function scrollToSection(id) {
  const element = document.querySelector(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}


export default function App() {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const {
  results,
  summary,
  loading,
  error,
  analyze,
  analyzeFile,
} = useLabAnalysis();


  const handleAnalyzeClick = () => {
    setIsInputVisible(true);

    setTimeout(() => {
      scrollToSection("#input");
    }, 50);
  };


  const handleAnalyze = async (payload) => {
  try {
    if (payload.mode === "csv") {
      await analyzeFile(payload.file);
    } else {
      const results = payload.results.map((result) => ({
        test_name: result.testName,
        value: Number(result.value),
        unit: result.unit,
      }));

      await analyze(results);
    }

    setTimeout(() => {
      scrollToSection("#analysis");
    }, 50);
  } catch (err) {
    console.error("Lab analysis failed:", err);
  }
};


  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">

      {/* Navigation */}
      <Navbar />


      {/* Hero */}
      <HeroSection
        onAnalyzeClick={handleAnalyzeClick}
      />


      {/* Main Application */}
      <main className="relative w-full px-4 pb-20 sm:px-6 lg:px-8">

        {/* Input Section */}
        {isInputVisible && (
          <LabInput
            onAnalyze={handleAnalyze}
            disabled={loading}
          />
        )}


        {/* Error */}
        {error && !loading && (
          <section className="mx-auto w-full max-w-6xl py-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4">
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                  !
                </div>

                <div>
                  <p className="text-sm font-medium text-red-300">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-400/80">
                    {error}
                  </p>
                </div>

              </div>
            </div>
          </section>
        )}


        {/* Analysis Area */}
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {summary && (
              <SummaryCards
                results={results}
                summary={summary}
              />
            )}

            {results.length > 0 && (
              <ResultsDisplay
                results={results}
              />
            )}
          </>
        )}


        {/* Explainability Section */}
        <section
          id="documentation"
          className="w-full scroll-mt-24 py-16 sm:py-20 lg:py-24"
        >
          <div className="mx-auto w-full max-w-6xl">

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8 lg:p-10">

              {/* Background Glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.05] blur-3xl" />


              <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">

                {/* Text */}
                <div>

                  <span className="text-sm font-medium uppercase tracking-[0.14em] text-violet-400">
                    Explainable AI
                  </span>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Every flag comes with an explanation.
                  </h2>

                  <p className="mt-4 text-base leading-7 text-zinc-400">
                    ClinicalAI separates deterministic result classification
                    from AI-generated explanations. This makes the severity
                    decision transparent while using generative AI where it
                    adds the most value.
                  </p>

                </div>


                {/* Pipeline */}
                <div className="grid gap-3 sm:grid-cols-3">

                  {[
                    {
                      number: "01",
                      title: "Classify",
                      text: "Compare the measured value against the configured reference range.",
                    },
                    {
                      number: "02",
                      title: "Route",
                      text: "Prioritize critical results before warnings and normal results.",
                    },
                    {
                      number: "03",
                      title: "Explain",
                      text: "Generate a clear explanation and suggested next step with AI.",
                    },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="rounded-xl border border-white/[0.06] bg-zinc-950/40 p-4"
                    >

                      <span className="text-xs font-semibold tracking-[0.12em] text-violet-400">
                        {step.number}
                      </span>

                      <h3 className="mt-3 text-base font-semibold text-white">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {step.text}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>
        </section>

      </main>


      {/* Footer */}
      <footer
        id="history"
        className="border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

          <div>
            <p className="text-sm font-medium text-zinc-400">
              ClinicalAI
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Explainable clinical laboratory analysis.
            </p>
          </div>

          <p className="text-xs text-zinc-700">
            AI-assisted analysis · Built for demonstration purposes
          </p>

        </div>
      </footer>

    </div>
  );
}