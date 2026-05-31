import { OperatorPage } from "@/components/operator/OperatorPage";
import { ChamberPanel } from "@/components/ui/ChamberPanel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/ui/StatusPill";

const sections = [
  ["Scheduled tasks", "Recurring work that should run on a timer."],
  ["Recurring research", "Browser or knowledge scans that should repeat."],
  ["Overnight workflows", "Long-running tasks planned for future 24/7 mode."],
  ["n8n status", "Verify actual runtime from Settings before relying on it."],
  ["Cloud server status", "Future hosted runtime for always-on operations."],
  ["Pending automations", "Workflows designed but not active yet."],
  ["Completed automations", "Finished runs and handoffs."],
  ["Failure logs", "Errors that need review before automation is trusted."]
];

export function AutomationsChamber() {
  return (
    <OperatorPage
      eyebrow="Maat / Automations"
      title="Automations"
      description="Plan and monitor repeatable AIOS workflows. Maat remains the agent identity underneath; the surface is organized around what an operator needs to run safely."
      status="n8n runtime: verify actual status"
      capabilities={[
        "Track scheduled and recurring work without pretending it is already 24/7.",
        "Connect automation ideas to projects, agents, activity, and Obsidian notes.",
        "Keep failure logs visible so unattended workflows are not trusted blindly.",
        "Preserve Maat automation concepts while using plain English labels."
      ]}
      recent={["Automation concepts preserved from Maat.", "n8n runtime is configurable in Settings.", "Cloud server and 24/7 mode remain future work."]}
      nextActions={[
        { label: "Verify whether n8n is running from Settings.", href: "/settings", status: "VERIFY" },
        { label: "Choose one recurring research workflow to define.", href: "/browser" },
        { label: "Link the automation to an active project.", href: "/projects" }
      ]}
      systems={["Entity graph: automation", "Obsidian: 08-Automations/", "Activity log", "n8n settings"]}
    >
      <ChamberPanel>
        <SectionTitle eyebrow="Runtime truth" title="Current Automation Status" />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <StatusPill label="n8n runtime: VERIFY" tone="bronze" />
          <StatusPill label="Cloud server: FUTURE" tone="blue" />
          <StatusPill label="24/7 mode: FUTURE" tone="blue" />
        </div>
      </ChamberPanel>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(([title, body]) => (
          <ChamberPanel key={title}>
            <h2 className="font-display text-2xl text-ivory">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-soft-sand">{body}</p>
          </ChamberPanel>
        ))}
      </div>
    </OperatorPage>
  );
}
