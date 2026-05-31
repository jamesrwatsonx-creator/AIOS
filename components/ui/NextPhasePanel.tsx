import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

type NextPhasePanelProps = {
  focus: string;
};

export function NextPhasePanel({ focus }: NextPhasePanelProps) {
  return (
    <ChamberPanel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle eyebrow="Live Pending" title="Bridge Awaiting Connection" />
        <StatusPill label="LIVE_PENDING" tone="blue" />
      </div>
      <p className="mt-4 max-w-3xl text-base leading-7 text-soft-sand text-balance-safe">
        {focus}
      </p>
      <button type="button" disabled title="This chamber will activate when its local data bridge is connected." className="mt-5 cursor-not-allowed rounded-none border border-gold/18 px-3 py-2 font-mono text-xs uppercase text-soft-sand/70">
        Live Connection Pending
      </button>
    </ChamberPanel>
  );
}
