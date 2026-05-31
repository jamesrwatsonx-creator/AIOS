import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { MemoryNucleusGraphPlaceholder } from "@/components/memory/MemoryNucleusGraphPlaceholder";

export const dynamic = "force-dynamic";

export default function MemoryPage() {
  return (
    <AppShell>
      <PageFrame
        eyebrow="Memory"
        title="Memory"
        subtitle="Search and understand AIOS memory: Obsidian notes, entity graph records, projects, browser missions, Codex logs, conversations, and recent activity."
      >
        <MemoryNucleusGraphPlaceholder />
      </PageFrame>
    </AppShell>
  );
}
