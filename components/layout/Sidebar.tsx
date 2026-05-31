"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandIcon as BrandIcon, navigationItems } from "@/lib/navigation";
import { StatusPill } from "@/components/ui/StatusPill";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sacred-panel flex min-h-dvh w-full flex-col gap-6 border-y-0 border-l-0 p-4 md:sticky md:top-0 md:w-[5.5rem] lg:w-[18rem]">
      <Link href="/" className="flex items-center gap-3 rounded-md border border-gold/20 bg-obsidian/45 p-3 transition hover:border-gold/45">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-gold/35 bg-gold/10">
          <BrandIcon className="h-6 w-6 text-gold" aria-hidden="true" />
        </span>
        <span className="hidden min-w-0 lg:block">
          <span className="block font-display text-xl leading-none text-ivory">JAMES</span>
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.28em] text-gold">AI Operator OS</span>
        </span>
      </Link>

      <nav className="grid gap-2">
        {navigationItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex min-w-0 items-center gap-3 rounded-md border px-3 py-3 transition hover:-translate-y-0.5 hover:border-gold/55 hover:bg-gold/10 ${
                active
                  ? "border-gold/55 bg-gold/12 text-ivory"
                  : "border-transparent text-soft-sand hover:text-ivory"
              }`}
              title={item.label}
            >
              <item.icon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <span className="hidden min-w-0 truncate font-mono text-[0.72rem] uppercase tracking-[0.12em] lg:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3 rounded-md border border-gold/18 bg-obsidian/55 p-3">
        <p className="hidden font-mono text-[0.68rem] uppercase tracking-[0.18em] text-soft-sand lg:block">System Status</p>
        <StatusPill label="All Systems Optimal" tone="emerald" />
      </div>
    </aside>
  );
}
