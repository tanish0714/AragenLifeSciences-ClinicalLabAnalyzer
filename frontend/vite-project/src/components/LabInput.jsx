
import { useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  FlaskConical,
  FileSpreadsheet,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import CsvUpload from "./CsvUpload";

/*
 * Numeric tests supported by the current backend.
 *
 * The backend expects:
 * {
 *   test_name: string,
 *   value: float,
 *   unit: string
 * }
 *
 * Qualitative strip tests are intentionally not included in the
 * manual-entry form because they cannot be represented correctly
 * by the current numeric LabResult model.
 */
const TEST_OPTIONS = [
  "Ferritin",
  "Glikozile Hemoglobin (HbA1c)",
  "Total IgE",
  "İnsülin",
  "Serbest T4",
  "Trombosit",
  "Lökosit",
  "Hemoglobin",
  "Eritrosit",
  "RDW-SD",
  "RDW",
  "PDW",
  "PCT",
  "Nötrofil%",
  "Monosit%",
  "Lenfosit%",
  "Hematokrit",
];

/*
 * Units used by the dataset for the numeric laboratory tests.
 *
 * The unit is selected automatically from the test name rather
 * than being entered manually, which prevents inconsistent input.
 */
const TEST_UNITS = {
  Ferritin: "ug/L",
  "Glikozile Hemoglobin (HbA1c)": "%",
  "Total IgE": "KU/L",
  "İnsülin": "mU/L",
  "Serbest T4": "ng/dL",
  Trombosit: "10^9/L",
  Lökosit: "10^9/L",
  Hemoglobin: "g/dL",
  Eritrosit: "10^12/L",
  "RDW-SD": "fL",
  RDW: "%",
  PDW: "%",
  PCT: "%",
  "Nötrofil%": "%",
  "Monosit%": "%",
  "Lenfosit%": "%",
  Hematokrit: "%",
};

const createRow = () => ({
  id: crypto.randomUUID(),
  testName: "",
  value: "",
  unit: "",
});

export default function LabInput({ onAnalyze, disabled = false }) {
  const [inputMode, setInputMode] = useState("manual");
  const [rows, setRows] = useState([createRow()]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );

    setError("");
  };

  const handleTestChange = (id, testName) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              testName,
              unit: TEST_UNITS[testName] ?? "",
            }
          : row,
      ),
    );

    setError("");
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createRow()]);
    setError("");
  };

  const removeRow = (id) => {
    if (rows.length === 1) {
      setRows([createRow()]);
      setError("");
      return;
    }

    setRows((currentRows) =>
      currentRows.filter((row) => row.id !== id),
    );

    setError("");
  };

  const resetForm = () => {
    setRows([createRow()]);
    setSelectedFile(null);
    setError("");
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError("");
  };

  const validateManualRows = () => {
    const activeRows = rows.filter(
      (row) =>
        row.testName.trim() ||
        row.value !== "" ||
        row.unit.trim(),
    );

    if (activeRows.length === 0) {
      return {
        valid: false,
        message:
          "Please add at least one laboratory result with a test name and value.",
      };
    }

    const incompleteRow = activeRows.find(
      (row) =>
        !row.testName.trim() ||
        row.value === "" ||
        !row.unit.trim(),
    );

    if (incompleteRow) {
      return {
        valid: false,
        message:
          "Please complete every laboratory result with a test name and value.",
      };
    }

    const invalidValueRow = activeRows.find((row) => {
      const numericValue = Number(row.value);
      return !Number.isFinite(numericValue);
    });

    if (invalidValueRow) {
      return {
        valid: false,
        message: "Laboratory values must be valid numbers.",
      };
    }

    const duplicateTests = activeRows.filter(
      (row, index, array) =>
        array.findIndex(
          (item) => item.testName === row.testName,
        ) !== index,
    );

    if (duplicateTests.length > 0) {
      return {
        valid: false,
        message:
          "Please use each laboratory test only once in the same analysis.",
      };
    }

    return {
      valid: true,
      rows: activeRows,
    };
  };

  const handleAnalyze = () => {
    if (disabled) return;

    setError("");

    if (inputMode === "csv") {
      if (!selectedFile) {
        setError(
          "Please select a CSV file before starting the analysis.",
        );
        return;
      }

      onAnalyze({
        mode: "csv",
        file: selectedFile,
      });

      return;
    }

    const validation = validateManualRows();

    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    onAnalyze({
      mode: "manual",
      results: validation.rows.map(({ id, ...row }) => ({
        ...row,
        value: Number(row.value),
      })),
    });
  };

  return (
    <section
      id="input"
      className="w-full scroll-mt-24 px-0 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.05] px-3.5 py-2">
            <FlaskConical
              size={15}
              strokeWidth={1.8}
              className="text-violet-300"
            />

            <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-violet-200">
              Analysis Workspace
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Add laboratory results
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Enter your laboratory values manually or upload a CSV
            file for automated analysis and explainable AI insights.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/60 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {/* Mode Selector */}
          <div className="border-b border-white/[0.06] p-4 sm:p-5">
            <div className="mx-auto flex w-full max-w-xl rounded-xl border border-white/[0.07] bg-zinc-950/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setInputMode("manual");
                  setError("");
                }}
                disabled={disabled}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 sm:text-[15px] ${
                  inputMode === "manual"
                    ? "bg-white text-zinc-950 shadow-lg"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <FlaskConical
                  size={17}
                  strokeWidth={1.8}
                />
                Manual Entry
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode("csv");
                  setError("");
                }}
                disabled={disabled}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 sm:text-[15px] ${
                  inputMode === "csv"
                    ? "bg-white text-zinc-950 shadow-lg"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                <FileSpreadsheet
                  size={17}
                  strokeWidth={1.8}
                />
                CSV Upload
              </button>
            </div>
          </div>

          {/* Manual Entry */}
          {inputMode === "manual" && (
            <div className="p-5 sm:p-7 lg:p-8">
              {/* Column Labels */}
              <div className="mb-3 hidden grid-cols-[minmax(0,1.5fr)_minmax(140px,0.7fr)_minmax(140px,0.7fr)_48px] gap-3 px-1 md:grid">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Laboratory Test
                </span>

                <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Value
                </span>

                <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Unit
                </span>

                <span />
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {rows.map((row, index) => (
                  <div
                    key={row.id}
                    className="group relative rounded-xl border border-white/[0.06] bg-zinc-950/40 p-3 transition-all duration-200 hover:border-white/[0.10] hover:bg-zinc-950/60 sm:p-4 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(140px,0.7fr)_minmax(140px,0.7fr)_48px] md:items-center md:gap-3"
                  >
                    {/* Test Name */}
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 md:hidden">
                        Laboratory Test
                      </label>

                      <select
                        value={row.testName}
                        onChange={(event) =>
                          handleTestChange(
                            row.id,
                            event.target.value,
                          )
                        }
                        disabled={disabled}
                        className="h-12 w-full appearance-none rounded-lg border border-white/[0.07] bg-zinc-900 px-3.5 text-[15px] text-zinc-200 outline-none transition-all duration-200 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">
                          Select a test
                        </option>

                        {TEST_OPTIONS.map((test) => (
                          <option
                            key={test}
                            value={test}
                          >
                            {test}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value */}
                    <div className="mt-3 md:mt-0">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 md:hidden">
                        Value
                      </label>

                      <input
                        type="number"
                        step="any"
                        value={row.value}
                        onChange={(event) =>
                          updateRow(
                            row.id,
                            "value",
                            event.target.value,
                          )
                        }
                        placeholder="e.g. 13.2"
                        disabled={disabled}
                        className="h-12 w-full rounded-lg border border-white/[0.07] bg-zinc-900 px-3.5 text-[15px] text-white outline-none placeholder:text-zinc-700 transition-all duration-200 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Unit */}
                    <div className="mt-3 md:mt-0">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-600 md:hidden">
                        Unit
                      </label>

                      <div
                        className={`flex h-12 w-full items-center rounded-lg border border-white/[0.07] bg-zinc-900 px-3.5 text-[15px] ${
                          row.unit
                            ? "text-zinc-300"
                            : "text-zinc-600"
                        }`}
                      >
                        {row.unit || "Unit"}
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="mt-3 flex justify-end md:mt-0 md:justify-center">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={disabled}
                        aria-label={`Remove result ${index + 1}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] text-zinc-600 transition-all duration-200 hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2
                          size={17}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Row */}
              <button
                type="button"
                onClick={addRow}
                disabled={disabled}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.09] px-4 py-3.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:border-violet-400/25 hover:bg-violet-400/[0.03] hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />
                Add another result
              </button>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3.5 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={disabled}
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={disabled}
                  className="group flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-zinc-950 shadow-lg shadow-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {disabled
                    ? "Analyzing..."
                    : "Analyze Results"}

                  {!disabled && (
                    <ArrowRight
                      size={17}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* CSV Upload */}
          {inputMode === "csv" && (
            <div className="p-5 sm:p-7 lg:p-8">
              <div className="mx-auto max-w-3xl">
                <CsvUpload
                  onFileSelect={handleFileSelect}
                  disabled={disabled}
                />

                {/* File Selected */}
                {selectedFile && (
                  <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08]">
                        <FileSpreadsheet
                          size={18}
                          className="text-emerald-400"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {selectedFile.name}
                        </p>

                        <p className="mt-0.5 text-xs text-zinc-600">
                          {(
                            selectedFile.size / 1024
                          ).toFixed(1)}{" "}
                          KB
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-emerald-400">
                      Ready
                    </span>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3.5 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* CSV Actions */}
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={disabled}
                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw size={15} />
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={disabled}
                    className="group flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-zinc-950 shadow-lg shadow-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {disabled
                      ? "Analyzing..."
                      : "Analyze CSV"}

                    {!disabled && (
                      <ArrowRight
                        size={17}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-zinc-600 sm:text-sm">
          <Upload size={14} />

          <span>
            Results are classified against configured laboratory
            reference ranges and explained using AI.
          </span>
        </div>
      </div>
    </section>
  );
}

