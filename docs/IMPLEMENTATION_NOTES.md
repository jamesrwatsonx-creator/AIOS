# Implementation Notes

## Purpose
Document Run 1 implementation decisions for the James AI Operator Dashboard shell.

## Source of truth
Application source: `/mnt/c/Users/a1guy/Documents/AppBuilds/James-AI-Operator-Dashboard`.

## Current status
Run 1 builds a structured frontend shell only. No backend, auth, or database is included.

## Owner/agent
Owner: James. Implementation agent: Codex.

## Key sections
- Stack: Next.js, React, TypeScript, Tailwind CSS, Framer Motion dependency installed for later subtle motion.
- Layout: `AppShell`, `Sidebar`, `TopStatusBar`, and `PageFrame`.
- UI primitives: `ChamberPanel`, `MetricCard`, `StatusPill`, `IconButton`, `ProgressMeter`, `SectionTitle`, and `GlowDivider`.
- Data: all guardian, navigation, path, chamber, project category, and telemetry placeholder values live in `/lib`.
- Visual canon: reference images are preserved under `reference/` and mirrored under `public/reference/` for image-slot serving.

## Open questions
- Should the first live reader normalize markdown into JSON files or serve data directly through API routes?
- Should guardian portraits remain visible in profile slots or become selectable display modes?

## Next actions
- Implement read-only local API routes for operator data.
- Add graph component for Memory Nexus after schema is defined.
- Add Playwright visual checks after pages receive live data.

## Verification checklist
- [x] No backend, auth, or database added.
- [x] Routes and components are modular.
- [x] Placeholders are centralized.
- [x] Reference images are not used as fullscreen backgrounds.

## Last updated
2026-05-18 by Codex.
