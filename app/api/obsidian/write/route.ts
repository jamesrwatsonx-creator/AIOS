import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const vaultRoot = "/mnt/c/Users/a1guy/Documents/Obsidian/Hermes-Memory-Vault";

const categoryTargets = {
  activity: "00-Hermes-Memory/Dashboard-Activity.md",
  automation: "09-Systems/Maat-Automation-Log.md",
  capture: "00-Hermes-Memory/Captures.md",
  guardian: "04-Agents/Guardian-Activity.md",
  hermes: "00-Hermes-Memory/Hermes-Conversations.md",
  memory: "00-Hermes-Memory/Memory-Nexus-State.md",
  project: "02-Projects/Dashboard-Project-State.md",
  chronicle: `01-Daily-Logs/${new Date().toISOString().slice(0, 10)}.md`,
  settings: "09-Systems/Dashboard-Settings-Log.md",
  browser: "03-Browser-Missions/Horus-Browser-Sessions.md",
  codex: "05-Codex/Codex-Activity.md",
  content: "06-Content-Studio/Topic-Research.md",
  gohighlevel: "07-GoHighLevel/GoHighLevel-Activity.md"
} as const;

type ObsidianCategory = keyof typeof categoryTargets;

const secretPatterns = [
  /sk-[A-Za-z0-9_-]{12,}/g,
  /sk-or-[A-Za-z0-9_-]{12,}/g,
  /xox[baprs]-[A-Za-z0-9-]{12,}/g,
  /gh[pousr]_[A-Za-z0-9_]{12,}/g,
  /github_pat_[A-Za-z0-9_]{12,}/g,
  /\b\d{6,}:[A-Za-z0-9_-]{20,}\b/g,
  /\b[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_.-]{24,}\b/g
];

function redact(value: unknown): string {
  let text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  for (const pattern of secretPatterns) {
    text = text.replace(pattern, "[REDACTED - STORED LOCALLY]");
  }
  return text;
}

function isCategory(value: unknown): value is ObsidianCategory {
  return typeof value === "string" && value in categoryTargets;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      category?: unknown;
      title?: unknown;
      body?: unknown;
      metadata?: unknown;
    };

    if (!isCategory(body.category)) {
      return NextResponse.json({ error: "Invalid Obsidian category" }, { status: 400 });
    }

    const target = path.resolve(vaultRoot, categoryTargets[body.category]);
    if (!target.startsWith(path.resolve(vaultRoot))) {
      return NextResponse.json({ error: "Invalid Obsidian path" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const title = redact(body.title || "Dashboard Event").replace(/\n+/g, " ").slice(0, 160);
    const content = redact(body.body || "");
    const metadata = body.metadata ? `\nMetadata:\n\`\`\`json\n${redact(body.metadata)}\n\`\`\`\n` : "";
    const entry = `\n## ${timestamp} - ${title}\n\n${content || "_No body provided._"}\n${metadata}`;

    await mkdir(path.dirname(target), { recursive: true });
    await appendFile(target, entry, "utf8");

    return NextResponse.json({ ok: true, file: target.replace(vaultRoot, "") });
  } catch {
    return NextResponse.json({ error: "Obsidian write failed" }, { status: 500 });
  }
}
