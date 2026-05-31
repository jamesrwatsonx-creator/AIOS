"use client";

import { useEffect, useMemo, useState } from "react";
import { OperatorPage } from "@/components/operator/OperatorPage";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { readUnifiedActivity, readUnifiedEntities, upsertEntity } from "@/lib/entityStore";
import { readStorage, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";
import { appendActivity } from "@/lib/systemPersistence";

export function CodexChamber() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const key = "aios_v2_codex_work_seeded";
    if (!readStorage(key, false)) {
      upsertEntity({
        id: "codex-task-aios-v2-redesign",
        type: "codex_task",
        title: "AIOS V2 redesign and repository professionalization",
        status: "IN PROGRESS",
        guardian: "Codex",
        guardianSlug: "codex",
        category: "Repository Work",
        tags: ["codex", "aios-v2", "redesign"],
        relationships: [],
        source: "Codex",
        metadata: { route: "/codex" }
      }, "codex_task_updated");
      upsertEntity({
        id: "code-change-aios-v2-navigation-docs",
        type: "code_change",
        title: "Simplified navigation, operator pages, documentation, and Obsidian structure",
        status: "IN REVIEW",
        guardian: "Codex",
        guardianSlug: "codex",
        category: "UX + Docs",
        tags: ["codex", "code_change", "navigation", "docs"],
        relationships: [{ type: "belongs_to", targetId: "codex-task-aios-v2-redesign", label: "AIOS V2 redesign" }],
        source: "Codex",
        metadata: { routes: ["/", "/codex", "/content", "/gohighlevel", "/automations", "/agents"] }
      }, "code_change_recorded");
      appendActivity({
        guardian: "Codex",
        guardianSlug: "codex",
        type: "codex_task",
        text: "AIOS V2 redesign work recorded",
        destinations: ["/codex", "/projects", "/memory", "/activity"],
        source: "Codex"
      });
      void recordObsidianEvent({ category: "codex", title: "AIOS V2 redesign work recorded", body: "Codex updated navigation, operator pages, documentation, entity types, and Obsidian structure.", metadata: { route: "/codex" } });
      writeStorage(key, true);
    }
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("hermes-activity-updated", refresh);
    window.addEventListener("hermes-entities-updated", refresh);
    refresh();
    return () => {
      window.removeEventListener("hermes-activity-updated", refresh);
      window.removeEventListener("hermes-entities-updated", refresh);
    };
  }, []);

  const activity = useMemo(() => readUnifiedActivity(), [version]);
  const entities = useMemo(() => readUnifiedEntities(), [version]);
  const codexEvents = activity.filter((event) => event.guardian === "Codex" || event.eventType.includes("codex") || event.source?.toLowerCase().includes("codex"));
  const codeChanges = entities.filter((entity) => entity.type === "code_change" || entity.tags.includes("codex"));

  return (
    <OperatorPage
      eyebrow="Codex Workflow"
      title="Codex"
      description="Track what Codex changed, which commands ran, what errors were fixed, and how code work connects back to projects, Memory, Activity, and Obsidian."
      status="WORK LOG READY"
      capabilities={[
        "Show current and completed Codex tasks when they are recorded.",
        "Track files changed, commands run, errors fixed, browser tests, build results, screenshots, and Git commits.",
        "Link code work back to projects, entity graph records, activity events, and Obsidian notes.",
        "Keep a professional audit trail for AI-assisted engineering work."
      ]}
      recent={codexEvents.slice(0, 4).map((event) => event.title).concat(codexEvents.length ? [] : ["No Codex activity has been recorded in local storage yet."])}
      nextActions={[
        { label: "Record the current Codex task after meaningful work.", status: "ACTIVE" },
        { label: "Link Codex work to the project it affects.", href: "/projects" },
        { label: "Review build and TypeScript validation results before commit." }
      ]}
      systems={["Entity graph: codex_task and code_change", "Obsidian: 05-Codex/", "Activity log", "Git history", "Browser test evidence"]}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <ChamberPanel>
          <SectionTitle eyebrow="Current work" title="Codex Task Status" />
          <div className="mt-5 grid gap-3 text-sm text-soft-sand">
            <Info label="Current Codex task" value={codexEvents[0]?.title ?? "No active Codex task recorded yet."} />
            <Info label="Files changed" value="Use Git status after the local repository is initialized or connected." />
            <Info label="Build/test results" value="Shown in final validation reports and future Codex log entries." />
            <Info label="Linked project" value="Pending until Codex task entities are attached to project entities." />
          </div>
        </ChamberPanel>
        <ChamberPanel>
          <SectionTitle eyebrow="Work log" title="Completed Codex Work" />
          <div className="mt-5 grid gap-3">
            {codexEvents.length ? codexEvents.slice(0, 8).map((event) => (
              <div key={event.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
                <span className="font-mono text-gold">{new Date(event.createdAt).toLocaleString()} - {event.eventType}</span>
                <p>{event.title}</p>
              </div>
            )) : <EmptyState title="No Codex work logged yet." message="Meaningful Codex work should create activity and Obsidian entries." />}
          </div>
        </ChamberPanel>
      </div>
      <ChamberPanel>
        <SectionTitle eyebrow="Code changes" title="Linked Code Change Entities" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {codeChanges.length ? codeChanges.slice(0, 6).map((entity) => (
            <div key={entity.id} className="rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">
              <p className="text-ivory">{entity.title}</p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase text-gold">{entity.status} - {entity.source}</p>
            </div>
          )) : <EmptyState title="No code change entities yet." message="Codex will use entity type code_change for future tracked edits." />}
        </div>
      </ChamberPanel>
    </OperatorPage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-gold/14 bg-obsidian/45 p-3"><p className="font-mono text-[0.68rem] uppercase text-gold">{label}</p><p className="mt-1">{value}</p></div>;
}
