import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const obsidianRoot = "/mnt/c/Users/a1guy/Documents/Obsidian/Hermes-Memory-Vault";
const appBuildsRoot = "/mnt/c/Users/a1guy/Documents/AppBuilds";
const dashboardRoot = "/mnt/c/Users/a1guy/Documents/AppBuilds/James-AI-Operator-Dashboard";

type ScanItem = {
  path: string;
  name: string;
  kind: "file" | "directory";
  modifiedAt: string;
};

const ignoredDirs = new Set(["node_modules", ".next", ".git", ".agents", ".codex", "dist", "build"]);

async function scan(root: string, maxDepth: number, current = root, depth = 0): Promise<ScanItem[]> {
  if (depth > maxDepth) return [];
  let entries;
  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch {
    return [];
  }

  const items: ScanItem[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".env.local") continue;
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(current, entry.name);
    const info = await stat(fullPath).catch(() => null);
    if (!info) continue;

    items.push({
      path: path.relative(root, fullPath),
      name: entry.name,
      kind: entry.isDirectory() ? "directory" : "file",
      modifiedAt: info.mtime.toISOString()
    });

    if (entry.isDirectory()) {
      items.push(...await scan(root, maxDepth, fullPath, depth + 1));
    }
  }

  return items;
}

export async function GET() {
  const [obsidianItems, appBuildItems, dashboardItems] = await Promise.all([
    scan(obsidianRoot, 3),
    scan(appBuildsRoot, 1),
    scan(dashboardRoot, 2)
  ]);

  return NextResponse.json({
    scannedAt: new Date().toISOString(),
    sources: {
      obsidian: {
        root: obsidianRoot,
        markdownFiles: obsidianItems.filter((item) => item.kind === "file" && item.name.endsWith(".md")),
        folders: obsidianItems.filter((item) => item.kind === "directory")
      },
      appBuilds: {
        root: appBuildsRoot,
        folders: appBuildItems.filter((item) => item.kind === "directory")
      },
      dashboard: {
        root: dashboardRoot,
        files: dashboardItems.filter((item) => item.kind === "file")
      }
    }
  });
}
