
import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function CsvUpload({
  onFileSelect,
  disabled = false,
}) {
  const inputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select a CSV file.";
    }

    const isCsv =
      selectedFile.type === "text/csv" ||
      selectedFile.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      return "Only CSV files are supported.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "The CSV file must be smaller than 5 MB.";
    }

    if (selectedFile.size === 0) {
      return "The selected CSV file is empty.";
    }

    return "";
  };

  const processFile = (selectedFile) => {
    if (disabled) return;

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      setFile(null);
      onFileSelect?.(null);
      return;
    }

    setError("");
    setFile(selectedFile);
    onFileSelect?.(selectedFile);
  };

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    if (disabled) return;

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();

    setIsDragging(false);
  };

  const handleBrowse = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const removeFile = (event) => {
    event.stopPropagation();

    if (disabled) return;

    setFile(null);
    setError("");
    onFileSelect?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Upload Area */}
      <button
        type="button"
        onClick={handleBrowse}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        className={
          "group relative flex min-h-[270px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-6 py-10 text-center transition-all duration-300 sm:min-h-[300px] " +
          (isDragging
            ? "border-violet-400/50 bg-violet-400/[0.06] shadow-xl shadow-violet-500/[0.04]"
            : file
              ? "border-emerald-400/25 bg-emerald-400/[0.025]"
              : "border-white/[0.10] bg-zinc-950/30 hover:border-violet-400/30 hover:bg-violet-400/[0.025]") +
          (disabled
            ? " cursor-not-allowed opacity-50"
            : " cursor-pointer")
        }
      >
        {/* Background Glow */}
        <div
          className={
            "pointer-events-none absolute h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 " +
            (isDragging
              ? "bg-violet-500/[0.10] opacity-100"
              : "bg-violet-500/[0.05] opacity-0 group-hover:opacity-100")
          }
        />

        <div className="relative">
          {/* Icon */}
          <div
            className={
              "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 " +
              (file
                ? "border-emerald-400/15 bg-emerald-400/[0.07]"
                : "border-white/[0.07] bg-white/[0.025] group-hover:border-violet-400/20 group-hover:bg-violet-400/[0.06]")
            }
          >
            {file ? (
              <CheckCircle2
                size={28}
                strokeWidth={1.7}
                className="text-emerald-400"
              />
            ) : (
              <UploadCloud
                size={28}
                strokeWidth={1.6}
                className="text-zinc-500 transition-colors duration-300 group-hover:text-violet-300"
              />
            )}
          </div>

          {/* Text */}
          <div className="mt-6">
            <p className="text-base font-semibold text-zinc-200 sm:text-lg">
              {file ? "CSV file selected" : "Upload laboratory results"}
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 sm:text-[15px]">
              {file
                ? file.name
                : "Drag and drop your CSV file here, or click to browse your computer."}
            </p>
          </div>

          {/* File Information */}
          {!file && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-zinc-600">
                CSV only
              </span>

              <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-zinc-600">
                Max 5 MB
              </span>
            </div>
          )}

          {/* Selected File */}
          {file && (
            <div className="mx-auto mt-5 flex max-w-md items-center gap-3 rounded-xl border border-white/[0.06] bg-zinc-950/50 px-4 py-3 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.07]">
                <FileSpreadsheet
                  size={18}
                  strokeWidth={1.8}
                  className="text-emerald-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-300">
                  {file.name}
                </p>

                <p className="mt-0.5 text-xs text-zinc-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                disabled={disabled}
                aria-label="Remove selected file"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-400/[0.06] hover:text-red-400"
              >
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>
          )}
        </div>
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3.5">
          <p className="text-sm leading-6 text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-4 text-center text-xs leading-5 text-zinc-600 sm:text-sm">
          The uploaded file will be validated before analysis.
        </p>
      )}
    </div>
  );
}

