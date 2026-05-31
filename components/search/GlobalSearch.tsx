"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildSearchIndex } from "@/lib/searchIndex";
import { SearchResult } from "@/components/search/SearchResult";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => buildSearchIndex().filter((item) => `${item.title} ${item.subtitle} ${item.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 25), [query, open]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") setOpen(false);
      if (open && event.key === "ArrowDown") setActive((value) => Math.min(value + 1, results.length - 1));
      if (open && event.key === "ArrowUp") setActive((value) => Math.max(value - 1, 0));
      if (open && event.key === "Enter" && results[active]) window.location.href = results[active].route;
    };
    const trigger = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("hermes-open-search", trigger);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("hermes-open-search", trigger); };
  }, [open, results, active]);

  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  if (!open) return null;
  const groups = Array.from(new Set(results.map((item) => item.category)));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 layer-overlay grid place-items-start bg-obsidian/80 p-4 pt-[12vh]" onMouseDown={() => setOpen(false)}>
      <motion.div initial={{ y: -18 }} animate={{ y: 0 }} onMouseDown={(event) => event.stopPropagation()} className="sacred-panel layer-modal mx-auto grid w-full max-w-3xl gap-4 rounded-lg border border-gold/35 p-5">
        <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="Search chambers, guardians, projects, commands..." className="rounded border border-gold/25 bg-obsidian/65 px-4 py-3 text-ivory outline-none" />
        <div className="grid max-h-[60vh] gap-4 overflow-auto">
          {results.length === 0 ? <p className="text-soft-sand">No results found for '{query}'. Try searching for a guardian, project, or chamber.</p> : groups.map((group) => <div key={group} className="grid gap-2"><p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">{group}</p>{results.filter((item) => item.category === group).slice(0, 5).map((item, index) => <SearchResult key={`${group}-${item.id}`} item={item} active={results.indexOf(item) === active} onSelect={() => setOpen(false)} />)}</div>)}
        </div>
      </motion.div>
    </motion.div>
  );
}
