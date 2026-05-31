"use client";

import { WorkflowTrigger } from "@/components/maat/WorkflowTrigger";
import { openEntityInspector } from "@/lib/entityInspectorEvents";

export function WorkflowCard({ workflow, onTrigger }: { workflow: { id: string; name: string; active?: boolean }; onTrigger: () => void }) {
  return (
    <div className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4">
      <div>
        <p className="text-lg text-ivory">{workflow.name}</p>
        <p className="font-mono text-xs uppercase text-soft-sand">{workflow.active ? "ACTIVE" : "INACTIVE"} · last run LIVE_PENDING · count DEMO</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <WorkflowTrigger onTrigger={onTrigger} />
        <a href={`http://localhost:5678/workflow/${workflow.id}`} target="_blank" className="rounded-none border border-gold/20 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Open in n8n</a>
        <button type="button" onClick={() => openEntityInspector(`workflow:${workflow.id}`)} className="rounded-none border border-gold/20 px-3 py-2 font-mono text-xs uppercase text-gold">Inspect</button>
      </div>
    </div>
  );
}
