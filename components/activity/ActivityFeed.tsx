import { latestSignals } from "@/lib/mockTelemetry";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

export function ActivityFeed() {
  return (
    <ChamberPanel>
      <SectionTitle eyebrow="Latest Signals" title="Operational Intelligence Feed" />
      <div className="mt-5 grid gap-3">
        {latestSignals.map((signal) => (
          <div key={signal.title} className="grid gap-2 rounded-md border border-gold/15 bg-obsidian/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 font-medium text-ivory text-balance-safe">{signal.title}</p>
              <StatusPill label={signal.state} tone={signal.state === "DEMO" ? "bronze" : "blue"} />
            </div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-soft-sand">{signal.source}</p>
          </div>
        ))}
      </div>
    </ChamberPanel>
  );
}
