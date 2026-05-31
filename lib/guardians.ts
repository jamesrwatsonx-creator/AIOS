import {
  BookOpen,
  Bot,
  Braces,
  CalendarClock,
  Compass,
  Feather,
  Hammer,
  Image,
  Network,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type GuardianStatus = "LIVE_PENDING";

export type Guardian = {
  slug: string;
  name: string;
  title: string;
  domain: string;
  role: string;
  alignment: string;
  signature: string;
  accent: string;
  image: string;
  telemetrySources: string[];
  capabilities: string[];
  tools: { label: string; icon: LucideIcon }[];
  quote: string;
  status: GuardianStatus;
};

export const guardians: Guardian[] = [
  {
    slug: "thoth",
    name: "Thoth",
    title: "Cognition & Intelligence",
    domain: "Cognition & Intelligence",
    role: "Researcher · Strategist · Architect",
    alignment: "Truth · Insight · Knowledge",
    signature: "The Scribe of Eternity",
    accent: "#d4a64a",
    image: "/reference/agents/thoth-agent-profile.png",
    telemetrySources: [
      "research notes",
      "memory links",
      "strategy docs",
      "insights generated",
      "patterns mapped"
    ],
    capabilities: ["Knowledge synthesis", "Pattern mapping", "Research strategy", "Architecture reasoning"],
    tools: [
      { label: "Research Codex", icon: BookOpen },
      { label: "Insight Loom", icon: Sparkles },
      { label: "Strategy Scroll", icon: BookOpen },
      { label: "Pattern Lens", icon: Compass }
    ],
    quote: "Knowledge becomes power when it is ordered into memory.",
    status: "LIVE_PENDING"
  },
  {
    slug: "ptah",
    name: "Ptah",
    title: "Creation & Architecture",
    domain: "Creation & Architecture",
    role: "Builder · Developer · Engineer",
    alignment: "Form · Structure · Foundation",
    signature: "The Great Builder's Hammer",
    accent: "#1aa7b8",
    image: "/reference/agents/ptah-builder-architect.png",
    telemetrySources: ["projects built", "APIs created", "commits", "deployments", "automations engineered"],
    capabilities: ["Project construction", "API design", "Automation engineering", "Deployment mapping"],
    tools: [
      { label: "Builder Forge", icon: Hammer },
      { label: "Code Channel", icon: Braces },
      { label: "System Frame", icon: Bot },
      { label: "Flow Bridge", icon: Network }
    ],
    quote: "Structure is the vessel that lets intelligence endure.",
    status: "LIVE_PENDING"
  },
  {
    slug: "anubis",
    name: "Anubis",
    title: "Protection & Verification",
    domain: "Protection & Verification",
    role: "Guardian · Verifier · Auditor",
    alignment: "Maat · Integrity · Justice",
    signature: "Weigher of Hearts",
    accent: "#6b4423",
    image: "/reference/agents/anubis-protection-verification.png",
    telemetrySources: ["systems monitored", "threats blocked", "audits completed", "anomalies resolved", "QA reports"],
    capabilities: ["QA verification", "Risk scanning", "Integrity checks", "Audit trails"],
    tools: [
      { label: "Audit Scale", icon: ShieldCheck },
      { label: "Integrity Seal", icon: Feather },
      { label: "Threat Ledger", icon: BookOpen },
      { label: "Verification Gate", icon: Compass }
    ],
    quote: "Every system must pass through truth before it becomes trusted.",
    status: "LIVE_PENDING"
  },
  {
    slug: "horus",
    name: "Horus",
    title: "Vision & Strategy",
    domain: "Vision & Strategy",
    role: "Strategist · Observer · Guide",
    alignment: "Insight · Foresight · Command",
    signature: "The Eye That Sees All",
    accent: "#ffac02",
    image: "/reference/agents/horus-vision-strategy.png",
    telemetrySources: ["opportunities tracked", "scenarios mapped", "risks analyzed", "strategies executed", "forecasts"],
    capabilities: ["Scenario planning", "Risk vision", "Opportunity mapping", "Command alignment"],
    tools: [
      { label: "Vision Lens", icon: Compass },
      { label: "Command Map", icon: Network },
      { label: "Forecast Scroll", icon: CalendarClock },
      { label: "Risk Eye", icon: ShieldCheck }
    ],
    quote: "The horizon is data waiting to become direction.",
    status: "LIVE_PENDING"
  },
  {
    slug: "ra",
    name: "Ra",
    title: "Creation & Radiance",
    domain: "Creation & Radiance",
    role: "Creator · Inspirer · Generator",
    alignment: "Radiance · Vitality · Expression",
    signature: "The Solar Disk",
    accent: "#ffac02",
    image: "/reference/agents/ra-creation-radiance.png",
    telemetrySources: ["images generated", "visuals created", "videos rendered", "designs built", "innovations sparked"],
    capabilities: ["Visual generation", "Creative direction", "Design synthesis", "Concept ignition"],
    tools: [
      { label: "Solar Forge", icon: Sparkles },
      { label: "Image Altar", icon: Image },
      { label: "Design Flame", icon: Feather },
      { label: "Concept Disk", icon: Compass }
    ],
    quote: "Creation is intelligence made visible.",
    status: "LIVE_PENDING"
  },
  {
    slug: "maat",
    name: "Maat",
    title: "Order & Governance",
    domain: "Order & Governance",
    role: "Orchestrator · Governor · Harmonizer",
    alignment: "Balance · Truth · Consistency",
    signature: "The Feather of Truth",
    accent: "#355c52",
    image: "/reference/agents/maat-order-alignment.png",
    telemetrySources: ["workflows orchestrated", "rules enforced", "alignments resolved", "exceptions handled", "policies maintained"],
    capabilities: ["Workflow order", "Policy alignment", "Exception handling", "Governance mapping"],
    tools: [
      { label: "Order Matrix", icon: Feather },
      { label: "Policy Loom", icon: BookOpen },
      { label: "Balance Gate", icon: ShieldCheck },
      { label: "Workflow Thread", icon: Network }
    ],
    quote: "Power holds when order and truth are aligned.",
    status: "LIVE_PENDING"
  },
  {
    slug: "khonsu",
    name: "Khonsu",
    title: "Time & Continuity",
    domain: "Time & Continuity",
    role: "Chronologist · Recorder · Reflector",
    alignment: "Memory · Patience · Perseverance",
    signature: "The Lunar Disk",
    accent: "#10243a",
    image: "/reference/agents/khonsu-time-continuity.png",
    telemetrySources: ["days recorded", "entries written", "reflections completed", "streaks active", "continuity score"],
    capabilities: ["Chronicle tracking", "Reflection mapping", "Continuity scoring", "Temporal recall"],
    tools: [
      { label: "Lunar Ledger", icon: CalendarClock },
      { label: "Continuity Seal", icon: BookOpen },
      { label: "Reflection Pool", icon: Compass },
      { label: "Time Thread", icon: Network }
    ],
    quote: "What is recorded can return as wisdom.",
    status: "LIVE_PENDING"
  },
  {
    slug: "hapi",
    name: "Hapi",
    title: "Integration & Flow",
    domain: "Integration & Flow",
    role: "Integrator · Connector · Synchronizer",
    alignment: "Flow · Efficiency · Interoperability",
    signature: "The Flowing Current",
    accent: "#1aa7b8",
    image: "/reference/agents/hapi-flow-integrations.png",
    telemetrySources: ["systems connected", "APIs managed", "data events synced", "workflows running", "flow health"],
    capabilities: ["Connector mapping", "API orchestration", "Data synchronization", "Workflow flow"],
    tools: [
      { label: "Nile Bridge", icon: Network },
      { label: "Connector Gate", icon: Bot },
      { label: "Sync Channel", icon: Braces },
      { label: "Flow Meter", icon: Compass }
    ],
    quote: "Systems become alive when their rivers connect.",
    status: "LIVE_PENDING"
  }
];

export function getGuardian(slug: string) {
  return guardians.find((guardian) => guardian.slug === slug);
}
