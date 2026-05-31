export const projectOverviewMetrics = [
  "Total Projects",
  "Active Projects",
  "In Progress",
  "In Review",
  "Deployed",
  "Archived"
].map((label) => ({ label, value: 0, state: "LIVE_PENDING" as const }));

export const projectHealthCounts = [
  { label: "HEALTHY", value: 0 },
  { label: "WARNING", value: 0 },
  { label: "CRITICAL", value: 0 },
  { label: "UNKNOWN", value: 0 }
];

export const projectTableRows = [
  { name: "WebApps", status: "ACTIVE", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Filesystem scan", owner: "Codex", environment: "Local" },
  { name: "MobileApps", status: "PLANNED", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Registry mapping", owner: "Codex", environment: "Local" },
  { name: "WatchApps", status: "IN PROGRESS", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Template alignment", owner: "Codex", environment: "Local" },
  { name: "DesktopApps", status: "PLANNED", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Category scan", owner: "Codex", environment: "Local" },
  { name: "AgentApps", status: "IN REVIEW", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Agent registry", owner: "Hermes", environment: "Local" },
  { name: "InternalTools", status: "PLANNED", health: "UNKNOWN", progress: 0, lastUpdate: "LIVE_PENDING", milestone: "Tool inventory", owner: "Codex", environment: "Local" }
];

export const pipelineStages = ["PLAN", "BUILD", "TEST", "DEPLOY", "MONITOR"];

export const pipelineStats = [
  { label: "Builds Today", value: 0 },
  { label: "Tests Run", value: 0 },
  { label: "Deployments", value: 0 },
  { label: "Success Rate", value: 0, suffix: "%" }
];

export const roadmapTracks = [
  { label: "Data Readers", quarter: "Q1", width: "25%" },
  { label: "Memory Graph", quarter: "Q2", width: "42%" },
  { label: "Project Registry", quarter: "Q3", width: "58%" },
  { label: "Operational Reports", quarter: "Q4", width: "36%" }
];

export const upcomingMilestones = [
  { date: "LIVE_PENDING", label: "Read-only AppBuilds scanner" },
  { date: "LIVE_PENDING", label: "Project detail route" },
  { date: "LIVE_PENDING", label: "Build log aggregation" }
];

export const projectRecentActivity = [
  "Projects Chamber shell initialized",
  "Category roots ready for scanner",
  "Registry integration pending"
];

export const deploymentSparkline = [22, 34, 28, 44, 38, 58, 46, 68, 52, 76, 62, 84];

export const resourceAllocation = [
  { label: "Web", value: 0 },
  { label: "Mobile", value: 0 },
  { label: "Watch", value: 0 },
  { label: "Agent", value: 0 }
];
