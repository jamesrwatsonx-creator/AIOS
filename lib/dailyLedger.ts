export const ledgerOverviewMetrics = [
  "Days Logged",
  "Entries Written",
  "Reflections",
  "Memories Captured",
  "Gratitudes Recorded",
  "Insights Gained",
  "Streak",
  "Consistency"
].map((label) => ({ label, value: 0, suffix: label === "Streak" ? " days" : label === "Consistency" ? "%" : "", state: "LIVE_PENDING" as const }));

export const continuityHealth = [
  { label: "STRONG", value: 0 },
  { label: "STABLE", value: 0 },
  { label: "FRAGILE", value: 0 },
  { label: "AT RISK", value: 0 }
];

export const reflectionPrompts = [
  "What did I build?",
  "What did I learn?",
  "Who did I help?",
  "What can I improve?",
  "What am I grateful for?"
];

export const dailyStages = ["DAWN", "FOCUS", "BUILD", "REFLECT", "EVENING"];

export const habits = [
  "Morning Intention",
  "Daily Planning",
  "Deep Work Session",
  "Build / Create",
  "Exercise / Movement",
  "Reflect & Journal",
  "Gratitude Practice",
  "Evening Review"
];

export const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export const moodLabels = ["JOY", "FOCUS", "CALM", "CHALLENGED", "FATIGUED", "STRESSED"];

export const recentLedgerEntries = [
  { time: "LIVE_PENDING", label: "Daily note scanner pending" },
  { time: "LIVE_PENDING", label: "Reflection parser pending" },
  { time: "LIVE_PENDING", label: "Memory highlight extraction pending" }
];

export const memoryHighlights = [
  { date: "LIVE_PENDING", label: "No live memory highlights connected" },
  { date: "LIVE_PENDING", label: "Obsidian daily note index required" }
];

export const gratitudeEntries = [
  "Placeholder gratitude entry",
  "Local-first journal connection pending",
  "Memory-safe save workflow pending"
];

export const entryStats = [
  { label: "Avg Words/Entry", value: "0" },
  { label: "Longest Streak", value: "0" },
  { label: "Most Active Day", value: "LIVE_PENDING" },
  { label: "Consistency Score", value: "0%" }
];

export const reflectionThemes = [
  { label: "Build", size: "text-2xl" },
  { label: "Memory", size: "text-xl" },
  { label: "Focus", size: "text-3xl" },
  { label: "Learning", size: "text-lg" },
  { label: "Gratitude", size: "text-2xl" },
  { label: "Continuity", size: "text-xl" }
];

export const moodTrend = [24, 38, 32, 46, 44, 58, 40, 62, 54, 70, 50, 74, 66, 82];

export const entriesPerWeek = [18, 30, 22, 42, 28, 50, 36];

export const calendarDays = Array.from({ length: 35 }, (_, index) => ({
  label: `${index + 1}`,
  state: index % 9 === 0 ? "COMPLETE" : index % 7 === 0 ? "PARTIAL" : index % 11 === 0 ? "MISSED" : "NO DATA"
}));
