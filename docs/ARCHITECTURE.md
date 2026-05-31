# AIOS Architecture

AIOS is a local-first AI operating system dashboard built with Next.js App Router, React, TypeScript, Tailwind CSS, local browser persistence, local API routes, and optional local services.

## Principles

- Local first: useful without a hosted database or cloud account.
- Operator centered: every page should explain purpose, actions, recent activity, and next step.
- Preserve systems: Hermes, Browser Operations, Memory Nexus, Entity Graph, Obsidian, Telegram concepts, Guardians, Activity, Projects, and integrations remain intact.
- Truthful status: future systems are marked future or pending until verified.
- Plain language surface: guardian identity remains internally while the UI uses Agents, Browser, Memory, Projects, and Automations.

## App Shell

- `app/layout.tsx` mounts the global app frame.
- `components/layout/AppShell.tsx` provides sidebar, top status, search, quick capture, notifications, morning brief, and entity inspector.
- `lib/navigation.ts` defines the primary operator navigation.

## Routes

Primary routes: `/`, `/hermes`, `/projects`, `/browser`, `/memory`, `/agents`, `/codex`, `/automations`, `/content`, `/gohighlevel`, `/activity`, and `/settings`.

Compatibility and advanced routes remain available where useful: `/chronicles`, `/skills`, `/models`, `/connectors`, `/vault`, and `/observatory`. Duplicate guardian routes redirect to Agents. Maat redirects to Automations.

## Persistence

- `lib/localStorageKeys.ts`: localStorage keys and daily keys.
- `lib/systemPersistence.ts`: project and local system records.
- `lib/entityStore.ts`: unified entities and activity events.
- `lib/captureStore.ts`: quick capture records.
- `lib/dailyLedger.ts`: daily planning and ledger concepts.

A durable database can be added later without removing local-first mode.

## Entity Graph

Important work should become an entity: project, task, milestone, browser session, Codex task, code change, content idea, YouTube script, GoHighLevel project, automation, memory, conversation, and system event.

Entities should support status, owner or agent, source, relationships, activity history, Obsidian target, and timestamps.

## Memory Nexus And Obsidian

Memory Nexus is the underlying model for memory, recall, and relationships. The Memory page presents it with summaries, recent memory updates, browser missions, Codex logs, project notes, conversations, search, and a relationship map.

`lib/obsidianClient.ts` provides client helpers. `app/api/obsidian/write/route.ts` appends redacted markdown to a local vault. Existing notes are not deleted or rewritten by the dashboard.

## Browser Operations

Browser Operations are implemented through `components/browser/*`, `lib/browser/*`, and `app/api/browser/session/route.ts`.

Current mode is step screenshot replay. Live streaming is future work.

## Hermes

Hermes lives in `components/hermes/*`, `lib/hermesCommands.ts`, `lib/hermesPersonality.ts`, and `app/api/hermes/*`. The config endpoint returns status only and must not return secret values.

## Guardians And Agents

`lib/guardians.ts` remains the guardian source of truth. `/agents` and `/agents/[slug]` are the operator routes. `/guardians` and `/guardians/[slug]` redirect for compatibility.

## Optional Services

- Voice: `scripts/hermes-voice-server.py`, started with `npm run voice` when the local Python environment exists.
- n8n: `npm run workflows`, runtime must be verified locally.
- Telegram: integration concepts and runtime awareness are preserved.

## Future VPS Architecture

A future VPS deployment should include process supervision, secure environment variables, authentication, persistent storage, optional n8n, isolated browser workers, backups for memory and notes, monitoring, and failure alerts. This repository documents that direction but does not claim verified production deployment.
