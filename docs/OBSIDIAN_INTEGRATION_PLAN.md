# Obsidian Integration Plan

## Purpose
Plan read-only integration with the Hermes Memory Vault for the Memory Nexus.

## Source of truth
Obsidian vault: `/mnt/c/Users/a1guy/Documents/Obsidian/Hermes-Memory-Vault`.

## Current status
Run 1 includes Memory Nexus shell only. No Obsidian parser is active.

## Owner/agent
Owner: James. Memory agent: Hermes. Implementation agent: Codex.

## Key sections
- Input formats: markdown files, wikilinks, headings, task checkboxes, and filesystem references.
- Graph nodes: notes, projects, agents, models, tasks, reports, and connectors.
- Graph edges: references, owns, depends on, updates, routes to, reports on.
- Safety: do not index secrets, tokens, or private credentials into browser-visible data.

## Open questions
- Should graph extraction infer edges from wikilinks only or also from path references?
- Should Hermes summaries be displayed separately from raw Obsidian notes?

## Next actions
- Create markdown parser utility.
- Add redaction pass before API response.
- Feed Memory Nexus graph with sanitized nodes and edges.

## Verification checklist
- [x] Obsidian integration is read-only in Run 1.
- [x] Memory graph data remains pending.
- [x] No secrets are copied into docs.

## Last updated
2026-05-18 by Codex.
