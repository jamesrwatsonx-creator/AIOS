# Contributing

AIOS is local-first. Contributions should preserve existing working systems and avoid pretending future integrations are complete.

## Rules

- Preserve Hermes, Browser Operations, Memory, Obsidian persistence, entity graph, Projects, Agents, Activity, voice, and Codex workflow concepts.
- Prefer refactoring over duplicate routes or parallel systems.
- Use plain English labels in user-facing UI.
- Mark unverified runtime features as pending or future.
- Do not commit secrets, .env files, Obsidian private notes, generated browser screenshots with sensitive content, or local machine credentials.

## Validation

Run:

```bash
npx tsc --noEmit --pretty false
```

For UI work, boot the dashboard and verify the main routes load.
