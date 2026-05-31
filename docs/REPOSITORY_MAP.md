# Repository Map

## Root

- README.md: platform overview and quick start.
- ROADMAP.md: short GitHub-facing roadmap.
- CONTRIBUTING.md: contribution workflow and standards.
- LICENSE: MIT license.
- package.json: scripts and dependencies.
- .env.example: safe example environment file.
- .gitignore: excludes local secrets, dependencies, build output, virtualenvs, and runtime artifacts.

## app

Next.js App Router pages and API routes.

Primary pages: /, /hermes, /projects, /browser, /memory, /agents, /codex, /automations, /content, /gohighlevel, /activity, and /settings.

Compatibility and advanced pages: /guardians, /maat, /chronicles, /skills, /models, /connectors, /vault, and /observatory.

API routes: Hermes chat and config, Browser sessions, Memory Nexus, and Obsidian writes.

## components

- layout: shell, sidebar, top status.
- operator: Home and operator scaffolding.
- hermes: Command Center, voice orb, response panels, morning brief.
- browser: Browser Operations UI and mission history.
- memory: Memory surface and graph placeholder.
- guardians: agent cards, grid, profiles, Horus scanner.
- projects: Projects execution hub.
- codex: Codex Chamber.
- content: Content Studio.
- gohighlevel: GoHighLevel surface.
- activity: Activity timeline and feed.
- entities: entity inspector.
- capture: quick capture.
- notifications: notification UI.
- ui: shared primitives.

## lib

- navigation.ts: primary navigation.
- guardians.ts: guardian and agent source of truth.
- hermesCommands.ts: command routing.
- entityStore.ts: entities and activity events.
- entityGraph.ts and memoryGraph.ts: graph structures.
- memoryNexusEngine.ts: Memory Nexus logic.
- obsidianClient.ts: Obsidian write helper.
- browser/*: Browser Operations types, manager, and router.
- systemPersistence.ts: project and local persistence helpers.
- n8nClient.ts: n8n integration boundary.
- searchIndex.ts: global search index.

## docs

Product and engineering documentation: architecture, installation, user guide, repository map, vision, roadmap, Codex workflow, browser operations, Obsidian memory, screenshots, and release plan.

## scripts

Local helper scripts, currently including the Hermes voice server.

## public

Static assets used by the app.
