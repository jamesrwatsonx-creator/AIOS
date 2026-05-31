"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { openEntityInspector } from "@/lib/entityInspectorEvents";
import { readUnifiedActivity, type EntityActivityEvent } from "@/lib/entityStore";
import { guardians } from "@/lib/guardians";

export function ActivityChamber() {
  const [guardian, setGuardian] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [cleared, setCleared] = useState(false);
  const [entries, setEntries] = useState<EntityActivityEvent[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(readUnifiedActivity());
    refresh();
    window.addEventListener("hermes-activity-updated", refresh);
    window.addEventListener("hermes-entity-activity-updated", refresh);
    return () => {
      window.removeEventListener("hermes-activity-updated", refresh);
      window.removeEventListener("hermes-entity-activity-updated", refresh);
    };
  }, []);

  const visible = useMemo(() => cleared ? [] : entries.filter((entry) => (guardian === "ALL" || entry.guardian === guardian) && (type === "ALL" || entry.eventType === type)), [entries, guardian, type, cleared]);
  const typeOptions = useMemo(() => ["ALL", ...Array.from(new Set(entries.map((entry) => entry.eventType))).sort()], [entries]);
  const today = new Date().toISOString().slice(0, 10);
  const todaysEntries = useMemo(() => entries.filter((entry) => entry.createdAt.startsWith(today)), [entries, today]);
  const guardianCounts = useMemo(() => entries.reduce<Record<string, number>>((acc, entry) => ({ ...acc, [entry.guardian]: (acc[entry.guardian] ?? 0) + 1 }), {}), [entries]);
  const mostActiveGuardian = Object.entries(guardianCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "NONE";

  function exportActivity() {
    const url = URL.createObjectURL(new Blob([visible.map((item) => `${new Date(item.createdAt).toLocaleString()} ${item.guardian} ${item.eventType}: ${item.title}`).join("\n")], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url; link.download = "activity-export.txt"; link.click(); URL.revokeObjectURL(url);
  }
  return (
    <AppShell><PageFrame eyebrow="Activity" title="Activity" subtitle="A clear timeline of what AIOS, agents, browser missions, projects, Memory, and Codex have done locally.">
      <ChamberPanel><SectionTitle eyebrow="Activity Stats" title="Today" /><div className="mt-5 grid gap-3 md:grid-cols-3"><MetricCard label="Actions Today" value={todaysEntries.length} state="LIVE_PENDING" tooltip="Local activity events created today." /><MetricCard label="Most Active Guardian" value={guardianCounts[mostActiveGuardian] ?? 0} state="LIVE_PENDING" note={mostActiveGuardian} /><MetricCard label="Total Local Events" value={entries.length} state="LIVE_PENDING" tooltip="Events saved in hermes_activity." /></div></ChamberPanel>
      <ChamberPanel><div className="flex flex-wrap items-center justify-between gap-4"><SectionTitle eyebrow="Activity Feed" title="Activity Timeline" /><div className="flex gap-2"><button onClick={() => setCleared(true)} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Clear View</button><button onClick={exportActivity} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Export</button></div></div><div className="mt-5 grid gap-3 md:grid-cols-2"><select value={guardian} onChange={(e) => setGuardian(e.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory"><option>ALL</option><option>Hermes</option>{guardians.map((g) => <option key={g.name}>{g.name}</option>)}</select><select value={type} onChange={(e) => setType(e.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">{typeOptions.map((item) => <option key={item}>{item}</option>)}</select></div><div className="mt-5 grid max-h-[34rem] gap-3 overflow-auto">{visible.length === 0 ? <EmptyState title="No activity recorded yet." message="Hermes is watching." /> : visible.map((entry) => <div key={entry.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><span className="font-mono text-gold">{new Date(entry.createdAt).toLocaleString()} · {entry.guardian} · {entry.eventType}</span><p>{entry.title}</p>{entry.source ? <p className="mt-1 text-xs text-soft-sand/70">Source: {entry.source}</p> : null}{entry.entityId ? <button type="button" onClick={() => openEntityInspector(entry.entityId!)} className="mt-2 font-mono text-[0.68rem] uppercase text-gold">Inspect</button> : null}</div>)}</div></ChamberPanel>
    </PageFrame></AppShell>
  );
}
