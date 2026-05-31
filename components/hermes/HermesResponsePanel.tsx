"use client";

import { motion } from "framer-motion";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";

type HermesResponsePanelProps = {
  response: string;
  onSpeak: () => void;
  onClear: () => void;
};

export function HermesResponsePanel({ response, onSpeak, onClear }: HermesResponsePanelProps) {
  return (
    <ChamberPanel>
      <SectionTitle eyebrow="Hermes Response" title="Current Transmission" />
      <motion.p
        key={response}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 min-h-36 rounded border border-gold/16 bg-obsidian/55 p-4 text-lg leading-8 text-gold text-balance-safe"
      >
        {response || "Awaiting your command, James."}
      </motion.p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => navigator.clipboard?.writeText(response)} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">Copy Response</button>
        <button type="button" onClick={onSpeak} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">Speak Again</button>
        <button type="button" onClick={onClear} className="rounded-none border border-burnt-bronze/50 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Clear Response</button>
      </div>
    </ChamberPanel>
  );
}
