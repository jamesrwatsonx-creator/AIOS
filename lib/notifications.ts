"use client";

import { createLocalId } from "@/lib/id";

export type NotificationType = "BUILD" | "MEMORY" | "TASK" | "SYSTEM" | "HERMES" | "GUARDIAN" | "WORKFLOW";

export type HermesNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  guardian?: string;
  route?: string;
};

export const notificationsKey = "hermes_notifications";

const starterNotifications: Omit<HermesNotification, "id" | "timestamp" | "read">[] = [
  { type: "SYSTEM", title: "Dashboard initialized successfully", message: "DEMO: James AI Operator OS is online.", route: "/" },
  { type: "HERMES", title: "Hermes voice engine ready", message: "DEMO: Start voice with npm run voice.", route: "/hermes" },
  { type: "GUARDIAN", title: "All 8 guardians online", message: "DEMO: Council telemetry is awaiting live connections.", route: "/agents" }
];

export function readNotifications() {
  if (typeof window === "undefined") return [];
  const existing = localStorage.getItem(notificationsKey);
  if (existing) return JSON.parse(existing) as HermesNotification[];
  const seeded = starterNotifications.map((item) => ({
    ...item,
    id: createLocalId("notification"),
    timestamp: new Date().toLocaleString(),
    read: false
  }));
  localStorage.setItem(notificationsKey, JSON.stringify(seeded));
  return seeded;
}

export function writeNotifications(items: HermesNotification[]) {
  localStorage.setItem(notificationsKey, JSON.stringify(items.slice(0, 100)));
  window.dispatchEvent(new Event("hermes-notifications-updated"));
}

export function addNotification(item: Omit<HermesNotification, "id" | "timestamp" | "read">) {
  const next = [{ ...item, id: createLocalId("notification"), timestamp: new Date().toLocaleString(), read: false }, ...readNotifications()];
  writeNotifications(next);
}
