"use client";

import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { openEntityInspector } from "@/lib/entityInspectorEvents";

export type HermesHistoryItem = {
  id: string;
  command: string;
  response: string;
  timestamp: string;
};

type HermesCommandHistoryProps = {
  items: HermesHistoryItem[];
  onClear: () => void;
  onRerun: (command: string) => void;
};

export function HermesCommandHistory({ items, onClear, onRerun }: HermesCommandHistoryProps) {
  function exportHistory() {
    const text = items.map((item) => `[${item.timestamp}]\nJames: ${item.command}\nHermes: ${item.response}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hermes-command-history.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ChamberPanel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle eyebrow="Command History" title="Last Transmissions" />
        <div className="flex gap-2">
          <button type="button" onClick={exportHistory} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Export History</button>
          <button type="button" onClick={onClear} className="rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Clear History</button>
        </div>
      </div>
      <div className="mt-5 grid max-h-96 gap-3 overflow-auto pr-1">
        {items.length === 0 ? (
          <EmptyState title="No commands recorded yet." message="Hermes is waiting for your first instruction." />
        ) : (
          items.slice(0, 10).map((item) => (
            <div key={item.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-left transition hover:border-gold/45">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold">{item.timestamp}</p>
              <p className="mt-2 text-sm text-ivory text-balance-safe">{item.command}</p>
              <p className="mt-1 text-sm text-soft-sand text-balance-safe">{item.response}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => onRerun(item.command)} className="font-mono text-[0.68rem] uppercase text-gold">Rerun</button>
                <button type="button" onClick={() => openEntityInspector(item.id)} className="font-mono text-[0.68rem] uppercase text-gold">Inspect</button>
              </div>
            </div>
          ))
        )}
      </div>
    </ChamberPanel>
  );
}
