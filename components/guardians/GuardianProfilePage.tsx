"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { BrowserMissionsPanel } from "@/components/browser/BrowserMissionsPanel";
import { GuidedCreationModal } from "@/components/creation/GuidedCreationModal";
import { getGuardian } from "@/lib/guardians";
import { guardianPlaceholderStats, guardianSystemBars } from "@/lib/mockTelemetry";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { GlowDivider } from "@/components/ui/GlowDivider";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressMeter } from "@/components/ui/ProgressMeter";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { readStorage } from "@/lib/localStorageKeys";
import { HorusScanner } from "@/components/guardians/HorusScanner";
import { createSystemItem, saveGuardianTasks } from "@/lib/systemPersistence";
import { openEntityInspector } from "@/lib/entityInspectorEvents";

type GuardianProfilePageProps = {
  slug: string;
};

export function GuardianProfilePage({ slug }: GuardianProfilePageProps) {
  const guardian = getGuardian(slug)!;
  const taskKey = `hermes_guardian_${guardian.slug}_tasks`;
  const [status, setStatus] = useState("ACTIVE");
  const [tasks, setTasks] = useState<Array<{ id: string; label: string; status: string; complete: boolean }>>([]);
  const [newTask, setNewTask] = useState("");
  const [guidedOpen, setGuidedOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setTasks(readStorage(taskKey, []));
    refresh();
    window.addEventListener("hermes-guardian-tasks-updated", refresh);
    window.addEventListener("hermes-memory-nexus-updated", refresh);
    return () => {
      window.removeEventListener("hermes-guardian-tasks-updated", refresh);
      window.removeEventListener("hermes-memory-nexus-updated", refresh);
    };
  }, [taskKey]);

  function saveTasks(next = tasks) {
    saveGuardianTasks(guardian.slug, guardian.name, next);
  }

  async function addTaskFromInput() {
    if (!newTask.trim()) return;
    await createSystemItem(newTask, { preferredType: "task", guardianSlug: guardian.slug, source: `${guardian.name} Profile` });
    setTasks(readStorage(taskKey, []));
    setNewTask("");
  }

  return (
    <div className="grid min-w-0 gap-6">
      <section className="sacred-panel gold-circuit grid gap-6 rounded-lg p-6 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] md:p-8">
        <div className="grid content-center gap-5">
          <div className="flex flex-wrap gap-3">
            <Link href="/agents" className="rounded-none border border-gold/40 px-3 py-2 font-mono text-xs uppercase text-gold">Back to Agents</Link>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border border-gold/20 bg-obsidian px-3 py-2 text-gold">
              {["ACTIVE", "IDLE", "OFFLINE"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <Link href={`/agents/${guardian.slug}`} className="rounded-none border border-gold/40 px-3 py-2 font-mono text-xs uppercase text-gold">Open Agent</Link>
          </div>
          <div>
            <p className="mb-3 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-gold">Agent Profile</p>
            <h1 className="font-display text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.92] text-ivory text-balance-safe">{guardian.name}</h1>
            <p className="mt-4 max-w-3xl text-xl leading-8 text-soft-sand text-balance-safe">{guardian.title}</p>
          </div>
          <p className="max-w-3xl text-base leading-7 text-soft-sand/88 text-balance-safe">{guardian.signature}</p>
        </div>
        <div className="grid min-w-0 place-items-center rounded-lg border border-gold/20 bg-obsidian/55 p-4">
          <Image
            src={guardian.image}
            alt={`${guardian.name} guardian portrait slot`}
            width={640}
            height={760}
            className="max-h-[28rem] w-full rounded-md object-cover opacity-85"
            priority
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Agent Overview" title="What This Agent Does" />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-soft-sand">
            {[
              ["Domain", guardian.domain],
              ["Role", guardian.role],
              ["Alignment", guardian.alignment],
              ["Status", status],
              ["Signature", guardian.signature]
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 rounded border border-gold/14 bg-obsidian/45 p-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-gold">{label}</span>
                <span className="min-w-0 text-balance-safe">{value}</span>
              </div>
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Capabilities" title="Capabilities" />
          <div className="mt-5 grid gap-4">
            {guardian.capabilities.map((capability) => (
              <div key={capability} title={`${capability} value is DEMO until guardian telemetry is connected.`}>
                <div className="mb-2 flex justify-between gap-3"><StatusPill label="DEMO" tone="bronze" /><span className="font-mono text-xs text-soft-sand">0%</span></div>
                <ProgressMeter label={capability} value={0} accent={guardian.accent} />
              </div>
            ))}
          </div>
        </ChamberPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Active Domain" title="Recent Work Signals" />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {guardianPlaceholderStats.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} suffix={metric.suffix} state={metric.state} />
            ))}
          </div>
          <GlowDivider />
          <div className="mt-5 grid gap-3">
            {guardian.telemetrySources.map((source) => (
              <div key={source} className="rounded border border-gold/14 bg-obsidian/45 p-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-soft-sand">
                Source to connect: {source}
              </div>
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Current Tasks" title="Queue" />
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => {
              if (event.key === "Enter" && newTask.trim()) {
                void addTaskFromInput();
              }
            }} placeholder="Add guardian task..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void addTaskFromInput()} className="rounded-none border border-gold/45 px-4 py-3 font-mono text-xs uppercase text-gold">Add Task</button>
              <button type="button" onClick={() => setGuidedOpen(true)} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold">Guided</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {tasks.length === 0 ? <EmptyState title="No tasks assigned." message="Await your next command." /> : tasks.map((task) => (
              <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3">
                <label className="flex min-w-0 items-center gap-3">
                  <input type="checkbox" checked={task.complete} onChange={() => {
                    const next = tasks.map((item) => item.id === task.id ? { ...item, complete: !item.complete, status: !item.complete ? "COMPLETE" : "QUEUED" } : item);
                    setTasks(next); saveTasks(next);
                  }} />
                  <span className={`min-w-0 text-sm text-soft-sand text-balance-safe ${task.complete ? "line-through opacity-60" : ""}`}>{task.label}</span>
                </label>
                <select value={task.status} onChange={(event) => {
                  const next = tasks.map((item) => item.id === task.id ? { ...item, status: event.target.value } : item);
                  setTasks(next); saveTasks(next);
                }} className="rounded border border-gold/18 bg-obsidian px-2 py-1 text-xs text-gold">
                  {["IN PROGRESS", "QUEUED", "COMPLETE"].map((item) => <option key={item}>{item}</option>)}
                </select>
                <button type="button" onClick={() => openEntityInspector(task.id)} className="font-mono text-[0.68rem] uppercase text-gold">Inspect</button>
                <button type="button" onClick={() => {
                  const next = tasks.filter((item) => item.id !== task.id);
                  setTasks(next); saveTasks(next);
                }} className="text-burnt-bronze hover:text-gold"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => saveTasks()} className="mt-4 rounded-none border border-gold/45 px-4 py-2 font-mono text-xs uppercase text-gold">Save Tasks</button>
        </ChamberPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Tools" title="Available Tools" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {guardian.tools.map((tool) => (
              <button key={tool.label} type="button" title={tool.label} className="flex min-w-0 items-center gap-3 rounded border border-gold/16 bg-obsidian/45 p-4 text-left transition hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-gold-soft">
                <tool.icon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <span className="min-w-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-soft-sand">{tool.label}</span>
              </button>
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel accent={guardian.accent}>
          <SectionTitle eyebrow="Associated Systems" title="Bars" />
          <div className="mt-5 grid gap-4">
            {guardianSystemBars.map((bar) => (
              <div key={bar.label} title={`${bar.label} is DEMO until systems are connected.`}>
                <div className="mb-2 flex justify-between"><StatusPill label="DEMO" tone="bronze" /><button disabled className="font-mono text-[0.68rem] uppercase text-soft-sand/60">Connect</button></div>
                <ProgressMeter label={bar.label} value={bar.value} accent={guardian.accent} />
              </div>
            ))}
          </div>
        </ChamberPanel>
      </div>

      {guardian.slug === "horus" ? (
        <>
          <HorusScanner />
          <ChamberPanel accent={guardian.accent}>
            <BrowserMissionsPanel compact />
          </ChamberPanel>
        </>
      ) : null}

      <GuidedCreationModal
        open={guidedOpen}
        title={`Create ${guardian.name} Work`}
        defaultInput={newTask}
        context={{ preferredType: "task", guardianSlug: guardian.slug, source: `${guardian.name} Profile` }}
        onClose={() => setGuidedOpen(false)}
        onCreated={() => {
          setTasks(readStorage(taskKey, []));
          setNewTask("");
        }}
      />

      <section className="sacred-panel grid gap-4 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusPill label="Agent status: LIVE_PENDING" tone="blue" />
          <Link href="/agents" className="font-mono text-xs uppercase tracking-[0.16em] text-gold hover:text-ivory">Return to Agents</Link>
          <Link href={`/hermes?guardian=${guardian.slug}`} className="font-mono text-xs uppercase tracking-[0.16em] text-gold hover:text-ivory">Send Message to Hermes</Link>
        </div>
        <GlowDivider />
        <p className="font-display text-[clamp(1.35rem,3vw,2.35rem)] leading-tight text-soft-sand text-balance-safe">“{guardian.quote}”</p>
      </section>
    </div>
  );
}
