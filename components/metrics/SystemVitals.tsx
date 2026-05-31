import { systemVitals } from "@/lib/mockTelemetry";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function SystemVitals() {
  return (
    <ChamberPanel>
      <SectionTitle eyebrow="Core Telemetry" title="System Vitals" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {systemVitals.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            suffix={metric.suffix}
            note={metric.note}
            state={metric.state}
          />
        ))}
      </div>
    </ChamberPanel>
  );
}
