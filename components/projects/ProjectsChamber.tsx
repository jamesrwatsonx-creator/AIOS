"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { GuidedCreationModal } from "@/components/creation/GuidedCreationModal";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { ProgressMeter } from "@/components/ui/ProgressMeter";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { guardians } from "@/lib/guardians";
import { createLocalId } from "@/lib/id";
import { projectCategories } from "@/lib/projectCategories";
import { pipelineStages, pipelineStats } from "@/lib/projectsChamber";
import { writeStorage } from "@/lib/localStorageKeys";
import { openEntityInspector } from "@/lib/entityInspectorEvents";
import { milestoneStorageKey, projectStorageKey, readActivity, readMilestones, readProjects, saveMilestones, saveProjects, type SystemMilestone, type SystemProject } from "@/lib/systemPersistence";

type Project = SystemProject;
type Milestone = SystemMilestone;

const projectKey = projectStorageKey;
const milestoneKey = milestoneStorageKey;
const statuses = ["ACTIVE", "IN PROGRESS", "IN REVIEW", "PLANNED", "QUEUED", "IDLE", "BLOCKED", "PENDING SETUP", "DEPLOYED", "ARCHIVED"];

export function ProjectsChamber() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState<"project" | "milestone" | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState("PLAN");
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activityCleared, setActivityCleared] = useState(false);
  const [activity, setActivity] = useState(readActivity());
  const [form, setForm] = useState({ name: "", category: "WebApps", status: "PLANNED", guardian: "Ptah", environment: "Local" });

  useEffect(() => {
    const refresh = () => {
      setProjects(readProjects());
      setMilestones(readMilestones());
      setActivity(readActivity());
    };
    refresh();
    window.addEventListener("hermes-projects-updated", refresh);
    window.addEventListener("hermes-milestones-updated", refresh);
    window.addEventListener("hermes-activity-updated", refresh);
    return () => {
      window.removeEventListener("hermes-projects-updated", refresh);
      window.removeEventListener("hermes-milestones-updated", refresh);
      window.removeEventListener("hermes-activity-updated", refresh);
    };
  }, []);

  const filtered = useMemo(() => projects.filter((project) => (filter === "ALL" || project.status === filter) && project.name.toLowerCase().includes(search.toLowerCase())), [projects, filter, search]);
  const counts = useMemo(() => ({
    total: projects.length,
    active: projects.filter((project) => project.status === "ACTIVE").length,
    inProgress: projects.filter((project) => project.status === "IN PROGRESS").length,
    review: projects.filter((project) => project.status === "IN REVIEW").length,
    deployed: projects.filter((project) => project.status === "DEPLOYED").length,
    archived: projects.filter((project) => project.status === "ARCHIVED").length
  }), [projects]);
  const categoryCounts = useMemo(() => Object.fromEntries(projectCategories.map((category) => [category, projects.filter((project) => project.category === category).length])), [projects]);
  const nextGates = useMemo(() => milestones.filter((milestone) => !milestone.complete).slice(0, 5), [milestones]);
  const recentActivity = useMemo(() => activity.filter((item) => item.destinations.includes("/projects") || item.type === "project" || item.type === "milestone").slice(0, 5), [activity]);

  function saveProject() {
    if (!form.name.trim()) return;
    const next = editingId
      ? projects.map((project) => project.id === editingId ? { ...project, ...form, name: form.name.trim() } : project)
      : [...projects, { id: createLocalId("project"), progress: 0, ...form, name: form.name.trim() }];
    setProjects(next);
    saveProjects(next, editingId ? "Project updated" : "Project created");
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...form, name: "" });
  }

  function updateProjects(next: Project[]) {
    setProjects(next);
    saveProjects(next);
  }

  function openNewProject() {
    setGuidedOpen("project");
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setForm({ name: project.name, category: project.category, status: project.status, guardian: project.guardian, environment: project.environment });
    setModalOpen(true);
  }

  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const selectedProjectMilestones = selectedProject ? milestones.filter((milestone) => milestone.projectId === selectedProject.id || !milestone.projectId) : milestones;

  return (
    <AppShell>
      <PageFrame eyebrow="Projects" title="Projects" subtitle="The execution hub for apps, client work, browser research, content, automations, voice agents, and internal tools.">
        {/* TODO filesystem connection point: later read AppBuild category roots after local API scanners exist. */}
        <ChamberPanel className="gold-circuit">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-gold">Execution Hub</p><h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.9rem)] leading-[0.94] text-ivory">Projects</h2></div>
            <button type="button" onClick={openNewProject} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">+ New Project</button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" />
            <div className="flex flex-wrap gap-2">{["ALL", ...statuses].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded border px-3 py-2 font-mono text-[0.68rem] uppercase ${filter === item ? "border-gold bg-gold/10 text-gold" : "border-gold/14 text-soft-sand"}`}>{item}</button>)}</div>
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Overview" title="Project State" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              ["Total Projects", counts.total],
              ["Active Projects", counts.active],
              ["In Progress", counts.inProgress],
              ["In Review", counts.review],
              ["Deployed", counts.deployed],
              ["Archived", counts.archived]
            ].map(([label, value]) => <MetricCard key={label} label={String(label)} value={Number(value)} state="LIVE_PENDING" tooltip={`${label} is calculated from saved project state.`} />)}
          </div>
        </ChamberPanel>

        <ChamberPanel>
          <SectionTitle eyebrow="Active Projects" title="Execution Table" />
          {filtered.length === 0 ? <div className="mt-5"><EmptyState title="No projects in the chamber yet." message="Begin your first build." /><button type="button" onClick={openNewProject} className="mt-5 rounded-none border border-gold/55 px-5 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">+ New Project</button></div> : (
            <div className="mt-5 grid gap-3">{filtered.map((project) => <div key={project.id} className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 xl:grid-cols-[minmax(0,1fr)_9rem_10rem_12rem_auto] xl:items-center">
              <button onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)} className="min-w-0 text-left text-ivory">{project.name}<span className="block text-xs text-soft-sand">{project.category} · {project.guardian} · {project.environment}</span></button>
              <select value={project.status} onChange={(e) => updateProjects(projects.map((item) => item.id === project.id ? { ...item, status: e.target.value } : item))} className="rounded border border-gold/18 bg-obsidian px-2 py-2 text-xs text-gold">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <StatusPill label="UNKNOWN" tone="blue" />
              <input type="range" min="0" max="100" value={project.progress} onChange={(e) => updateProjects(projects.map((item) => item.id === project.id ? { ...item, progress: Number(e.target.value) } : item))} />
              <div className="flex gap-2"><button type="button" onClick={() => openEntityInspector(project.id)} className="font-mono text-[0.68rem] uppercase text-gold">Inspect</button><button type="button" onClick={() => editProject(project)} className="text-gold" aria-label={`Edit ${project.name}`}><Edit className="h-4 w-4" /></button><button onClick={() => window.confirm("Delete project?") && updateProjects(projects.filter((item) => item.id !== project.id))} className="text-burnt-bronze" aria-label={`Delete ${project.name}`}><Trash2 className="h-4 w-4" /></button></div>
            </div>)}</div>
          )}
          {selectedProject ? <div className="mt-5 rounded border border-gold/18 bg-obsidian/45 p-4"><p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">Selected Project</p><h3 className="mt-2 text-lg text-ivory">{selectedProject.name}</h3><p className="mt-2 text-sm text-soft-sand">Status: {selectedProject.status} · Progress: {selectedProject.progress}% · Guardian: {selectedProject.guardian}</p><ProgressMeter value={selectedProject.progress} label="Local progress" /></div> : null}
        </ChamberPanel>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChamberPanel><SectionTitle eyebrow="Build Pipeline" title="Plan to Monitor" /><div className="mt-5 grid gap-3 sm:grid-cols-5">{pipelineStages.map((stage) => <button key={stage} onClick={() => setActiveStage(stage)} className={`rounded border p-4 font-mono text-xs uppercase ${activeStage === stage ? "border-gold bg-gold/10 text-gold" : "border-gold/18 text-soft-sand"}`}>{stage}</button>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-4">{pipelineStats.map((stat) => <MetricCard key={stat.label} label={stat.label} value={stat.value} suffix={stat.suffix} state="DEMO" />)}</div></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Roadmap" title="Timeline" action={<button onClick={() => setRoadmapOpen(true)} className="font-mono text-xs uppercase text-gold">View Full Roadmap</button>} /><button onClick={() => setGuidedOpen("milestone")} className="mt-5 rounded-none border border-gold/45 px-3 py-2 font-mono text-xs uppercase text-gold">+ Add Milestone</button><div className="mt-5 grid gap-3">{milestones.length === 0 ? <EmptyState title="No milestones yet." message="Add the first roadmap marker." /> : milestones.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded border border-gold/14 bg-obsidian/45 p-3"><button onClick={() => { const next = milestones.map((m) => m.id === item.id ? { ...m, complete: !m.complete, status: !m.complete ? "COMPLETE" : "QUEUED" } : m); setMilestones(next); saveMilestones(next, "Milestone status changed"); }} className={item.complete ? "line-through text-soft-sand" : "text-soft-sand"}>{item.label}<span className="block text-left text-xs text-soft-sand/70">{item.projectName || "Roadmap"} · {item.guardian || "Ptah"}</span></button><div className="flex items-center gap-2"><button type="button" onClick={() => openEntityInspector(item.id)} className="font-mono text-[0.68rem] uppercase text-gold">Inspect</button><button onClick={() => { const next = milestones.filter((m) => m.id !== item.id); setMilestones(next); saveMilestones(next, "Milestone deleted"); }} className="text-burnt-bronze"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></ChamberPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <ChamberPanel><SectionTitle eyebrow="Categories" title="Project Categories" /><div className="mt-5 grid gap-3">{projectCategories.map((category) => <button key={category} onClick={() => setSearch(category)} className="flex justify-between rounded border border-gold/16 bg-obsidian/45 p-4 text-left text-soft-sand"><span>{category}</span><span className="text-gold">{categoryCounts[category] ?? 0} LOCAL</span></button>)}</div></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Recent Activity" title="Project Activity" action={<a href="/activity" className="font-mono text-xs uppercase text-gold">View All</a>} />{activityCleared || recentActivity.length === 0 ? <EmptyState title="No activity recorded yet." message="Hermes is watching." /> : <div className="mt-5 grid gap-3">{recentActivity.map((item) => <div key={item.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><span className="font-mono text-gold">{item.time} · {item.guardian}</span><p>{item.text}</p></div>)}</div>}<button onClick={() => setActivityCleared(true)} className="mt-4 rounded-none border border-burnt-bronze/45 px-3 py-2 font-mono text-xs uppercase text-soft-sand">Clear</button></ChamberPanel>
          <ChamberPanel><SectionTitle eyebrow="Upcoming Milestones" title="Next Gates" />{nextGates.length === 0 ? <EmptyState title="No milestones yet." message="Add a milestone to begin the roadmap." /> : <div className="mt-5 grid gap-3">{nextGates.map((item) => <div key={item.id} className="rounded border border-gold/14 bg-obsidian/45 p-3 text-sm text-soft-sand"><button onClick={() => setRoadmapOpen(true)} className="text-left"><span className="text-gold">{item.label}</span><span className="block text-xs">{item.projectName || "Roadmap"} · {item.status || "QUEUED"}</span></button><button type="button" onClick={() => openEntityInspector(item.id)} className="mt-2 font-mono text-[0.68rem] uppercase text-gold">Inspect</button></div>)}</div>}</ChamberPanel>
        </div>

        {modalOpen ? <div className="sacred-panel rounded-lg p-5"><SectionTitle eyebrow={editingId ? "Edit Project" : "New Project"} title={editingId ? "Update Project" : "Create Project"} /><div className="mt-5 grid gap-3 md:grid-cols-2"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project Name" className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">{projectCategories.map((item) => <option key={item}>{item}</option>)}</select><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">{statuses.map((item) => <option key={item}>{item}</option>)}</select><select value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">{guardians.map((item) => <option key={item.name}>{item.name}</option>)}</select><select value={form.environment} onChange={(e) => setForm({ ...form, environment: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">{["Local", "Development", "Review", "Production"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="mt-5 flex gap-3"><button onClick={saveProject} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold hover:bg-gold hover:text-obsidian">Save Project</button><button onClick={() => { setModalOpen(false); setEditingId(null); }} className="rounded-none border border-burnt-bronze/45 px-4 py-3 font-mono text-xs uppercase text-soft-sand">Cancel</button></div></div> : null}
        {guidedOpen ? <GuidedCreationModal
          open
          title={guidedOpen === "project" ? "Create Project" : "Create Milestone"}
          context={{
            preferredType: guidedOpen,
            projectId: selectedProject?.id,
            projectName: selectedProject?.name,
            source: "Projects Chamber"
          }}
          onClose={() => setGuidedOpen(null)}
          onCreated={() => {
            setProjects(readProjects());
            setMilestones(readMilestones());
            setActivity(readActivity());
          }}
        /> : null}
        {roadmapOpen ? <ChamberPanel><SectionTitle eyebrow="Expanded Roadmap" title="Full Roadmap" action={<div className="flex gap-3"><button onClick={() => setGuidedOpen("milestone")} className="font-mono text-xs uppercase text-gold">Add Milestone</button><button onClick={() => setRoadmapOpen(false)} className="font-mono text-xs uppercase text-gold">Close</button></div>} />{selectedProject ? <p className="mt-3 text-sm text-soft-sand">Focused project: {selectedProject.name}</p> : null}<div className="mt-5 grid gap-3">{selectedProjectMilestones.length === 0 ? <EmptyState title="No roadmap entries yet." message="Create a milestone to populate this roadmap." /> : selectedProjectMilestones.map((milestone) => <div key={milestone.id} className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center"><input value={milestone.label} onChange={(event) => { const next = milestones.map((item) => item.id === milestone.id ? { ...item, label: event.target.value } : item); setMilestones(next); writeStorage(milestoneKey, next); }} onBlur={() => saveMilestones(readMilestones(), "Milestone edited")} className="rounded border border-gold/18 bg-obsidian/55 px-3 py-2 text-ivory" /><button onClick={() => { const next = milestones.map((item) => item.id === milestone.id ? { ...item, complete: !item.complete, status: !item.complete ? "COMPLETE" : "QUEUED" } : item); setMilestones(next); saveMilestones(next, "Milestone status changed"); }} className="rounded-none border border-gold/35 px-3 py-2 font-mono text-xs uppercase text-gold">{milestone.complete ? "Complete" : "Open"}</button><button type="button" onClick={() => openEntityInspector(milestone.id)} className="font-mono text-xs uppercase text-gold">Inspect</button><button onClick={() => { const next = milestones.filter((item) => item.id !== milestone.id); setMilestones(next); saveMilestones(next, "Milestone deleted"); }} className="text-burnt-bronze"><Trash2 className="h-4 w-4" /></button></div>)}</div></ChamberPanel> : null}
      </PageFrame>
    </AppShell>
  );
}
