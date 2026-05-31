"use client";

import { useEffect, useMemo, useState } from "react";
import { classifyCreation, type CreationContext, type CreationOverrides, type CreationStatus, type CreationType } from "@/lib/creationRouter";
import { guardians } from "@/lib/guardians";
import { createSystemItem, type CreatedSystemItem } from "@/lib/systemPersistence";

type GuidedCreationModalProps = {
  open: boolean;
  title: string;
  context?: CreationContext;
  defaultInput?: string;
  onClose: () => void;
  onCreated?: (item: CreatedSystemItem) => void;
};

const types: CreationType[] = ["project", "task", "milestone", "automation", "research", "daily_intention", "signal", "memory", "idea"];
const statuses: CreationStatus[] = ["ACTIVE", "QUEUED", "IDLE", "BLOCKED", "PENDING SETUP", "IN PROGRESS", "IN REVIEW", "PLANNED", "DEPLOYED", "ARCHIVED"];
const categories = ["WebApps", "MobileApps", "WatchApps", "DesktopApps", "AgentApps", "InternalTools", "Knowledge"];
const guardianOptions = [{ slug: "hermes", name: "Hermes" }, ...guardians.map((guardian) => ({ slug: guardian.slug, name: guardian.name }))];

export function GuidedCreationModal({ open, title, context = {}, defaultInput = "", onClose, onCreated }: GuidedCreationModalProps) {
  const [input, setInput] = useState(defaultInput);
  const inferred = useMemo(() => classifyCreation(input, context), [input, context]);
  const [overrides, setOverrides] = useState<CreationOverrides>({});
  const classification = useMemo(() => classifyCreation(input, context, overrides), [input, context, overrides]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setInput(defaultInput);
      setOverrides({});
    }
  }, [defaultInput, open]);

  if (!open) return null;

  async function save() {
    if (!input.trim() || saving) return;
    setSaving(true);
    const created = await createSystemItem(input, context, overrides);
    setSaving(false);
    if (created) onCreated?.(created);
    onClose();
  }

  return (
    <div className="fixed inset-0 layer-overlay grid place-items-center bg-obsidian/70 p-4" onMouseDown={onClose}>
      <div className="sacred-panel layer-modal grid max-h-[92vh] w-full max-w-3xl gap-5 overflow-y-auto rounded-lg border border-gold/35 p-5 shadow-gold-soft" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-gold">Guided Creation · {classification.routingMode}</p>
            <h2 className="mt-2 font-display text-3xl text-ivory text-balance-safe">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Cancel</button>
        </div>

        <label className="grid gap-2">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">What are you creating?</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-36 rounded border border-gold/18 bg-obsidian/55 p-4 text-sm leading-6 text-ivory outline-none focus:border-gold/55"
            placeholder="Describe the build, task, milestone, signal, memory, or intention..."
          />
        </label>

        {classification.clarificationQuestion ? (
          <div className="rounded border border-gold/18 bg-gold/8 p-3 text-sm text-soft-sand">
            <span className="font-mono text-gold">Clarify:</span> {classification.clarificationQuestion}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold">Type</span>
            <select value={classification.type} onChange={(event) => setOverrides({ ...overrides, type: event.target.value as CreationType })} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">
              {types.map((item) => <option key={item} value={item}>{item.replace("_", " ").toUpperCase()}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold">Guardian</span>
            <select value={classification.guardianSlug} onChange={(event) => {
              const guardian = guardianOptions.find((item) => item.slug === event.target.value);
              setOverrides({ ...overrides, guardianSlug: event.target.value, guardian: guardian?.name });
            }} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">
              {guardianOptions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold">Category</span>
            <select value={classification.category} onChange={(event) => setOverrides({ ...overrides, category: event.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold">Status</span>
            <select value={classification.status} onChange={(event) => setOverrides({ ...overrides, status: event.target.value as CreationStatus })} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-gold/18 px-2 py-1 font-mono text-[0.68rem] uppercase text-gold">Confidence {classification.confidence}</span>
            <span className="rounded border border-gold/18 px-2 py-1 font-mono text-[0.68rem] uppercase text-gold">Obsidian {classification.obsidianTarget}</span>
            <span className="rounded border border-gold/18 px-2 py-1 font-mono text-[0.68rem] uppercase text-gold">Inferred {inferred.guardian}</span>
          </div>
          <p>Updates: {classification.relatedDestinations.join(" · ")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={!input.trim() || saving} onClick={save} className="rounded-none border border-gold/55 bg-gold px-4 py-3 font-mono text-xs uppercase text-obsidian disabled:cursor-not-allowed disabled:opacity-45">
            {saving ? "Saving..." : "Confirm and Save"}
          </button>
          <button type="button" onClick={onClose} className="rounded-none border border-burnt-bronze/45 px-4 py-3 font-mono text-xs uppercase text-soft-sand">Cancel</button>
        </div>
      </div>
    </div>
  );
}
