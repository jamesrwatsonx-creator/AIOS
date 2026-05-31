import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { chooseBrowserTool, getVerifiedChromiumExecutablePath } from "@/lib/browser/browserToolRouter";
import type { BrowserActionLog, BrowserSession, BrowserSessionSource } from "@/lib/browser/browserTypes";

const screenshotDir = "/mnt/c/Users/a1guy/Documents/AppBuilds/James-AI-Operator-Dashboard/public/browser-sessions";
const publicScreenshotPrefix = "/browser-sessions";
const browserOperationsLog = "/mnt/c/Users/a1guy/Documents/Obsidian/Hermes-Memory-Vault/04-Agents/Horus-Browser-Sessions.md";

type RequestBody = {
  action?: "status" | "open_example" | "open_url" | "extract_title" | "screenshot" | "clear";
  url?: string;
  goal?: string;
  session?: BrowserSession | null;
  source?: BrowserSessionSource;
};

function timestamp() {
  return new Date().toISOString();
}

function createServerId(prefix = "browser-session") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function writeBrowserOperationLog(session: BrowserSession) {
  await mkdir(path.dirname(browserOperationsLog), { recursive: true });
  const entry = [
    `\n## ${timestamp()} - Browser operation ${session.status}: ${session.goal}`,
    "",
    `Entity ID: ${session.entityId}`,
    `URL: ${session.url || "NONE"}`,
    `Title: ${session.title || "NONE"}`,
    `Tool: ${session.toolUsed}`,
    `Screenshot: ${session.screenshotPath || "NONE"}`,
    "",
    "Action log:",
    ...session.actionLog.map((item) => `- ${item.timestamp} · ${item.action}: ${item.result}${item.error ? ` (${item.error})` : ""}`),
    ""
  ].join("\n");
  await appendFile(browserOperationsLog, entry, "utf8");
}

function log(action: string, result: string, error?: string): BrowserActionLog {
  return { timestamp: timestamp(), action, result, error };
}

function createSession(goal: string, url: string, source: BrowserSessionSource = "manual"): BrowserSession {
  const routerDecision = chooseBrowserTool({ goal, url, deterministic: true });
  const id = createServerId("browser-session");
  return {
    id,
    entityId: id,
    goal,
    url,
    title: "",
    status: routerDecision.tool === "blocked" ? "blocked" : "idle",
    toolUsed: routerDecision.tool,
    guardian: "Horus",
    guardianSlug: "horus",
    startedAt: timestamp(),
    updatedAt: timestamp(),
    extractedLinks: [],
    notes: [],
    actionLog: [log("router_decision", routerDecision.reason)],
    routerDecision,
    source
  };
}

async function runPlaywright(session: BrowserSession, mode: "open" | "title" | "screenshot") {
  const chromiumPath = await getVerifiedChromiumExecutablePath();
  if (!chromiumPath) {
    return {
      ...session,
      status: "blocked" as const,
      updatedAt: timestamp(),
      actionLog: [...session.actionLog, log(mode, "Blocked", "No Chromium executable detected.")]
    };
  }

  const { chromium } = await import("playwright");
  await mkdir(screenshotDir, { recursive: true });
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    browser = await chromium.launch({ executablePath: chromiumPath, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(session.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const title = await page.title();
    const text = (await page.locator("body").innerText({ timeout: 5000 }).catch(() => "")).slice(0, 4000);
    const links = await page.locator("a").evaluateAll((items) => items.slice(0, 20).map((item) => ({
      text: (item.textContent ?? "").trim().slice(0, 120),
      href: (item as HTMLAnchorElement).href
    }))).catch(() => []);
    let screenshotPath = session.screenshotPath;
    if (mode === "screenshot") {
      const filename = `${session.id}-${Date.now()}.png`;
      const absolute = path.join(screenshotDir, filename);
      await page.screenshot({ path: absolute, fullPage: true });
      screenshotPath = `${publicScreenshotPrefix}/${filename}`;
    }
    return {
      ...session,
      title,
      extractedText: text,
      extractedLinks: links,
      screenshotPath,
      status: "complete" as const,
      updatedAt: timestamp(),
      actionLog: [...session.actionLog, log(mode, `Completed with title: ${title || "NO TITLE"}`)]
    };
  } catch (error) {
    return {
      ...session,
      status: "failed" as const,
      updatedAt: timestamp(),
      actionLog: [...session.actionLog, log(mode, "Failed", error instanceof Error ? error.message : "Unknown error")]
    };
  } finally {
    await browser?.close();
  }
}

export async function GET() {
  const routerDecision = chooseBrowserTool({ goal: "status check", deterministic: true });
  return NextResponse.json({ routerDecision });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    if (body.action === "clear") return NextResponse.json({ session: null, routerDecision: chooseBrowserTool({ goal: "clear", deterministic: true }) });

    const url = body.action === "open_example" ? "https://example.com" : body.url || body.session?.url || "https://example.com";
    const goal = body.goal || body.session?.goal || "Open page, extract title, and capture browser operation evidence.";
    const session = body.session ?? createSession(goal, url, body.source ?? "manual");
    const nextSession = { ...session, url, goal, source: body.source ?? session.source ?? "manual", status: "running" as const, updatedAt: timestamp() };

    if (nextSession.toolUsed === "blocked") {
      const blockedSession = {
          ...nextSession,
          status: "blocked",
          actionLog: [...nextSession.actionLog, log(body.action ?? "status", "Blocked", nextSession.routerDecision.reason)]
        } satisfies BrowserSession;
      await writeBrowserOperationLog(blockedSession);
      return NextResponse.json({ session: blockedSession });
    }

    if (nextSession.toolUsed !== "playwright") {
      const blockedSession = {
          ...nextSession,
          status: "blocked",
          actionLog: [...nextSession.actionLog, log(body.action ?? "status", "Blocked", `${nextSession.toolUsed} execution is detected but not implemented in local mode.`)]
        } satisfies BrowserSession;
      await writeBrowserOperationLog(blockedSession);
      return NextResponse.json({ session: blockedSession });
    }

    const mode = body.action === "screenshot" || body.action === "open_example" ? "screenshot" : body.action === "extract_title" ? "title" : "open";
    const result = await runPlaywright(nextSession, mode);
    await writeBrowserOperationLog(result);
    return NextResponse.json({ session: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Browser operation failed" }, { status: 500 });
  }
}
