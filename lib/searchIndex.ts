"use client";

import { guardians } from "@/lib/guardians";
import { navigationItems } from "@/lib/navigation";
import { readStorage, hermesDailyKey } from "@/lib/localStorageKeys";

export type SearchResultItem = { id: string; category: string; title: string; subtitle: string; route: string };

export function buildSearchIndex(): SearchResultItem[] {
  const chambers = navigationItems.map((item) => ({ id: item.href, category: "Chambers", title: item.label, subtitle: `Open ${item.label}`, route: item.href }));
  const guardianResults = guardians.map((g) => ({ id: g.slug, category: "Agents", title: g.name, subtitle: `${g.domain} · ${g.role}`, route: `/agents/${g.slug}` }));
  const projects = readStorage("hermes_projects", []).map((p: { id: string; name: string; category: string }) => ({ id: p.id, category: "Projects", title: p.name, subtitle: p.category, route: "/projects" }));
  const entries = readStorage(hermesDailyKey("entries"), []).map((e: { id: string; text: string }) => ({ id: e.id, category: "Daily Log", title: e.text, subtitle: "Today's entry", route: "/chronicles" }));
  const commands = [
    ["New Project", "Create a local project", "/projects"],
    ["Daily Plan", "Open the Daily Plan", "/chronicles"],
    ["Speak to Hermes", "Open Command Center", "/hermes"],
    ["System Status", "Open Settings", "/settings"],
    ["Morning Brief", "Show daily brief", "/"],
    ["Open Memory", "Open Memory", "/memory"],
    ["View Agents", "Open Agents", "/agents"]
  ].map(([title, subtitle, route]) => ({ id: title, category: "Commands", title, subtitle, route }));
  return [...chambers, ...guardianResults, ...projects, ...commands, ...entries];
}
