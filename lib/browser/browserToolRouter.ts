import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import type { BrowserRouterDecision, BrowserToolStatus } from "@/lib/browser/browserTypes";

export type BrowserTaskIntent = {
  goal: string;
  url?: string;
  deterministic?: boolean;
};

function commandOutput(command: string, args: string[] = []) {
  try {
    return execFileSync(command, args, { encoding: "utf8", timeout: 5000, stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function missingSharedLibraries(executable: string) {
  if (!executable) return [];
  const output = commandOutput("ldd", [executable]);
  return output.split("\n").filter((line) => line.includes("not found")).map((line) => line.trim());
}

function commandPath(command: string) {
  return commandOutput("which", [command]);
}

function packageVersion(packageName: string) {
  try {
    const packageJsonPath = pathForPackage(packageName);
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
    return packageJson.version ?? "";
  } catch {
    return "";
  }
}

function pathForPackage(packageName: string) {
  return `${process.cwd()}/node_modules/${packageName}/package.json`;
}

function chromiumPath() {
  const envPath = ["PLAYWRIGHT_CHROMIUM_EXECUTABLE", "CHROMIUM_PATH"].map((key) => process.env[key]).find(Boolean);
  if (envPath) return envPath;
  const systemPath = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"].find((candidate) => existsSync(candidate));
  if (systemPath) return systemPath;
  return existsSync("/tmp/chromium") ? "/tmp/chromium" : "";
}

export function detectBrowserTools() {
  const explicitBrowsePath = commandPath("browse.sh") || commandPath("browsesh") || commandPath("browse-sh");
  const browseCommandPath = commandPath("browse");
  const browseCommandVersion = browseCommandPath ? commandOutput(browseCommandPath, ["--version"]) : "";
  const browsePath = explicitBrowsePath || (browseCommandPath && !browseCommandVersion.toLowerCase().includes("xdg-open") ? browseCommandPath : "");
  const browseVersion = browsePath ? commandOutput(browsePath, ["--version"]) : "";
  const stagehandVersion = packageVersion("@browserbasehq/stagehand");
  const playwrightVersion = packageVersion("playwright");
  const sparticuzVersion = packageVersion("@sparticuz/chromium");
  const chromium = chromiumPath();
  const missingLibraries = chromium ? missingSharedLibraries(chromium) : [];

  const browseSh: BrowserToolStatus = browsePath
    ? {
        available: true,
        status: "INSTALLED BUT SKILL LIST UNVERIFIED",
        version: browseVersion || undefined,
        path: browsePath,
        detail: "Browse.sh-like CLI command was detected. Domain skill listing is not verified."
      }
    : {
        available: false,
        status: "NOT INSTALLED",
        path: browseCommandPath || undefined,
        detail: browseCommandPath
          ? "`browse` exists but resolves to xdg-open, not Browse.sh. Install command: npm install -g browse"
          : "No Browse.sh CLI command detected. Install command: npm install -g browse"
      };

  const stagehand: BrowserToolStatus = stagehandVersion
    ? {
        available: false,
        status: "PACKAGE INSTALLED / LOCAL MODE UNVERIFIED",
        version: stagehandVersion,
        detail: "Stagehand package is installed. Local env: LOCAL smoke test timed out before opening example.com without Browserbase/API keys, so it remains unverified."
      }
    : {
        available: false,
        status: "NOT INSTALLED",
        detail: "Stagehand package is missing."
      };

  const playwright: BrowserToolStatus = playwrightVersion && (chromium || sparticuzVersion) && missingLibraries.length === 0
    ? {
        available: true,
        status: "READY",
        version: playwrightVersion,
        path: chromium || "@sparticuz/chromium",
        detail: chromium ? "Playwright package and a Chromium executable are available." : "Playwright package and @sparticuz/chromium local runtime are available."
      }
    : {
        available: false,
        status: playwrightVersion ? missingLibraries.length ? "PACKAGE INSTALLED / CHROMIUM LIBS MISSING" : "PACKAGE INSTALLED / CHROMIUM MISSING" : "NOT INSTALLED",
        version: playwrightVersion || undefined,
        path: chromium || undefined,
        detail: playwrightVersion ? missingLibraries.length ? `Chromium is present but missing shared libraries: ${missingLibraries.join("; ")}` : "Playwright is installed, but no usable Chromium executable was detected." : "Playwright package is missing."
      };

  return {
    browseSh,
    stagehand,
    playwright,
    browserbase: {
      available: false,
      status: "FUTURE / NOT CONFIGURED",
      detail: "Browserbase cloud is intentionally not configured in this local-first pass."
    } satisfies BrowserToolStatus
  };
}

export function chooseBrowserTool(task: BrowserTaskIntent): BrowserRouterDecision {
  const statuses = detectBrowserTools();
  const goal = task.goal.toLowerCase();
  const semantic = /(research|summarize|understand|find|compare|extract meaning|navigate)/.test(goal);
  const deterministic = task.deterministic || /(screenshot|title|click|test|open|extract text|links)/.test(goal);

  if (statuses.browseSh.available && /(known skill|domain skill|browse\.sh skill)/.test(goal)) {
    return { tool: "browse_sh", reason: "Browse.sh selected because a Browse.sh skill was explicitly indicated and CLI was detected.", statuses };
  }

  if (statuses.stagehand.available && semantic && !statuses.browseSh.available) {
    return { tool: "stagehand", reason: "Stagehand selected for semantic browser interaction because Browse.sh was unavailable.", statuses };
  }

  if (statuses.playwright.available && (deterministic || !statuses.stagehand.available)) {
    return { tool: "playwright", reason: "Playwright selected for deterministic browser operation or as the available local fallback.", statuses };
  }

  return {
    tool: "blocked",
    reason: "No verified local browser execution tool is currently available. Playwright needs a Chromium executable; Stagehand local mode is unverified; Browse.sh skills are unavailable.",
    statuses
  };
}

export function getChromiumExecutablePath() {
  return chromiumPath();
}

export async function getVerifiedChromiumExecutablePath() {
  const current = chromiumPath();
  if (current) return current;
  try {
    const chromium = await import("@sparticuz/chromium");
    return await chromium.default.executablePath();
  } catch {
    return "";
  }
}
