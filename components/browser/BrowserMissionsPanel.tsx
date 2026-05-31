"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Copy, Download, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { openEntityInspector } from "@/lib/entityInspectorEvents";
import { readBrowserSession, readBrowserSessions } from "@/lib/browser/browserSessionManager";
import type { BrowserSession } from "@/lib/browser/browserTypes";

export function BrowserMissionsPanel({ compact = false }: { compact?: boolean }) {
  const [sessions, setSessions] = useState<BrowserSession[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState("");

  useEffect(() => {
    const refresh = () => {
      const history = readBrowserSessions();
      const latest = readBrowserSession();
      setSessions(history.length ? history : latest ? [latest] : []);
    };
    refresh();
    window.addEventListener("hermes-browser-session-updated", refresh);
    window.addEventListener("hermes-entities-updated", refresh);
    return () => {
      window.removeEventListener("hermes-browser-session-updated", refresh);
      window.removeEventListener("hermes-entities-updated", refresh);
    };
  }, []);

  const visible = sessions.slice(0, compact ? 4 : 8);
  const selectedMission = sessions.find((session) => session.id === selectedMissionId) ?? visible[0] ?? null;

  function missionSummary(session: BrowserSession) {
    return [
      `Mission: ${session.title || session.goal || session.url || "Browser operation"}`,
      `Status: ${session.status}`,
      `Tool: ${session.toolUsed}`,
      `URL: ${session.url || "NONE"}`,
      `Timestamp: ${session.updatedAt}`,
      `Screenshot: ${session.screenshotPath || "NONE"}`,
      "",
      "Extracted text:",
      session.extractedText || "NONE",
      "",
      "Links:",
      ...(session.extractedLinks.length ? session.extractedLinks.map((link) => `- ${link.text || link.href}: ${link.href}`) : ["NONE"])
    ].join("\n");
  }

  async function copyMission(session: BrowserSession) {
    const summary = missionSummary(session);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        return;
      }
    } catch {
      // Clipboard permission can be denied in automated/headless browsers.
    }
    exportText(`${session.id}-summary.txt`, summary);
  }

  function exportMission(session: BrowserSession) {
    exportText(`${session.id}-summary.txt`, missionSummary(session));
  }

  function exportText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-4">
      <SectionTitle eyebrow="Horus Browser Missions" title="Latest Browser Sessions" />
      <div className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
        <StatusPill label="Live browser streaming: FUTURE" tone="blue" />
      </div>
      {visible.length === 0 ? (
        <EmptyState title="No browser missions recorded." message="Run Browser Operations to create the first mission." />
      ) : (
        <div className={`grid gap-4 ${compact ? "" : "xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]"}`}>
          <div className="grid gap-3">
            {visible.map((session) => (
              <article key={session.id} className={`grid gap-3 rounded border p-3 transition ${selectedMission?.id === session.id ? "border-gold/45 bg-gold/8" : "border-gold/14 bg-obsidian/45"}`}>
                <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                  <button type="button" onClick={() => setSelectedMissionId(session.id)} className="grid min-h-24 place-items-center overflow-hidden rounded border border-gold/14 bg-obsidian/60">
                    {session.screenshotPath ? (
                      <Image src={session.screenshotPath} alt={`Screenshot for ${session.title || session.url}`} width={240} height={160} className="h-full max-h-28 w-full object-cover" />
                    ) : (
                      <span className="px-2 text-center font-mono text-[0.65rem] uppercase text-soft-sand">No Screenshot</span>
                    )}
                  </button>
                  <div className="grid min-w-0 gap-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">{session.toolUsed} · {session.status}</p>
                        <h3 className="mt-1 text-base text-ivory text-balance-safe">{session.title || session.url || session.goal}</h3>
                      </div>
                      <button type="button" onClick={() => setSelectedMissionId(session.id)} className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase text-gold">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Detail
                      </button>
                    </div>
                    <div className="grid gap-1 text-sm text-soft-sand">
                      <MissionLine label="URL" value={session.url || "NONE"} />
                      <MissionLine label="Timestamp" value={formatDate(session.updatedAt)} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openEntityInspector(session.entityId)} className="font-mono text-[0.68rem] uppercase text-gold">Inspect</button>
                      <button type="button" onClick={() => copyMission(session)} className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase text-gold"><Copy className="h-3.5 w-3.5" /> Copy</button>
                      <button type="button" onClick={() => exportMission(session)} className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase text-gold"><Download className="h-3.5 w-3.5" /> Export</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {selectedMission ? (
            <aside className="grid gap-3 rounded border border-gold/18 bg-obsidian/50 p-4">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">Mission Detail</p>
                <h3 className="mt-1 text-xl text-ivory text-balance-safe">{selectedMission.title || selectedMission.goal || selectedMission.url}</h3>
              </div>
              {selectedMission.screenshotPath ? (
                <div className="overflow-hidden rounded border border-gold/14 bg-obsidian/60">
                  <Image src={selectedMission.screenshotPath} alt={`Screenshot for ${selectedMission.title || selectedMission.url}`} width={720} height={480} className="max-h-64 w-full object-contain" />
                </div>
              ) : null}
              <div className="grid gap-2 text-sm text-soft-sand">
                <MissionLine label="URL" value={selectedMission.url || "NONE"} />
                <MissionLine label="Status" value={selectedMission.status} />
                <MissionLine label="Tool" value={selectedMission.toolUsed} />
                <MissionLine label="Timestamp" value={formatDate(selectedMission.updatedAt)} />
                <MissionLine label="Result" value={selectedMission.extractedText?.slice(0, 360) || "NONE"} />
                <div>
                  <span className="font-mono text-[0.65rem] uppercase text-gold">Links</span>
                  <div className="mt-1 grid gap-1">{selectedMission.extractedLinks.length ? selectedMission.extractedLinks.map((link, index) => <span key={`${selectedMission.id}-${link.href}-${index}`}>{link.text || link.href}</span>) : <span>NONE</span>}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openEntityInspector(selectedMission.entityId)} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Open Entity</button>
                <button type="button" onClick={() => copyMission(selectedMission)} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Copy Summary</button>
                <button type="button" onClick={() => exportMission(selectedMission)} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Export Summary</button>
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}

function MissionLine({ label, value }: { label: string; value: string }) {
  return <p><span className="font-mono text-[0.65rem] uppercase text-gold">{label}:</span> {value}</p>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
