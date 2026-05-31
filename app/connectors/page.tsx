import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { NextPhasePanel } from "@/components/ui/NextPhasePanel";

export const dynamic = "force-dynamic";

export default function ConnectorsPage() {
  return (
    <AppShell>
      <PageFrame eyebrow="Integration Flow" title="Connectors" subtitle="Connector shell for integrations, bridge paths, flow health, and approval boundaries.">
        {/* TODO telemetry connection point: load connector inventory only from sanitized operator files. */}
        <NextPhasePanel focus="Connectors Chamber will show local bridge status, integration safety boundaries, sync flow health, and approval gates." />
      </PageFrame>
    </AppShell>
  );
}
