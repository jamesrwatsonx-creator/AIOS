# Memory Graph Plan

## Purpose
Define the Run 2 Memory Nucleus graph placeholder and the future upgrade path to a full 3D interactive memory system.

## Source of truth
Current component: `/components/memory/MemoryNucleusGraphPlaceholder.tsx`.
Current data: `/lib/memoryGraph.ts`.

## Current status
Run 2 uses a fully coded 2D SVG/div placeholder. It is not a static image, APNG, or flattened asset.

## Owner/agent
Owner: James. Implementation agent: Codex.

## Key sections
### Current placeholder architecture
- 2D SVG graph rendered inside a responsive `ChamberPanel`.
- Central nucleus node with Eye of Ra icon and gold glow.
- Eight radial clusters: Ideas, Projects, Agents, Journals, Memories, Systems, Resources, Knowledge.
- Nodes support basic pointer drag.
- Hover reveals node label.
- Click updates the right-side Active Nexus detail panel.
- Left panel includes Overview, Nodes, Clusters, Timeline, Links, Insights, Search, Filters, and Settings tabs.
- Graph controls include Center, Focus, Expand, Filter, and Reset.
- View modes include Galaxy, Force, Hierarchy, and Timeline.

### Future 3D engine plan
The placeholder should be upgraded to either React Force Graph 3D or a custom Three.js scene.

React Force Graph 3D is preferred for faster implementation of:
- Mouse drag rotation.
- Scroll zoom.
- Node click selection.
- Force-directed layouts.
- Animated connection lines.
- Node sprites or custom HTML labels.

Three.js is preferred if the dashboard needs:
- Fully custom sacred-geometry orbit visuals.
- Custom shaders and particle systems.
- Chamber-scale cinematic scene control.
- Advanced lighting, depth, and post-processing.

### Node types
- `memory_note`: Obsidian note or Hermes memory note.
- `project`: AppBuild project or category.
- `agent`: Guardian or workflow agent.
- `journal`: Daily Ledger entry.
- `model`: model route or provider role.
- `report`: QA, research, audit, or operational report.
- `connector`: local bridge or external integration summary.
- `resource`: reference file, template, doc, or asset.

### Edge types
- `references`: note links to another note, project, or report.
- `owns`: agent owns a workflow, project, or domain.
- `depends_on`: project or workflow dependency.
- `routes_to`: model routing relationship.
- `updates`: log, report, or journal updates a node.
- `reports_on`: report describes a project, model, agent, or workflow.
- `syncs_with`: Hermes, Codex, Obsidian, or connector bridge relationship.

### Cluster definitions
- Ideas: prompts, concepts, experiments, creative sparks.
- Projects: AppBuilds, build logs, QA state, deployment readiness.
- Agents: Guardians, Codex, Hermes, Research, GHL, and future workflow agents.
- Journals: Daily Ledger, reflections, gratitude, continuity tracking.
- Memories: Obsidian notes, Hermes summaries, durable decisions.
- Systems: filesystem paths, bridges, dashboard internals, model routing.
- Resources: references, templates, assets, docs, reports.
- Knowledge: research, synthesized patterns, strategy, insight maps.

### Interaction behavior
- Drag node: reposition temporary visual node in the placeholder.
- Hover node: show concise tooltip label.
- Click node: update Active Nexus detail.
- Reset: restore initial graph layout.
- Future Center: recenter camera or viewport.
- Future Focus: isolate selected node neighborhood.
- Future Expand: reveal second-degree edges.
- Future Filter: apply type, cluster, date, or source filters.

### Telemetry connection plan
- Parse Obsidian markdown links from `/mnt/c/Users/a1guy/Documents/Obsidian/Hermes-Memory-Vault`.
- Parse operator system markdown from `/mnt/c/Users/a1guy/Documents/AppBuilds/_AI_OPERATOR_DATA`.
- Parse AppBuilds project metadata from `/mnt/c/Users/a1guy/Documents/AppBuilds`.
- Read Hermes bridge summaries from `/home/james/.hermes/bridges/codex` and `/home/james/.hermes/memory/obsidian` after redaction rules exist.
- Normalize all sources into sanitized nodes and edges before browser rendering.
- Keep secrets, credentials, Telegram settings, Twilio settings, and raw private tokens out of graph data.

## Open questions
- Should the first live graph index be generated at build time, request time, or by manual refresh?
- Should Obsidian wikilinks or explicit frontmatter define authoritative graph relationships?
- Should the 3D graph be full screen or embedded inside the Memory Nexus chamber?

## Next actions
- Build a read-only markdown parser for Obsidian and `_AI_OPERATOR_DATA`.
- Define graph JSON schema.
- Add redaction and path ignore rules.
- Evaluate React Force Graph 3D against Three.js for Run 3 or Run 4.

## Verification checklist
- [x] Current graph is coded, not rendered as a static image.
- [x] Upgrade path includes React Force Graph 3D and Three.js.
- [x] Node and edge types are defined.
- [x] Telemetry connection plan avoids secrets.

## Last updated
2026-05-18 by Codex.
