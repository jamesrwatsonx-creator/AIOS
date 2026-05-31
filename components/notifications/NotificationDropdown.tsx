"use client";

import Link from "next/link";
import { Bell, Check, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { HermesNotification } from "@/lib/notifications";

type Props = {
  notifications: HermesNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
};

export function NotificationDropdown({ notifications, onMarkRead, onMarkAllRead, onClearAll }: Props) {
  return (
    <div className="fixed right-4 top-20 layer-dropdown grid max-h-[min(32rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2rem))] gap-3 overflow-auto rounded border border-gold/25 bg-obsidian p-4 shadow-panel-lift md:right-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">Notifications</p>
        <div className="flex gap-2">
          <button onClick={onMarkAllRead} className="rounded-none border border-gold/30 px-2 py-1 font-mono text-[0.65rem] uppercase text-gold"><Check className="inline h-3 w-3" /> Mark All</button>
          <button onClick={onClearAll} className="rounded-none border border-burnt-bronze/45 px-2 py-1 font-mono text-[0.65rem] uppercase text-soft-sand"><Trash2 className="inline h-3 w-3" /> Clear</button>
        </div>
      </div>
      {notifications.length === 0 ? <EmptyState title="All clear. Hermes is watching." message="No new operational signals." /> : notifications.slice(0, 20).map((item) => (
        <div key={item.id} className="grid gap-2 rounded border border-gold/14 bg-obsidian/55 p-3">
          <div className="flex gap-3">
            <Bell className="mt-1 h-4 w-4 shrink-0 text-gold" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gold">{item.title}</p>
              <p className="text-sm text-soft-sand">{item.message}</p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase text-soft-sand/70">{item.type} · {item.timestamp}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!item.read ? <button onClick={() => onMarkRead(item.id)} className="rounded-none border border-gold/30 px-2 py-1 font-mono text-[0.65rem] uppercase text-gold">Mark Read</button> : null}
            {item.route ? <Link href={item.route} className="rounded-none border border-gold/20 px-2 py-1 font-mono text-[0.65rem] uppercase text-soft-sand hover:text-gold">Open</Link> : null}
          </div>
        </div>
      ))}
      <Link href="/activity" className="justify-self-start font-mono text-xs uppercase text-gold">View All</Link>
    </div>
  );
}
