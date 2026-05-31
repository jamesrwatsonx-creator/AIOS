"use client";

import { createLocalId } from "@/lib/id";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import { upsertEntity, type EntityType } from "@/lib/entityStore";

export type CaptureType = "THOUGHT" | "TASK" | "IDEA" | "REFLECTION" | "MEMORY";
export type CaptureItem = { id: string; type: CaptureType; text: string; guardian?: string; timestamp: string };
export const capturesKey = "hermes_captures";

export function readCaptures(): CaptureItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(capturesKey) ?? "[]");
}

export function saveCapture(item: Omit<CaptureItem, "id" | "timestamp">) {
  const capture = { ...item, id: createLocalId("capture"), timestamp: new Date().toLocaleString() };
  const next = [capture, ...readCaptures()].slice(0, 100);
  localStorage.setItem(capturesKey, JSON.stringify(next));
  if (item.type === "REFLECTION" || item.type === "MEMORY") {
    const key = `hermes_${new Date().toISOString().slice(0, 10)}_entries`;
    const entries = JSON.parse(localStorage.getItem(key) ?? "[]");
    localStorage.setItem(key, JSON.stringify([{ id: capture.id, text: item.text, timestamp: capture.timestamp }, ...entries]));
  }
  upsertEntity({
    id: capture.id,
    type: captureTypeToEntityType(item.type),
    title: item.text.slice(0, 80),
    status: "RECORDED",
    guardian: item.guardian ?? "Hermes",
    guardianSlug: item.guardian,
    category: item.type,
    tags: ["capture", item.type.toLowerCase()],
    relationships: [],
    source: "Quick Capture",
    metadata: { text: item.text, timestamp: capture.timestamp }
  }, `${item.type.toLowerCase()}_captured`);
  void recordObsidianEvent({
    category: "capture",
    title: `${item.type} captured`,
    body: item.text,
    metadata: { guardian: item.guardian ?? null, timestamp: capture.timestamp }
  });
  window.dispatchEvent(new Event("hermes-captures-updated"));
  return capture;
}

function captureTypeToEntityType(type: CaptureType): EntityType {
  if (type === "TASK") return "task";
  if (type === "IDEA") return "memory";
  if (type === "REFLECTION" || type === "MEMORY") return "memory";
  return "memory";
}

export function deleteCapture(id: string) {
  localStorage.setItem(capturesKey, JSON.stringify(readCaptures().filter((item) => item.id !== id)));
  window.dispatchEvent(new Event("hermes-captures-updated"));
}
