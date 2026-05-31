"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { projectCategories } from "@/lib/projectCategories";

const vaultFolders = ["00-Hermes-Memory", "01-Daily-Logs", "02-Projects", "03-Ideas", "04-Agents", "05-Knowledge", "06-Resources", "07-Reflections", "08-Goals", "09-Systems"];

export function VaultChamber() {
  const [folder, setFolder] = useState(projectCategories[0]);
  return (
    <AppShell>
      <PageFrame eyebrow="Vault" title="Vault Chamber" subtitle="Local file and knowledge browser shell. Filesystem reads remain placeholder until the local API layer is built.">
        {/* TODO telemetry connection point: read AppBuilds and Obsidian folders through sanitized local API routes. */}
        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel><SectionTitle eyebrow="Files" title="AppBuilds Browser" /><div className="mt-5 grid gap-3">{projectCategories.map((category) => <button key={category} onClick={() => setFolder(category)} className={`flex justify-between rounded border p-4 text-left ${folder === category ? "border-gold bg-gold/10 text-gold" : "border-gold/14 bg-obsidian/45 text-soft-sand"}`}><span>{category}</span><span>0 DEMO</span></button>)}</div><div className="mt-5"><EmptyState title={`${folder} file list pending.`} message="OPEN IN EXPLORER is a placeholder until desktop bridge actions are approved." /></div><button className="mt-4 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open in Explorer</button></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Knowledge" title="Obsidian Vault" /><div className="mt-5 grid gap-3">{vaultFolders.map((item) => <div key={item} className="flex justify-between rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><span>{item}</span><span>0 DEMO</span></div>)}</div><div className="mt-4 flex gap-3"><button className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Open Obsidian</button><button className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Sync Vault</button></div></ChamberPanel>
        </div>
      </PageFrame>
    </AppShell>
  );
}
