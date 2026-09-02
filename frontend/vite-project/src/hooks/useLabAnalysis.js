import { useState } from "react";
import {
  analyzeCsv,
  analyzeLabs,
} from "../services/api";

export function useLabAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (results) => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await analyzeLabs(results);
      setData(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze laboratory results.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeFile = async (file) => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await analyzeCsv(file);
      setData(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze CSV file.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError("");
    setLoading(false);
  };

  return {
    data,
    results: data?.results ?? [],
    summary: data?.summary ?? null,
    loading,
    error,
    analyze,
    analyzeFile,
    reset,
  };
}