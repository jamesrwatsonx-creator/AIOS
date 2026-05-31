"use client";

import { useEffect, useState } from "react";
import { telemetryStrip } from "@/lib/mockTelemetry";
import { StatusPill } from "@/components/ui/StatusPill";
import { RefreshCw } from "lucide-react";

export function TelemetryStrip() {
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    setUpdated(new Date().toLocaleTimeString());
  }, []);

  return (
    <section className="sacred-panel grid gap-4 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-gold">Telemetry Strip · Last Updated {updated || "loading"}</p>
        <button type="button" className="inline-flex items-center gap-2 rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {telemetryStrip.map((item) => (
          <div key={item.label} className="flex min-w-0 items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 px-4 py-3">
            <span className="min-w-0 truncate font-mono text-[0.72rem] uppercase tracking-[0.14em] text-soft-sand">{item.label}</span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-display text-xl text-gold">{item.value}</span>
              <StatusPill label="DEMO" tone="bronze" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
