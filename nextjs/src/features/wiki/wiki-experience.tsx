"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { clsx } from "clsx";
import type { GuidebookSection, NavItem, PageDetail, ViewerSession, WikiNavTree } from "@/shared/lib/api-types";
import { buildAdminPageHref, buildLoginHref, buildPageHref, toFrontendHref } from "@/shared/lib/routes";
import { extractTableOfContents } from "@/shared/lib/sections";
import { ArrowLeft, ArrowRight, PanelLeft, Pencil } from "@/shared/icons";
import { StatusPanel } from "@/shared/ui/status-panel";

type WikiExperienceProps = {
  viewer: ViewerSession;
  tenantId: number | null;
  guidebookId: number;
  pageId: number;
  detail: PageDetail | null;
  nav: WikiNavTree | null;
  error?: {
    code: string;
    message: string;
  } | null;
};

export function WikiExperience({ viewer, tenantId, guidebookId, pageId, detail, nav, error }: WikiExperienceProps) {
  if (!viewer.user) {
    return (
      <StatusPanel
        eyebrow="Auth"
        title="문서를 읽기 전에 로그인해야 합니다."
        description="현재 페이지 상세 API는 인증과 tenant 컨텍스트가 모두 필요합니다."
        actionHref={buildLoginHref(buildPageHref({ guidebookId, pageId, tenantId }))}
        actionLabel="로그인"
      />
    );
  }

  if (!tenantId) {
    return (
      <StatusPanel
        eyebrow="Tenant"
        title="tenant 컨텍스트가 아직 없습니다."
        description="문서 상세와 네비게이션은 모두 `X-Tenant-Id` 헤더를 요구합니다. 상단 workspace를 고르거나 URL에 `tenantId`를 포함해 진입하세요."
        tone="warning"
      />
    );
  }

  if (error || !detail) {
    return (
      <StatusPanel
        eyebrow={error?.code ?? "PAGE"}
        title="문서를 불러오지 못했습니다."
        description={error?.message ?? "페이지 상세 응답이 비어 있습니다."}
        tone="warning"
      />
    );
  }

  const page = detail.page;
  const toc = extractTableOfContents(page.sections);
  const lead = summarizeLead(page.sections);

  return (
    <div className="animate-rise-in grid gap-8 xl:grid-cols-12">
      <aside className="hidden xl:col-span-3 xl:block">
        <div className="sticky top-24">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <PanelLeft className="h-4 w-4" />
              Navigation
            </div>
          </div>
          <div className="mt-4">
            {nav ? <NavTree items={nav.items} tenantId={tenantId} activePageId={page.pageId} /> : <p className="text-sm text-muted-foreground">네비게이션이 비어 있습니다.</p>}
          </div>
        </div>
      </aside>

      <div className="min-w-0 xl:col-span-6">
        <article>
          <header className="border-b border-border pb-10">
            <p className="editorial-eyebrow">Archive / document page</p>
            <nav className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {detail.navContext?.breadcrumb.map((item, index) => (
                <span key={item.pageId} className="flex items-center gap-2">
                  {index > 0 ? <span>/</span> : null}
                  <Link href={toFrontendHref(item.url) as Route} className="hover:text-foreground">
                    {item.title}
                  </Link>
                </span>
              ))}
            </nav>

            <div className="mt-5 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-9">
                <h1 className="max-w-4xl text-5xl text-foreground md:text-6xl">{page.title}</h1>
                {lead ? <p className="mt-6 max-w-3xl text-sm leading-8 text-muted-foreground">{lead}</p> : null}
                <div className="mt-6 flex flex-wrap gap-5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Guidebook {page.guidebookId}</span>
                  <span>Page {page.pageId}</span>
                  <span>Status {page.status}</span>
                  <span>Access {page.accessPolicy}</span>
                </div>
              </div>

              <div className="border-l border-border pl-5 lg:col-span-3">
                <Link
                  href={buildAdminPageHref(page.pageId, tenantId) as Route}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-primary bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground"
                >
                  <Pencil className="h-4 w-4" />
                  관리 진입
                </Link>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  읽기 화면과 관리자 화면은 같은 page id를 공유합니다. 검색과 운영 흐름이 별도 URL 체계로 갈라지지 않도록 고정했습니다.
                </p>
              </div>
            </div>
          </header>

          <div className="pt-10">
            <SectionRenderer sections={page.sections} />
          </div>
        </article>

        <nav className="mt-14 grid gap-4 md:grid-cols-2">
          <PagePagerCard direction="prev" item={detail.navContext?.prev ?? null} tenantId={tenantId} />
          <PagePagerCard direction="next" item={detail.navContext?.next ?? null} tenantId={tenantId} />
        </nav>
      </div>

      <aside className="hidden xl:col-span-3 xl:block">
        <div className="sticky top-24 space-y-8">
          <div className="border-l border-border pl-5">
            <p className="editorial-eyebrow">Page meta</p>
            <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em]">Tenant</dt>
                <dd className="mt-1 text-foreground">{tenantId}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em]">Guidebook</dt>
                <dd className="mt-1 text-foreground">{guidebookId}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em]">Access</dt>
                <dd className="mt-1 text-foreground">{page.accessPolicy}</dd>
              </div>
            </dl>
          </div>

          <div className="border-l border-border pl-5">
            <p className="editorial-eyebrow">On this page</p>
            <ol className="mt-4 space-y-3">
              {toc.length > 0 ? (
                toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-foreground" style={{ paddingLeft: `${(item.level - 1) * 10}px` }}>
                      {item.label}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">헤딩 섹션이 아직 없습니다.</li>
              )}
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}

function NavTree({ items, tenantId, activePageId }: { items: NavItem[]; tenantId: number; activePageId: number }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <NavTreeItem key={item.pageId} item={item} tenantId={tenantId} activePageId={activePageId} depth={0} />
      ))}
    </ul>
  );
}

function NavTreeItem({
  item,
  tenantId,
  activePageId,
  depth,
}: {
  item: NavItem;
  tenantId: number;
  activePageId: number;
  depth: number;
}) {
  const isActive = item.pageId === activePageId;
  const isParent = containsPage(item.children, activePageId);

  return (
    <li>
      <Link
        href={buildPageHref({ guidebookId: parseGuidebookId(item.url), pageId: item.pageId, tenantId }) as Route}
        className={clsx(
          "block rounded-[6px] px-3 py-2.5 text-sm",
          isActive ? "bg-panel text-foreground" : isParent ? "text-foreground" : "text-muted-foreground hover:bg-panel hover:text-foreground",
        )}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {item.title}
      </Link>
      {item.children.length > 0 ? (
        <ul className="mt-1 space-y-1">
          {item.children.map((child) => (
            <NavTreeItem key={child.pageId} item={child} tenantId={tenantId} activePageId={activePageId} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function containsPage(items: NavItem[], pageId: number): boolean {
  return items.some((item) => item.pageId === pageId || containsPage(item.children, pageId));
}

function PagePagerCard({
  direction,
  item,
  tenantId,
}: {
  direction: "prev" | "next";
  item: { pageId: number; title: string; url: string } | null;
  tenantId: number;
}) {
  if (!item) {
    return <div className="border border-border bg-panel px-5 py-5 text-sm text-muted-foreground">{direction === "prev" ? "이전 문서가 없습니다." : "다음 문서가 없습니다."}</div>;
  }

  return (
    <Link href={buildPageHref({ guidebookId: parseGuidebookId(item.url), pageId: item.pageId, tenantId }) as Route} className="border border-border bg-panel px-5 py-5 hover:bg-panel-soft">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {direction === "prev" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        {direction === "prev" ? "Previous" : "Next"}
      </div>
      <p className="mt-3 text-2xl text-foreground">{item.title}</p>
    </Link>
  );
}

function SectionRenderer({ sections }: { sections: GuidebookSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (section.type === "HEADING") {
          const id = section.id ?? `section-${index + 1}`;
          return renderHeading(section.level, id, section.text, index);
        }

        if (section.type === "MARKDOWN") {
          return <MarkdownBlock key={`markdown-${index}`} content={section.content} />;
        }

        if (section.type === "CALLOUT") {
          return (
            <div key={`callout-${index}`} className="border border-border bg-panel px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{section.variant}</p>
              {section.title ? <p className="mt-2 text-base font-medium text-foreground">{section.title}</p> : null}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.content}</p>
            </div>
          );
        }

        if (section.type === "CODE") {
          return (
            <div key={`code-${index}`} className="overflow-hidden border border-border bg-panel">
              <div className="border-b border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{section.lang || "code"}</div>
              <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-foreground">
                <code>{section.content}</code>
              </pre>
            </div>
          );
        }

        if (section.type === "TABLE") {
          return (
            <div key={`table-${index}`} className="overflow-hidden border border-border">
              <table className="w-full border-collapse text-sm">
                {section.headers?.length ? (
                  <thead className="bg-panel-soft text-left">
                    <tr>
                      {section.headers.map((header) => (
                        <th key={header} className="border-b border-border px-4 py-3 font-medium text-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {section.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`} className="border-b border-border last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (section.type === "IMAGE") {
          return (
            <div key={`image-${index}`} className="border border-dashed border-border bg-panel-soft px-5 py-8 text-sm text-muted-foreground">
              이미지 섹션
              {section.alt ? ` · ${section.alt}` : ""}
              {section.url ? ` · ${section.url}` : ""}
            </div>
          );
        }

        if (section.type === "VIDEO") {
          return (
            <div key={`video-${index}`} className="border border-dashed border-border bg-panel-soft px-5 py-8 text-sm text-muted-foreground">
              비디오 섹션 · file #{section.fileId}
            </div>
          );
        }

        if (section.type === "TABS") {
          return <TabsBlock key={`tabs-${index}`} items={section.items} />;
        }

        return (
          <div key={`unknown-${index}`} className="border border-border bg-panel-soft px-5 py-5 text-sm text-muted-foreground">
            알 수 없는 섹션입니다.
          </div>
        );
      })}
    </div>
  );
}

function renderHeading(level: number, id: string, text: string, index: number) {
  const className = clsx(
    "scroll-mt-24 text-foreground",
    level <= 2 && "text-4xl",
    level === 3 && "text-3xl",
    level >= 4 && "text-2xl",
  );
  const key = `${id}-${index}`;

  if (level <= 1) {
    return (
      <h1 key={key} id={id} className={className}>
        {text}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 key={key} id={id} className={className}>
        {text}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 key={key} id={id} className={className}>
        {text}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4 key={key} id={id} className={className}>
        {text}
      </h4>
    );
  }
  if (level === 5) {
    return (
      <h5 key={key} id={id} className={className}>
        {text}
      </h5>
    );
  }
  return (
    <h6 key={key} id={id} className={className}>
      {text}
    </h6>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return (
    <div className="space-y-5 text-base leading-8 text-foreground">
      {blocks.map((block, index) => {
        if (block.startsWith("- ")) {
          const items = block.split("\n").map((line) => line.replace(/^- /, "").trim());
          return (
            <ul key={`list-${index}`} className="list-disc space-y-2 pl-6 text-muted-foreground">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="whitespace-pre-wrap text-muted-foreground">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function TabsBlock({ items }: { items: { key: string; label: string; content: GuidebookSection[] }[] }) {
  const [activeKey, setActiveKey] = useState(items[0]?.key);
  const active = items.find((item) => item.key === activeKey) ?? items[0];

  if (!active) {
    return null;
  }

  return (
    <div className="border border-border bg-panel">
      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={clsx(
              "rounded-[6px] px-3 py-1.5 text-sm",
              item.key === active.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-panel-soft hover:text-foreground",
            )}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="px-4 py-5">
        <SectionRenderer sections={active.content} />
      </div>
    </div>
  );
}

function parseGuidebookId(url: string) {
  const match = url.match(/\/g\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

function summarizeLead(sections: GuidebookSection[]) {
  for (const section of sections) {
    if (section.type === "MARKDOWN") {
      const text = section.content.replace(/[#*_`>-]/g, " ").replace(/\s+/g, " ").trim();
      if (text) {
        return text.slice(0, 220);
      }
    }
  }
  return null;
}
