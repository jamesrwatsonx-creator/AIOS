import { systemVitals } from "@/lib/mockTelemetry";

export type HermesRouteResult = {
  type: "navigate" | "local" | "remote";
  href?: string;
  response?: string;
};

const routeMap: Array<[string[], string]> = [
  [["open home"], "/"],
  [["open memory"], "/memory"],
  [["open projects"], "/projects"],
  [["open daily plan", "daily log", "open chronicles"], "/chronicles"],
  [["open agents", "open guardians"], "/agents"],
  [["open automations", "open maat", "show workflows", "workflow status"], "/automations"],
  [["open thoth"], "/agents/thoth"],
  [["open ptah"], "/agents/ptah"],
  [["open anubis"], "/agents/anubis"],
  [["open horus"], "/agents/horus"],
  [["open ra"], "/agents/ra"],
  [["open maat"], "/agents/maat"],
  [["open khonsu"], "/agents/khonsu"],
  [["open hapi"], "/agents/hapi"],
  [["open hermes", "open command center", "command center"], "/hermes"],
  [["open observatory"], "/observatory"],
  [["open vault"], "/vault"],
  [["open codex", "check what codex did"], "/codex"],
  [["open content", "youtube", "video idea"], "/content"],
  [["open gohighlevel", "open ghl", "client project"], "/gohighlevel"],
  [["open browser", "web research"], "/browser"],
  [["open settings"], "/settings"]
];

export const quickHermesCommands = [
  "System Status",
  "Active Projects",
  "Open Memory",
  "Daily Plan",
  "Open Agents",
  "Check Codex",
  "What's Next?"
];

export function routeHermesCommand(input: string): HermesRouteResult {
  const command = input.toLowerCase().trim();
  for (const [phrases, href] of routeMap) {
    if (phrases.some((phrase) => command.includes(phrase))) {
      return { type: "navigate", href, response: `James, opening ${href === "/" ? "Home" : href.replace("/", "")}.` };
    }
  }

  if (command.includes("system status")) {
    const vitals = systemVitals.map((metric) => `${metric.label}: ${metric.value}${metric.suffix ?? ""} ${metric.state}`).join(". ");
    return { type: "local", response: `James, current local vitals are pending live telemetry. ${vitals}.` };
  }

  if (command.includes("what's next") || command.includes("whats next")) {
    return { type: "local", response: "James, the next operational step is to pick one active project, clear blockers, review Codex work, and save the outcome to Memory." };
  }

  if (command.includes("active projects")) {
    return { type: "local", response: "James, project telemetry is not preloaded. Add projects in Projects as you create them." };
  }

  if (command.startsWith("scan ")) {
    const topic = encodeURIComponent(input.replace(/^scan\s+/i, ""));
    return { type: "navigate", href: `/agents/horus?scan=${topic}`, response: `James, Horus is scanning ${decodeURIComponent(topic)}.` };
  }

  if (command.includes("show signals")) {
    return { type: "navigate", href: "/agents/horus", response: "James, opening Horus / Web Research signals." };
  }

  return { type: "remote" };
}
