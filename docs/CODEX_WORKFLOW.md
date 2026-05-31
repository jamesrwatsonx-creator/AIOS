# Codex Workflow

Codex is the engineering work log for AIOS. It should make AI-assisted code changes understandable after the fact.

## Purpose

The Codex section should answer:

- What is Codex working on now?
- What did Codex complete?
- What files changed?
- What commands ran?
- What errors were fixed?
- What commits were created?
- What tests or browser checks ran?
- Which project, Obsidian notes, entities, and activity events are linked?

## Current Surface

- /codex renders the Codex Chamber.
- Codex concepts are supported in the entity store with codex_task and code_change entity types.
- Obsidian category support includes Codex targets.
- Related project cards can display Codex work logs as the data model fills in.

## Desired Logging Model

Meaningful Codex work should create or update:

- Entity type: codex_task.
- Entity type: code_change.
- Activity event.
- Obsidian log entry.
- Related project link when applicable.

## Obsidian Folder

Codex notes should live in 05-Codex.

Recommended files:

- Codex-Activity.md
- Codex-Build-Logs.md
- Codex-Decisions.md
- Codex-Errors-Fixed.md

## Operator Workflow

1. Start from a project or Command Center request.
2. Codex performs scoped work.
3. Record changed files, commands, validation, decisions, and unresolved issues.
4. Link the work to project, entity, activity, and Obsidian context.
5. Commit with a clear message.

## Safety

- Never log raw secrets.
- Do not claim tests passed unless they were run.
- Do not overwrite user changes silently.
- Preserve existing systems unless the change is explicitly scoped.
