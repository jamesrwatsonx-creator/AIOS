"use client";

import { useMemo, useState } from "react";
import { guardians } from "@/lib/guardians";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { GuardianCard } from "@/components/guardians/GuardianCard";
import { ChamberPanel } from "@/components/ui/ChamberPanel";

export function GuardiansChamber() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [domain, setDomain] = useState("ALL");
  const domains = Array.from(new Set(guardians.map((guardian) => guardian.domain)));
  const filtered = useMemo(
    () => guardians.filter((guardian) => guardian.name.toLowerCase().includes(query.toLowerCase()) && (domain === "ALL" || guardian.domain === domain) && (status === "ALL" || status === "ACTIVE")),
    [query, domain, status]
  );

  return (
    <AppShell>
      <PageFrame eyebrow="Agents" title="Agents" subtitle="The AIOS agent team. The guardian identities remain underneath, but each page now explains what the agent does, what tools it owns, and what work is active.">
        <ChamberPanel>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search agents..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55" />
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">
              {["ALL", "ACTIVE", "IDLE"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">
              <option>ALL</option>
              {domains.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </ChamberPanel>
        <ChamberPanel>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((guardian) => <GuardianCard key={guardian.slug} guardian={guardian} />)}
          </div>
        </ChamberPanel>
      </PageFrame>
    </AppShell>
  );
}
