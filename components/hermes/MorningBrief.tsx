"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { todayKey, timeGreeting, speakBrief } from "@/lib/morningBrief";
import { readStorage, writeStorage, hermesDailyKey } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";

export function MorningBrief() {
  const [open, setOpen] = useState(false);
  const [intention, setIntention] = useState("");
  const greeting = timeGreeting();
  const date = new Date().toLocaleDateString();
  const projects = readStorage("hermes_projects", []);
  const agenda = readStorage(hermesDailyKey("agenda"), []);
  const briefText = useMemo(() => `Good ${greeting} James. Today is ${date}. ${projects.length} projects are active. Your streak is 0 days. The system is operational. What shall we build today?`, [greeting, date, projects.length]);

  useEffect(() => {
    const key = todayKey("hermes_brief");
    if (!localStorage.getItem(key)) {
      setOpen(true);
      void speakBrief(briefText);
    }
  }, [briefText]);

  if (!open) return null;

  function begin(mark = true) {
    if (mark) localStorage.setItem(todayKey("hermes_brief"), "true");
    setOpen(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 layer-overlay grid place-items-center bg-obsidian/90 p-4">
      <div className="sacred-panel layer-modal gold-circuit grid max-h-[90dvh] w-full max-w-3xl gap-5 overflow-auto rounded-lg border border-gold/35 p-6">
        <Eye className="mx-auto h-10 w-10 text-gold" />
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-gold">Morning Brief</p>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,4rem)] text-ivory">Good {greeting} James.</h2>
          <p className="text-soft-sand">Sol Cycle {date}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {["Active agents: 8", `Projects: ${projects.length}`, "Streak: 0 days", "Last reflection: LIVE_PENDING"].map((item) => <div key={item} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">{item}</div>)}
        </div>
        <div className="grid gap-3">
          <p className="font-mono text-xs uppercase text-gold">Today's Intention</p>
          <textarea value={intention} onChange={(event) => setIntention(event.target.value)} className="min-h-24 rounded border border-gold/18 bg-obsidian/55 p-3 text-ivory" placeholder={readStorage(hermesDailyKey("intention"), "Set today's intention...")} />
          <button onClick={() => { writeStorage(hermesDailyKey("intention"), intention); void recordObsidianEvent({ category: "chronicle", title: "Morning intention set", body: intention, metadata: { source: "MorningBrief" } }); }} className="justify-self-start rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Set Intention</button>
        </div>
        <div className="rounded border border-gold/14 bg-obsidian/45 p-4">
          <p className="font-mono text-xs uppercase text-gold">Agenda Preview</p>
          <div className="mt-3 grid gap-2 text-sm text-soft-sand">{agenda.length ? agenda.map((item: { id: string; text: string }) => <p key={item.id}>{item.text}</p>) : <p>No agenda set.</p>}</div>
          <a href="/" className="mt-3 inline-block font-mono text-xs uppercase text-gold">Open Today&apos;s Focus</a>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => begin(true)} className="rounded-none border border-gold/55 bg-gold px-5 py-3 font-mono text-xs uppercase text-obsidian">Begin the Day</button>
          <button onClick={() => begin(false)} className="rounded-none border border-burnt-bronze/45 px-4 py-3 font-mono text-xs uppercase text-soft-sand">Skip for today</button>
        </div>
      </div>
    </motion.div>
  );
}
