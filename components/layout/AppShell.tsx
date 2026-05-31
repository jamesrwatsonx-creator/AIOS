import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopStatusBar } from "@/components/layout/TopStatusBar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { QuickCapture } from "@/components/capture/QuickCapture";
import { EntityInspector } from "@/components/entities/EntityInspector";
import { MorningBrief } from "@/components/hermes/MorningBrief";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0 px-4 py-4 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[96rem] gap-6">
          <TopStatusBar />
          {children}
        </div>
      </div>
      <NotificationCenter />
      <GlobalSearch />
      <QuickCapture />
      <MorningBrief />
      <EntityInspector />
    </div>
  );
}
