import { guardians } from "@/lib/guardians";
import { GuardianCard } from "@/components/guardians/GuardianCard";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function GuardianGrid() {
  return (
    <ChamberPanel>
      <SectionTitle eyebrow="Agents" title="Agent Team" action={<a className="font-mono text-xs uppercase tracking-[0.16em] text-gold hover:text-ivory" href="/agents">View All</a>} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {guardians.map((guardian) => (
          <GuardianCard key={guardian.slug} guardian={guardian} />
        ))}
      </div>
    </ChamberPanel>
  );
}
