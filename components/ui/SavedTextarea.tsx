"use client";

import { useEffect, useState } from "react";
import { SaveClearButtons } from "@/components/ui/ActionButtons";
import { upsertEntity } from "@/lib/entityStore";
import { readStorage, removeStorage, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";

type SavedTextareaProps = {
  storageKey: string;
  label: string;
  placeholder?: string;
  minHeightClass?: string;
};

export function SavedTextarea({ storageKey, label, placeholder, minHeightClass = "min-h-28" }: SavedTextareaProps) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(readStorage(storageKey, ""));
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (detail?.key === storageKey) setValue(readStorage(storageKey, ""));
    };
    window.addEventListener("hermes-storage-key-updated", refresh);
    return () => window.removeEventListener("hermes-storage-key-updated", refresh);
  }, [storageKey]);

  useEffect(() => {
    const saveCurrent = () => save(value);
    window.addEventListener("hermes-save-all-ledger-fields", saveCurrent);
    return () => window.removeEventListener("hermes-save-all-ledger-fields", saveCurrent);
  }, [storageKey, value]);

  function save(nextValue = value) {
    writeStorage(storageKey, nextValue);
    if (storageKey.includes("intention") && nextValue.trim()) {
      upsertEntity({
        id: `intention:${storageKey}`,
        type: "intention",
        title: nextValue.trim().slice(0, 80),
        status: "ACTIVE",
        guardian: "Khonsu",
        guardianSlug: "khonsu",
        category: "Daily Ledger",
        tags: ["intention", "daily"],
        relationships: [{ type: "recorded_on", targetId: new Date().toISOString().slice(0, 10) }],
        source: "Daily Ledger",
        metadata: { storageKey, body: nextValue }
      }, "intention_saved");
    }
    void recordObsidianEvent({
      category: storageKey.includes("timeline") || storageKey.includes("intention") || storageKey.includes("built") || storageKey.includes("learned") || storageKey.includes("helped") || storageKey.includes("improve") || storageKey.includes("grateful") ? "chronicle" : "memory",
      title: `Saved ${label}`,
      body: nextValue,
      metadata: { storageKey, label }
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function clear() {
    if (!window.confirm(`Clear ${label}?`)) return;
    setValue("");
    removeStorage(storageKey);
  }

  return (
    <label className="grid gap-2">
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") save();
        }}
        className={`${minHeightClass} w-full resize-y rounded border border-gold/18 bg-obsidian/55 p-4 text-sm leading-6 text-ivory outline-none transition focus:border-gold/55`}
        placeholder={placeholder}
      />
      <SaveClearButtons onSave={() => save()} onClear={clear} saved={saved} />
    </label>
  );
}
