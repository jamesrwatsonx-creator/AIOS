"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { searchAndScan } from "@/lib/browseshClient";
import { createLocalId } from "@/lib/id";
import { addNotification } from "@/lib/notifications";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import { upsertEntity } from "@/lib/entityStore";

type Signal = { id: string; title: string; url?: string; snippet?: string; timestamp: string };

export function HorusScanner() {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Signal[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [lastScan, setLastScan] = useState("");

  useEffect(() => {
    setApiKey(localStorage.getItem("hermes_browsesh_key") ?? "");
    setSignals(JSON.parse(localStorage.getItem("hermes_signals") ?? "[]"));
    const params = new URLSearchParams(window.location.search);
    const scan = params.get("scan");
    if (scan) setQuery(scan);
  }, []);

  function saveSignals(next: Signal[]) {
    setSignals(next);
    localStorage.setItem("hermes_signals", JSON.stringify(next));
    next.forEach((signal) => {
      upsertEntity({
        id: signal.id,
        type: "signal",
        title: signal.title,
        status: "RECORDED",
        guardian: "Horus",
        guardianSlug: "horus",
        category: "Web Intelligence",
        tags: ["signal", "horus"],
        relationships: [{ type: "assigned_to", targetId: "guardian:horus", label: "Horus" }],
        source: "Horus Scanner",
        metadata: { url: signal.url, snippet: signal.snippet, timestamp: signal.timestamp }
      }, "signal_saved");
    });
    void recordObsidianEvent({
      category: "guardian",
      title: "Horus signal state saved",
      body: next.map((signal) => `- ${signal.title}${signal.url ? ` (${signal.url})` : ""}`).join("\n") || "No saved signals.",
      metadata: { guardian: "horus", signalCount: next.length }
    });
  }

  async function runScan() {
    const timestamp = new Date().toLocaleString();
    setLastScan(timestamp);
    const data = await searchAndScan(query, apiKey);
    setResults((data.length ? data : [{ title: query || "No result", url: "", snippet: "Browse.sh returned no results or is not connected.", timestamp }]).map((item: { title?: string; url?: string; snippet?: string; content?: string }) => ({ id: createLocalId("horus-signal"), title: item.title ?? query, url: item.url, snippet: item.snippet ?? item.content ?? "No snippet available.", timestamp })));
  }

  return (
    <ChamberPanel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle eyebrow="Web Scanner" title="Horus scans the horizon" />
        <div className="grid gap-2 text-right"><StatusPill label={apiKey ? "SCANNER: ACTIVE" : "SCANNER: PENDING"} tone={apiKey ? "emerald" : "bronze"} /><p className="font-mono text-xs uppercase text-soft-sand">Last scan: {lastScan || "LIVE_PENDING"} · Signals: {signals.length}</p></div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Browse.sh API key" className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><button onClick={() => { localStorage.setItem("hermes_browsesh_key", apiKey); }} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Key</button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search or URL to scan..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><button onClick={runScan} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold">Scan</button></div>
      <div className="mt-5 grid gap-3">{results.map((item) => <div key={item.id} className="grid gap-2 rounded border border-gold/14 bg-obsidian/45 p-3"><p className="text-gold">{item.title}</p><p className="text-sm text-soft-sand">{item.url}</p><p className="text-sm text-soft-sand">{item.snippet}</p><p className="font-mono text-[0.65rem] uppercase text-soft-sand">{item.timestamp}</p><button onClick={() => { const next = [item, ...signals]; saveSignals(next); addNotification({ type: "SYSTEM", title: "Horus signal saved", message: item.title, guardian: "Horus", route: "/agents/horus" }); }} className="justify-self-start rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save as Signal</button></div>)}</div>
      <div className="mt-5 grid gap-3"><p className="font-mono text-xs uppercase text-gold">Saved Signals</p>{signals.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3"><span className="text-sm text-soft-sand">{item.title}</span><span className="flex gap-2"><Link href={`/hermes?signal=${encodeURIComponent(item.title)}`} className="font-mono text-xs uppercase text-gold">Send to Hermes</Link><button onClick={() => saveSignals(signals.filter((signal) => signal.id !== item.id))} className="font-mono text-xs uppercase text-burnt-bronze">Delete</button></span></div>)}</div>
    </ChamberPanel>
  );
}
