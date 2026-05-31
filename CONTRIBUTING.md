# Contributing To AIOS

AIOS is an operator dashboard with several preserved core systems. Contributions should improve clarity, reliability, or capability without removing working local behavior.

## Preserve Core Systems

Do not delete or break:

- Hermes.
- Browser Operations.
- Memory Nexus.
- Entity Graph.
- Obsidian integration.
- Telegram integration concepts and runtime awareness.
- Guardians and Agents.
- Activity.
- Projects.
- Existing integrations.

## Development Workflow

1. Create a focused branch.
2. Keep changes scoped.
3. Prefer refactoring over duplicate V2, New, Final, or Backup component chains.
4. Run validation before committing.
5. Document user-facing changes.

## Setup

Run npm install, then npm run dev, and open http://localhost:3003.

## Validation

Run npx tsc --noEmit --pretty false.

When changing routes or layout, also run the dashboard and smoke-test affected pages.

## Documentation Standards

- Use plain English labels.
- Mark pending integrations as pending.
- Do not claim production readiness unless verified.
- Add screenshots only after visual verification.
- Keep README and docs aligned with actual behavior.

## Security Standards

- Never commit secrets.
- Never expose raw environment values in API responses.
- Keep .env.local local.
- Redact logs before saving to Obsidian or docs.

## Pull Request Checklist

- Scope is clear.
- Core systems are preserved.
- TypeScript passes.
- Affected routes were smoke-tested.
- Documentation updated if behavior changed.
- No secrets or private local data included.
