"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { entityInspectorEvent, openEntityInspector } from "@/lib/entityInspectorEvents";
import {
  archiveEntity,
  assignEntityGuardian,
  linkEntity,
  markEntityComplete,
  readEntityById,
  readEntityEvents,
  readRelatedEntities,
  readUnifiedEntities,
  updateEntityStatus,
  type EntityRelationshipType,
  type OSEntity
} from "@/lib/entityStore";
import { guardians } from "@/lib/guardians";

const statuses = ["ACTIVE", "QUEUED", "IDLE", "BLOCKED", "PENDING SETUP", "IN PROGRESS", "IN REVIEW", "PLANNED", "COMPLETE", "DEPLOYED", "ARCHIVED", "RECORDED"];
const relationshipTypes: EntityRelationshipType[] = ["belongs_to", "has_task", "has_milestone", "assigned_to", "linked_to", "generated", "recorded_on"];

export function EntityInspector() {
  const [entityId, setEntityId] = useState("");
  const [version, setVersion] = useState(0);
  const [relationshipType, setRelationshipType] = useState<EntityRelationshipType>("linked_to");
  const [relationshipTarget, setRelationshipTarget] = useState("");
  const entity = entityId ? readEntityById(entityId) : null;
  const allEntities = useMemo(() => readUnifiedEntities(), [version, entityId]);
  const events = useMemo(() => entity ? readEntityEvents(entity.id) : [], [entity, version]);
  const related = useMemo(() => entity ? readRelatedEntities(entity.id) : [], [entity, version]);

  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent<{ entityId?: string }>).detail;
      if (detail?.entityId) setEntityId(detail.entityId);
    };
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(entityInspectorEvent, open);
    window.addEventListener("hermes-entities-updated", refresh);
    window.addEventListener("hermes-entity-activity-updated", refresh);
    return () => {
      window.removeEventListener(entityInspectorEvent, open);
      window.removeEventListener("hermes-entities-updated", refresh);
      window.removeEventListener("hermes-entity-activity-updated", refresh);
    };
  }, []);

  if (!entityId) return null;

  function refresh() {
    setVersion((value) => value + 1);
  }

  function close() {
    setEntityId("");
    setRelationshipTarget("");
  }

  function copyJson(current: OSEntity) {
    void navigator.clipboard?.writeText(JSON.stringify(current, null, 2));
  }

  function addRelationship(current: OSEntity) {
    if (!relationshipTarget) return;
    linkEntity(current.id, { type: relationshipType, targetId: relationshipTarget, label: allEntities.find((item) => item.id === relationshipTarget)?.title });
    setRelationshipTarget("");
    refresh();
  }

  const obsidianTarget = entity ? getObsidianTarget(entity) : "UNAVAILABLE";

  return (
    <div className="fixed inset-0 layer-overlay grid place-items-end bg-obsidian/60 p-4" onMouseDown={close}>
      <aside className="sacred-panel layer-modal grid max-h-[94vh] w-full max-w-3xl gap-5 overflow-y-auto rounded-lg border border-gold/35 p-5 shadow-gold-soft" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-gold">Entity Inspector</p>
            <h2 className="mt-2 font-display text-3xl text-ivory text-balance-safe">{entity?.title ?? "Entity not found"}</h2>
          </div>
          <button type="button" onClick={close} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Close</button>
        </div>

        {!entity ? (
          <div className="rounded border border-burnt-bronze/45 bg-obsidian/55 p-4 text-soft-sand">No entity exists for id: {entityId}</div>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <EntityField label="ID" value={entity.id} />
              <EntityField label="Type" value={entity.type} />
              <EntityField label="Status" value={entity.status} />
              <EntityField label="Guardian" value={entity.guardian} />
              <EntityField label="Category" value={entity.category} />
              <EntityField label="Source" value={entity.source} />
              <EntityField label="Created" value={entity.createdAt} />
              <EntityField label="Updated" value={entity.updatedAt} />
              <EntityField label="Obsidian Target" value={obsidianTarget} />
              <EntityField label="Tags" value={entity.tags.join(", ") || "NONE"} />
            </div>

            <div className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold">Actions</p>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <select value={entity.status} onChange={(event) => { updateEntityStatus(entity.id, event.target.value); refresh(); }} className="rounded border border-gold/18 bg-obsidian px-3 py-2 text-ivory">
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <select value={entity.guardianSlug ?? entity.guardian.toLowerCase()} onChange={(event) => {
                  const guardian = guardians.find((item) => item.slug === event.target.value);
                  assignEntityGuardian(entity.id, guardian?.name ?? "Hermes", event.target.value);
                  refresh();
                }} className="rounded border border-gold/18 bg-obsidian px-3 py-2 text-ivory">
                  <option value="hermes">Hermes</option>
                  {guardians.map((guardian) => <option key={guardian.slug} value={guardian.slug}>{guardian.name}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { markEntityComplete(entity.id); refresh(); }} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Mark Complete</button>
                <button type="button" onClick={() => { archiveEntity(entity.id); refresh(); }} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Archive</button>
                <button type="button" onClick={() => copyJson(entity)} className="inline-flex items-center gap-2 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold"><Copy className="h-4 w-4" /> Copy JSON</button>
              </div>
            </div>

            <div className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold">Add Relationship</p>
              <div className="grid gap-3 md:grid-cols-[12rem_minmax(0,1fr)_auto]">
                <select value={relationshipType} onChange={(event) => setRelationshipType(event.target.value as EntityRelationshipType)} className="rounded border border-gold/18 bg-obsidian px-3 py-2 text-ivory">
                  {relationshipTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                <select value={relationshipTarget} onChange={(event) => setRelationshipTarget(event.target.value)} className="rounded border border-gold/18 bg-obsidian px-3 py-2 text-ivory">
                  <option value="">Select related entity</option>
                  {allEntities.filter((item) => item.id !== entity.id).map((item) => <option key={item.id} value={item.id}>{item.type}: {item.title}</option>)}
                </select>
                <button type="button" onClick={() => addRelationship(entity)} className="inline-flex items-center gap-2 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold"><Link2 className="h-4 w-4" /> Link</button>
              </div>
            </div>

            <InspectorList title="Relationships" empty="No relationships recorded.">
              {entity.relationships.map((relationship) => (
                <button key={`${relationship.type}:${relationship.targetId}`} onClick={() => openEntityInspector(relationship.targetId)} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-left text-sm text-soft-sand">
                  <span className="font-mono text-gold">{relationship.type}</span> · {relationship.label ?? relationship.targetId}
                </button>
              ))}
            </InspectorList>

            <InspectorList title="Related Entities" empty="No related entities found.">
              {related.map((item) => (
                <button key={item.id} onClick={() => openEntityInspector(item.id)} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-left text-sm text-soft-sand">
                  <span className="font-mono text-gold">{item.type}</span> · {item.title}
                </button>
              ))}
            </InspectorList>

            <InspectorList title="Activity History" empty="No entity activity recorded yet.">
              {events.map((event) => (
                <div key={event.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
                  <span className="font-mono text-gold">{new Date(event.createdAt).toLocaleString()} · {event.eventType}</span>
                  <p>{event.title}</p>
                </div>
              ))}
              {entity.activityHistory.map((event, index) => <StatusPill key={`${event}-${index}`} label={event} tone="blue" />)}
            </InspectorList>

            <a href="/memory" className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase text-gold"><ExternalLink className="h-4 w-4" /> Open Memory Nexus</a>
          </>
        )}
      </aside>
    </div>
  );
}

function EntityField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-gold/14 bg-obsidian/45 p-3">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gold">{label}</p>
      <p className="mt-1 break-words text-sm text-soft-sand">{value || "NONE"}</p>
    </div>
  );
}

function InspectorList({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(items) ? items.length === 0 : !items;
  return (
    <div className="grid gap-3">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-gold">{title}</p>
      {isEmpty ? <p className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">{empty}</p> : <div className="grid gap-2">{items}</div>}
    </div>
  );
}

function getObsidianTarget(entity: OSEntity) {
  if (entity.type === "project" || entity.type === "milestone") return "02-Projects/Dashboard-Project-State.md";
  if (entity.type === "task" || entity.type === "guardian_output") return "04-Agents/Guardian-Activity.md";
  if (entity.type === "intention") return "01-Daily-Logs/YYYY-MM-DD.md";
  if (entity.type === "conversation") return "00-Hermes-Memory/Hermes-Conversations.md";
  if (entity.type === "automation" || entity.type === "workflow") return "09-Systems/Maat-Automation-Log.md";
  if (entity.type === "browser_session") return "04-Agents/Horus-Browser-Sessions.md";
  if (entity.type === "signal" || entity.type === "research" || entity.type === "memory") return "00-Hermes-Memory/Memory-Nexus-State.md";
  return "00-Hermes-Memory/Dashboard-Activity.md";
}
