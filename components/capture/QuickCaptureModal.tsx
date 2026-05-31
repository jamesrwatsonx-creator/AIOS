"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { guardians } from "@/lib/guardians";
import { deleteCapture, readCaptures, saveCapture, type CaptureItem, type CaptureType } from "@/lib/captureStore";
import { classifyCreation, type CreationType } from "@/lib/creationRouter";
import { createSystemItem } from "@/lib/systemPersistence";

const types: CaptureType[] = ["THOUGHT", "TASK", "IDEA", "REFLECTION", "MEMORY"];
const placeholders: Record<CaptureType, string> = {
  THOUGHT: "Capture a thought...",
  TASK: "What needs to be done?",
  IDEA: "Describe the idea...",
  REFLECTION: "What's on your mind?",
  MEMORY: "What do you want to remember?"
};

export function QuickCaptureModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<CaptureType>("THOUGHT");
  const [text, setText] = useState("");
  const [guardian, setGuardian] = useState("");
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState<CaptureItem[]>([]);
  const preview = classifyCreation(text, { preferredType: captureTypeToCreationType(type), guardianSlug: guardian || undefined, source: "Quick Capture" });

  useEffect(() => {
    const refresh = () => setItems(readCaptures());
    refresh();
    window.addEventListener("hermes-captures-updated", refresh);
    return () => window.removeEventListener("hermes-captures-updated", refresh);
  }, []);

  async function capture(close = false) {
    if (!text.trim()) return;
    if (type === "THOUGHT" || type === "REFLECTION") {
      saveCapture({ type, text: text.trim(), guardian: guardian || undefined });
    } else {
      await createSystemItem(text.trim(), { preferredType: captureTypeToCreationType(type), guardianSlug: guardian || undefined, source: "Quick Capture" });
    }
    setText("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    if (close) onClose();
  }

  return (
    <div className="fixed inset-0 layer-overlay grid place-items-end bg-obsidian/60 p-4" onMouseDown={onClose}>
      <div className="sacred-panel layer-modal grid w-full max-w-xl gap-4 rounded-lg border border-gold/35 p-5" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex flex-wrap gap-2">{types.map((item) => <button key={item} onClick={() => setType(item)} className={`rounded border px-3 py-2 font-mono text-[0.68rem] uppercase ${type === item ? "border-gold bg-gold/10 text-gold" : "border-gold/14 text-soft-sand"}`}>{item}</button>)}</div>
        <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-32 rounded border border-gold/18 bg-obsidian/55 p-3 text-ivory" placeholder={placeholders[type]} />
        <select value={guardian} onChange={(event) => setGuardian(event.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory">
          <option value="">No guardian assigned</option>
          {guardians.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <div className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
          <span className="font-mono text-gold">Routes as:</span> {preview.type.replace("_", " ")} · {preview.guardian} · {preview.status}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => void capture(false)} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Capture</button>
          <button onClick={() => void capture(true)} className="rounded-none border border-gold/55 bg-gold px-3 py-2 font-mono text-xs uppercase text-obsidian">Capture and Close</button>
          {saved ? <span className="font-mono text-xs uppercase text-gold">Captured ✓</span> : null}
        </div>
        <div className="grid gap-2">
          <p className="font-mono text-xs uppercase text-gold">Recent Captures</p>
          {items.slice(0, 5).map((item) => <div key={item.id} className="flex justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-2 text-sm text-soft-sand"><span>{item.type}: {item.text}</span><button onClick={() => deleteCapture(item.id)}><Trash2 className="h-4 w-4 text-burnt-bronze" /></button></div>)}
        </div>
      </div>
    </div>
  );
}

function captureTypeToCreationType(type: CaptureType): CreationType {
  if (type === "TASK") return "task";
  if (type === "IDEA") return "idea";
  if (type === "MEMORY" || type === "REFLECTION") return "memory";
  return "idea";
}
