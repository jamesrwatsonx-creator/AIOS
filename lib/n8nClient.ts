"use client";

const N8N_BASE = "http://localhost:5678/api/v1";

export async function getWorkflows() {
  try {
    const response = await fetch(`${N8N_BASE}/workflows`, {
      headers: {
        "X-N8N-API-KEY": localStorage.getItem("hermes_n8n_api_key") ?? ""
      }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function triggerWorkflow(id: string) {
  try {
    const response = await fetch(`${N8N_BASE}/workflows/${id}/activate`, {
      method: "POST",
      headers: {
        "X-N8N-API-KEY": localStorage.getItem("hermes_n8n_api_key") ?? ""
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}
