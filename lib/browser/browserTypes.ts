export type BrowserTool = "browse_sh" | "stagehand" | "playwright" | "blocked";

export type BrowserOperationStatus = "idle" | "queued" | "running" | "complete" | "failed" | "blocked";

export type BrowserToolStatus = {
  available: boolean;
  status: string;
  version?: string;
  path?: string;
  detail: string;
};

export type BrowserRouterDecision = {
  tool: BrowserTool;
  reason: string;
  statuses: {
    browseSh: BrowserToolStatus;
    stagehand: BrowserToolStatus;
    playwright: BrowserToolStatus;
    browserbase: BrowserToolStatus;
  };
};

export type BrowserActionLog = {
  timestamp: string;
  action: string;
  result: string;
  error?: string;
};

export type BrowserSessionSource = "manual" | "horus" | "hermes";

export type BrowserSession = {
  id: string;
  goal: string;
  url: string;
  title: string;
  status: BrowserOperationStatus;
  toolUsed: BrowserTool;
  guardian: string;
  guardianSlug: string;
  startedAt: string;
  updatedAt: string;
  screenshotPath?: string;
  extractedText?: string;
  extractedLinks: Array<{ text: string; href: string }>;
  notes: string[];
  actionLog: BrowserActionLog[];
  routerDecision: BrowserRouterDecision;
  entityId: string;
  source?: BrowserSessionSource;
};
