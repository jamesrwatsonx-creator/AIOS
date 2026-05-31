"use client";

export type ObsidianCategory =
  | "activity"
  | "automation"
  | "capture"
  | "guardian"
  | "hermes"
  | "memory"
  | "project"
  | "chronicle"
  | "settings"
  | "browser"
  | "codex"
  | "content"
  | "gohighlevel";

type ObsidianEvent = {
  category: ObsidianCategory;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
};

export async function recordObsidianEvent(event: ObsidianEvent) {
  try {
    const response = await fetch("/api/obsidian/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
    return response.ok;
  } catch {
    return false;
  }
}
