# Stabilization Functional Audit

## Layer System

Centralized z-index layers now live in `app/globals.css`.

| Layer | CSS variable | Intended use |
| --- | --- | --- |
| Background | `--z-background` | page background |
| Chamber | `--z-chamber` | standard panels and surfaces |
| Sticky nav | `--z-sticky-nav` | sidebar and top status bar |
| Floating | `--z-floating` | floating action buttons |
| Dropdown | `--z-dropdown` | notification and operator menus |
| Overlay | `--z-overlay` | full-screen backdrop layers |
| Modal | `--z-modal` | modal content |
| Toast | `--z-toast` | future toast/status layer |

## Persistence Map

| Area | UI cache | Obsidian write | Status |
| --- | --- | --- | --- |
| Quick Capture | `hermes_captures` | `00-Hermes-Memory/Captures.md` | FUNCTIONAL |
| Guardian task queues | `hermes_guardian_${slug}_tasks` | `04-Agents/Guardian-Activity.md` | FUNCTIONAL |
| Hermes command history | `hermes_command_history` | `00-Hermes-Memory/Hermes-Conversations.md` | FUNCTIONAL |
| Morning intention | `hermes_${date}_intention` | `01-Daily-Logs/${date}.md` | FUNCTIONAL |
| Daily reflection fields | `hermes_${date}_${field}` | `01-Daily-Logs/${date}.md` | FUNCTIONAL |
| Daily timeline notes | `hermes_${date}_timeline_${stage}` | `01-Daily-Logs/${date}.md` | FUNCTIONAL |
| Daily mood | `hermes_${date}_mood` | `01-Daily-Logs/${date}.md` | FUNCTIONAL |
| Daily list entries | `hermes_${date}_entries` and related list keys | `01-Daily-Logs/${date}.md` | FUNCTIONAL |
| Projects | `hermes_projects` | `02-Projects/Dashboard-Project-State.md` | FUNCTIONAL |
| Project milestones | `hermes_project_milestones` | `02-Projects/Dashboard-Project-State.md` | FUNCTIONAL |
| Horus signals | `hermes_signals` | `04-Agents/Guardian-Activity.md` | FUNCTIONAL |
| Maat workflow trigger attempts | n8n runtime state | `09-Systems/Maat-Automation-Log.md` | PARTIAL |
| Profile, appearance, voice settings | localStorage settings keys | `09-Systems/Dashboard-Settings-Log.md` | PARTIAL |
| API keys | localStorage or `.env.local` | never written | INTENTIONAL |

All Obsidian writes pass through `app/api/obsidian/write/route.ts`, which writes only to fixed vault targets and redacts secret-shaped values.

## Chamber Interaction Classification

| Chamber | Classification | Notes |
| --- | --- | --- |
| Home | PARTIAL | Agenda and panels use local state; several telemetry values remain live-pending/demo |
| Memory | FUNCTIONAL | Nexus computes graph/metrics from Obsidian, AppBuilds, dashboard files, and localStorage |
| Projects | FUNCTIONAL | Project and milestone saves persist to localStorage and Obsidian |
| Chronicles | FUNCTIONAL | Ledger fields, mood, timeline, and lists persist to localStorage and Obsidian |
| Guardians | PARTIAL | Tasks persist; telemetry/capability metrics remain demo/live-pending |
| Hermes | PARTIAL | Commands and OpenRouter route exist; voice depends on external local server |
| Maat | PARTIAL | n8n client exists; actual workflows require n8n runtime and API key |
| Skills | PARTIAL | Custom skills persist locally; external skill runtime is not connected |
| Models | UI ONLY | Model routing display is not a live model manager |
| Connectors | UI ONLY | Connector map is not live-connected |
| Activity | PARTIAL | Notification/activity state exists; no full system event bus yet |
| Vault | UI ONLY | Vault browser is not a live filesystem explorer |
| Observatory | UI ONLY | System report panels are not live telemetry |
| Settings | PARTIAL | Local preferences persist; API key saves stay local only |

## Cleanup Candidates

Do not delete automatically.

- `public/reference` and `reference` appear duplicated.
- Nested Obsidian vault candidate exists under `Hermes-Memory-Vault/Hermes-Memory-Vault`.
- `scripts/.voice-venv` appears older than active `scripts/.voice-venv311`.
- Extra AppBuild folders exist outside this dashboard and may be intentional.

## Security Fixes Applied

- `app/api/hermes/config/route.ts` no longer returns the OpenRouter env value. It now returns only whether OpenRouter is configured.
- Obsidian write route redacts secret-shaped values before writing markdown.

## Remaining Verification Gaps

- Production build remains unverified because a prior `npm run build` hung in sandbox.
- Voice server runtime is not verified unless `npm run voice` is started and port `8881` responds.
- n8n runtime is not verified unless `npm run workflows` is started and port `5678` responds.
- Browser visual overlap/responsive checks require Playwright or manual browser screenshots.
