import { OperatorPage } from "@/components/operator/OperatorPage";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

const sections = [
  "Client projects",
  "Funnels",
  "Voice agents",
  "Missed-call systems",
  "GEO/AI visibility audits",
  "Review automations",
  "SMS/email workflows",
  "Appointment systems",
  "Browser research missions",
  "Codex build logs"
];

export function GoHighLevelChamber() {
  return (
    <OperatorPage
      eyebrow="Agency Operations"
      title="GoHighLevel"
      description="A future operating area for local AI agency work: clients, funnels, voice agents, automations, research missions, and Codex build logs. API integration is intentionally marked pending until configured."
      status="API integration: PENDING"
      capabilities={[
        "Organize future client and GoHighLevel work without connecting an API prematurely.",
        "Track missed-call, review, SMS/email, appointment, and visibility audit concepts.",
        "Link browser research missions and Codex build logs to client projects.",
        "Keep GoHighLevel work local-first until credentials and API scope are configured."
      ]}
      recent={["GoHighLevel page created as a planning hub.", "No GoHighLevel API connection is attempted by this page.", "Obsidian folder 07-GoHighLevel is part of the memory structure."]}
      nextActions={[
        { label: "Create a client project in Projects.", href: "/projects" },
        { label: "Run local business research in Browser.", href: "/browser" },
        { label: "Add API integration only after credentials and scope are configured.", status: "PENDING" }
      ]}
      systems={["Entity graph: ghl_project", "Obsidian: 07-GoHighLevel/", "Projects", "Browser missions", "Codex logs"]}
    >
      <ChamberPanel>
        <SectionTitle eyebrow="Integration status" title="GoHighLevel API" />
        <div className="mt-5 flex flex-wrap gap-3">
          <StatusPill label="API integration: PENDING" tone="bronze" />
          <StatusPill label="Planning workspace: READY" tone="emerald" />
        </div>
      </ChamberPanel>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => <ChamberPanel key={section}><h2 className="font-display text-2xl text-ivory">{section}</h2><p className="mt-3 text-sm leading-6 text-soft-sand">Plan, track, and later connect this work to projects, agents, Obsidian, and activity.</p></ChamberPanel>)}
      </div>
    </OperatorPage>
  );
}
