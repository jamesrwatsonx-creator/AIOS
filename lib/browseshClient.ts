"use client";

const BROWSESH_BASE = "https://api.browse.sh";

export async function scanUrl(url: string, apiKey: string) {
  try {
    const response = await fetch(`${BROWSESH_BASE}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ url, format: "markdown" })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function searchAndScan(query: string, apiKey: string) {
  try {
    const response = await fetch(`${BROWSESH_BASE}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query, limit: 5 })
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}
