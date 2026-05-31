"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { GuidedCreationModal } from "@/components/creation/GuidedCreationModal";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { SavedTextarea } from "@/components/ui/SavedTextarea";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { calendarDays, continuityHealth, dailyStages, habits, ledgerOverviewMetrics, moodLabels, reflectionThemes, weekDays } from "@/lib/dailyLedger";
import { createLocalId } from "@/lib/id";
import { hermesDailyKey, readStorage, writeStorage } from "@/lib/localStorageKeys";
import { recordObsidianEvent } from "@/lib/obsidianClient";

const reflectionFields = [
  ["What did I build?", "built"],
  ["What did I learn?", "learned"],
  ["Who did I help?", "helped"],
  ["What can I improve?", "improve"],
  ["What am I grateful for?", "grateful"]
] as const;

type TextItem = { id: string; text: string; timestamp?: string };

export function DailyLedgerChamber() {
  const [savedAll, setSavedAll] = useState(false);
  const [habitsState, setHabitsState] = useState<Record<string, boolean>>({});
  const [mood, setMood] = useState("");
  const [moodUpdated, setMoodUpdated] = useState("");
  const [entries, setEntries] = useState<TextItem[]>([]);
  const [entryInput, setEntryInput] = useState("");
  const [highlights, setHighlights] = useState<TextItem[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [gratitudes, setGratitudes] = useState<TextItem[]>([]);
  const [gratitudeInput, setGratitudeInput] = useState("");
  const [timelineNotes, setTimelineNotes] = useState<Record<string, string>>({});
  const [activeStage, setActiveStage] = useState("DAWN");
  const [selectedDay, setSelectedDay] = useState("");
  const [timelineSaved, setTimelineSaved] = useState(false);
  const [guidedIntentionOpen, setGuidedIntentionOpen] = useState(false);

  useEffect(() => {
    setHabitsState(readStorage(hermesDailyKey("habits"), {}));
    setMood(readStorage(hermesDailyKey("mood"), ""));
    setMoodUpdated(readStorage(hermesDailyKey("mood_updated"), ""));
    setEntries(readStorage(hermesDailyKey("entries"), []));
    setHighlights(readStorage(hermesDailyKey("highlights"), []));
    setGratitudes(readStorage(hermesDailyKey("gratitudes"), []));
    setTimelineNotes(dailyStages.reduce<Record<string, string>>((acc, stage) => {
      acc[stage] = readStorage(hermesDailyKey(`timeline_${stage}`), "");
      return acc;
    }, {}));
  }, []);

  const weeklyScore = useMemo(() => {
    const total = habits.length * weekDays.length;
    const done = Object.values(habitsState).filter(Boolean).length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [habitsState]);

  function saveAll() {
    window.dispatchEvent(new Event("hermes-save-all-ledger-fields"));
    void recordObsidianEvent({
      category: "chronicle",
      title: "Daily ledger save all",
      body: "Ledger text fields were saved from the Daily Ledger Chamber.",
      metadata: { date: new Date().toISOString().slice(0, 10) }
    });
    setSavedAll(true);
    window.setTimeout(() => setSavedAll(false), 2000);
  }

  function saveTimelineNote() {
    writeStorage(hermesDailyKey(`timeline_${activeStage}`), timelineNotes[activeStage] ?? "");
    void recordObsidianEvent({
      category: "chronicle",
      title: `Timeline note saved: ${activeStage}`,
      body: timelineNotes[activeStage] ?? "",
      metadata: { stage: activeStage }
    });
    setTimelineSaved(true);
    window.setTimeout(() => setTimelineSaved(false), 2000);
  }

  function selectMood(nextMood: string) {
    setMood(nextMood);
    writeStorage(hermesDailyKey("mood"), nextMood);
    const now = new Date().toLocaleString();
    setMoodUpdated(now);
    writeStorage(hermesDailyKey("mood_updated"), now);
    void recordObsidianEvent({
      category: "chronicle",
      title: "Mood saved",
      body: nextMood,
      metadata: { updated: now }
    });
  }

  function addItem(input: string, setter: (value: string) => void, list: TextItem[], setList: (items: TextItem[]) => void, key: string) {
    if (!input.trim()) return;
    const next = [{ id: createLocalId("ledger"), text: input.trim(), timestamp: new Date().toLocaleTimeString() }, ...list];
    setList(next);
    writeStorage(key, next);
    void recordObsidianEvent({
      category: "chronicle",
      title: "Ledger item saved",
      body: input.trim(),
      metadata: { storageKey: key, itemCount: next.length }
    });
    setter("");
  }

  return (
    <AppShell>
      <PageFrame eyebrow="Daily Ledger Chamber" title="Daily Ledger Chamber" subtitle="HALL OF REFLECTION & CONTINUITY. Every field saves locally with date-keyed Hermes entries until the Obsidian bridge is live.">
        {/* TODO file connection point: write saved ledger data into Obsidian daily notes after bridge approval. */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <ChamberPanel className="gold-circuit">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-gold">Hall of Reflection & Continuity</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.9rem)] leading-[0.94] text-ivory text-balance-safe">Chronicle the day. Preserve the signal.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-soft-sand text-balance-safe">Ctrl+Enter saves text fields. Clear buttons confirm before removing local entries.</p>
          </ChamberPanel>
          <ChamberPanel>
            <SectionTitle eyebrow="Overview" title="Continuity Metrics" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{ledgerOverviewMetrics.map((metric) => <MetricCard key={metric.label} label={metric.label} value={metric.value} suffix={metric.suffix} state="DEMO" />)}</div>
          </ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <ChamberPanel>
            <SectionTitle eyebrow="Continuity" title="Continuity Health" />
            <div className="mt-5 grid gap-3">{continuityHealth.map((item) => <div key={item.label} className="flex justify-between rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><span>{item.label}</span><span className="text-gold">{item.value}% DEMO</span></div>)}</div>
          </ChamberPanel>
          <ChamberPanel>
            <SectionTitle eyebrow="Intention" title="Today's Intention" action={<button onClick={() => setGuidedIntentionOpen(true)} className="font-mono text-xs uppercase text-gold">Guided Intention</button>} />
            <div className="mt-5"><SavedTextarea storageKey={hermesDailyKey("intention")} label="Intention" placeholder="Write the day’s intention here." minHeightClass="min-h-40" /></div>
          </ChamberPanel>
        </div>

        <ChamberPanel>
          <div className="flex flex-wrap items-center justify-between gap-4"><SectionTitle eyebrow="Reflection" title="Today's Reflection" /><button onClick={saveAll} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">Save All Entries</button>{savedAll ? <span className="font-mono text-xs uppercase text-gold">All Entries Saved ✓</span> : null}</div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{reflectionFields.map(([label, key]) => <SavedTextarea key={key} storageKey={hermesDailyKey(key)} label={label} placeholder="Record your answer." />)}</div>
        </ChamberPanel>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel>
            <SectionTitle eyebrow="Daily Timeline" title="Continuity Stages" />
            <div className="mt-5 grid gap-3 sm:grid-cols-5">{dailyStages.map((stage) => <button key={stage} onClick={() => setActiveStage(stage)} className={`grid gap-3 rounded border p-4 text-center ${activeStage === stage ? "border-gold/60 bg-gold/10" : "border-gold/18 bg-obsidian/45"}`}><span className="mx-auto h-4 w-4 rounded-full bg-gold" /><span className="font-mono text-[0.68rem] uppercase text-soft-sand">{stage}</span>{timelineNotes[stage] ? <StatusPill label="Saved" tone="emerald" /> : null}</button>)}</div>
            <div className="mt-5 grid gap-3">
              <textarea value={timelineNotes[activeStage] ?? ""} onChange={(e) => setTimelineNotes({ ...timelineNotes, [activeStage]: e.target.value })} className="min-h-24 rounded border border-gold/18 bg-obsidian/55 p-3 text-ivory" placeholder={`Note for ${activeStage}`} />
              <div className="flex flex-wrap items-center gap-3"><button onClick={saveTimelineNote} className="justify-self-start rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Note</button>{timelineSaved ? <span className="font-mono text-xs uppercase text-gold">Saved ✓</span> : null}</div>
            </div>
          </ChamberPanel>
          <ChamberPanel>
            <SectionTitle eyebrow="Emotional Weather" title="Mood Field" />
            <div className="mt-5 grid gap-2 sm:grid-cols-2">{moodLabels.map((label) => <button key={label} onClick={() => selectMood(label)} className={`rounded border p-3 font-mono text-xs uppercase ${mood === label ? "border-gold bg-gold/10 text-gold" : "border-gold/14 text-soft-sand"}`}>{label} · 0% DEMO</button>)}</div>
            <button onClick={() => mood && selectMood(mood)} className="mt-4 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save Mood</button>
            <p className="mt-3 text-sm text-soft-sand">Last mood update: {moodUpdated || "LIVE_PENDING"}</p>
          </ChamberPanel>
        </div>

        <ChamberPanel>
          <div className="flex flex-wrap items-center justify-between gap-4"><SectionTitle eyebrow="Rituals" title="Habit & Ritual Tracker" /><StatusPill label={`Weekly Score ${weeklyScore}%`} tone="blue" /></div>
          <div className="mt-5 overflow-x-auto"><div className="grid min-w-[44rem] gap-2">{habits.map((habit) => <div key={habit} className="grid grid-cols-[minmax(12rem,1fr)_repeat(7,2.5rem)] items-center gap-2 rounded border border-gold/12 bg-obsidian/45 p-2"><span className="text-sm text-soft-sand">{habit}</span>{weekDays.map((day, index) => { const key = `${habit}_${index}`; return <button key={key} onClick={() => { const next = { ...habitsState, [key]: !habitsState[key] }; setHabitsState(next); writeStorage(hermesDailyKey("habits"), next); }} className={`mx-auto h-4 w-4 rounded-full border ${habitsState[key] ? "border-gold bg-gold" : "border-gold/35 bg-gold/10"}`} title={`${day} ${habit}`} />; })}</div>)}</div></div>
        </ChamberPanel>

        <div className="grid gap-6 xl:grid-cols-3">
          <ChamberPanel><SectionTitle eyebrow="Recent Entries" title="Ledger Feed" action={<button className="font-mono text-xs uppercase text-gold">View All Entries</button>} /><ListEditor items={entries} input={entryInput} setInput={setEntryInput} onAdd={() => addItem(entryInput, setEntryInput, entries, setEntries, hermesDailyKey("entries"))} onDelete={(id) => { const next = entries.filter((item) => item.id !== id); setEntries(next); writeStorage(hermesDailyKey("entries"), next); }} placeholder="New entry..." empty="No entries recorded today. Begin your reflection." /></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Memory Highlights" title="Captured Signals" action={<Link href="/memory" className="font-mono text-xs uppercase text-gold">View Memory Map</Link>} /><ListEditor items={highlights} input={highlightInput} setInput={setHighlightInput} onAdd={() => addItem(highlightInput, setHighlightInput, highlights, setHighlights, hermesDailyKey("highlights"))} onDelete={(id) => { const next = highlights.filter((item) => item.id !== id); setHighlights(next); writeStorage(hermesDailyKey("highlights"), next); }} placeholder="Add highlight..." empty="No memory highlights yet." /></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Gratitude" title="Gratitude Log" /><ListEditor items={gratitudes} input={gratitudeInput} setInput={setGratitudeInput} onAdd={() => addItem(gratitudeInput, setGratitudeInput, gratitudes, setGratitudes, hermesDailyKey("gratitudes"))} onDelete={(id) => { const next = gratitudes.filter((item) => item.id !== id); setGratitudes(next); writeStorage(hermesDailyKey("gratitudes"), next); }} placeholder="Add gratitude..." empty="No gratitude recorded yet." /></ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel><SectionTitle eyebrow="Themes" title="Reflection Themes" /><div className="mt-5 flex min-h-40 flex-wrap items-center justify-center gap-4 rounded border border-gold/14 bg-obsidian/45 p-5 text-center">{reflectionThemes.map((theme) => <span key={theme.label} className={`${theme.size} font-display text-gold/85`}>{theme.label}</span>)}</div></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Continuity Calendar" title="Monthly Pattern" /><div className="mt-5 grid grid-cols-7 gap-2">{calendarDays.map((day) => <button key={day.label} onClick={() => setSelectedDay(day.label)} className={`grid aspect-square place-items-center rounded border p-2 ${day.label === String(new Date().getDate()) ? "border-gold bg-gold/10" : "border-gold/12 bg-obsidian/45"} ${selectedDay === day.label ? "ring-1 ring-gold" : ""}`}><span className="font-mono text-xs text-soft-sand">{day.label}</span></button>)}</div>{selectedDay ? <div className="mt-4 rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">Selected day {selectedDay}. Daily entry loading is LIVE_PENDING until the Obsidian bridge is connected.</div> : null}</ChamberPanel>
        </div>
        <GuidedCreationModal
          open={guidedIntentionOpen}
          title="Create Today's Intention"
          context={{ preferredType: "daily_intention", guardianSlug: "khonsu", source: "Daily Ledger" }}
          onClose={() => setGuidedIntentionOpen(false)}
        />
      </PageFrame>
    </AppShell>
  );
}

function ListEditor({ items, input, setInput, onAdd, onDelete, placeholder, empty }: { items: TextItem[]; input: string; setInput: (value: string) => void; onAdd: () => void; onDelete: (id: string) => void; placeholder: string; empty: string }) {
  return (
    <div className="mt-5 grid gap-3">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAdd()} placeholder={placeholder} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory" />
        <button type="button" onClick={onAdd} className="rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">Save</button>
      </div>
      {items.length === 0 ? <EmptyState title={empty} message="LocalStorage is ready for your first entry." /> : items.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3"><span className="text-sm text-soft-sand">{item.text}</span><button onClick={() => onDelete(item.id)} className="text-burnt-bronze hover:text-gold"><Trash2 className="h-4 w-4" /></button></div>)}
    </div>
  );
}
