import { redirect } from "next/navigation";

type LegacyPageProps = {
  params: Promise<{ tenantId: string; guidebookId: string; pageId: string }>;
};

export default async function LegacyPage({ params }: LegacyPageProps) {
  const resolvedParams = await params;
  redirect(`/guidebooks/${resolvedParams.guidebookId}/pages/${resolvedParams.pageId}?tenantId=${resolvedParams.tenantId}`);
}
