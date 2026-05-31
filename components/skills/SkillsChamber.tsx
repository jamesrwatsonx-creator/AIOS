"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageFrame } from "@/components/layout/PageFrame";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";
import { guardians } from "@/lib/guardians";
import { createLocalId } from "@/lib/id";

type Skill = { id: string; name: string; category: string; status: "ACTIVE" | "AVAILABLE" | "PENDING"; description: string; route?: string };

const baseSkills: Skill[] = [
  { id: "openrouter", name: "OpenRouter", category: "Integration Skills", status: "ACTIVE", description: "Model routing and Hermes intelligence.", route: "/models" },
  { id: "speech", name: "Web Speech Recognition", category: "AI Capabilities", status: "ACTIVE", description: "Browser speech input for Hermes.", route: "/hermes" },
  { id: "coqui", name: "Coqui TTS Voice", category: "AI Capabilities", status: "AVAILABLE", description: "Local cloned voice server on port 8881.", route: "/hermes" },
  { id: "n8n", name: "n8n Workflows", category: "Automation Skills", status: "PENDING", description: "Workflow automation via Maat.", route: "/maat" },
  { id: "obsidian", name: "Obsidian", category: "Integration Skills", status: "ACTIVE", description: "Local Hermes memory vault.", route: "/vault" },
  { id: "build", name: "Next.js / React / TypeScript", category: "Build Skills", status: "ACTIVE", description: "Dashboard app foundation.", route: "/projects" }
];

export function SkillsChamber() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "AI Capabilities", status: "AVAILABLE" as Skill["status"], description: "" });

  useEffect(() => {
    setSkills([...baseSkills, ...JSON.parse(localStorage.getItem("hermes_skills") ?? "[]")]);
  }, []);

  function addSkill() {
    if (!form.name.trim()) return;
    const custom = JSON.parse(localStorage.getItem("hermes_skills") ?? "[]");
    const next = [{ id: createLocalId("skill"), ...form }, ...custom];
    localStorage.setItem("hermes_skills", JSON.stringify(next));
    setSkills([...baseSkills, ...next]);
    setForm({ ...form, name: "", description: "" });
    setModal(false);
  }

  const guardianSkills = guardians.map((g) => ({ id: g.slug, name: `${g.name} Capabilities`, category: "Agent Skills", status: "AVAILABLE" as const, description: g.capabilities.join(", "), route: `/agents/${g.slug}` }));
  const all = [...skills, ...guardianSkills];
  const groups = Array.from(new Set(all.map((skill) => skill.category)));

  return (
    <AppShell>
      <PageFrame eyebrow="Skills Chamber" title="Skills Chamber" subtitle="CAPABILITY REGISTRY. Every skill is a tool. Every tool extends the mission.">
        <ChamberPanel className="gold-circuit"><div className="flex flex-wrap items-center justify-between gap-4"><SectionTitle eyebrow="Capability Registry" title="Operational Skills" /><button onClick={() => setModal(true)} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold">Add Skill</button></div><p className="mt-4 text-soft-sand">CODEX SKILLS in /mnt/skills are DEMO until filesystem reads are connected.</p></ChamberPanel>
        {groups.map((group) => <ChamberPanel key={group}><SectionTitle eyebrow={group} title={group} /><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{all.filter((skill) => skill.category === group).map((skill) => <div key={skill.id} className="grid gap-3 rounded border border-gold/14 bg-obsidian/45 p-4"><div className="flex items-start justify-between gap-3"><p className="text-ivory">{skill.name}</p><StatusPill label={skill.status} tone={skill.status === "ACTIVE" ? "emerald" : skill.status === "AVAILABLE" ? "gold" : "bronze"} /></div><p className="text-sm text-soft-sand">{skill.description}</p>{skill.route ? <Link href={skill.route} className="font-mono text-xs uppercase text-gold">Open Chamber</Link> : null}</div>)}</div></ChamberPanel>)}
        {modal ? <ChamberPanel><SectionTitle eyebrow="Add Skill" title="New Capability" /><div className="mt-5 grid gap-3 md:grid-cols-2"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory">{["Codex Skills", "AI Capabilities", "Automation Skills", "Agent Skills", "Build Skills", "Integration Skills"].map((item) => <option key={item}>{item}</option>)}</select><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Skill["status"] })} className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory"><option>ACTIVE</option><option>AVAILABLE</option><option>PENDING</option></select><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded border border-gold/18 bg-obsidian/55 px-4 py-3 text-ivory" /></div><div className="mt-5 flex gap-3"><button onClick={addSkill} className="rounded-none border border-gold/55 px-4 py-3 font-mono text-xs uppercase text-gold">Save Skill</button><button onClick={() => setModal(false)} className="rounded-none border border-burnt-bronze/45 px-4 py-3 font-mono text-xs uppercase text-soft-sand">Cancel</button></div></ChamberPanel> : null}
      </PageFrame>
    </AppShell>
  );
}
