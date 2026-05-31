"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Filter, Focus, Maximize2, RotateCcw, Search, Settings2, Target } from "lucide-react";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { ProgressMeter } from "@/components/ui/ProgressMeter";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { openEntityInspector } from "@/lib/entityInspectorEvents";
import { readUnifiedEntities } from "@/lib/entityStore";
import { memoryTabs, memoryViewModes, type MemoryNode } from "@/lib/memoryGraph";
import { buildMemoryNexusModel, readLocalNexusState, type NexusModel, type NexusSourcePayload } from "@/lib/memoryNexusEngine";
import { recordObsidianEvent } from "@/lib/obsidianClient";

const controls = [
  { label: "CENTER", icon: Target },
  { label: "FOCUS", icon: Focus },
  { label: "EXPAND", icon: Maximize2 },
  { label: "FILTER", icon: Filter },
  { label: "RESET", icon: RotateCcw }
];

export function MemoryNucleusGraphPlaceholder() {
  const [payload, setPayload] = useState<NexusSourcePayload | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState("nucleus");
  const [activeTab, setActiveTab] = useState(memoryTabs[0]);
  const [activeMode, setActiveMode] = useState<(typeof memoryViewModes)[number]>("GALAXY");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [nodeOverrides, setNodeOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityCleared, setActivityCleared] = useState(false);
  const [localVersion, setLocalVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/memory-nexus", { cache: "no-store" });
        if (!response.ok) throw new Error("Memory scan failed");
        const next = (await response.json()) as NexusSourcePayload;
        if (!cancelled) {
          setPayload(next);
          setError("");
          void recordObsidianEvent({
            category: "memory",
            title: "Memory scan completed",
            body: `Indexed ${next.sources.obsidian.markdownFiles.length} Obsidian notes, ${next.sources.appBuilds.folders.length} AppBuild folders, and ${next.sources.dashboard.files.length} dashboard files.`,
            metadata: { scannedAt: next.scannedAt }
          });
        }
      } catch {
        if (!cancelled) setError("Memory scan unavailable.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const refreshLocal = () => setLocalVersion((value) => value + 1);
    window.addEventListener("hermes-memory-nexus-updated", refreshLocal);
    window.addEventListener("hermes-activity-updated", refreshLocal);
    window.addEventListener("hermes-captures-updated", refreshLocal);
    return () => {
      window.removeEventListener("hermes-memory-nexus-updated", refreshLocal);
      window.removeEventListener("hermes-activity-updated", refreshLocal);
      window.removeEventListener("hermes-captures-updated", refreshLocal);
    };
  }, []);

  const model: NexusModel = useMemo(() => buildMemoryNexusModel(payload, readLocalNexusState()), [payload, localVersion]);
  const nodes = useMemo(() => model.nodes.map((node) => ({ ...node, ...(nodeOverrides[node.id] ?? {}) })), [model.nodes, nodeOverrides]);
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const visibleNodes = useMemo(() => nodes.filter((node) => `${node.label} ${node.cluster}`.toLowerCase().includes(search.toLowerCase())), [nodes, search]);
  const selectedNode = nodeMap.get(selectedNodeId) ?? nodes[0];
  const recentEntities = useMemo(() => readUnifiedEntities().slice(0, 6), [localVersion]);

  function resetGraph() {
    setNodeOverrides({});
    setSelectedNodeId("nucleus");
    setSearch("");
    setZoom(1);
  }

  function applyControl(label: string) {
    if (label === "RESET") resetGraph();
    if (label === "CENTER") setSelectedNodeId("nucleus");
    if (label === "FOCUS") setSearch(selectedNode.label);
    if (label === "EXPAND") setZoom((value) => Math.min(1.35, value + 0.1));
    if (label === "FILTER") setSearch(selectedNode.cluster);
  }

  function moveNode(id: string, clientX: number, clientY: number, svg: SVGSVGElement) {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 1000;
    const y = ((clientY - rect.top) / rect.height) * 640;
    setNodeOverrides((current) => ({
      ...current,
      [id]: {
        x: Math.max(60, Math.min(940, x)),
        y: Math.max(60, Math.min(580, y))
      }
    }));
  }

  return (
    <div className="grid min-w-0 gap-6">
      <div className="grid gap-6 xl:grid-cols-[14rem_minmax(0,1fr)_20rem]">
        <ChamberPanel className="self-start">
          <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold">Memory Console</p>
          <div className="grid gap-2">
            {memoryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex min-w-0 items-center justify-between gap-3 rounded border px-3 py-3 text-left font-mono text-[0.68rem] uppercase tracking-[0.14em] transition hover:border-gold/50 ${
                  activeTab === tab ? "border-gold/55 bg-gold/10 text-gold" : "border-gold/12 bg-obsidian/45 text-soft-sand"
                }`}
              >
                <span className="truncate">{tab}</span>
                {tab === "SEARCH" ? <Search className="h-3.5 w-3.5 shrink-0" /> : null}
                {tab === "SETTINGS" ? <Settings2 className="h-3.5 w-3.5 shrink-0" /> : null}
              </button>
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionTitle eyebrow="Memory" title="Relationship Map" />
            <div className="flex flex-wrap gap-2">
              {memoryViewModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActiveMode(mode)}
                  className={`rounded border px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition hover:border-gold/55 ${
                    activeMode === mode ? "border-gold/55 bg-gold/10 text-gold" : "border-gold/15 bg-obsidian/45 text-soft-sand"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {controls.map((control) => (
              <button
                key={control.label}
                type="button"
                onClick={() => applyControl(control.label)}
                className="inline-flex items-center gap-2 rounded border border-gold/18 bg-obsidian/50 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-soft-sand transition hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
              >
                <control.icon className="h-4 w-4" aria-hidden="true" />
                {control.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Quick search real nodes..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory outline-none focus:border-gold/55" />
            <button type="button" onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Zoom In</button>
            <button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">Zoom Out</button>
          </div>

          <div className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
            {loading ? "Scanning Obsidian, AppBuilds, dashboard files, and local state." : error || `${activeTab} tab active. ${activeMode} mode uses ${model.nodes.length} computed nodes and ${model.links.length} real links.`}
          </div>

          <div className="grid min-h-[32rem] overflow-hidden rounded-lg border border-gold/18 bg-[radial-gradient(circle_at_center,rgba(212,166,74,0.12),rgba(5,5,5,0.88)_48%,rgba(5,5,5,0.96))]">
            <svg
              viewBox="0 0 1000 640"
              role="img"
              aria-label="Operational graph for Memory"
              className="h-full min-h-[32rem] w-full touch-none"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
              onPointerMove={(event) => {
                if (!draggingNode) return;
                moveNode(draggingNode, event.clientX, event.clientY, event.currentTarget);
              }}
              onPointerUp={() => setDraggingNode(null)}
              onPointerLeave={() => setDraggingNode(null)}
            >
              <defs>
                <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffac02" stopOpacity="0.95" />
                  <stop offset="65%" stopColor="#d4a64a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d4a64a" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g opacity="0.42">
                {[160, 240, 320].map((radius) => (
                  <circle key={radius} cx="500" cy="320" r={radius} fill="none" stroke="#d4a64a" strokeDasharray="8 14" strokeWidth="1" />
                ))}
              </g>

              {model.links.map((link) => {
                const source = nodeMap.get(link.source);
                const target = nodeMap.get(link.target);
                if (!source || !target) return null;
                const strokeWidth = link.strength === "high" ? 2.2 : link.strength === "medium" ? 1.5 : 1;
                return (
                  <line
                    key={`${link.source}-${link.target}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#d4a64a"
                    strokeOpacity={link.strength === "high" ? 0.58 : 0.32}
                    strokeWidth={strokeWidth}
                  />
                );
              })}

              {visibleNodes.map((node: MemoryNode) => (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${node.label}`}
                  transform={`translate(${node.x} ${node.y})`}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDraggingNode(node.id);
                    setSelectedNodeId(node.id);
                  }}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedNodeId(node.id);
                  }}
                  className="cursor-grab outline-none"
                >
                  {node.id === "nucleus" ? <circle r="76" fill="url(#nucleusGlow)" className="animate-gold-pulse" /> : null}
                  <circle r={node.radius + 8} fill={node.color} opacity="0.12" />
                  <circle r={node.radius} fill="#050505" stroke={node.color} strokeWidth="2.5" />
                  {node.id === "nucleus" ? <Eye x="-14" y="-14" width="28" height="28" color="#d4a64a" /> : <circle r="5" fill={node.color} />}
                  {hoveredNode === node.id || selectedNode.id === node.id ? (
                    <g transform="translate(-72 -58)">
                      <rect width="144" height="32" rx="4" fill="#050505" stroke={node.color} strokeOpacity="0.65" />
                      <text x="72" y="21" textAnchor="middle" fill="#f5f1e8" fontSize="13" fontFamily="ui-monospace">
                        {node.label}
                      </text>
                    </g>
                  ) : null}
                </g>
              ))}
            </svg>
          </div>
        </ChamberPanel>

        <ChamberPanel className="self-start">
          <SectionTitle eyebrow="Graph Overview" title="Memory Metrics" />
          <div className="mt-5 grid gap-3">
            {model.metrics.map((stat) => (
              <div key={stat.label} title={stat.detail} className="flex items-center justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-soft-sand">{stat.label}</span>
                <span className="font-display text-xl text-gold">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">Imbalance Detection</p>
            {model.imbalances.map((item) => (
              <div key={item.label} className="rounded border border-gold/14 bg-obsidian/45 p-3">
                <StatusPill label={item.severity} tone={item.severity === "stable" ? "emerald" : item.severity === "watch" ? "blue" : "bronze"} />
                <p className="mt-2 text-sm text-soft-sand text-balance-safe">{item.label}: {item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded border border-gold/18 bg-obsidian/45 p-4">
            <StatusPill label="Live Nexus" tone="gold" />
            <h3 className="mt-3 font-display text-2xl text-ivory text-balance-safe">{selectedNode.label}</h3>
            <p className="mt-2 text-sm leading-6 text-soft-sand text-balance-safe">{selectedNode.description}</p>
          </div>
        </ChamberPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <ChamberPanel>
          <SectionTitle eyebrow="Distribution" title="Cluster Distribution" />
          <div className="mt-5 grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
            <div className="aspect-square rounded-full border-[1.6rem] border-gold/35 bg-obsidian shadow-gold-soft" />
            <div className="grid gap-2">
              {model.clusterCounts.map((cluster) => (
                <div key={cluster.label} className="flex items-center gap-3 text-sm text-soft-sand">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cluster.color }} />
                  <button onClick={() => setSearch(cluster.label)} className="min-w-0 truncate text-left">{cluster.label}: {cluster.value}</button>
                </div>
              ))}
            </div>
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Recent Activity" title="Nexus Feed" />
          <div className="mt-5 grid gap-3">
            <div className="mb-3 flex gap-3"><button onClick={() => setActivityCleared(true)} className="font-mono text-xs uppercase text-gold">Clear</button><a href="/activity" className="font-mono text-xs uppercase text-gold">View All</a></div>
            {activityCleared ? <div className="text-sm text-soft-sand">Nexus feed cleared locally.</div> : model.recentActivity.map((item) => (
              <div key={item} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">{item}</div>
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Connectivity" title="Top Connected Nodes" />
          <div className="mt-5 grid gap-3">
            {model.topConnectedNodes.map((item, index) => (
              <ProgressMeter key={item} label={item} value={Math.max(12, 100 - index * 16)} accent={index === 0 ? "#d4a64a" : "#1aa7b8"} />
            ))}
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Entity Debug" title="Recent Entities" />
          <div className="mt-5 grid gap-3">
            {recentEntities.length === 0 ? <div className="text-sm text-soft-sand">No entities recorded yet.</div> : recentEntities.map((entity) => (
              <div key={entity.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand">
                <span className="font-mono text-gold">{entity.type} · {entity.guardian}</span>
                <p>{entity.title}</p>
                <button type="button" onClick={() => openEntityInspector(entity.id)} className="mt-2 font-mono text-[0.68rem] uppercase text-gold">Inspect</button>
              </div>
            ))}
          </div>
        </ChamberPanel>
      </div>
    </div>
  );
}
