import { Suspense } from "react";
import { HermesCommandChamber } from "@/components/hermes/HermesCommandChamber";
import { AppShell } from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";

export default function HermesPage() {
  return (
    <AppShell>
      <Suspense>
        <HermesCommandChamber />
      </Suspense>
    </AppShell>
  );
}
