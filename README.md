# AIOS

AIOS is a local-first AI operating system dashboard for managing projects, memory, browser automation, agents, Codex workflows, content planning, and future business automation.

The product direction is simple: make a professional operator dashboard that feels closer to Apple OS, Jarvis, Linear, Notion, and Claude Desktop than a developer prototype. The Egyptian-inspired identity remains, but the interface uses plain English labels and explains what each page does.

## Features

- Home briefing with focus items, active projects, blockers, recent browser missions, Codex work, memory updates, and system status.
- Command Center powered by Hermes for text and voice-assisted routing.
- Projects execution hub backed by local storage, entity graph records, activity events, and Obsidian writes.
- Browser missions with Playwright screenshot replay, action logs, extracted results, mission history, and Horus ownership.
- Memory page backed by Memory Nexus logic, Obsidian scanning, local state, and the entity relationship map.
- Agents page that keeps guardian identities while explaining each agent in operator language.
- Codex page for tracking tasks, code changes, commands, errors, commits, browser tests, and build results.
- Content Studio for YouTube/content research, scripts, thumbnails, calendars, and AI video planning.
- GoHighLevel planning area for future local agency operations.
- Automations page for Maat/n8n concepts, scheduled tasks, and future 24/7 operations.
- Activity timeline for local events across the system.

## Current Status

AIOS is an active local-first dashboard. It uses Next.js, React, localStorage, local API routes, Playwright tooling, and a local Obsidian vault. Some systems are intentionally marked pending or future when the runtime is not verified.

Current browser mode is step screenshot replay. Live browser streaming is future work and is not faked.

## Architecture

- Frontend: Next.js App Router and React components.
- State: browser localStorage for local dashboard state.
- Entity graph: unified entities and entity activity in local storage.
- Obsidian: local API route appends redacted notes into a configured vault.
- Browser: local browser session manager and API route for screenshots and extraction.
- Voice: optional local Hermes voice server.
- Automation: n8n settings are present; runtime must be verified locally.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the dashboard:

```bash
npm run dev
```

3. Open:

```
http://localhost:3003
```

4. Optional voice layer:

```bash
npm run voice
```

5. Optional n8n:

```bash
npm run workflows
```

## Screenshots

Screenshots should be added after the next visual verification pass.

## Safety Notes

- AIOS is local-first and does not require a production database.
- Do not commit real API keys or secrets.
- The Obsidian write route redacts common secret patterns before appending notes.
- /api/hermes/config returns only whether OpenRouter appears configured; it does not return the key.
- YouTube publishing, GoHighLevel API integration, cloud server, and live browser streaming remain pending or future unless explicitly implemented and verified.

## Roadmap

See [ROADMAP.md](ROADMAP.md).
