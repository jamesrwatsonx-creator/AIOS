"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { readNotifications, writeNotifications, type HermesNotification } from "@/lib/notifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HermesNotification[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((item) => !item.read).length;

  useEffect(() => {
    const refresh = () => setItems(readNotifications());
    refresh();
    window.addEventListener("hermes-notifications-updated", refresh);
    const outside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", outside);
    return () => {
      window.removeEventListener("hermes-notifications-updated", refresh);
      window.removeEventListener("mousedown", outside);
    };
  }, []);

  function update(next: HermesNotification[]) {
    setItems(next);
    writeNotifications(next);
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((value) => !value)} className={`relative inline-flex h-10 w-10 items-center justify-center rounded border border-gold/25 bg-obsidian/60 transition hover:border-gold/55 hover:bg-gold/10 ${unread ? "animate-pulse" : ""}`} type="button" title="Notifications">
        <Bell className="h-4 w-4 text-gold" aria-hidden="true" />
        {unread ? <span className="absolute -right-1 -top-1 rounded border border-gold/40 bg-obsidian px-1.5 font-mono text-[0.6rem] text-gold">{unread}</span> : null}
      </button>
      {open ? <NotificationDropdown notifications={items} onMarkRead={(id) => update(items.map((item) => item.id === id ? { ...item, read: true } : item))} onMarkAllRead={() => update(items.map((item) => ({ ...item, read: true })))} onClearAll={() => update([])} /> : null}
    </div>
  );
}
