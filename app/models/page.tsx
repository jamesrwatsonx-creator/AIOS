import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { NextPhasePanel } from "@/components/ui/NextPhasePanel";

export const dynamic = "force-dynamic";

export default function ModelsPage() {
  return (
    <AppShell>
      <PageFrame eyebrow="Model Routing" title="Models" subtitle="Routing shell for model roles, availability, provider policy, and task-class selection.">
        {/* TODO telemetry connection point: parse `_AI_OPERATOR_DATA/MODEL_ROUTING.md` and verified provider metadata without exposing secrets. */}
        <NextPhasePanel focus="Models Chamber will visualize routing policy, task-class model choices, fallback paths, and evaluation evidence." />
      </PageFrame>
    </AppShell>
  );
}
