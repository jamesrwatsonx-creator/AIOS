"use client";

import { Eye, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function TopStatusBar() {
  const [timestamp, setTimestamp] = useState("Sol Cycle pending");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const breadcrumb = pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).map((part) => part.replaceAll("-", " ")).join(" / ");

  useEffect(() => {
    const update = () => {
      setTimestamp(
        new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date())
      );
    };

    update();
    const interval = window.setInterval(update, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="sacred-panel layer-sticky-nav flex min-w-0 flex-wrap items-center justify-between gap-4 overflow-visible rounded-lg px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-gold/25 bg-gold/10">
          <Eye className="h-5 w-5 text-gold" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold">Sol Cycle</p>
          <p className="truncate text-sm text-soft-sand">{timestamp} · {breadcrumb}</p>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <button onClick={() => window.dispatchEvent(new Event("hermes-open-search"))} className="inline-flex h-10 w-10 items-center justify-center rounded border border-gold/25 bg-obsidian/60 transition hover:border-gold/55 hover:bg-gold/10" type="button" title="Search Ctrl+K">
          <Search className="h-4 w-4 text-gold" aria-hidden="true" />
        </button>
        <NotificationBell />
        <button onClick={() => setSettingsOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded border border-gold/25 bg-obsidian/65" title="Operator James" type="button">
          <UserRound className="h-5 w-5 text-gold" aria-hidden="true" />
        </button>
        {settingsOpen ? (
          <div className="absolute right-0 top-12 layer-dropdown grid w-56 gap-2 rounded border border-gold/25 bg-obsidian p-3 shadow-panel-lift">
            <Link className="rounded border border-gold/12 px-3 py-2 text-sm text-soft-sand hover:text-gold" href="/settings">Settings</Link>
            <Link className="rounded border border-gold/12 px-3 py-2 text-sm text-soft-sand hover:text-gold" href="/hermes">Open Hermes</Link>
            <Link className="rounded border border-gold/12 px-3 py-2 text-sm text-soft-sand hover:text-gold" href="/settings">System Status</Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
