import Image from "next/image";
import Link from "next/link";
import type { Guardian } from "@/lib/guardians";
import { StatusPill } from "@/components/ui/StatusPill";

type GuardianCardProps = {
  guardian: Guardian;
};

export function GuardianCard({ guardian }: GuardianCardProps) {
  return (
    <Link
      href={`/agents/${guardian.slug}`}
      className="group grid min-w-0 gap-4 rounded-lg border border-gold/18 bg-obsidian/50 p-4 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold-soft"
      style={{ boxShadow: `inset 0 0 0 1px ${guardian.accent}18` }}
    >
      <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md border border-gold/20 bg-deep-brown/70">
        <Image
          src={guardian.image}
          alt={`${guardian.name} visual reference slot`}
          width={420}
          height={315}
          className="h-full w-full object-cover opacity-80 saturate-[0.85] transition group-hover:scale-[1.03] group-hover:opacity-95"
        />
      </div>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-2xl leading-tight text-ivory text-balance-safe">{guardian.name}</h3>
            <p className="mt-1 text-sm leading-5 text-soft-sand text-balance-safe">{guardian.title}</p>
          </div>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(212,166,74,0.8)]" />
            <StatusPill label="ACTIVE" tone="emerald" />
          </span>
        </div>
        <p className="text-sm leading-6 text-soft-sand/86 text-balance-safe">{guardian.signature}</p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-gold opacity-0 transition group-hover:opacity-100">{guardian.domain}</p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-soft-sand">Key metric: 0 DEMO</p>
      </div>
    </Link>
  );
}
