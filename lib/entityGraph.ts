import type { EntityActivityEvent, EntityType, OSEntity } from "@/lib/entityStore";

export type EntityGraphNode = {
  id: string;
  label: string;
  type: EntityType;
  guardian: string;
  status: string;
  relationshipCount: number;
};

export type EntityGraphLink = {
  source: string;
  target: string;
  type: string;
};

export type EntityGraphMetrics = {
  entityCount: number;
  relationshipCount: number;
  relationshipDensity: number;
  staleEntities: number;
  completionRate: number;
  fragmentation: number;
  orphanedTasks: number;
  inactiveProjects: number;
  executionVelocity: number;
  guardianDistribution: Array<{ guardian: string; count: number }>;
  typeCounts: Record<string, number>;
};

export type EntityGraph = {
  nodes: EntityGraphNode[];
  links: EntityGraphLink[];
  metrics: EntityGraphMetrics;
  recentEvents: EntityActivityEvent[];
};

const doneStatuses = new Set(["COMPLETE", "COMPLETED", "DEPLOYED", "DONE", "SHIPPED"]);
const inactiveStatuses = new Set(["IDLE", "BLOCKED", "PENDING SETUP", "ARCHIVED"]);

export function buildEntityGraph(entities: OSEntity[], events: EntityActivityEvent[]): EntityGraph {
  const links = entities.flatMap((entity) => entity.relationships.map((relationship) => ({
    source: entity.id,
    target: relationship.targetId,
    type: relationship.type
  })));
  const nodes = entities.map((entity) => ({
    id: entity.id,
    label: entity.title,
    type: entity.type,
    guardian: entity.guardian,
    status: entity.status,
    relationshipCount: entity.relationships.length + links.filter((link) => link.target === entity.id).length
  }));

  const entityCount = entities.length;
  const relationshipCount = links.length;
  const completed = entities.filter((entity) => doneStatuses.has(entity.status.toUpperCase())).length;
  const staleCutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
  const staleEntities = entities.filter((entity) => !doneStatuses.has(entity.status.toUpperCase()) && new Date(entity.updatedAt).getTime() < staleCutoff).length;
  const orphanedTasks = entities.filter((entity) => entity.type === "task" && !entity.relationships.some((relationship) => relationship.type === "belongs_to" || relationship.type === "assigned_to")).length;
  const inactiveProjects = entities.filter((entity) => entity.type === "project" && inactiveStatuses.has(entity.status.toUpperCase())).length;
  const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const executionVelocity = events.filter((event) => new Date(event.createdAt).getTime() >= recentCutoff).length;
  const disconnected = entities.filter((entity) => entity.relationships.length === 0 && !["memory", "signal", "system_event"].includes(entity.type)).length;

  const guardianDistribution = Object.entries(entities.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.guardian] = (acc[entity.guardian] ?? 0) + 1;
    return acc;
  }, {})).map(([guardian, count]) => ({ guardian, count })).sort((a, b) => b.count - a.count);

  const typeCounts = entities.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.type] = (acc[entity.type] ?? 0) + 1;
    return acc;
  }, {});

  return {
    nodes,
    links,
    metrics: {
      entityCount,
      relationshipCount,
      relationshipDensity: entityCount ? relationshipCount / entityCount : 0,
      staleEntities,
      completionRate: entityCount ? (completed / entityCount) * 100 : 0,
      fragmentation: entityCount ? (disconnected / entityCount) * 100 : 0,
      orphanedTasks,
      inactiveProjects,
      executionVelocity,
      guardianDistribution,
      typeCounts
    },
    recentEvents: [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 25)
  };
}
