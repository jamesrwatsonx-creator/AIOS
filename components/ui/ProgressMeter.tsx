type ProgressMeterProps = {
  label: string;
  value: number;
  accent?: string;
};

export function ProgressMeter({ label, value, accent = "#d4a64a" }: ProgressMeterProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-soft-sand">
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0">{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-gold/20 bg-obsidian/70">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${safeValue}%`,
            background: `linear-gradient(90deg, ${accent}, rgba(255, 189, 56, 0.7))`
          }}
        />
      </div>
    </div>
  );
}
