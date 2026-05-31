"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

export type OperatorAction = {
  label: string;
  href?: string;
  status?: string;
};

export type OperatorPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  primaryHref?: string;
  primaryLabel?: string;
  children?: ReactNode;
  capabilities: string[];
  recent: string[];
  nextActions: OperatorAction[];
  systems?: string[];
};

export function OperatorPage({
  eyebrow,
  title,
  description,
  status = "LOCAL-FIRST",
  primaryHref,
  primaryLabel,
  children,
  capabilities,
  recent,
  nextActions,
  systems = []
}: OperatorPageProps) {
  return (
    <AppShell>
      <main className="grid min-w-0 gap-6">
        <section className="sacred-panel gold-circuit rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid max-w-4xl gap-4">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
              <h1 className="font-display text-[clamp(2.2rem,5.5vw,5.7rem)] leading-[0.92] text-ivory text-balance-safe">{title}</h1>
              <p className="max-w-3xl text-base leading-7 text-soft-sand md:text-lg">{description}</p>
            </div>
            <StatusPill label={status} tone="gold" />
          </div>
          {primaryHref && primaryLabel ? (
            <Link href={primaryHref} className="mt-6 inline-flex items-center gap-2 rounded border border-gold/45 bg-gold/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-gold transition hover:border-gold/70 hover:bg-gold hover:text-obsidian">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </section>

        {children}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <ChamberPanel>
            <SectionTitle eyebrow="What this page does" title="Capabilities" />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {capabilities.map((item) => (
                <div key={item} className="flex gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm leading-6 text-soft-sand">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ChamberPanel>

          <ChamberPanel>
            <SectionTitle eyebrow="Recommended next" title="Next Actions" />
            <div className="mt-5 grid gap-3">
              {nextActions.map((action) => {
                const content = (
                  <>
                    <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="min-w-0 flex-1">{action.label}</span>
                    {action.status ? <span className="font-mono text-[0.68rem] uppercase text-gold">{action.status}</span> : null}
                  </>
                );
                return action.href ? (
                  <Link key={action.label} href={action.href} className="flex items-start gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand transition hover:border-gold/45 hover:text-ivory">
                    {content}
                  </Link>
                ) : (
                  <div key={action.label} className="flex items-start gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">
                    {content}
                  </div>
                );
              })}
            </div>
          </ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel>
            <SectionTitle eyebrow="Recent work" title="What Happened Recently" />
            <div className="mt-5 grid gap-3">
              {recent.map((item) => (
                <div key={item} className="flex gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 text-sm leading-6 text-soft-sand">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ChamberPanel>

          <ChamberPanel>
            <SectionTitle eyebrow="Connected systems" title="Data Sources" />
            <div className="mt-5 grid gap-3">
              {(systems.length ? systems : ["Entity graph", "Obsidian notes", "Activity log"]).map((item) => (
                <div key={item} className="rounded border border-gold/14 bg-obsidian/45 p-4 text-sm text-soft-sand">{item}</div>
              ))}
            </div>
          </ChamberPanel>
        </div>
      </main>
    </AppShell>
  );
}
