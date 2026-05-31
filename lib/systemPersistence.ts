"use client";

import { classifyCreation, titleFromInput, type CreationClassification, type CreationContext, type CreationOverrides } from "@/lib/creationRouter";
import { emitEntityActivity, upsertEntity, type EntityRelationship, type EntityType } from "@/lib/entityStore";
import { createLocalId } from "@/lib/id";
import { hermesDailyKey, readStorage, todayKey, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";

export const projectStorageKey = "hermes_projects";
export const milestoneStorageKey = "hermes_project_milestones";
export const activityStorageKey = "hermes_activity";
export const captureStorageKey = "hermes_captures";
export const signalsStorageKey = "hermes_signals";

export type SystemProject = {
  id: string;
  name: string;
  category: string;
  status: string;
  guardian: string;
  environment: string;
  progress: number;
  createdAt?: string;
  source?: string;
};

export type SystemMilestone = {
  id: string;
  label: string;
  complete: boolean;
  projectId?: string;
  projectName?: string;
  guardian?: string;
  category?: string;
  status?: string;
  createdAt?: string;
};

export type SystemActivity = {
  id: string;
  guardian: string;
  guardianSlug: string;
  type: string;
  text: string;
  time: string;
  createdAt: string;
  destinations: string[];
  source?: string;
};

export type CreatedSystemItem = {
  id: string;
  title: string;
  classification: CreationClassification;
  activity: SystemActivity;
};

function nowDisplay() {
  return new Date().toLocaleString();
}

function dispatchSystemUpdates() {
  window.dispatchEvent(new Event("hermes-activity-updated"));
  window.dispatchEvent(new Event("hermes-projects-updated"));
  window.dispatchEvent(new Event("hermes-milestones-updated"));
  window.dispatchEvent(new Event("hermes-guardian-tasks-updated"));
  window.dispatchEvent(new Event("hermes-memory-nexus-updated"));
}

export function readProjects() {
  return readStorage<SystemProject[]>(projectStorageKey, []);
}

export function saveProjects(projects: SystemProject[], title = "Project state saved") {
  writeStorage(projectStorageKey, projects);
  projects.forEach((project) => {
    upsertEntity({
      id: project.id,
      type: "project",
      title: project.name,
      status: project.status,
      guardian: project.guardian,
      guardianSlug: project.guardian.toLowerCase(),
      category: project.category,
      tags: ["project", project.category],
      relationships: [],
      source: project.source ?? "Projects Chamber",
      metadata: { environment: project.environment, progress: project.progress }
    }, "project_updated");
  });
  appendActivity({
    guardian: "Ptah",
    guardianSlug: "ptah",
    type: "project",
    text: title,
    destinations: ["/projects", "/memory", "/activity"],
    source: "Projects Chamber"
  });
  void recordObsidianEvent({
    category: "project",
    title,
    body: projects.map((project) => `- ${project.name}: ${project.status}, ${project.progress}%, ${project.guardian}`).join("\n") || "No projects saved.",
    metadata: { projectCount: projects.length }
  });
  dispatchSystemUpdates();
}

export function readMilestones() {
  return readStorage<SystemMilestone[]>(milestoneStorageKey, []);
}

export function saveMilestones(milestones: SystemMilestone[], title = "Milestone state saved") {
  writeStorage(milestoneStorageKey, milestones);
  milestones.forEach((milestone) => {
    upsertEntity({
      id: milestone.id,
      type: "milestone",
      title: milestone.label,
      status: milestone.complete ? "COMPLETE" : milestone.status ?? "QUEUED",
      guardian: milestone.guardian ?? "Ptah",
      guardianSlug: milestone.guardian?.toLowerCase() ?? "ptah",
      category: milestone.category ?? "Roadmap",
      tags: ["milestone", milestone.category ?? "roadmap"],
      relationships: milestone.projectId ? [{ type: "belongs_to", targetId: milestone.projectId, label: milestone.projectName }] : [],
      source: "Projects Chamber",
      metadata: { complete: milestone.complete, projectName: milestone.projectName }
    }, milestone.complete ? "milestone_completed" : "milestone_updated");
  });
  appendActivity({
    guardian: "Ptah",
    guardianSlug: "ptah",
    type: "milestone",
    text: title,
    destinations: ["/projects", "/memory", "/activity"],
    source: "Projects Chamber"
  });
  void recordObsidianEvent({
    category: "project",
    title,
    body: milestones.map((milestone) => `- [${milestone.complete ? "x" : " "}] ${milestone.label}${milestone.projectName ? ` (${milestone.projectName})` : ""}`).join("\n") || "No milestones saved.",
    metadata: { milestoneCount: milestones.length }
  });
  dispatchSystemUpdates();
}

export function readActivity() {
  return readStorage<SystemActivity[]>(activityStorageKey, []);
}

export function appendActivity(item: Omit<SystemActivity, "id" | "time" | "createdAt">) {
  const activity: SystemActivity = {
    ...item,
    id: createLocalId("activity"),
    time: nowDisplay(),
    createdAt: new Date().toISOString()
  };
  const next = [activity, ...readActivity()].slice(0, 250);
  writeStorage(activityStorageKey, next);
  emitEntityActivity({
    eventType: item.type,
    title: item.text,
    guardian: item.guardian,
    guardianSlug: item.guardianSlug,
    entityType: item.type as EntityType,
    source: item.source,
    metadata: { destinations: item.destinations }
  });
  window.dispatchEvent(new Event("hermes-activity-updated"));
  window.dispatchEvent(new Event("hermes-memory-nexus-updated"));
  void recordObsidianEvent({
    category: "activity",
    title: `${activity.guardian} activity`,
    body: `${activity.type}: ${activity.text}`,
    metadata: { source: activity.source, destinations: activity.destinations }
  });
  return activity;
}

export function saveGuardianTasks(guardianSlug: string, guardianName: string, tasks: Array<{ id: string; label: string; status: string; complete: boolean }>, title = `${guardianName} task queue saved`) {
  const storageKey = `hermes_guardian_${guardianSlug}_tasks`;
  writeStorage(storageKey, tasks);
  tasks.forEach((task) => {
    upsertEntity({
      id: task.id,
      type: "task",
      title: task.label,
      status: task.complete ? "COMPLETE" : task.status,
      guardian: guardianName,
      guardianSlug,
      category: "Guardian Work",
      tags: ["task", guardianSlug],
      relationships: [{ type: "assigned_to", targetId: `guardian:${guardianSlug}`, label: guardianName }],
      source: "Guardian Profile",
      metadata: { complete: task.complete }
    }, task.complete ? "task_completed" : "task_updated");
  });
  appendActivity({
    guardian: guardianName,
    guardianSlug,
    type: "task",
    text: title,
    destinations: [`/agents/${guardianSlug}`, "/activity", "/memory"],
    source: "Guardian Profile"
  });
  void recordObsidianEvent({
    category: guardianSlug === "hermes" ? "hermes" : "guardian",
    title,
    body: tasks.map((task) => `- [${task.complete ? "x" : " "}] ${task.label} (${task.status})`).join("\n") || "No tasks assigned.",
    metadata: { guardian: guardianSlug, storageKey, taskCount: tasks.length }
  });
  dispatchSystemUpdates();
}

export async function createSystemItem(input: string, context: CreationContext = {}, overrides: CreationOverrides = {}): Promise<CreatedSystemItem | null> {
  const raw = input.trim();
  if (!raw) return null;

  const classification = classifyCreation(raw, context, overrides);
  const title = titleFromInput(raw);
  const id = createLocalId(classification.type);
  const createdAt = new Date().toISOString();
  const entityType = creationToEntityType(classification.type);
  const relationships: EntityRelationship[] = [
    { type: "assigned_to", targetId: `guardian:${classification.guardianSlug}`, label: classification.guardian }
  ];
  if (context.projectId) relationships.push({ type: "belongs_to", targetId: context.projectId, label: context.projectName });

  if (classification.type === "project") {
    const projects = readProjects();
    writeStorage(projectStorageKey, [
      {
        id,
        name: title,
        category: classification.category,
        status: classification.status,
        guardian: classification.guardian,
        environment: "Local",
        progress: classification.status === "DEPLOYED" ? 100 : 0,
        createdAt,
        source: context.source
      },
      ...projects
    ]);
  }

  if (classification.type === "milestone") {
    const milestones = readMilestones();
    writeStorage(milestoneStorageKey, [
      {
        id,
        label: title,
        complete: false,
        projectId: context.projectId,
        projectName: context.projectName,
        guardian: classification.guardian,
        category: classification.category,
        status: classification.status,
        createdAt
      },
      ...milestones
    ]);
  }

  if (classification.type === "task") {
    const storageKey = `hermes_guardian_${classification.guardianSlug === "hermes" ? "ptah" : classification.guardianSlug}_tasks`;
    const tasks = readStorage<Array<{ id: string; label: string; status: string; complete: boolean }>>(storageKey, []);
    writeStorage(storageKey, [{ id, label: title, status: classification.status, complete: false }, ...tasks]);
  }

  if (classification.type === "daily_intention") {
    const key = hermesDailyKey("intention");
    writeStorage(key, raw);
    window.dispatchEvent(new CustomEvent("hermes-storage-key-updated", { detail: { key } }));
  }

  if (classification.type === "signal") {
    const signals = readStorage<Array<{ id: string; text: string; guardian: string; timestamp: string }>>(signalsStorageKey, []);
    writeStorage(signalsStorageKey, [{ id, text: raw, guardian: classification.guardian, timestamp: nowDisplay() }, ...signals].slice(0, 100));
  }

  if (["idea", "memory", "research"].includes(classification.type)) {
    const captures = readStorage<Array<{ id: string; type: string; text: string; guardian?: string; timestamp: string }>>(captureStorageKey, []);
    writeStorage(captureStorageKey, [{ id, type: classification.type.toUpperCase(), text: raw, guardian: classification.guardianSlug, timestamp: nowDisplay() }, ...captures].slice(0, 100));
  }

  upsertEntity({
    id,
    type: entityType,
    title,
    status: classification.status,
    guardian: classification.guardian,
    guardianSlug: classification.guardianSlug,
    category: classification.category,
    tags: [classification.type, classification.category, classification.guardianSlug],
    createdAt,
    relationships,
    source: context.source ?? "Guided Creation",
    metadata: {
      raw,
      routingMode: classification.routingMode,
      relatedDestinations: classification.relatedDestinations
    }
  }, `${entityType}_created`);

  const activity = appendActivity({
    guardian: classification.guardian,
    guardianSlug: classification.guardianSlug,
    type: classification.type,
    text: title,
    destinations: classification.relatedDestinations,
    source: context.source
  });

  await recordObsidianEvent({
    category: classification.obsidianTarget,
    title: `Created ${classification.type}: ${title}`,
    body: raw,
    metadata: {
      id,
      guardian: classification.guardian,
      category: classification.category,
      status: classification.status,
      routingMode: classification.routingMode,
      relatedDestinations: classification.relatedDestinations,
      date: todayKey()
    }
  });

  dispatchSystemUpdates();
  if (classification.type === "idea" || classification.type === "memory" || classification.type === "research") {
    window.dispatchEvent(new Event("hermes-captures-updated"));
  }

  return { id, title, classification, activity };
}

function creationToEntityType(type: CreationClassification["type"]): EntityType {
  if (type === "daily_intention") return "intention";
  if (type === "idea") return "memory";
  return type;
}
