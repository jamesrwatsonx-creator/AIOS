"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { guardians } from "@/lib/guardians";

export function ObservatoryChamber() {
  const [checked, setChecked] = useState("LIVE_PENDING");
  function exportReport() {
    const text = `# James AI Operator Report\n\nGenerated: ${new Date().toLocaleString()}\n\nAll values are DEMO until telemetry readers are connected.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "james-ai-operator-report.md";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <AppShell>
      <PageFrame eyebrow="Observatory" title="Observatory Chamber" subtitle="Reports, audits, build intelligence, memory statistics, and guardian activity.">
        <ChamberPanel><div className="flex flex-wrap items-center justify-between gap-4"><SectionTitle eyebrow="System Health" title="Overview" /><button onClick={() => setChecked(new Date().toLocaleString())} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Run Audit</button></div><div className="mt-5 grid gap-3 md:grid-cols-4">{["Overall Health", "Home", "Memory", "Projects"].map((label) => <MetricCard key={label} label={label} value={0} suffix="%" state="DEMO" />)}</div><p className="mt-4 text-sm text-soft-sand">Last checked: {checked}</p></ChamberPanel>
        <div className="grid gap-6 xl:grid-cols-3"><ChamberPanel><SectionTitle eyebrow="Build Activity" title="Builds" /><div className="mt-5 grid gap-3">{["Builds This Week", "Deployments", "Tests Run", "Success Rate"].map((label) => <MetricCard key={label} label={label} value={0} suffix={label === "Success Rate" ? "%" : ""} state="DEMO" />)}</div></ChamberPanel><ChamberPanel><SectionTitle eyebrow="Memory Stats" title="Vault Signal" /><div className="mt-5 grid gap-3">{["Total Notes", "Total Connections"].map((label) => <MetricCard key={label} label={label} value={0} state="DEMO" />)}<StatusPill label="Last Vault Sync DEMO" tone="bronze" /><button className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Sync Now</button></div></ChamberPanel><ChamberPanel><SectionTitle eyebrow="Report" title="Export" /><button onClick={exportReport} className="mt-5 rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">Export Report</button></ChamberPanel></div>
        <ChamberPanel><SectionTitle eyebrow="Guardian Activity" title="Summary" /><div className="mt-5 grid gap-3 md:grid-cols-2">{guardians.map((guardian) => <div key={guardian.slug} className="flex justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><span>{guardian.name}</span><span>Last active DEMO · 0 tasks</span></div>)}</div></ChamberPanel>
      </PageFrame>
    </AppShell>
  );
}
