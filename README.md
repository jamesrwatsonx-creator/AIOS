# AIOS

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Local First](https://img.shields.io/badge/Local--First-Operator%20OS-d4a64a)](#local-first-philosophy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

AIOS is a local-first AI operating system dashboard for managing projects, memory, browser automation, agent workflows, Codex work, content planning, and future business automation from one operator console.

The product direction is simple: a professional AI operations environment that feels closer to Apple OS, Jarvis, Linear, Notion, and Claude Desktop than a developer prototype. The Egyptian-inspired identity remains underneath the product language, while the interface uses plain English labels.

## Operator Workflow

1. Start on Home and review the current briefing.
2. Ask Hermes in Command Center what to do next or where to route work.
3. Execute through Projects, Browser, Codex, Memory, Agents, Automations, Content Studio, or GoHighLevel.
4. Save important events into local activity, entity graph records, and Obsidian notes.
5. Review recent activity and continue from the next clear action.

## Core Features

- Home: daily briefing, focus items, active projects, blockers, browser missions, Codex work, memory updates, and system status.
- Command Center: Hermes interface for routing commands, questions, and operator decisions.
- Projects: execution hub for apps, research, client work, content, automations, and internal tools.
- Browser: Horus Browser Operations with screenshot replay, action logs, extracted results, and mission history.
- Memory: simplified surface over Memory Nexus, entity graph, Obsidian notes, browser sessions, projects, and conversations.
- Agents: guardian architecture presented as a practical agent team.
- Codex: work log for code tasks, changed files, commands, errors fixed, commits, tests, and linked project context.
- Automations: Maat and n8n planning surface for scheduled and recurring workflows.
- Content Studio: YouTube and content planning area for ideas, research, scripts, thumbnails, queues, and calendars.
- GoHighLevel: future local agency operating area for funnels, voice agents, missed-call systems, workflows, and audits.
- Activity: unified local event timeline.

## Main Navigation

Home, Command Center, Projects, Browser, Memory, Agents, Codex, Automations, Content Studio, GoHighLevel, Activity, Settings.

Legacy and advanced routes such as Chronicles, Skills, Models, Connectors, Vault, and Observatory remain accessible by URL where they preserve useful functionality, but they are not part of the primary operator navigation.

## Hermes

Hermes is the command center and daily operator. Hermes accepts plain English requests such as Build a mobile app, Research local businesses, Create a GoHighLevel project, Start a YouTube video idea, Check what Codex did, Open Browser, Show blockers, and What should I work on next.

Hermes routing is implemented locally through dashboard commands and UI state. Full autonomous routing remains a future milestone.

## Horus Browser Operations

Browser Operations are preserved under the simpler Browser label. The current verified mode is step screenshot replay, not live streaming. Browser missions preserve URL, command intent, action log, extracted results, screenshots, status, and project or task context where available.

Live browser streaming is a future capability and is not faked in the UI.

## Codex Chamber

Codex Chamber tracks AI-assisted engineering work across the system: current task, completed tasks, changed files, commands, errors fixed, commits, browser tests, build results, screenshots when available, linked project, linked Obsidian notes, and linked activity or entity records.

## Memory Nexus And Obsidian

Memory is the plain-English surface. Memory Nexus remains the underlying concept for graph-backed memory, entity relationships, and recall. Obsidian integration appends markdown notes to a local vault through a local API route and redacts common secret patterns before writing.

## Local-First Philosophy

AIOS is designed to run locally first. It should be useful without a production database, cloud account, or external queue. The dashboard uses local browser state, local API routes, local filesystem integrations, and optional local services.

## Installation

See [docs/INSTALLATION.md](docs/INSTALLATION.md).

```bash
npm install
npm run dev
```

Open `http://localhost:3003`.

Optional local services:

```bash
npm run voice
npm run workflows
```

## Screenshots

Screenshot slots are documented in [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md). Images should be added after visual verification so the README reflects the actual dashboard.

| Area | Screenshot |
| --- | --- |
| Home | Pending verified screenshot |
| Command Center | Pending verified screenshot |
| Browser | Pending verified screenshot |
| Memory | Pending verified screenshot |
| Codex | Pending verified screenshot |

## Current Status

AIOS is an active local-first dashboard. Core UI, route structure, local persistence, Browser Operations, Memory Nexus concepts, Entity Graph, Obsidian writes, Guardians and Agents, Projects, Activity, and Codex, Content, and GoHighLevel planning surfaces are present.

Future or pending until verified: live browser streaming, GoHighLevel API connection, YouTube publishing API, cloud or VPS 24/7 runtime, fully autonomous background operation, and n8n runtime status in this checkout.

## Future VPS Deployment

The target VPS architecture is a persistent AIOS runtime with process supervision, secure environment variables, optional n8n, browser worker capacity, Obsidian or synced knowledge storage, and remote dashboard access behind authentication. This repository does not currently claim a production VPS deployment.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Installation](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [Repository Map](docs/REPOSITORY_MAP.md)
- [Vision](docs/VISION.md)
- [Roadmap](docs/ROADMAP.md)
- [Codex Workflow](docs/CODEX_WORKFLOW.md)
- [Browser Operations](docs/BROWSER_OPERATIONS.md)
- [Obsidian Memory](docs/OBSIDIAN_MEMORY.md)
- [Screenshots](docs/SCREENSHOTS.md)
- [Release Plan](docs/RELEASE_PLAN.md)
- [Contributing](CONTRIBUTING.md)

## Safety Notes

- Do not commit real API keys or secrets.
- Keep env files local.
- `/api/hermes/config` returns configuration status only, not secret values.
- Obsidian writes redact common secret patterns.
- External integrations should fail closed when credentials are missing.
- Do not claim future integrations are live until they are verified.

## License

MIT. See [LICENSE](LICENSE).
