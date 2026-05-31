export type MemoryNode = {
  id: string;
  label: string;
  cluster: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  description: string;
};

export type MemoryLink = {
  source: string;
  target: string;
  strength: "low" | "medium" | "high";
};

export const memoryTabs = [
  "OVERVIEW",
  "NODES",
  "CLUSTERS",
  "TIMELINE",
  "LINKS",
  "INSIGHTS",
  "SEARCH",
  "FILTERS",
  "SETTINGS"
];

export const memoryViewModes = ["GALAXY", "FORCE", "HIERARCHY", "TIMELINE"] as const;

export const memoryClusters = [
  { label: "Ideas", color: "#d4a64a" },
  { label: "Projects", color: "#1aa7b8" },
  { label: "Agents", color: "#ffac02" },
  { label: "Journals", color: "#10243a" },
  { label: "Memories", color: "#c8b28a" },
  { label: "Systems", color: "#355c52" },
  { label: "Resources", color: "#6b4423" },
  { label: "Knowledge", color: "#f5f1e8" }
];

export const initialMemoryNodes: MemoryNode[] = [
  { id: "nucleus", label: "Memory Nucleus", cluster: "Core", x: 500, y: 320, radius: 30, color: "#d4a64a", description: "Central local intelligence memory index. LIVE_PENDING." },
  { id: "ideas", label: "Ideas", cluster: "Ideas", x: 500, y: 92, radius: 18, color: "#d4a64a", description: "Concepts, prompts, experiments, and creative seeds." },
  { id: "projects", label: "Projects", cluster: "Projects", x: 672, y: 150, radius: 18, color: "#1aa7b8", description: "AppBuild missions and build history." },
  { id: "agents", label: "Agents", cluster: "Agents", x: 750, y: 320, radius: 18, color: "#ffac02", description: "Agent team and workflow ownership." },
  { id: "journals", label: "Journals", cluster: "Journals", x: 672, y: 490, radius: 18, color: "#10243a", description: "Daily Ledger and continuity records." },
  { id: "memories", label: "Memories", cluster: "Memories", x: 500, y: 548, radius: 18, color: "#c8b28a", description: "Obsidian durable notes and Hermes memory summaries." },
  { id: "systems", label: "Systems", cluster: "Systems", x: 328, y: 490, radius: 18, color: "#355c52", description: "Local OS paths, bridges, and dashboard infrastructure." },
  { id: "resources", label: "Resources", cluster: "Resources", x: 250, y: 320, radius: 18, color: "#6b4423", description: "Reference files, docs, reports, and assets." },
  { id: "knowledge", label: "Knowledge", cluster: "Knowledge", x: 328, y: 150, radius: 18, color: "#f5f1e8", description: "Research, models, decisions, and synthesized intelligence." }
];

export const memoryLinks: MemoryLink[] = [
  { source: "nucleus", target: "ideas", strength: "high" },
  { source: "nucleus", target: "projects", strength: "high" },
  { source: "nucleus", target: "agents", strength: "high" },
  { source: "nucleus", target: "journals", strength: "medium" },
  { source: "nucleus", target: "memories", strength: "high" },
  { source: "nucleus", target: "systems", strength: "medium" },
  { source: "nucleus", target: "resources", strength: "low" },
  { source: "nucleus", target: "knowledge", strength: "high" },
  { source: "projects", target: "agents", strength: "medium" },
  { source: "journals", target: "memories", strength: "medium" },
  { source: "systems", target: "resources", strength: "low" },
  { source: "knowledge", target: "ideas", strength: "medium" }
];

export const memoryOverviewStats = [
  { label: "Nodes", value: 0, state: "LIVE_PENDING" },
  { label: "Links", value: 0, state: "LIVE_PENDING" },
  { label: "Clusters", value: 0, state: "LIVE_PENDING" },
  { label: "Insights", value: 0, state: "LIVE_PENDING" }
];

export const memoryBottomPanels = {
  recentActivity: ["Memory scanner pending", "Obsidian index pending", "Hermes bridge pending"],
  topConnectedNodes: ["Memory Nucleus", "Projects", "Agents", "Knowledge"],
  insightFeed: ["No live insights connected yet", "Graph engine placeholder active", "3D upgrade path documented"]
};
