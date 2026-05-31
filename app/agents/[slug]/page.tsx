import { notFound } from "next/navigation";
import { GuardianProfilePage } from "@/components/guardians/GuardianProfilePage";
import { AppShell } from "@/components/layout/AppShell";
import { getGuardian, guardians } from "@/lib/guardians";

export const dynamic = "force-dynamic";

type AgentRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guardians.map((guardian) => ({ slug: guardian.slug }));
}

export default async function AgentRoute({ params }: AgentRouteProps) {
  const { slug } = await params;

  if (!getGuardian(slug)) {
    notFound();
  }

  return (
    <AppShell>
      <GuardianProfilePage slug={slug} />
    </AppShell>
  );
}
