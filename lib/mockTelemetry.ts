export type TelemetryState = "DEMO" | "LIVE_PENDING";

export type MetricDatum = {
  label: string;
  value: number;
  suffix?: string;
  state: TelemetryState;
  note: string;
};

// TODO: Replace DEMO and LIVE_PENDING values with filesystem readers from _AI_OPERATOR_DATA.
export const systemVitals: MetricDatum[] = [
  { label: "Intelligence", value: 0, suffix: "%", state: "LIVE_PENDING", note: "Awaiting model telemetry" },
  { label: "Memory", value: 0, suffix: "%", state: "LIVE_PENDING", note: "Awaiting Obsidian index" },
  { label: "Agents", value: 0, state: "LIVE_PENDING", note: "Awaiting guardian runtime registry" },
  { label: "Projects", value: 0, state: "LIVE_PENDING", note: "Awaiting AppBuilds scanner" },
  { label: "System Health", value: 0, suffix: "%", state: "LIVE_PENDING", note: "Awaiting local checks" }
];

// TODO: Connect to MASTER_BUILD_LOG.md, PROJECT_REGISTRY.md, and task files.
export const telemetryStrip = [
  { label: "Builds", value: 0, state: "LIVE_PENDING" as const },
  { label: "Tasks", value: 0, state: "LIVE_PENDING" as const },
  { label: "Reports", value: 0, state: "LIVE_PENDING" as const },
  { label: "Memory Links", value: 0, state: "LIVE_PENDING" as const },
  { label: "Model Routes", value: 0, state: "LIVE_PENDING" as const }
];

export const demoAgenda = [
  { time: "Sol 00:00", task: "Index operator data foundation", state: "LIVE_PENDING" as const },
  { time: "Sol 00:00", task: "Map AppBuild project registry", state: "LIVE_PENDING" as const },
  { time: "Sol 00:00", task: "Prepare Memory Nexus scanner", state: "LIVE_PENDING" as const }
];

export const latestSignals = [
  { title: "Dashboard shell initialized", source: "DEMO signal", state: "DEMO" as const },
  { title: "Guardian telemetry pending", source: "LIVE_PENDING", state: "LIVE_PENDING" as const },
  { title: "Memory graph connection queued", source: "LIVE_PENDING", state: "LIVE_PENDING" as const }
];

export const guardianPlaceholderStats = [
  { label: "Domain Activity", value: 0, suffix: "%", state: "LIVE_PENDING" as const },
  { label: "Task Flow", value: 0, suffix: "%", state: "LIVE_PENDING" as const },
  { label: "Signal Quality", value: 0, suffix: "%", state: "LIVE_PENDING" as const }
];

export const guardianTasks = [
  { label: "Connect telemetry source", status: "QUEUED" as const },
  { label: "Map operational signals", status: "IN PROGRESS" as const },
  { label: "Verify dashboard data contract", status: "QUEUED" as const }
];

export const guardianSystemBars = [
  { label: "Memory", value: 0 },
  { label: "Projects", value: 0 },
  { label: "Reports", value: 0 },
  { label: "Workflow", value: 0 }
];
