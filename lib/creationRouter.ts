import { guardians } from "@/lib/guardians";

export type CreationType = "idea" | "project" | "task" | "milestone" | "automation" | "research" | "daily_intention" | "signal" | "memory";
export type CreationStatus = "ACTIVE" | "QUEUED" | "IDLE" | "BLOCKED" | "PENDING SETUP" | "IN PROGRESS" | "IN REVIEW" | "PLANNED" | "DEPLOYED" | "ARCHIVED";

export type CreationClassification = {
  type: CreationType;
  guardian: string;
  guardianSlug: string;
  category: string;
  status: CreationStatus;
  confidence: "high" | "medium" | "low";
  routingMode: "LOCAL_RULE_BASED";
  relatedDestinations: string[];
  obsidianTarget: "activity" | "automation" | "capture" | "guardian" | "hermes" | "memory" | "project" | "chronicle";
  clarificationQuestion?: string;
};

export type CreationContext = {
  preferredType?: CreationType;
  guardianSlug?: string;
  projectId?: string;
  projectName?: string;
  source?: string;
};

export type CreationOverrides = Partial<Pick<CreationClassification, "type" | "guardian" | "guardianSlug" | "category" | "status">>;

const hermesGuardian = { name: "Hermes", slug: "hermes" };

const guardianRules = [
  { slug: "ptah", words: ["app", "build", "code", "ui", "dashboard", "architecture", "component", "project", "deploy", "website", "route", "bug", "fix"] },
  { slug: "thoth", words: ["research", "write", "knowledge", "strategy", "note", "learn", "intelligence", "prompt", "concept", "analyze"] },
  { slug: "anubis", words: ["audit", "security", "verify", "validation", "cleanup", "truth", "risk", "test", "qa", "broken"] },
  { slug: "horus", words: ["scan", "signal", "web", "market", "competitor", "visibility", "opportunity", "browse"] },
  { slug: "ra", words: ["design", "image", "brand", "creative", "media", "visual", "video", "logo"] },
  { slug: "maat", words: ["automation", "workflow", "n8n", "operation", "governance", "balance", "process"] },
  { slug: "khonsu", words: ["today", "daily", "schedule", "time", "journal", "ledger", "reminder", "intention", "chronicle"] },
  { slug: "hapi", words: ["api", "connector", "sync", "integration", "resource", "health", "data", "flow"] },
  { slug: "hermes", words: ["voice", "chat", "telegram", "sms", "email", "command", "conversation", "assistant", "message"] }
];

const typeRules: Array<{ type: CreationType; words: string[] }> = [
  { type: "automation", words: ["automation", "workflow", "n8n", "trigger", "schedule"] },
  { type: "research", words: ["research", "analyze", "study", "learn", "intelligence"] },
  { type: "signal", words: ["signal", "scan", "opportunity", "market", "competitor", "trend"] },
  { type: "milestone", words: ["milestone", "roadmap", "deadline", "phase", "gate", "ship"] },
  { type: "daily_intention", words: ["today", "intention", "daily", "focus", "finish today"] },
  { type: "task", words: ["task", "todo", "fix", "check", "verify", "finish", "add", "update"] },
  { type: "project", words: ["project", "app", "build", "website", "dashboard", "tool", "system"] },
  { type: "memory", words: ["remember", "memory", "note", "journal", "reflection"] },
  { type: "idea", words: ["idea", "concept", "experiment", "maybe", "prompt"] }
];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function scoreWords(text: string, words: string[]) {
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function guardianName(slug: string) {
  if (slug === "hermes") return hermesGuardian.name;
  return guardians.find((guardian) => guardian.slug === slug)?.name ?? "Ptah";
}

function normalizeGuardianSlug(nameOrSlug?: string) {
  if (!nameOrSlug) return "";
  const lowered = nameOrSlug.toLowerCase();
  if (lowered === "hermes") return "hermes";
  return guardians.find((guardian) => guardian.slug === lowered || guardian.name.toLowerCase() === lowered)?.slug ?? "";
}

function inferType(text: string, preferred?: CreationType) {
  if (preferred) return preferred;
  const match = typeRules.map((rule) => ({ type: rule.type, score: scoreWords(text, rule.words) })).sort((a, b) => b.score - a.score)[0];
  return match && match.score > 0 ? match.type : "idea";
}

function inferGuardian(text: string, context?: CreationContext) {
  const contextSlug = normalizeGuardianSlug(context?.guardianSlug);
  if (contextSlug) return contextSlug;
  const match = guardianRules.map((rule) => ({ slug: rule.slug, score: scoreWords(text, rule.words) })).sort((a, b) => b.score - a.score)[0];
  return match && match.score > 0 ? match.slug : "ptah";
}

function inferCategory(text: string, type: CreationType) {
  if (includesAny(text, ["mobile", "ios", "android"])) return "MobileApps";
  if (includesAny(text, ["watch", "wearable"])) return "WatchApps";
  if (includesAny(text, ["desktop", "windows", "mac"])) return "DesktopApps";
  if (includesAny(text, ["agent", "voice", "hermes", "telegram", "assistant", "bot"])) return "AgentApps";
  if (includesAny(text, ["internal", "dashboard", "automation", "n8n", "workflow", "tool"])) return "InternalTools";
  if (includesAny(text, ["web", "site", "landing", "browser"])) return "WebApps";
  if (type === "automation") return "InternalTools";
  if (type === "research" || type === "idea" || type === "memory") return "Knowledge";
  return "WebApps";
}

function inferStatus(text: string, type: CreationType): CreationStatus {
  if (includesAny(text, ["blocked", "stuck", "waiting"])) return "BLOCKED";
  if (includesAny(text, ["api key", "setup", "configure", "pending"])) return "PENDING SETUP";
  if (includesAny(text, ["active", "now", "today", "finish", "working on"])) return "ACTIVE";
  if (includesAny(text, ["review", "verify", "audit"])) return "IN REVIEW";
  if (includesAny(text, ["done", "deployed", "shipped"])) return "DEPLOYED";
  if (type === "milestone" || type === "task") return "QUEUED";
  return "PLANNED";
}

function relatedDestinations(type: CreationType, guardianSlug: string) {
  const base = ["/activity", "/memory"];
  if (type === "project" || type === "milestone") base.unshift("/projects");
  if (type === "task") base.unshift(`/agents/${guardianSlug === "hermes" ? "ptah" : guardianSlug}`);
  if (type === "daily_intention") base.unshift("/chronicles");
  if (guardianSlug === "hermes") base.unshift("/hermes");
  return [...new Set(base)];
}

function obsidianTarget(type: CreationType, guardianSlug: string): CreationClassification["obsidianTarget"] {
  if (type === "project" || type === "milestone") return "project";
  if (type === "task") return guardianSlug === "hermes" ? "hermes" : "guardian";
  if (type === "automation") return "automation";
  if (type === "daily_intention") return "chronicle";
  if (type === "signal" || type === "research") return "memory";
  if (guardianSlug === "hermes") return "hermes";
  return "capture";
}

export function classifyCreation(input: string, context: CreationContext = {}, overrides: CreationOverrides = {}): CreationClassification {
  const text = input.toLowerCase();
  const type = overrides.type ?? inferType(text, context.preferredType);
  const overrideSlug = normalizeGuardianSlug(overrides.guardianSlug) || normalizeGuardianSlug(overrides.guardian);
  const guardianSlug = overrideSlug || inferGuardian(text, context);
  const guardian = overrides.guardian ?? guardianName(guardianSlug);
  const category = overrides.category ?? inferCategory(text, type);
  const status = overrides.status ?? inferStatus(text, type);
  const signalCount = typeRules.reduce((count, rule) => count + scoreWords(text, rule.words), 0) + guardianRules.reduce((count, rule) => count + scoreWords(text, rule.words), 0);
  const confidence = signalCount >= 3 ? "high" : signalCount >= 1 ? "medium" : "low";

  return {
    type,
    guardian,
    guardianSlug,
    category,
    status,
    confidence,
    routingMode: "LOCAL_RULE_BASED",
    relatedDestinations: relatedDestinations(type, guardianSlug),
    obsidianTarget: obsidianTarget(type, guardianSlug),
    clarificationQuestion: confidence === "low" ? "Should this become a project, task, idea, memory, or daily intention?" : undefined
  };
}

export function titleFromInput(input: string) {
  const firstLine = input.trim().split("\n").find(Boolean) ?? "Untitled creation";
  return firstLine.length > 78 ? `${firstLine.slice(0, 75)}...` : firstLine;
}
