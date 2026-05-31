type StatusPillProps = {
  label: string;
  tone?: "gold" | "emerald" | "blue" | "bronze";
};

const toneClasses = {
  gold: "border-gold/40 bg-gold/10 text-gold",
  emerald: "border-emerald/50 bg-emerald/20 text-soft-sand",
  blue: "border-nile-blue/45 bg-nile-blue/10 text-nile-blue",
  bronze: "border-burnt-bronze/60 bg-burnt-bronze/20 text-soft-sand"
};

export function StatusPill({ label, tone = "gold" }: StatusPillProps) {
  return (
    <span className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] ${toneClasses[tone]}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
      <span className="truncate">{label}</span>
    </span>
  );
}
