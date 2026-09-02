const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export async function analyzeLabs(results) {
  const response = await fetch(`${API_BASE_URL}/analyze_labs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      results,
    }),
  });

  return parseResponse(response);
}

export async function analyzeCsv(file) {
  if (!file) {
    throw new Error("Please select a CSV file.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/analyze_csv`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  return parseResponse(response);
}