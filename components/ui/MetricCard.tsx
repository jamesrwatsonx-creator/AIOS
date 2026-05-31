import { RefreshCw } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";

type MetricCardProps = {
  label: string;
  value: number;
  suffix?: string;
  note?: string;
  state?: "DEMO" | "LIVE_PENDING";
  tooltip?: string;
};

export function MetricCard({ label, value, suffix = "", note, state = "LIVE_PENDING", tooltip }: MetricCardProps) {
  return (
    <div className="min-w-0 rounded-md border border-gold/18 bg-obsidian/45 p-4 transition hover:-translate-y-0.5 hover:border-gold/38" title={tooltip ?? note ?? `${label} telemetry will connect in a later phase.`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-soft-sand">{label}</p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={`Refresh ${label}`} className="rounded border border-gold/20 p-1 text-gold transition hover:bg-gold/10">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <StatusPill label={state} tone={state === "DEMO" ? "bronze" : "blue"} />
        </div>
      </div>
      <p className="font-display text-[clamp(1.85rem,3vw,2.65rem)] leading-none text-gold">
        {value}
        <span className="text-[0.55em] text-soft-sand">{suffix}</span>
      </p>
      {note ? <p className="mt-3 text-sm leading-6 text-soft-sand/82 text-balance-safe">{note}</p> : null}
    </div>
  );
}
