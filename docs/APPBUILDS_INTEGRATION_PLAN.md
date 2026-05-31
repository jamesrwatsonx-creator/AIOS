# AppBuilds Integration Plan

## Purpose
Plan read-only integration with the AppBuilds project filesystem.

## Source of truth
AppBuilds root: `/mnt/c/Users/a1guy/Documents/AppBuilds`. Operator registry: `/mnt/c/Users/a1guy/Documents/AppBuilds/_AI_OPERATOR_DATA/PROJECT_REGISTRY.md`.

## Current status
Run 1 displays shell routes only. No filesystem reader is active yet.

## Owner/agent
Owner: James. Implementation agent: Codex.

## Key sections
- Scan targets: project folders, category folders, `_AI_OPERATOR_DATA`, and `_TEMPLATES`.
- Ignore targets: `node_modules`, `.git`, `dist`, build caches, secrets, and generated binary artifacts.
- Dashboard outputs: project count, stack summary, missing operational files, task counts, build log activity, QA status.

## Open questions
- Should existing root-level projects be moved into category folders or indexed in place?
- Should generated indexes live inside the dashboard app or `_AI_OPERATOR_DATA/system`?

## Next actions
- Build safe read-only scanner.
- Normalize project metadata into dashboard-safe JSON.
- Add project detail route after registry schema is stable.

## Verification checklist
- [x] Existing projects are not modified by Run 1.
- [x] Integration is planned as read-only first.
- [x] Secret-bearing paths are excluded.

## Last updated
2026-05-18 by Codex.
