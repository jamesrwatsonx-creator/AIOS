"use client";

import { createLocalId } from "@/lib/id";
import { emitEntityActivity, upsertEntity } from "@/lib/entityStore";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import type { BrowserSession } from "@/lib/browser/browserTypes";

export const browserSessionStorageKey = "hermes_browser_session";
export const browserSessionsStorageKey = "hermes_browser_sessions";

export function readBrowserSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(browserSessionStorageKey) ?? "null") as BrowserSession | null;
  } catch {
    return null;
  }
}

export function writeBrowserSession(session: BrowserSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(browserSessionStorageKey);
  } else {
    window.localStorage.setItem(browserSessionStorageKey, JSON.stringify(session));
  }
  window.dispatchEvent(new Event("hermes-browser-session-updated"));
  window.dispatchEvent(new Event("hermes-memory-nexus-updated"));
}

export function readBrowserSessions() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(browserSessionsStorageKey) ?? "[]") as BrowserSession[];
  } catch {
    return [];
  }
}

export function writeBrowserSessions(sessions: BrowserSession[]) {
  if (typeof window === "undefined") return;
  const deduped = Array.from(new Map(sessions.map((session) => [session.id, session])).values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 30);
  window.localStorage.setItem(browserSessionsStorageKey, JSON.stringify(deduped));
  window.dispatchEvent(new Event("hermes-browser-session-updated"));
  window.dispatchEvent(new Event("hermes-memory-nexus-updated"));
}

export async function persistBrowserSession(session: BrowserSession, eventType = "browser_session_updated") {
  writeBrowserSession(session);
  writeBrowserSessions([session, ...readBrowserSessions()]);
  upsertEntity({
    id: session.entityId || createLocalId("browser-session"),
    type: "browser_session",
    title: session.goal || session.title || session.url || "Browser operation",
    status: session.status.toUpperCase(),
    guardian: session.guardian,
    guardianSlug: session.guardianSlug,
    category: "Browser Operations",
    tags: ["browser", session.toolUsed, session.status],
    relationships: [{ type: "assigned_to", targetId: "guardian:horus", label: "Horus" }],
    source: session.source === "hermes" ? "Hermes Browser Command" : session.source === "horus" ? "Horus Browser Operations" : "Browser Operations",
    metadata: {
      url: session.url,
      title: session.title,
      screenshotPath: session.screenshotPath,
      toolUsed: session.toolUsed,
      routerReason: session.routerDecision.reason
    }
  }, eventType);
  emitEntityActivity({
    entityId: session.entityId,
    entityType: "browser_session",
    eventType,
    title: `${session.status}: ${session.goal}`,
    guardian: session.guardian,
    guardianSlug: session.guardianSlug,
    source: session.source === "hermes" ? "Hermes Browser Command" : session.source === "horus" ? "Horus Browser Operations" : "Browser Operations",
    metadata: { url: session.url, toolUsed: session.toolUsed, screenshotPath: session.screenshotPath }
  });
  await recordObsidianEvent({
    category: "browser",
    title: `Browser operation ${session.status}: ${session.goal}`,
    body: [
      `URL: ${session.url || "NONE"}`,
      `Title: ${session.title || "NONE"}`,
      `Tool: ${session.toolUsed}`,
      `Source: ${session.source ?? "manual"}`,
      `Screenshot: ${session.screenshotPath || "NONE"}`,
      "",
      "Action log:",
      ...session.actionLog.map((item) => `- ${item.timestamp} · ${item.action}: ${item.result}${item.error ? ` (${item.error})` : ""}`)
    ].join("\n"),
    metadata: {
      entityId: session.entityId,
      status: session.status,
      source: session.source ?? "manual",
      routerReason: session.routerDecision.reason
    }
  });
  return session;
}
