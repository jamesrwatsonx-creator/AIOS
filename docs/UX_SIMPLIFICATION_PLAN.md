# UX Simplification Plan

## Current Navigation

Home Chamber, Memory Nexus, Projects Chamber, Daily Ledger, Guardians, Maat, Hermes, Browser Operations, Skills, Models, Connectors, Activity, Vault, Observatory, Settings.

## Proposed Primary Navigation

1. Home
2. Command Center
3. Projects
4. Browser
5. Memory
6. Agents
7. Codex
8. Automations
9. Content Studio
10. GoHighLevel
11. Activity
12. Settings

## Migration Plan

- Keep working systems intact: Hermes, Browser Operations, Entity Graph, Memory Nexus, Obsidian, Telegram awareness, Guardians, Projects, Activity, and voice support.
- Put operator workflows in the primary navigation and move advanced/debug pages out of the main sidebar.
- Keep guardian architecture in code, but label the surface as Agents for normal users.
- Preserve legacy URLs with redirects where the new route is a complete replacement.
- Keep unique advanced pages accessible by URL until their functionality is fully migrated.

## Duplicate Routes

- /guardians duplicates /agents and should redirect to /agents.
- /guardians/[slug] duplicates /agents/[slug] and should redirect to /agents/[slug].
- /maat is replaced by /automations and should redirect to /automations.

## Obsolete Or Hidden Files

- components/home/HomeChamber.tsx is replaced by components/operator/OperatorHome.tsx for the active home route. Keep it for now because it is harmless and may still be useful as reference until a later cleanup pass.
- components/maat/MaatChamber.tsx remains hidden behind the Automations replacement. Keep it because it contains old automation concepts not yet fully migrated into data-backed workflows.
- components/ledger/DailyLedgerChamber.tsx remains hidden at /chronicles because daily-log functionality is not fully replaced by Home focus yet.
- components/observatory/ObservatoryChamber.tsx remains hidden at /observatory because it has system telemetry content not fully merged into Settings.

## Pages To Merge Or Reframe

- Hermes becomes Command Center.
- Memory Nexus becomes Memory while keeping Memory Nexus logic underneath.
- Council of Guardians becomes Agents while preserving guardian identity.
- Maat becomes Automations.
- Browser Operations becomes Browser.
- Daily Ledger becomes Daily Plan content in Home first, with /chronicles hidden for the full ledger.
- Skills, Models, Connectors, Vault, and Observatory remain accessible by route but are removed from primary navigation until they are operator-ready.

## Pages To Hide From Primary Navigation

Skills, Models, Connectors, Vault, Observatory, and legacy Chronicles are advanced/debug surfaces for now.

## Pages To Rename

- Memory Nexus -> Memory
- Mission Registry -> Projects
- Council of Guardians -> Agents
- Activity Chamber -> Activity
- Browser Operations -> Browser
- Daily Ledger -> Daily Plan
- Maat -> Automations
- Horus -> Web Research
- Ptah -> Build Studio
- Thoth -> Research & Knowledge
- Anubis -> Review & Security
- Hermes -> Command Center

## Beginner-Friendly Wording

Every page should answer: what this page is for, what can be done here, what happened recently, and what to do next.

Use plain labels like Start Project, Review Browser Mission, Save to Memory, Check Codex Work, Open Blockers, and Suggested Next Action.
