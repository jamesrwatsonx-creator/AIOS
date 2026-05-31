"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchResultItem } from "@/lib/searchIndex";

export function SearchResult({ item, active, onSelect }: { item: SearchResultItem; active: boolean; onSelect: () => void }) {
  return (
    <Link href={item.route} onClick={onSelect} className={`flex items-center justify-between gap-3 rounded border p-3 ${active ? "border-gold bg-gold/10" : "border-gold/14 bg-obsidian/45"}`}>
      <span className="flex min-w-0 items-center gap-3"><Search className="h-4 w-4 text-gold" /><span className="min-w-0"><span className="block truncate text-sm text-ivory">{item.title}</span><span className="block truncate text-xs text-soft-sand">{item.subtitle}</span></span></span>
      <span className="font-mono text-[0.65rem] uppercase text-gold">Enter</span>
    </Link>
  );
}
