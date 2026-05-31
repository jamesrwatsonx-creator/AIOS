import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type LegacyGuardianRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LegacyGuardianRoute({ params }: LegacyGuardianRouteProps) {
  const { slug } = await params;
  redirect(`/agents/${slug}`);
}
