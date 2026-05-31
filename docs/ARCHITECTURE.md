# Architecture

AIOS is a Next.js App Router dashboard with local-first persistence.

## Main Layers

- UI: app routes and reusable chamber panels.
- Navigation: lib/navigation.ts defines the simplified operator navigation.
- Local state: lib/localStorageKeys.ts plus domain persistence helpers.
- Entity graph: lib/entityStore.ts normalizes projects, tasks, milestones, memories, browser sessions, Codex tasks, code changes, content ideas, GoHighLevel projects, automations, conversations, and system events.
- Obsidian: app/api/obsidian/write/route.ts appends redacted markdown entries to the local vault.
- Browser: components/browser and lib/browser preserve the Playwright screenshot replay workflow.
- Memory: Memory Nexus logic remains underneath the simplified Memory route.
- Agents: guardian metadata remains in lib/guardians.ts and is surfaced as Agents.

## Runtime Truth

Live browser streaming, cloud 24/7 operations, YouTube upload automation, and GoHighLevel API integration are not claimed as complete.
