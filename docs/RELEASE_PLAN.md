# GitHub Release Plan

This document defines a practical release path for AIOS.

## Release Goals

- Make the repository understandable to a first-time visitor.
- Keep local-first setup reliable.
- Preserve core systems.
- Mark future integrations honestly.
- Provide clear screenshots and validation results.

## v0.1.0: Professional Local Dashboard

Recommended release contents:

- Simplified operator navigation.
- Professional README and docs set.
- Home, Command Center, Projects, Browser, Memory, Agents, Codex, Automations, Content Studio, GoHighLevel, Activity, and Settings surfaces.
- Preserved Browser Operations, Memory Nexus, Entity Graph, Obsidian integration, Guardians, Projects, Activity, and voice script.
- Validation: TypeScript check and route smoke test.

## Pre-Release Checklist

- npm install completes.
- npx tsc --noEmit --pretty false passes.
- npm run dev boots on port 3003 or a documented alternate port.
- Primary routes return 200.
- Legacy redirects work.
- /api/hermes/config does not expose secrets.
- README screenshots are either verified or explicitly marked pending.
- No real env files are committed.

## Release Notes Template

AIOS v0.1.0 establishes a professional local-first AI operating system dashboard with simplified navigation, Hermes Command Center, Horus Browser Operations, Memory Nexus, Agents, Codex Chamber, Content Studio, GoHighLevel planning, Automations, and professional documentation.

Known future work: live browser streaming, GoHighLevel API integration, YouTube publishing API, VPS deployment, and safe autonomous operation.

## Tagging

Use semantic versioning when the repository is ready for public release:

- git tag v0.1.0
- git push origin v0.1.0
