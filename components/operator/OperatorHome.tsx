"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Globe2, ListTodo, MessageCircle, ShieldAlert, Sparkles } from "lucide-react";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { AppShell } from "@/components/layout/AppShell";
import { SystemVitals } from "@/components/metrics/SystemVitals";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { readBrowserSessions } from "@/lib/browser/browserSessionManager";
import { readUnifiedActivity, readUnifiedEntities } from "@/lib/entityStore";
import { hermesDailyKey, readStorage, writeStorage } from "@/lib/localStorageKeys";
import { readProjects } from "@/lib/systemPersistence";

type FocusItem = { id: string; text: string; complete: boolean };

export function OperatorHome() {
  const [focus, setFocus] = useState<FocusItem[]>([]);
  const [newFocus, setNewFocus] = useState("");
  const [version, setVersion] = useState(0);
  const focusKey = hermesDailyKey("agenda");

  useEffect(() => {
    setFocus(readStorage(focusKey, []));
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("hermes-projects-updated", refresh);
    window.addEventListener("hermes-activity-updated", refresh);
    window.addEventListener("hermes-browser-session-updated", refresh);
    window.addEventListener("hermes-memory-nexus-updated", refresh);
    return () => {
      window.removeEventListener("hermes-projects-updated", refresh);
      window.removeEventListener("hermes-activity-updated", refresh);
      window.removeEventListener("hermes-browser-session-updated", refresh);
      window.removeEventListener("hermes-memory-nexus-updated", refresh);
    };
  }, [focusKey]);

  const projects = useMemo(() => readProjects(), [version]);
  const activity = useMemo(() => readUnifiedActivity(), [version]);
  const entities = useMemo(() => readUnifiedEntities(), [version]);
  const browserSessions = useMemo(() => readBrowserSessions(), [version]);
  const activeProjects = projects.filter((project) => !["ARCHIVED", "DEPLOYED"].includes(project.status)).slice(0, 4);
  const blockers = [...projects.filter((project) => project.status === "BLOCKED").map((project) => project.name), ...entities.filter((entity) => entity.status === "BLOCKED").map((entity) => entity.title)].slice(0, 4);
  const codexEvents = activity.filter((event) => event.guardian === "Codex" || event.eventType.includes("codex") || event.source?.toLowerCase().includes("codex")).slice(0, 3);
  const memoryEvents = activity.filter((event) => event.entityType === "memory" || event.eventType.includes("memory")).slice(0, 3);
  const greeting = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  function saveFocus(next: FocusItem[]) {
    setFocus(next);
    writeStorage(focusKey, next);
  }

  function addFocus() {
    if (!newFocus.trim()) return;
    saveFocus([{ id: `focus-${Date.now()}-${Math.random().toString(16).slice(2)}`, text: newFocus.trim(), complete: false }, ...focus]);
    setNewFocus("");
  }

  const briefing = `Yesterday you recorded ${activity.slice(0, 25).length} recent system events, saved ${projects.length} projects, and captured ${browserSessions.length} browser missions. Recommended today: close open blockers, review Codex work, and commit the next stable AIOS milestone.`;

  return (
    <AppShell>
      <main className="grid min-w-0 gap-6">
        <section className="sacred-panel gold-circuit rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid max-w-4xl gap-4">
              <StatusPill label="AIOS V2" tone="gold" />
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold">{greeting}</p>
              <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] text-ivory text-balance-safe">Good morning, James.</h1>
              <p className="max-w-3xl text-base leading-7 text-soft-sand md:text-lg">{briefing}</p>
            </div>
            <Link href="/hermes" className="inline-flex items-center gap-2 rounded border border-gold/45 bg-gold/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-obsidian">
              Ask Hermes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-4">
          <MetricCard label="Active Projects" value={activeProjects.length} state="LIVE_PENDING" tooltip="Projects not archived or deployed." />
          <MetricCard label="Open Blockers" value={blockers.length} state="LIVE_PENDING" tooltip="Projects or entities marked BLOCKED." />
          <MetricCard label="Browser Missions" value={browserSessions.length} state="LIVE_PENDING" tooltip="Saved screenshot replay sessions." />
          <MetricCard label="Memory Items" value={entities.filter((entity) => entity.type === "memory").length} state="LIVE_PENDING" tooltip="Entity graph memory records." />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <ChamberPanel>
            <SectionTitle eyebrow="Today" title="Today's Focus" />
            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <input value={newFocus} onChange={(event) => setNewFocus(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addFocus()} placeholder="Add the next thing to focus on..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55" />
              <button type="button" onClick={addFocus} className="rounded border border-gold/45 px-4 py-3 font-mono text-xs uppercase text-gold">Add Focus</button>
            </div>
            <div className="mt-5 grid gap-3">
              {focus.length ? focus.map((item) => (
                <label key={item.id} className="flex items-center gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">
                  <input type="checkbox" checked={item.complete} onChange={() => saveFocus(focus.map((entry) => entry.id === item.id ? { ...entry, complete: !entry.complete } : entry))} />
                  <span className={item.complete ? "line-through opacity-60" : ""}>{item.text}</span>
                </label>
              )) : <EmptyState title="No focus set for today." message="Add one clear next action." />}
            </div>
          </ChamberPanel>

          <ChamberPanel>
            <SectionTitle eyebrow="Operator Advice" title="Suggested Next Actions" />
            <div className="mt-5 grid gap-3">
              <Action href="/projects" icon={<BriefcaseBusiness className="h-4 w-4" />} title="Choose one active project and define its next action." />
              <Action href="/browser" icon={<Globe2 className="h-4 w-4" />} title="Run or review the most recent web research mission." />
              <Action href="/codex" icon={<ListTodo className="h-4 w-4" />} title="Check what Codex changed and whether tests passed." />
              <Action href="/memory" icon={<BrainCircuit className="h-4 w-4" />} title="Confirm important work is saved to Memory and Obsidian." />
            </div>
          </ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <SummaryCard title="Active Projects" icon={<BriefcaseBusiness className="h-5 w-5" />} items={activeProjects.map((project) => `${project.name} - ${project.status}`)} empty="No active projects yet." href="/projects" />
          <SummaryCard title="Open Blockers" icon={<ShieldAlert className="h-5 w-5" />} items={blockers} empty="No blockers marked right now." href="/projects" />
          <SummaryCard title="Recent Browser Missions" icon={<Globe2 className="h-5 w-5" />} items={browserSessions.slice(0, 4).map((session) => `${session.goal || session.url} - ${session.status}`)} empty="No browser missions saved yet." href="/browser" />
          <SummaryCard title="Recent Codex Work" icon={<Sparkles className="h-5 w-5" />} items={codexEvents.map((event) => event.title)} empty="No Codex events recorded yet." href="/codex" />
          <SummaryCard title="Recent Memory Updates" icon={<BrainCircuit className="h-5 w-5" />} items={memoryEvents.map((event) => event.title)} empty="No memory updates recorded yet." href="/memory" />
          <SummaryCard title="Command Center" icon={<MessageCircle className="h-5 w-5" />} items={["Ask what to work on next.", "Route a project, browser mission, or Codex check.", "Use voice when the local voice layer is running."]} href="/hermes" />
        </div>

        <SystemVitals />
        <ActivityFeed />
      </main>
    </AppShell>
  );
}

function Action({ href, icon, title }: { href: string; icon: ReactNode; title: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand transition hover:border-gold/45 hover:text-ivory">
      <span className="text-gold">{icon}</span>
      <span>{title}</span>
    </Link>
  );
}

function SummaryCard({ title, icon, items, empty, href }: { title: string; icon: ReactNode; items: string[]; empty?: string; href: string }) {
  return (
    <ChamberPanel>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-gold">{icon}</span>
          <h2 className="font-display text-2xl text-ivory">{title}</h2>
        </div>
        <Link href={href} className="font-mono text-[0.68rem] uppercase text-gold">Open</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {items.length ? items.slice(0, 4).map((item) => <p key={item} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">{item}</p>) : <EmptyState title={empty ?? "Nothing recorded yet."} message="AIOS will show updates here when work is saved." />}
      </div>
    </ChamberPanel>
  );
}
