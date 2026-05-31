import { createLocalId } from "@/lib/id";
import { hermesDailyKey, readStorage, writeStorage } from "@/lib/localStorageKeys";

export type EntityType =
  | "project"
  | "task"
  | "milestone"
  | "memory"
  | "intention"
  | "conversation"
  | "automation"
  | "signal"
  | "research"
  | "workflow"
  | "system_event"
  | "guardian_output"
  | "browser_session"
  | "codex_task"
  | "code_change"
  | "content_idea"
  | "youtube_script"
  | "ghl_project";

export type EntityRelationshipType =
  | "belongs_to"
  | "has_task"
  | "has_milestone"
  | "assigned_to"
  | "linked_to"
  | "generated"
  | "recorded_on";

export type EntityRelationship = {
  type: EntityRelationshipType;
  targetId: string;
  label?: string;
};

export type OSEntity = {
  id: string;
  type: EntityType;
  title: string;
  status: string;
  guardian: string;
  guardianSlug?: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  relationships: EntityRelationship[];
  source: string;
  activityHistory: string[];
  metadata?: Record<string, unknown>;
};

export type EntityActivityEvent = {
  id: string;
  entityId?: string;
  eventType: string;
  title: string;
  guardian: string;
  guardianSlug?: string;
  entityType?: EntityType;
  createdAt: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export const entityStorageKey = "hermes_entities";
export const entityActivityStorageKey = "hermes_entity_activity";

type UpsertEntityInput = Omit<OSEntity, "createdAt" | "updatedAt" | "activityHistory"> & {
  createdAt?: string;
  updatedAt?: string;
  activityHistory?: string[];
};

const guardianSlugs = ["thoth", "ptah", "anubis", "horus", "ra", "maat", "khonsu", "hapi"] as const;

function nowIso() {
  return new Date().toISOString();
}

function safeDateIso(value?: string) {
  if (!value) return nowIso();
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? new Date(time).toISOString() : nowIso();
}

function normalizeTags(tags?: string[]) {
  return Array.from(new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean))).slice(0, 12);
}

function normalizeRelationships(relationships?: EntityRelationship[]) {
  const seen = new Set<string>();
  return (relationships ?? []).filter((relationship) => {
    const key = `${relationship.type}:${relationship.targetId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(relationship.targetId);
  });
}

function dispatchEntityUpdates() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("hermes-entities-updated"));
  window.dispatchEvent(new Event("hermes-entity-activity-updated"));
  window.dispatchEvent(new Event("hermes-activity-updated"));
  window.dispatchEvent(new Event("hermes-memory-nexus-updated"));
}

export function readStoredEntities() {
  return readStorage<OSEntity[]>(entityStorageKey, []);
}

export function writeStoredEntities(entities: OSEntity[]) {
  writeStorage(entityStorageKey, dedupeEntities(entities));
  dispatchEntityUpdates();
}

export function readEntityActivity() {
  return readStorage<EntityActivityEvent[]>(entityActivityStorageKey, []);
}

export function writeEntityActivity(events: EntityActivityEvent[]) {
  writeStorage(entityActivityStorageKey, dedupeActivity(events).slice(0, 500));
  dispatchEntityUpdates();
}

export function upsertEntity(input: UpsertEntityInput, eventType = "entity_updated") {
  const existing = readStoredEntities();
  const previous = existing.find((entity) => entity.id === input.id);
  const timestamp = nowIso();
  const entity: OSEntity = {
    ...input,
    title: input.title.trim() || "Untitled entity",
    status: input.status || "ACTIVE",
    guardian: input.guardian || "Hermes",
    category: input.category || "General",
    tags: normalizeTags(input.tags),
    relationships: normalizeRelationships(input.relationships),
    createdAt: previous?.createdAt ?? input.createdAt ?? timestamp,
    updatedAt: timestamp,
    activityHistory: [...(previous?.activityHistory ?? []), eventType].slice(-40)
  };
  syncLegacyEntity(entity);
  writeStoredEntities([entity, ...existing.filter((item) => item.id !== entity.id)]);
  emitEntityActivity({
    entityId: entity.id,
    entityType: entity.type,
    eventType,
    title: entity.title,
    guardian: entity.guardian,
    guardianSlug: entity.guardianSlug,
    source: entity.source,
    metadata: { status: entity.status, category: entity.category }
  });
  return entity;
}

function syncLegacyEntity(entity: OSEntity) {
  if (typeof window === "undefined") return;
  if (entity.type === "project") {
    const projects = readStorage<Array<{ id: string; name: string; status?: string; guardian?: string; category?: string; progress?: number; environment?: string; createdAt?: string; source?: string }>>("hermes_projects", []);
    if (projects.some((project) => project.id === entity.id)) {
      writeStorage("hermes_projects", projects.map((project) => project.id === entity.id ? {
        ...project,
        name: entity.title,
        status: entity.status,
        guardian: entity.guardian,
        category: entity.category
      } : project));
      window.dispatchEvent(new Event("hermes-projects-updated"));
    }
  }

  if (entity.type === "milestone") {
    const milestones = readStorage<Array<{ id: string; label: string; complete?: boolean; status?: string; guardian?: string; category?: string }>>("hermes_project_milestones", []);
    if (milestones.some((milestone) => milestone.id === entity.id)) {
      writeStorage("hermes_project_milestones", milestones.map((milestone) => milestone.id === entity.id ? {
        ...milestone,
        label: entity.title,
        status: entity.status,
        complete: entity.status === "COMPLETE",
        guardian: entity.guardian,
        category: entity.category
      } : milestone));
      window.dispatchEvent(new Event("hermes-milestones-updated"));
    }
  }

  if (entity.type === "task") {
    guardianSlugs.forEach((slug) => {
      const key = `hermes_guardian_${slug}_tasks`;
      const tasks = readStorage<Array<{ id: string; label: string; status?: string; complete?: boolean }>>(key, []);
      if (tasks.some((task) => task.id === entity.id)) {
        writeStorage(key, tasks.map((task) => task.id === entity.id ? {
          ...task,
          label: entity.title,
          status: entity.status,
          complete: entity.status === "COMPLETE"
        } : task));
      }
    });
    window.dispatchEvent(new Event("hermes-guardian-tasks-updated"));
  }
}

export function emitEntityActivity(input: Omit<EntityActivityEvent, "id" | "createdAt">) {
  const event: EntityActivityEvent = {
    ...input,
    id: createLocalId("entity-event"),
    createdAt: nowIso()
  };
  writeEntityActivity([event, ...readEntityActivity()]);
  return event;
}

export function readUnifiedEntities() {
  return dedupeEntities([...readStoredEntities(), ...readLegacyEntities()]);
}

export function readUnifiedActivity() {
  return dedupeActivity([...readEntityActivity(), ...readLegacyActivity()]);
}

export function linkEntity(sourceId: string, relationship: EntityRelationship, eventType = "entity_linked") {
  const entity = readEntityById(sourceId);
  if (!entity) return null;
  return upsertEntity({ ...entity, relationships: [...entity.relationships, relationship] }, eventType);
}

export function readEntityById(id: string) {
  return readUnifiedEntities().find((entity) => entity.id === id) ?? null;
}

export function readEntityEvents(entityId: string) {
  return readUnifiedActivity().filter((event) => event.entityId === entityId || event.metadata?.entityId === entityId);
}

export function readRelatedEntities(entityId: string) {
  const entities = readUnifiedEntities();
  const entity = entities.find((item) => item.id === entityId);
  if (!entity) return [];
  const relatedIds = new Set(entity.relationships.map((relationship) => relationship.targetId));
  entities.forEach((candidate) => {
    if (candidate.relationships.some((relationship) => relationship.targetId === entityId)) relatedIds.add(candidate.id);
  });
  return entities.filter((item) => relatedIds.has(item.id));
}

export function updateEntityStatus(entityId: string, status: string, eventType = "entity_status_changed") {
  const entity = readEntityById(entityId);
  if (!entity) return null;
  return upsertEntity({ ...entity, status }, eventType);
}

export function assignEntityGuardian(entityId: string, guardian: string, guardianSlug?: string) {
  const entity = readEntityById(entityId);
  if (!entity) return null;
  const nextRelationships = [
    ...entity.relationships.filter((relationship) => relationship.type !== "assigned_to"),
    { type: "assigned_to" as const, targetId: `guardian:${guardianSlug ?? guardian.toLowerCase()}`, label: guardian }
  ];
  return upsertEntity({ ...entity, guardian, guardianSlug: guardianSlug ?? guardian.toLowerCase(), relationships: nextRelationships }, "guardian_assigned");
}

export function markEntityComplete(entityId: string) {
  return updateEntityStatus(entityId, "COMPLETE", "entity_completed");
}

export function archiveEntity(entityId: string) {
  return updateEntityStatus(entityId, "ARCHIVED", "entity_archived");
}

function dedupeEntities(entities: OSEntity[]) {
  const map = new Map<string, OSEntity>();
  for (const entity of entities) {
    if (!entity.id) continue;
    const existing = map.get(entity.id);
    if (!existing || new Date(entity.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
      map.set(entity.id, entity);
    }
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function dedupeActivity(events: EntityActivityEvent[]) {
  const map = new Map<string, EntityActivityEvent>();
  for (const event of events) {
    if (event.id) map.set(event.id, event);
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function readLegacyEntities(): OSEntity[] {
  if (typeof window === "undefined") return [];
  const timestamp = nowIso();
  const projects = readStorage<Array<{ id: string; name: string; status?: string; guardian?: string; category?: string; progress?: number; createdAt?: string; source?: string }>>("hermes_projects", []);
  const milestones = readStorage<Array<{ id: string; label: string; complete?: boolean; status?: string; guardian?: string; category?: string; projectId?: string; projectName?: string; createdAt?: string }>>("hermes_project_milestones", []);
  const captures = readStorage<Array<{ id: string; type?: string; text: string; guardian?: string; timestamp?: string }>>("hermes_captures", []);
  const signals = readStorage<Array<{ id: string; text: string; guardian?: string; timestamp?: string }>>("hermes_signals", []);
  const dailyIntention = readStorage<string>(hermesDailyKey("intention"), "");

  const projectEntities = projects.map<OSEntity>((project) => ({
    id: project.id,
    type: "project",
    title: project.name,
    status: project.status ?? "PLANNED",
    guardian: project.guardian ?? "Ptah",
    guardianSlug: project.guardian?.toLowerCase(),
    category: project.category ?? "WebApps",
    tags: ["legacy", "project"],
    createdAt: project.createdAt ?? timestamp,
    updatedAt: project.createdAt ?? timestamp,
    relationships: [],
    source: project.source ?? "Projects Chamber",
    activityHistory: [],
    metadata: { progress: project.progress ?? 0 }
  }));

  const milestoneEntities = milestones.map<OSEntity>((milestone) => ({
    id: milestone.id,
    type: "milestone",
    title: milestone.label,
    status: milestone.complete ? "COMPLETE" : milestone.status ?? "QUEUED",
    guardian: milestone.guardian ?? "Ptah",
    guardianSlug: milestone.guardian?.toLowerCase(),
    category: milestone.category ?? "Roadmap",
    tags: ["legacy", "milestone"],
    createdAt: milestone.createdAt ?? timestamp,
    updatedAt: milestone.createdAt ?? timestamp,
    relationships: milestone.projectId ? [{ type: "belongs_to", targetId: milestone.projectId, label: milestone.projectName }] : [],
    source: "Projects Chamber",
    activityHistory: []
  }));

  const guardianTaskEntities = guardianSlugs.flatMap((slug) => {
    const tasks = readStorage<Array<{ id: string; label: string; status?: string; complete?: boolean }>>(`hermes_guardian_${slug}_tasks`, []);
    return tasks.map<OSEntity>((task) => ({
      id: task.id,
      type: "task",
      title: task.label,
      status: task.complete ? "COMPLETE" : task.status ?? "QUEUED",
      guardian: slug.charAt(0).toUpperCase() + slug.slice(1),
      guardianSlug: slug,
      category: "Guardian Work",
      tags: ["legacy", "task"],
      createdAt: timestamp,
      updatedAt: timestamp,
      relationships: [{ type: "assigned_to", targetId: `guardian:${slug}` }],
      source: "Guardian Profile",
      activityHistory: []
    }));
  });

  const captureEntities = captures.map<OSEntity>((capture) => ({
    id: capture.id,
    type: capture.type === "RESEARCH" ? "research" : capture.type === "MEMORY" ? "memory" : "memory",
    title: capture.text.slice(0, 80),
    status: "RECORDED",
    guardian: capture.guardian ?? "Hermes",
    guardianSlug: capture.guardian,
    category: capture.type ?? "Capture",
    tags: ["legacy", "capture"],
    createdAt: safeDateIso(capture.timestamp),
    updatedAt: safeDateIso(capture.timestamp),
    relationships: [],
    source: "Quick Capture",
    activityHistory: []
  }));

  const signalEntities = signals.map<OSEntity>((signal) => ({
    id: signal.id,
    type: "signal",
    title: signal.text.slice(0, 80),
    status: "RECORDED",
    guardian: signal.guardian ?? "Horus",
    guardianSlug: "horus",
    category: "Signal",
    tags: ["legacy", "signal"],
    createdAt: safeDateIso(signal.timestamp),
    updatedAt: safeDateIso(signal.timestamp),
    relationships: [],
    source: "Signals",
    activityHistory: []
  }));

  const intentionEntity: OSEntity[] = dailyIntention ? [{
    id: `intention:${hermesDailyKey("intention")}`,
    type: "intention",
    title: dailyIntention.slice(0, 80),
    status: "ACTIVE",
    guardian: "Khonsu",
    guardianSlug: "khonsu",
    category: "Daily Ledger",
    tags: ["legacy", "intention"],
    createdAt: timestamp,
    updatedAt: timestamp,
    relationships: [{ type: "recorded_on", targetId: new Date().toISOString().slice(0, 10) }],
    source: "Daily Ledger",
    activityHistory: []
  }] : [];

  return [...projectEntities, ...milestoneEntities, ...guardianTaskEntities, ...captureEntities, ...signalEntities, ...intentionEntity];
}

function readLegacyActivity(): EntityActivityEvent[] {
  if (typeof window === "undefined") return [];
  const legacy = readStorage<Array<{ id: string; guardian: string; guardianSlug?: string; type: string; text: string; createdAt: string; source?: string }>>("hermes_activity", []);
  return legacy.map((event) => ({
    id: `legacy:${event.id}`,
    eventType: event.type,
    title: event.text,
    guardian: event.guardian,
    guardianSlug: event.guardianSlug,
    entityType: event.type as EntityType,
    createdAt: event.createdAt,
    source: event.source,
    metadata: { legacy: true }
  }));
}
