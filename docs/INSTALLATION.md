# Installation Guide

This guide installs AIOS as a local-first dashboard.

## Requirements

- Node.js compatible with Next.js 15.
- npm.
- A modern browser.
- Optional Python environment for Hermes voice.
- Optional n8n runtime.
- Optional local Obsidian vault.

## Clone

```bash
git clone https://github.com/jamesrwatsonx-creator/AIOS.git
cd AIOS
```

## Install

```bash
npm install
```

## Environment

Create a local env file only if needed:

```bash
cp .env.example .env.local
```

Do not commit `.env.local` or real keys.

## Run

```bash
npm run dev
```

Open `http://localhost:3003`.

## Validate

```bash
npx tsc --noEmit --pretty false
```

## Optional Voice Layer

```bash
npm run voice
```

The voice script expects the local Python environment referenced in `package.json`. If the environment does not exist, treat voice as pending on that machine.

## Optional n8n

```bash
npm run workflows
```

n8n status must be verified locally before relying on automations.

## Obsidian

Configure a local vault path through local settings or environment support in the current checkout. Use dashboard actions that write memory or activity notes, then confirm notes appear in the target folder. Existing notes should not be deleted by AIOS.

## Troubleshooting

- If port 3003 is occupied, stop the process or run Next.js on another port manually.
- If TypeScript fails, fix the first reported source error before continuing.
- If browser operations fail, verify Playwright dependencies and local browser availability.
- If GitHub push fails over HTTPS, authenticate Git or use an SSH remote.
