"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Mic, RefreshCw, Trash2 } from "lucide-react";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { GuardianGrid } from "@/components/guardians/GuardianGrid";
import { HermesVoiceOrb } from "@/components/hermes/HermesVoiceOrb";
import { AppShell } from "@/components/layout/AppShell";
import { SystemVitals } from "@/components/metrics/SystemVitals";
import { TelemetryStrip } from "@/components/metrics/TelemetryStrip";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlowDivider } from "@/components/ui/GlowDivider";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { guardians } from "@/lib/guardians";
import { createLocalId } from "@/lib/id";
import { hermesDailyKey, readStorage, writeStorage } from "@/lib/localStorageKeys";
import { latestSignals } from "@/lib/mockTelemetry";

type AgendaItem = { id: string; text: string; complete: boolean };
type Signal = { id: string; title: string; source: string; read: boolean };
const hermesWaitingMessage = "Hermes is waiting for your command, James.";

export function HomeChamber() {
  const agendaKey = hermesDailyKey("agenda");
  const [connected, setConnected] = useState(false);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [newAgenda, setNewAgenda] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [quote, setQuote] = useState(guardians[0].quote);
  const [, setLastUpdated] = useState("");
  const [lastHermesResponse, setLastHermesResponse] = useState(hermesWaitingMessage);
  const visibleSignals = signals.filter((signal) => !signal.read);

  useEffect(() => {
    setAgenda(readStorage(agendaKey, []));
    setSignals(latestSignals.map((signal) => ({ id: createLocalId("signal"), title: signal.title, source: signal.source, read: false })));
    setLastHermesResponse(readStorage("hermes_last_response", hermesWaitingMessage));
  }, [agendaKey]);

  function saveAgenda(next = agenda) {
    writeStorage(agendaKey, next);
  }

  function addAgenda() {
    if (!newAgenda.trim()) return;
    const next = [...agenda, { id: createLocalId("agenda"), text: newAgenda.trim(), complete: false }];
    setAgenda(next);
    saveAgenda(next);
    setNewAgenda("");
  }

  function refreshQuote() {
    setQuote(guardians[Math.floor(Math.random() * guardians.length)].quote);
  }

  return (
    <AppShell>
      <main className="grid min-w-0 gap-6">
        <section className="sacred-panel gold-circuit grid gap-6 overflow-hidden rounded-lg p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:p-8">
          <div className="grid content-center gap-6">
            <StatusPill label="Local-first Egyptian AI OS" tone="gold" />
            <div className="grid gap-4">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-gold">Home</p>
              <h1 className="max-w-5xl font-display text-[clamp(3rem,8vw,7.8rem)] leading-[0.88] text-ivory text-balance-safe">James AI Operator Dashboard</h1>
              <p className="max-w-3xl text-[clamp(1rem,1.6vw,1.25rem)] leading-8 text-soft-sand text-balance-safe">
                A sacred local command chamber for agents, memory, projects, telemetry, builds, models, integrations, and operational intelligence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/agents" className="inline-flex items-center gap-2 rounded border border-gold/35 bg-gold/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-gold transition hover:-translate-y-0.5 hover:border-gold/60">Open Agents <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/projects" className="inline-flex items-center gap-2 rounded border border-nile-blue/35 bg-nile-blue/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-nile-blue transition hover:-translate-y-0.5 hover:border-nile-blue/60">Open Build Chamber <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <ChamberPanel className="self-stretch">
            <div className="grid h-full gap-6">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <BrainCircuit className="h-9 w-9 text-gold" />
                  <button type="button" onClick={() => setConnected((value) => !value)}><StatusPill label={connected ? "CONNECTED" : "OFFLINE"} tone={connected ? "emerald" : "bronze"} /></button>
                </div>
                <SectionTitle eyebrow="Core Intelligence" title="Nucleus Awaiting Live Index" />
                <p className="text-sm leading-6 text-soft-sand/86 text-balance-safe">TODO telemetry connection point: bind this panel to Obsidian memory, Hermes bridge, Codex activity, model routes, and AppBuild registry scans.</p>
              </div>
              <GlowDivider />
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setLastUpdated(new Date().toLocaleTimeString())} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Run Diagnostic</button>
                <Link href="/memory" className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open Memory Nexus</Link>
              </div>
              <div className="grid gap-2 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-soft-sand">
                <span>Memory Graph: 0 LIVE_PENDING</span>
                <span>Agents Online: 0 LIVE_PENDING</span>
                <span>Build Signals: 0 LIVE_PENDING</span>
              </div>
            </div>
          </ChamberPanel>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <SystemVitals />
          <ChamberPanel>
            <div className="grid place-items-center gap-3 text-center">
              <HermesVoiceOrb state="IDLE" size="compact" />
              <p className="max-w-full truncate text-sm text-soft-sand">{lastHermesResponse}</p>
              <Link href="/hermes" className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open Hermes Chamber</Link>
              <Link href="/hermes" className="inline-flex items-center gap-2 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold"><Mic className="h-4 w-4" /> Speak to Hermes</Link>
            </div>
          </ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ChamberPanel>
            <SectionTitle eyebrow="Daily Plan" title="Today's Agenda" action={<Link className="font-mono text-xs uppercase tracking-[0.16em] text-gold hover:text-ivory" href="/chronicles">View All</Link>} />
            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <input value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAgenda()} placeholder="Add agenda item..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55" />
              <button type="button" onClick={addAgenda} className="rounded-none border border-gold/45 px-4 py-3 font-mono text-xs uppercase text-gold">Add Item</button>
            </div>
            <div className="mt-5 grid gap-3">
              {agenda.length === 0 ? <EmptyState title="No entries recorded today." message="Begin your reflection." /> : agenda.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-4">
                  <label className="flex min-w-0 items-center gap-3 text-sm text-soft-sand">
                    <input type="checkbox" checked={item.complete} onChange={() => {
                      const next = agenda.map((entry) => entry.id === item.id ? { ...entry, complete: !entry.complete } : entry);
                      setAgenda(next); saveAgenda(next);
                    }} />
                    <span className={item.complete ? "line-through opacity-60" : ""}>{item.text}</span>
                  </label>
                  <button type="button" onClick={() => {
                    const next = agenda.filter((entry) => entry.id !== item.id);
                    setAgenda(next); saveAgenda(next);
                  }} className="text-burnt-bronze hover:text-gold"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => saveAgenda()} className="mt-4 rounded-none border border-gold/45 px-4 py-2 font-mono text-xs uppercase text-gold">Save Agenda</button>
          </ChamberPanel>

          <ChamberPanel>
            <SectionTitle eyebrow="Latest Signals" title="Operational Intelligence Feed" action={<Link href="/activity" className="font-mono text-xs uppercase tracking-[0.16em] text-gold">View All Signals</Link>} />
            <div className="mt-5 grid gap-3">
              {visibleSignals.length === 0 ? <EmptyState title="All signals clear." message="Horus sees no new movements." /> : visibleSignals.map((signal) => (
                <div key={signal.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3">
                  <div><p className="text-sm text-ivory">{signal.title}</p><p className="font-mono text-[0.68rem] uppercase text-soft-sand">{signal.source}</p></div>
                  <button type="button" onClick={() => setSignals(signals.map((item) => item.id === signal.id ? { ...item, read: true } : item))} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Mark Read</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setSignals([])} className="mt-4 rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Clear All</button>
          </ChamberPanel>
        </div>

        <GuardianGrid />
        <TelemetryStrip />
        <section className="sacred-panel rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-[clamp(1.3rem,2.5vw,2.2rem)] leading-tight text-soft-sand text-balance-safe">“{quote}”</p>
            <button type="button" onClick={refreshQuote} className="inline-flex items-center gap-2 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold"><RefreshCw className="h-4 w-4" /> Refresh Quote</button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
