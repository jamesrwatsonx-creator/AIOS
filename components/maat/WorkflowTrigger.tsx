"use client";

export function WorkflowTrigger({ onTrigger }: { onTrigger: () => void }) {
  return <button onClick={onTrigger} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Trigger</button>;
}
