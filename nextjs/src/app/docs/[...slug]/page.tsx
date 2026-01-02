import { LayoutShell } from "@/components/layout/LayoutShell";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { OnPageTOC } from "@/components/layout/OnPageTOC";
import { DocContent } from "@/components/wiki/DocContent";
import { DocHeader } from "@/components/wiki/DocHeader";
import { Button } from "@/components/ui/button";
import {
  fetchWikiGroups,
  fetchWikiNav,
  fetchWikiPage,
  getDefaultPathForGroup,
  getPagerForPath,
  wikiGroups,
  wikiNavTree,
} from "@/lib/wikiData";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { notFound, redirect } from "next/navigation";

interface DocsPageProps {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DocsPage({ params, searchParams }: DocsPageProps) {
  const groupsResponse = await fetchWikiGroups();
  const groups = groupsResponse.data?.groups ?? wikiGroups;
  const groupId = (searchParams.groupId as string | undefined) ?? groups[0]?.id;

  const slugArray = params.slug ?? [];
  const joinedSlug = slugArray.join("/");

  if (!joinedSlug) {
    const fallbackPath = getDefaultPathForGroup(groupId);
    if (fallbackPath) {
      redirect(`/docs/${fallbackPath}?groupId=${groupId}`);
    }
  }

  const navResponse = groupId ? await fetchWikiNav(groupId) : null;
  const navNodes = navResponse?.data?.nodes ?? (groupId ? wikiNavTree[groupId] ?? [] : []);

  const pageResponse = groupId && joinedSlug ? await fetchWikiPage(groupId, joinedSlug) : null;

  if (!pageResponse?.data) {
    notFound();
  }

  const page = pageResponse.data!;
  const pager = getPagerForPath(navNodes, page.fullPath);

  return (
    <LayoutShell>
      <div className="flex flex-1">
        <SidebarNav groupId={page.groupId} nodes={navNodes} />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <nav className="text-sm text-muted-foreground mb-4">{page.breadcrumb.join(" / ")}</nav>

            <DocHeader page={page} />
            <DocContent page={page} />

            <nav className="flex justify-between mt-12 pt-6 border-t border-border">
              {pager.prev ? (
                <Button
                  asChild
                  variant="ghost"
                  className="gap-2"
                >
                  <a href={`/docs/${pager.prev.fullPath}?groupId=${page.groupId}`}>
                    <ChevronLeft className="h-4 w-4" /> 이전: {pager.prev.title}
                  </a>
                </Button>
              ) : (
                <span className="text-muted-foreground text-sm">이전 문서 없음</span>
              )}
              {pager.next ? (
                <Button
                  asChild
                  variant="ghost"
                  className="gap-2"
                >
                  <a href={`/docs/${pager.next.fullPath}?groupId=${page.groupId}`}>
                    다음: {pager.next.title} <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <span className="text-muted-foreground text-sm">다음 문서 없음</span>
              )}
            </nav>
          </div>
        </main>

        <OnPageTOC items={page.toc} />
      </div>
    </LayoutShell>
  );
}
