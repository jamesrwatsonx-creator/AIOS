"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Globe2, SendHorizontal } from "lucide-react";
import { BrowserMissionsPanel } from "@/components/browser/BrowserMissionsPanel";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { openEntityInspector } from "@/lib/entityInspectorEvents";
import { persistBrowserSession, readBrowserSession, readBrowserSessions, writeBrowserSession, writeBrowserSessions } from "@/lib/browser/browserSessionManager";
import type { BrowserRouterDecision, BrowserSession, BrowserSessionSource } from "@/lib/browser/browserTypes";

export function BrowserOperationsChamber() {
  const [session, setSession] = useState<BrowserSession | null>(null);
  const [routerDecision, setRouterDecision] = useState<BrowserRouterDecision | null>(null);
  const [url, setUrl] = useState("https://example.com");
  const [goal, setGoal] = useState("Open example.com, extract title, take screenshot, and save browser session.");
  const [command, setCommand] = useState("");
  const [busy, setBusy] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [missionVersion, setMissionVersion] = useState(0);

  useEffect(() => {
    setSession(readBrowserSession());
    fetch("/api/browser/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { routerDecision?: BrowserRouterDecision }) => setRouterDecision(data.routerDecision ?? null))
      .catch(() => setRouterDecision(null));
    const refresh = () => setMissionVersion((value) => value + 1);
    window.addEventListener("hermes-browser-session-updated", refresh);
    return () => window.removeEventListener("hermes-browser-session-updated", refresh);
  }, []);

  async function run(action: "open_example" | "open_url" | "extract_title" | "screenshot" | "clear", overrides: { url?: string; goal?: string; source?: BrowserSessionSource; session?: BrowserSession | null } = {}) {
    setBusy(true);
    try {
      const requestUrl = overrides.url ?? url;
      const requestGoal = overrides.goal ?? goal;
      const requestSession = overrides.session === undefined ? session : overrides.session;
      const response = await fetch("/api/browser/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, url: requestUrl, goal: requestGoal, session: requestSession, source: overrides.source ?? "manual" })
      });
      const data = (await response.json()) as { session: BrowserSession | null; routerDecision?: BrowserRouterDecision };
      setRouterDecision(data.routerDecision ?? data.session?.routerDecision ?? routerDecision);
      setSession(data.session);
      setScreenshotIndex(0);
      writeBrowserSession(data.session);
      if (data.session && action !== "clear") {
        writeBrowserSessions([data.session, ...readBrowserSessions()]);
        await persistBrowserSession(data.session, `browser_${action}`);
      }
      setMissionVersion((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  async function saveSession() {
    if (!session) return;
    setBusy(true);
    try {
      await persistBrowserSession(session, "browser_session_saved");
    } finally {
      setBusy(false);
    }
  }

  function normalizeUrl(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return "https://example.com";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }

  function extractUrlFromCommand(input: string) {
    const explicit = input.match(/https?:\/\/[^\s"')]+/i)?.[0];
    if (explicit) return explicit.replace(/[,.]+$/, "");
    const domain = input.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s"')]+)?/i)?.[0];
    return domain ? normalizeUrl(domain.replace(/[,.]+$/, "")) : normalizeUrl(url);
  }

  async function submitCommand(source: BrowserSessionSource = "horus") {
    const trimmed = command.trim();
    if (!trimmed) return;
    const target = extractUrlFromCommand(trimmed);
    setUrl(target);
    setGoal(trimmed);
    await run("screenshot", { url: target, goal: trimmed, source, session: null });
  }

  async function openTargetUrl() {
    const target = normalizeUrl(url);
    setUrl(target);
    await run("screenshot", { url: target, goal: `Open ${target} and capture the current page.`, source: "manual", session: null });
  }

  const decision = session?.routerDecision ?? routerDecision;
  const storedSessions = missionVersion >= 0 ? readBrowserSessions() : [];
  const screenshotSteps = [session, ...storedSessions.filter((item) => item.id !== session?.id)].filter((item): item is BrowserSession => Boolean(item?.screenshotPath)).slice(0, 6);
  const activeScreenshot = screenshotSteps[screenshotIndex] ?? screenshotSteps[0];
  const activeActionLog = activeScreenshot?.actionLog ?? session?.actionLog ?? [];
  const activeLinks = activeScreenshot?.extractedLinks ?? session?.extractedLinks ?? [];
  const activeText = activeScreenshot?.extractedText ?? session?.extractedText ?? "";

  function previousScreenshot() {
    if (screenshotSteps.length === 0) return;
    setScreenshotIndex((index) => (index - 1 + screenshotSteps.length) % screenshotSteps.length);
  }

  function nextScreenshot() {
    if (screenshotSteps.length === 0) return;
    setScreenshotIndex((index) => (index + 1) % screenshotSteps.length);
  }

  return (
    <AppShell>
      <PageFrame eyebrow="Horus / Web Research" title="Browser" subtitle="Run web research and browser missions with screenshot replay, extracted results, action logs, project links, and Obsidian persistence. Live streaming is future; current mode is step screenshot replay.">
        <ChamberPanel>
          <SectionTitle eyebrow="Command Bar" title="Tell Browser What To Do" />
          <div className="mt-5 grid gap-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <textarea
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void submitCommand("horus");
                }}
                rows={3}
                className="min-h-24 rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55"
                placeholder="Tell Browser what to do on the web..."
              />
              <button type="button" disabled={busy || !command.trim()} onClick={() => void submitCommand("horus")} className="inline-flex items-center justify-center gap-2 rounded-none border border-gold/45 px-4 py-3 font-mono text-xs uppercase text-gold disabled:cursor-not-allowed disabled:opacity-45">
                <SendHorizontal className="h-4 w-4" />
                Run Mission
              </button>
            </div>
            <div className="grid gap-2 text-sm text-soft-sand md:grid-cols-2 xl:grid-cols-4">
              {["Go to example.com and screenshot the homepage.", "Open this site and find the pricing section.", "Go to this URL, click Contact, extract the email, and save it.", "If you see a booking button, screenshot it."].map((example) => (
                <button key={example} type="button" onClick={() => setCommand(example)} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-left hover:border-gold/40">{example}</button>
              ))}
            </div>
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="URL Bar" title="Target" />
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 items-center gap-3 rounded border border-gold/18 bg-obsidian/55 px-4 py-3">
              <Globe2 className="h-4 w-4 shrink-0 text-gold" />
              <input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void openTargetUrl()} className="min-w-0 flex-1 bg-transparent text-ivory outline-none" placeholder="example.com or https://example.com" />
            </div>
            <button type="button" disabled={busy} onClick={() => void openTargetUrl()} className="rounded-none border border-gold/45 px-4 py-3 font-mono text-xs uppercase text-gold disabled:opacity-45">Open + Screenshot</button>
          </div>
        </ChamberPanel>

        <div className="grid gap-6">
          <ChamberPanel className="gold-circuit">
            <SectionTitle eyebrow="Browser Preview" title="Observed Page" />
            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.34fr)]">
              <div className="grid min-h-[34rem] place-items-center overflow-hidden rounded border border-gold/18 bg-obsidian/55 xl:min-h-[44rem]">
                {activeScreenshot?.screenshotPath ? (
                  <Image src={activeScreenshot.screenshotPath} alt="Browser operation screenshot" width={1440} height={960} className="h-full max-h-[52rem] w-full object-contain" priority />
                ) : (
                  <EmptyState title="No browser screenshot yet." message="Run a test session or screenshot action to create evidence." />
                )}
              </div>
              <div className="grid content-start gap-3 rounded border border-gold/14 bg-obsidian/45 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">Replay Log</p>
                  <span className="font-mono text-[0.68rem] uppercase text-soft-sand">{screenshotSteps.length ? `${screenshotIndex + 1} / ${screenshotSteps.length}` : "0 / 0"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill label="Current mode: STEP SCREENSHOT REPLAY" tone="gold" />
                  <StatusPill label="Live streaming: FUTURE" tone="blue" />
                </div>
                <div className="grid max-h-64 gap-2 overflow-auto">
                  {activeActionLog.length ? activeActionLog.map((item, index) => (
                    <div key={`${activeScreenshot?.id ?? "active"}-${item.timestamp}-${item.action}-${index}`} className="rounded border border-gold/14 bg-obsidian/55 p-3 text-sm text-soft-sand">
                      <span className="font-mono text-[0.68rem] text-gold">{item.action}</span>
                      <p className="mt-1">{item.result}</p>
                    </div>
                  )) : <span className="text-sm text-soft-sand">No replay actions recorded.</span>}
                </div>
                <div className="grid gap-2 text-sm text-soft-sand">
                  <p className="font-mono text-[0.68rem] uppercase text-gold">Extracted Result</p>
                  <p className="line-clamp-5 whitespace-pre-wrap">{activeText || "NONE"}</p>
                  <p className="font-mono text-[0.68rem] uppercase text-gold">Links</p>
                  <div className="grid gap-1">{activeLinks.length ? activeLinks.map((link, index) => <span key={`${activeScreenshot?.id ?? "active"}-${link.href}-${index}`}>{link.text || link.href}</span>) : <span>NONE</span>}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">Mission Screenshot Steps</p>
                <StatusPill label="Horus / Web Research owner" tone="gold" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" disabled={screenshotSteps.length === 0} onClick={previousScreenshot} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-[0.68rem] uppercase text-gold disabled:opacity-40">Previous</button>
                {screenshotSteps.length === 0 ? <span className="text-sm text-soft-sand">No screenshot steps recorded.</span> : screenshotSteps.map((item, index) => (
                  <button key={item.id} type="button" onClick={() => setScreenshotIndex(index)} className={`rounded border px-3 py-2 font-mono text-[0.68rem] uppercase ${activeScreenshot?.id === item.id ? "border-gold bg-gold/10 text-gold" : "border-gold/14 text-soft-sand"}`}>Step {index + 1}</button>
                ))}
                <button type="button" disabled={screenshotSteps.length === 0} onClick={nextScreenshot} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-[0.68rem] uppercase text-gold disabled:opacity-40">Next</button>
              </div>
            </div>
          </ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <ChamberPanel>
            <SectionTitle eyebrow="Current Operation" title="Session State" />
            <div className="mt-5 grid gap-3 text-sm text-soft-sand">
              <Info label="Goal" value={session?.goal ?? goal} />
              <Info label="URL" value={session?.url ?? url} />
              <Info label="Selected Tool" value={session?.toolUsed ?? decision?.tool ?? "blocked"} />
              <Info label="Status" value={session?.status ?? "idle"} />
              <Info label="Guardian" value={session?.guardian ?? "Horus"} />
              <Info label="Source" value={session?.source ?? "manual"} />
              <Info label="Started" value={session?.startedAt ?? "NONE"} />
              <Info label="Updated" value={session?.updatedAt ?? "NONE"} />
              <Info label="Entity" value={session?.entityId ?? "NONE"} />
              {session?.entityId ? <button type="button" onClick={() => openEntityInspector(session.entityId)} className="justify-self-start font-mono text-xs uppercase text-gold">Inspect Entity</button> : null}
            </div>
          </ChamberPanel>
        </div>

        <ChamberPanel>
          <SectionTitle eyebrow="Tool Router" title="Automatic Browser Tool Selection" />
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ToolStatus label="Browse.sh" status={decision?.statuses.browseSh.status ?? "UNKNOWN"} detail={decision?.statuses.browseSh.detail ?? "Status not loaded."} />
            <ToolStatus label="Stagehand" status={decision?.statuses.stagehand.status ?? "UNKNOWN"} detail={decision?.statuses.stagehand.detail ?? "Status not loaded."} />
            <ToolStatus label="Playwright" status={decision?.statuses.playwright.status ?? "UNKNOWN"} detail={decision?.statuses.playwright.detail ?? "Status not loaded."} />
            <ToolStatus label="Browserbase" status={decision?.statuses.browserbase.status ?? "FUTURE / NOT CONFIGURED"} detail={decision?.statuses.browserbase.detail ?? "Cloud browser not configured."} />
          </div>
          <div className="mt-5 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">
            <span className="font-mono text-gold">Chosen:</span> {decision?.tool ?? "blocked"} · {decision?.reason ?? "Router status not loaded."}
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Session Controls" title="Local Test Actions" />
          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton label="Start Test Session" disabled={busy} onClick={() => void run("open_example")} />
            <ActionButton label="Open URL" disabled={busy} onClick={() => void openTargetUrl()} />
            <ActionButton label="Extract Page Title" disabled={busy} onClick={() => void run("extract_title")} />
            <ActionButton label="Take Screenshot" disabled={busy} onClick={() => void run("screenshot")} />
            <ActionButton label="Save Session" disabled={busy || !session} onClick={() => void saveSession()} />
            <button type="button" disabled={busy} onClick={() => void run("clear")} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand disabled:opacity-45">Clear Session</button>
          </div>
        </ChamberPanel>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel>
            <SectionTitle eyebrow="Action Log" title="Chronological Steps" />
            <div className="mt-5 grid max-h-96 gap-3 overflow-auto">
              {session?.actionLog.length ? session.actionLog.map((item) => (
                <div key={`${item.timestamp}-${item.action}`} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
                  <span className="font-mono text-gold">{item.timestamp} · {item.action}</span>
                  <p>{item.result}</p>
                  {item.error ? <p className="text-burnt-bronze">{item.error}</p> : null}
                </div>
              )) : <EmptyState title="No browser actions recorded." message="Start a browser operation to create an action log." />}
            </div>
          </ChamberPanel>

          <ChamberPanel>
            <SectionTitle eyebrow="Extracted Results" title="Page Evidence" />
            <div className="mt-5 grid gap-3 text-sm text-soft-sand">
              <Info label="Page Title" value={session?.title || "NONE"} />
              <Info label="Screenshot" value={session?.screenshotPath || "NONE"} />
              <div className="rounded border border-gold/14 bg-obsidian/45 p-3">
                <p className="font-mono text-[0.68rem] uppercase text-gold">Visible Text Summary</p>
                <p className="mt-2 line-clamp-[10] whitespace-pre-wrap">{session?.extractedText || "NONE"}</p>
              </div>
              <div className="rounded border border-gold/14 bg-obsidian/45 p-3">
                <p className="font-mono text-[0.68rem] uppercase text-gold">Extracted Links</p>
                <div className="mt-2 grid gap-1">{session?.extractedLinks.length ? session.extractedLinks.map((link, index) => <span key={`${link.href}-${link.text}-${index}`}>{link.text || link.href}</span>) : "NONE"}</div>
              </div>
            </div>
          </ChamberPanel>
        </div>

        <ChamberPanel>
          <SectionTitle eyebrow="Obsidian + Entity Output" title="Persistence Trace" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Info label="Entity ID" value={session?.entityId ?? "NONE"} />
            <Info label="Write Target" value="04-Agents/Horus-Browser-Sessions.md" />
            <Info label="Nexus Update" value={session ? "EVENT EMITTED" : "WAITING"} />
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Future Streaming Path" title="Live Control Roadmap" />
          <p className="mt-4 text-sm leading-6 text-soft-sand">True live mouse pointer and keyboard streaming is FUTURE. It requires VNC/noVNC, CDP screencast, Browserbase live session, or a WebRTC stream. Current mode is screenshot-based step replay only.</p>
        </ChamberPanel>

        <ChamberPanel>
          <BrowserMissionsPanel />
        </ChamberPanel>
      </PageFrame>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-gold/14 bg-obsidian/45 p-3"><p className="font-mono text-[0.68rem] uppercase text-gold">{label}</p><p className="mt-1 break-words text-soft-sand">{value}</p></div>;
}

function ToolStatus({ label, status, detail }: { label: string; status: string; detail: string }) {
  const tone = status.includes("READY") || status.includes("INSTALLED") ? "emerald" : status.includes("FUTURE") ? "blue" : "bronze";
  return <div className="rounded border border-gold/14 bg-obsidian/45 p-4"><StatusPill label={status} tone={tone} /><p className="mt-3 font-mono text-xs uppercase text-gold">{label}</p><p className="mt-2 text-sm leading-6 text-soft-sand">{detail}</p></div>;
}

function ActionButton({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold disabled:cursor-not-allowed disabled:opacity-45">{label}</button>;
}
