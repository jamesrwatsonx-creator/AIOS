# Telemetry Plan

## Purpose
Define how placeholder dashboard telemetry should become live local telemetry.

## Source of truth
Placeholder source: `/lib/mockTelemetry.ts`. Future live source: local filesystem readers and sanitized API routes.

## Current status
All Run 1 metrics start at `0` with `LIVE_PENDING` unless explicitly marked `DEMO`.

## Owner/agent
Owner: James. Implementation agent: Codex.

## Key sections
- System vitals: intelligence, memory, agents, projects, and system health.
- Telemetry strip: builds, tasks, reports, memory links, and model routes.
- Guardian profiles: capabilities, active domain stats, tasks, sacred tools, and associated systems.
- Activity feed: demo signal placeholders until logs are parsed.

## Open questions
- Should live telemetry be refreshed on demand, on interval, or through a file watcher?
- Which metrics should be considered operationally meaningful rather than decorative?

## Next actions
- Create `/app/api/*` read-only routes for sanitized local data.
- Parse `_AI_OPERATOR_DATA/PROJECT_REGISTRY.md`, `MASTER_BUILD_LOG.md`, `MASTER_TASKS.md`, and `MODEL_ROUTING.md`.
- Parse project `BUILD_LOG.md`, `TASKS.md`, and `QA_REPORT.md` files.

## Verification checklist
- [x] Fake numbers are not scattered through components.
- [x] Zero-state values are marked `LIVE_PENDING`.
- [x] Real connection points have TODO comments.

## Last updated
2026-05-18 by Codex.
