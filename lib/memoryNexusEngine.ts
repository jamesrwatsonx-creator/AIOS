import { buildEntityGraph } from "@/lib/entityGraph";
import { readUnifiedActivity, readUnifiedEntities, type EntityActivityEvent, type OSEntity } from "@/lib/entityStore";
import type { MemoryLink, MemoryNode } from "@/lib/memoryGraph";

export type NexusSourcePayload = {
  scannedAt: string;
  sources: {
    obsidian: {
      markdownFiles: Array<{ path: string; name: string; modifiedAt: string }>;
      folders: Array<{ path: string; name: string; modifiedAt: string }>;
    };
    appBuilds: {
      folders: Array<{ path: string; name: string; modifiedAt: string }>;
    };
    dashboard: {
      files: Array<{ path: string; name: string; modifiedAt: string }>;
    };
  };
};

export type LocalNexusState = {
  captures: unknown[];
  commandHistory: unknown[];
  guardianTasks: Array<{ guardian: string; tasks: unknown[] }>;
  projects: Array<{ status?: string; progress?: number }>;
  milestones: Array<{ complete?: boolean }>;
  signals: unknown[];
  skills: unknown[];
  notifications: unknown[];
  activity: unknown[];
  dailyEntries: unknown[];
  dailyHighlights: unknown[];
  dailyGratitudes: unknown[];
  entities: OSEntity[];
  entityEvents: EntityActivityEvent[];
};

export type NexusMetric = {
  label: string;
  value: string;
  detail: string;
};

export type NexusImbalance = {
  label: string;
  severity: "stable" | "watch" | "imbalanced";
  detail: string;
};

export type NexusModel = {
  nodes: MemoryNode[];
  links: MemoryLink[];
  metrics: NexusMetric[];
  imbalances: NexusImbalance[];
  recentActivity: string[];
  clusterCounts: Array<{ label: string; value: number; color: string }>;
  topConnectedNodes: string[];
};

const clusterColors: Record<string, string> = {
  Core: "#d4a64a",
  Ideas: "#d4a64a",
  Projects: "#1aa7b8",
  Agents: "#ffac02",
  Journals: "#10243a",
  Memories: "#c8b28a",
  Systems: "#355c52",
  Resources: "#6b4423",
  Knowledge: "#f5f1e8",
  Automation: "#355c52",
  Activity: "#ffac02"
};

function countNotes(files: NexusSourcePayload["sources"]["obsidian"]["markdownFiles"], segment: string) {
  return files.filter((file) => file.path.startsWith(segment)).length;
}

function percent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function nodeRadius(count: number) {
  return Math.max(16, Math.min(36, 16 + Math.round(Math.sqrt(count) * 4)));
}

export function buildMemoryNexusModel(payload: NexusSourcePayload | null, local: LocalNexusState): NexusModel {
  const markdownFiles = payload?.sources.obsidian.markdownFiles ?? [];
  const appFolders = payload?.sources.appBuilds.folders ?? [];
  const dashboardFiles = payload?.sources.dashboard.files ?? [];
  const completedProjects = local.projects.filter((project) => project.status === "DEPLOYED" || Number(project.progress ?? 0) >= 100).length;
  const activeProjects = local.projects.filter((project) => project.status !== "ARCHIVED").length;
  const completedMilestones = local.milestones.filter((milestone) => milestone.complete).length;
  const guardianTaskCount = local.guardianTasks.reduce((total, item) => total + item.tasks.length, 0);
  const graph = buildEntityGraph(local.entities, local.entityEvents);
  const typeCounts = graph.metrics.typeCounts;
  const graphProjects = typeCounts.project ?? 0;
  const graphTasks = typeCounts.task ?? 0;
  const graphMilestones = typeCounts.milestone ?? 0;
  const graphMemory = (typeCounts.memory ?? 0) + (typeCounts.research ?? 0);
  const graphIntentions = typeCounts.intention ?? 0;
  const graphSignals = typeCounts.signal ?? 0;
  const graphAutomation = (typeCounts.automation ?? 0) + (typeCounts.workflow ?? 0);

  const counts = {
    Ideas: countNotes(markdownFiles, "03-Ideas") + graphMemory,
    Projects: countNotes(markdownFiles, "02-Projects") + appFolders.length + graphProjects,
    Agents: countNotes(markdownFiles, "04-Agents") + graphTasks,
    Journals: countNotes(markdownFiles, "01-Daily-Logs") + graphIntentions,
    Memories: countNotes(markdownFiles, "00-Hermes-Memory") + graphMemory + local.dailyHighlights.length,
    Systems: countNotes(markdownFiles, "09-Systems") + dashboardFiles.length + local.skills.length,
    Resources: countNotes(markdownFiles, "06-Resources"),
    Knowledge: countNotes(markdownFiles, "05-Knowledge") + graphSignals + graphMemory,
    Automation: graphAutomation + countNotes(markdownFiles, "09-Systems"),
    Activity: graph.metrics.executionVelocity + local.entityEvents.length
  };

  const totalNodes = Object.values(counts).reduce((sum, value) => sum + value, 1);
  const executionRatio = graph.metrics.completionRate || (activeProjects ? (completedProjects / activeProjects) * 100 : 0);
  const continuity = graphMilestones + graphIntentions + completedMilestones;
  const freshnessDates = markdownFiles.map((file) => new Date(file.modifiedAt).getTime()).filter(Boolean);
  const latest = freshnessDates.length ? Math.max(...freshnessDates) : 0;
  const freshnessDays = latest ? Math.round((Date.now() - latest) / 86400000) : null;
  const memoryHealth = Math.min(100, (markdownFiles.length * 2) + (graph.metrics.relationshipDensity * 16) + (continuity * 4));
  const entropy = Math.min(100, Math.max(0, graph.metrics.fragmentation + graph.metrics.orphanedTasks * 8 + graph.metrics.inactiveProjects * 10 + graph.metrics.staleEntities * 6 - graph.metrics.completionRate * 0.4));

  const positions: Record<string, [number, number]> = {
    Ideas: [500, 92],
    Projects: [672, 150],
    Agents: [750, 320],
    Automation: [672, 490],
    Journals: [500, 548],
    Memories: [328, 490],
    Systems: [250, 320],
    Resources: [328, 150],
    Knowledge: [500, 220],
    Activity: [500, 420]
  };

  const nodes: MemoryNode[] = [
    {
      id: "nucleus",
      label: "Memory Nucleus",
      cluster: "Core",
      x: 500,
      y: 320,
      radius: 30,
      color: clusterColors.Core,
      description: `${graph.metrics.entityCount} canonical entities and ${graph.metrics.relationshipCount} relationships indexed with Obsidian, AppBuilds, and dashboard files.`
    },
    ...Object.entries(counts).map(([label, count]) => {
      const [x, y] = positions[label] ?? [500, 320];
      return {
        id: label.toLowerCase(),
        label,
        cluster: label,
        x,
        y,
        radius: nodeRadius(count),
        color: clusterColors[label],
        description: `${count} real ${label.toLowerCase()} signals currently indexed.`
      };
    })
  ];

  const links: MemoryLink[] = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({
      source: "nucleus",
      target: label.toLowerCase(),
      strength: count > 10 ? "high" : count > 3 ? "medium" : "low"
    }));

  if (counts.Projects && counts.Agents) links.push({ source: "projects", target: "agents", strength: "medium" });
  if (counts.Journals && counts.Memories) links.push({ source: "journals", target: "memories", strength: "medium" });
  if (counts.Knowledge && counts.Ideas) links.push({ source: "knowledge", target: "ideas", strength: "medium" });
  if (counts.Automation && counts.Systems) links.push({ source: "automation", target: "systems", strength: "medium" });
  if (counts.Activity && counts.Agents) links.push({ source: "activity", target: "agents", strength: "medium" });

  const imbalances: NexusImbalance[] = [
    {
      label: "Idea to execution",
      severity: counts.Ideas > completedProjects * 3 + 3 ? "imbalanced" : counts.Ideas > completedProjects + 2 ? "watch" : "stable",
      detail: `${counts.Ideas} idea signals vs ${completedProjects} completed projects.`
    },
    {
      label: "Build continuity",
      severity: graph.metrics.inactiveProjects > 0 || graph.metrics.orphanedTasks > 2 ? "watch" : "stable",
      detail: `${graph.metrics.inactiveProjects} inactive projects and ${graph.metrics.orphanedTasks} orphaned tasks.`
    },
    {
      label: "Research synthesis",
      severity: counts.Knowledge > counts.Projects * 2 + 4 ? "watch" : "stable",
      detail: `${counts.Knowledge} knowledge signals vs ${counts.Projects} project signals.`
    },
    {
      label: "Operational entropy",
      severity: entropy > 70 ? "imbalanced" : entropy > 35 ? "watch" : "stable",
      detail: `${percent(entropy)} entropy from fragmentation, stale entities, orphaned tasks, inactive projects, and completions.`
    }
  ];

  return {
    nodes,
    links,
    metrics: [
      { label: "Nodes", value: String(nodes.length), detail: "Computed graph nodes" },
      { label: "Clusters", value: String(Object.keys(counts).filter((key) => counts[key as keyof typeof counts] > 0).length), detail: "Clusters with real signals" },
      { label: "Memory Health", value: percent(memoryHealth), detail: `${markdownFiles.length} markdown notes plus local continuity signals` },
      { label: "Execution Ratio", value: percent(executionRatio), detail: `${graph.metrics.entityCount} entities, ${graph.metrics.completionRate.toFixed(0)}% complete` },
      { label: "Relations", value: String(graph.metrics.relationshipCount), detail: `${graph.metrics.relationshipDensity.toFixed(2)} relationships per entity` },
      { label: "Velocity", value: String(graph.metrics.executionVelocity), detail: "Entity activity events from the last 7 days" },
      { label: "Freshness", value: freshnessDays === null ? "NONE" : `${freshnessDays}d`, detail: "Most recently modified Obsidian note age" },
      { label: "Entropy", value: percent(entropy), detail: "Operational imbalance pressure" }
    ],
    imbalances,
    recentActivity: [
      `${markdownFiles.length} Obsidian markdown files indexed`,
      `${appFolders.length} AppBuild folders observed`,
      `${graph.metrics.entityCount} unified entities loaded`,
      `${graph.metrics.relationshipCount} entity relationships mapped`,
      `${local.entityEvents.length} unified activity events recorded`,
      `${local.commandHistory.length} Hermes commands in local history`,
      `${graph.metrics.orphanedTasks} orphaned tasks detected`
    ],
    clusterCounts: Object.entries(counts).map(([label, value]) => ({ label, value, color: clusterColors[label] })),
    topConnectedNodes: [...Object.entries(counts)].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, value]) => `${label}: ${value}`)
  };
}

export function readLocalNexusState(): LocalNexusState {
  if (typeof window === "undefined") {
    return { captures: [], commandHistory: [], guardianTasks: [], projects: [], milestones: [], signals: [], skills: [], notifications: [], activity: [], dailyEntries: [], dailyHighlights: [], dailyGratitudes: [], entities: [], entityEvents: [] };
  }

  const parse = <T>(key: string, fallback: T): T => {
    try {
      return JSON.parse(window.localStorage.getItem(key) ?? "") as T;
    } catch {
      return fallback;
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const guardians = ["thoth", "ptah", "anubis", "horus", "ra", "maat", "khonsu", "hapi"];

  return {
    captures: parse("hermes_captures", []),
    commandHistory: parse("hermes_command_history", []),
    guardianTasks: guardians.map((guardian) => ({ guardian, tasks: parse(`hermes_guardian_${guardian}_tasks`, []) })),
    projects: parse("hermes_projects", []),
    milestones: parse("hermes_project_milestones", []),
    signals: parse("hermes_signals", []),
    skills: parse("hermes_skills", []),
    notifications: parse("hermes_notifications", []),
    activity: parse("hermes_activity", []),
    dailyEntries: parse(`hermes_${today}_entries`, []),
    dailyHighlights: parse(`hermes_${today}_highlights`, []),
    dailyGratitudes: parse(`hermes_${today}_gratitudes`, []),
    entities: readUnifiedEntities(),
    entityEvents: readUnifiedActivity()
  };
}
