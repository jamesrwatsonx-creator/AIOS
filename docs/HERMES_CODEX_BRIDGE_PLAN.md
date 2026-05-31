# Hermes Codex Bridge Plan

## Purpose
Plan dashboard integration with Hermes and Codex bridge files without modifying agent configs.

## Source of truth
Hermes Codex bridge: `/home/james/.hermes/bridges/codex`. Hermes Obsidian bridge: `/home/james/.hermes/memory/obsidian`.

## Current status
Run 1 includes bridge path metadata only. No bridge reader or writer is active.

## Owner/agent
Owner: James. Agents: Hermes and Codex.

## Key sections
- Read-only first: bridge files should be scanned only after schema and redaction rules are defined.
- Dashboard views: Activity, Memory Nexus, Guardians, and Observatory.
- Data candidates: run summaries, task outcomes, build events, memory sync notes, and unresolved questions.
- Safety: do not modify Hermes config, Codex config, Telegram settings, Twilio settings, or credentials.

## Open questions
- Which bridge files are stable enough to index?
- Should bridge events be normalized into `_AI_OPERATOR_DATA` before dashboard display?

## Next actions
- Inspect bridge file formats in a dedicated integration phase.
- Add sanitized bridge reader.
- Link bridge events to Activity Feed.

## Verification checklist
- [x] No bridge files modified in Run 1.
- [x] No agent config modified.
- [x] Telegram, Twilio, and Codex config remain out of scope.

## Last updated
2026-05-18 by Codex.
