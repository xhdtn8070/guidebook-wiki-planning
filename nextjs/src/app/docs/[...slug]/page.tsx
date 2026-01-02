import { LayoutShell } from "@/components/layout/LayoutShell";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { OnPageTOC } from "@/components/layout/OnPageTOC";
import { DocContent } from "@/components/wiki/DocContent";
import { DocHeader } from "@/components/wiki/DocHeader";
import { Button } from "@/components/ui/button";
import { sampleDocPage } from "@/lib/mockData";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { redirect } from "next/navigation";

interface DocsPageProps {
  params: { slug?: string[] };
}

export default function DocsPage({ params }: DocsPageProps) {
  const slugArray = params.slug ?? [];
  if (slugArray.length === 0) {
    redirect("/docs/getting-started");
  }

  const doc = sampleDocPage;

  return (
    <LayoutShell>
      <div className="flex flex-1">
        <SidebarNav />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <nav className="text-sm text-muted-foreground mb-4">{doc.breadcrumb}</nav>

            <DocHeader page={doc} />
            <DocContent page={doc} />

            <nav className="flex justify-between mt-12 pt-6 border-t border-border">
              <Button variant="ghost" className="gap-2">
                <ChevronLeft className="h-4 w-4" /> 이전: 빠른 시작
              </Button>
              <Button variant="ghost" className="gap-2">
                다음: Google OAuth <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </main>

        <OnPageTOC items={doc.toc} />
      </div>
    </LayoutShell>
  );
}
