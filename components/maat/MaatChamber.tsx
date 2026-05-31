"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressMeter } from "@/components/ui/ProgressMeter";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { WorkflowCard } from "@/components/maat/WorkflowCard";
import { getWorkflows, triggerWorkflow } from "@/lib/n8nClient";
import { addNotification } from "@/lib/notifications";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import { upsertEntity } from "@/lib/entityStore";

const templates = [
  ["MORNING SYNC", "Khonsu", "Prepare the day and continuity ledger.", "Medium"],
  ["BUILD COMPLETE ALERT", "Ptah", "Notify when a build finishes.", "Low"],
  ["DAILY REFLECTION SAVE", "Khonsu", "Persist reflection into memory.", "Medium"],
  ["MEMORY SYNC", "Thoth", "Index Obsidian memory changes.", "High"],
  ["TELEGRAM NOTIFICATIONS", "Hapi", "Send approved updates to Telegram.", "Medium"],
  ["APPBUILDS SCANNER", "Ptah", "Scan local build folders.", "High"]
];

export function MaatChamber() {
  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string; active?: boolean }>>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getWorkflows().then((items) => { setWorkflows(items); setConnected(items.length > 0); });
  }, []);

  return (
    <AppShell>
      <PageFrame eyebrow="Maat Chamber" title="Maat Chamber" subtitle="ORDER & ALIGNMENT. Automation governance for n8n workflows, balance, and system coherence.">
        <ChamberPanel className="gold-circuit">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Order & Alignment</p><h2 className="mt-2 font-display text-[clamp(2rem,5vw,4.5rem)] text-ivory">Maat weighs every workflow.</h2><p className="text-soft-sand">Automations execute only when aligned with the mission.</p></div>
            <div className="grid gap-3"><StatusPill label={connected ? "CONNECTED" : "OFFLINE"} tone={connected ? "emerald" : "bronze"} /><a href="http://localhost:5678" target="_blank" className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open n8n Dashboard</a></div>
          </div>
        </ChamberPanel>
        <ChamberPanel><SectionTitle eyebrow="Workflow Overview" title="Automation State" /><div className="mt-5 grid gap-3 sm:grid-cols-4">{["Total Workflows", "Active Workflows", "Executions Today", "Success Rate"].map((label) => <MetricCard key={label} label={label} value={label === "Total Workflows" ? workflows.length : 0} suffix={label === "Success Rate" ? "%" : ""} state="DEMO" />)}</div></ChamberPanel>
        <ChamberPanel><SectionTitle eyebrow="Active Workflows" title="n8n Runtime" />{workflows.length === 0 ? <div className="mt-5"><EmptyState title="Maat awaits her first workflow." message="Start n8n to begin automation." /></div> : <div className="mt-5 grid gap-4 md:grid-cols-2">{workflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} onTrigger={async () => { const ok = await triggerWorkflow(workflow.id); upsertEntity({ id: `workflow:${workflow.id}`, type: "workflow", title: workflow.name, status: ok ? "TRIGGER_REQUESTED" : "BROKEN", guardian: "Maat", guardianSlug: "maat", category: "Automation", tags: ["workflow", "n8n"], relationships: [{ type: "assigned_to", targetId: "guardian:maat", label: "Maat" }], source: "Maat Chamber", metadata: { workflowId: workflow.id, ok } }, ok ? "automation_triggered" : "automation_failed"); addNotification({ type: "WORKFLOW", title: workflow.name, message: ok ? "Workflow activation requested." : "Workflow trigger failed or n8n is offline.", route: "/maat" }); void recordObsidianEvent({ category: "automation", title: `Workflow trigger ${ok ? "requested" : "failed"}`, body: workflow.name, metadata: { workflowId: workflow.id, ok } }); }} />)}</div>}</ChamberPanel>
        <ChamberPanel><SectionTitle eyebrow="Starter Workflow Templates" title="Import Queue" /><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{templates.map(([name, guardian, description, complexity]) => <div key={name} className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4"><p className="text-ivory">{name}</p><p className="text-sm text-soft-sand">{description}</p><div className="flex flex-wrap gap-2"><StatusPill label={guardian} tone="gold" /><StatusPill label={complexity} tone="blue" /></div><button disabled title="Import requires n8n workflow JSON templates." className="cursor-not-allowed rounded-none border border-gold/18 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Import to n8n</button></div>)}</div></ChamberPanel>
        <div className="grid gap-6 xl:grid-cols-2"><ChamberPanel><SectionTitle eyebrow="Balance Dashboard" title="Harmony Domains" /><div className="mt-5 grid gap-3">{["People", "Data", "Systems", "Processes", "Resources", "Outcomes"].map((item) => <div key={item} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-soft-sand">{item}: 0 DEMO</div>)}</div></ChamberPanel><ChamberPanel><SectionTitle eyebrow="Alignment Metrics" title="Coherence" /><div className="mt-5 grid gap-4">{["Task Completion Harmony", "Automation Efficiency", "System Coherence"].map((item) => <ProgressMeter key={item} label={item} value={0} />)}</div></ChamberPanel></div>
      </PageFrame>
    </AppShell>
  );
}
