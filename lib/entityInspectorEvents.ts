"use client";

export const entityInspectorEvent = "hermes-open-entity-inspector";

export function openEntityInspector(entityId: string) {
  window.dispatchEvent(new CustomEvent(entityInspectorEvent, { detail: { entityId } }));
}
