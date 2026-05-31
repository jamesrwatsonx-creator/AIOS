import { OperatorPage } from "@/components/operator/OperatorPage";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

const areas = [
  "Topic research",
  "Video ideas",
  "Script drafts",
  "Thumbnail ideas",
  "Source links",
  "AI video generation queue",
  "Publishing checklist",
  "Content calendar",
  "Browser research missions",
  "Obsidian content folder"
];

export function ContentStudioChamber() {
  return (
    <OperatorPage
      eyebrow="YouTube / Content"
      title="Content Studio"
      description="A planning hub for research-backed video and content workflows. It keeps ideas, scripts, sources, and publishing preparation organized without pretending upload automation exists yet."
      status="YouTube publishing API: FUTURE"
      capabilities={[
        "Capture YouTube and content ideas as durable AIOS work items.",
        "Connect topic research to Browser missions and Obsidian notes.",
        "Track scripts, thumbnails, source links, and publishing checklists.",
        "Prepare an AI video generation queue while keeping publishing automation marked future."
      ]}
      recent={["Content Studio route created.", "Obsidian folder 06-Content-Studio is part of the professional memory structure.", "YouTube upload automation remains future work."]}
      nextActions={[
        { label: "Start a topic research mission in Browser.", href: "/browser" },
        { label: "Create a content project in Projects.", href: "/projects" },
        { label: "Save script and calendar notes to Obsidian.", status: "LOCAL" }
      ]}
      systems={["Entity graph: content_idea and youtube_script", "Obsidian: 06-Content-Studio/", "Browser missions", "Projects", "Activity"]}
    >
      <ChamberPanel>
        <SectionTitle eyebrow="Status" title="Publishing Reality" />
        <div className="mt-5 flex flex-wrap gap-3">
          <StatusPill label="YouTube publishing API: FUTURE" tone="blue" />
          <StatusPill label="Research + planning: READY" tone="emerald" />
        </div>
      </ChamberPanel>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {areas.map((area) => <ChamberPanel key={area}><h2 className="font-display text-2xl text-ivory">{area}</h2><p className="mt-3 text-sm leading-6 text-soft-sand">Use this area to collect and connect content work to projects, memory, and browser evidence.</p></ChamberPanel>)}
      </div>
    </OperatorPage>
  );
}
