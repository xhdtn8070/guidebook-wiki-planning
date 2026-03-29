"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { clsx } from "clsx";
import type { GuidebookSection, NavItem, PageDetail, ViewerSession, WikiNavTree } from "@/shared/lib/api-types";
import { buildAdminPageHref, buildLoginHref, buildPageHref, toFrontendHref } from "@/shared/lib/routes";
import { extractTableOfContents } from "@/shared/lib/sections";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Lock, PanelLeft, Pencil } from "@/shared/icons";
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
    return <StatusPanel eyebrow={error?.code ?? "PAGE"} title="문서를 불러오지 못했습니다." description={error?.message ?? "페이지 상세 응답이 비어 있습니다."} tone="warning" />;
  }

  const page = detail.page;
  const toc = extractTableOfContents(page.sections);

  return (
    <div className="space-y-6">
      <article className="surface-elevated overflow-hidden rounded-[32px] border border-border shadow-theme-lg">
        <header className="hero-gradient border-b border-border px-6 py-7 md:px-8 md:py-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="pill pill-ghost">Document</span>
            <span className="pill pill-ghost">Guidebook {page.guidebookId}</span>
            <span className="pill pill-ghost">{page.status}</span>
            <span className="pill pill-ghost">{page.accessPolicy}</span>
          </div>

          <nav className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {detail.navContext?.breadcrumb.map((item, index) => (
              <div key={item.pageId} className="flex items-center gap-2">
                {index > 0 ? <ChevronRight className="h-4 w-4 text-muted-foreground/70" /> : null}
                <Link href={toFrontendHref(item.url) as Route} className="hover:text-foreground">
                  {item.title}
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">{page.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/78">
                page #{page.pageId} · status {page.status} · access {page.accessPolicy} · tenant {page.tenantId}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/35 px-4 py-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Reader ready
              </span>
              <Link href={buildAdminPageHref(page.pageId, tenantId) as Route} className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/12 px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary/18">
                <Pencil className="h-4 w-4" />
                관리 진입
              </Link>
            </div>
          </div>
        </header>

        <div className="px-6 py-7 md:px-8 md:py-8">
          <div className="mb-6 rounded-[24px] border border-border bg-background/35 px-5 py-4 lg:hidden">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PanelLeft className="h-4 w-4 text-primary" />
              On this page
            </div>
            <ol className="mt-4 space-y-2">
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

          <SectionRenderer sections={page.sections} />
        </div>
      </article>

      <nav className="grid gap-3 md:grid-cols-2">
        <PagePagerCard direction="prev" item={detail.navContext?.prev ?? null} tenantId={tenantId} />
        <PagePagerCard direction="next" item={detail.navContext?.next ?? null} tenantId={tenantId} />
      </nav>

      {nav ? (
        <div className="surface-elevated rounded-[28px] border border-border px-5 py-5 shadow-theme-md lg:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Navigation
          </div>
          <div className="mt-4">
            <NavTree items={nav.items} tenantId={tenantId} activePageId={page.pageId} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function WikiSidebarPanel({
  nav,
  tenantId,
  activePageId,
}: {
  nav: WikiNavTree | null;
  tenantId: number;
  activePageId: number;
}) {
  return (
    <aside className="sticky top-20 surface-elevated rounded-[28px] border border-[hsl(var(--sidebar-border))] px-4 py-5 shadow-theme-md">
      <div className="flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold text-foreground">
        <PanelLeft className="h-4 w-4 text-primary" />
        Navigation
      </div>
      <div className="mt-4 custom-scrollbar max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
        {nav ? <NavTree items={nav.items} tenantId={tenantId} activePageId={activePageId} /> : <p className="text-sm text-muted-foreground">네비게이션이 비어 있습니다.</p>}
      </div>
    </aside>
  );
}

export function WikiTocPanel({ sections }: { sections: GuidebookSection[] }) {
  const toc = extractTableOfContents(sections);

  return (
    <aside className="sticky top-20 surface-elevated rounded-[28px] border border-border px-4 py-5 shadow-theme-md">
      <p className="border-b border-border pb-3 text-sm font-semibold text-foreground">On this page</p>
      <ol className="mt-4 space-y-3">
        {toc.length > 0 ? (
          toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="block text-sm text-muted-foreground hover:text-foreground" style={{ paddingLeft: `${(item.level - 1) * 10}px` }}>
                {item.label}
              </a>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">헤딩 섹션이 아직 없습니다.</li>
        )}
      </ol>
    </aside>
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
          "block rounded-xl px-3 py-2 text-sm transition-colors",
          isActive ? "bg-primary/12 font-medium text-foreground" : isParent ? "text-foreground" : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
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
    return (
      <div className="surface-elevated rounded-[24px] border border-border px-5 py-5 text-sm text-muted-foreground shadow-theme-md">
        {direction === "prev" ? "이전 문서가 없습니다." : "다음 문서가 없습니다."}
      </div>
    );
  }

  return (
    <Link
      href={buildPageHref({ guidebookId: parseGuidebookId(item.url), pageId: item.pageId, tenantId }) as Route}
      className="surface-elevated rounded-[24px] border border-border px-5 py-5 shadow-theme-md transition-colors hover:bg-background/40"
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {direction === "prev" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        {direction === "prev" ? "Previous" : "Next"}
      </div>
      <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">{item.title}</p>
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
            <div
              key={`callout-${index}`}
              className={clsx(
                "rounded-[24px] border px-5 py-4",
                section.variant === "WARNING" && "border-yellow-500/30 bg-yellow-500/10",
                section.variant === "DANGER" && "border-red-500/30 bg-red-500/10",
                section.variant === "SUCCESS" && "border-emerald-500/30 bg-emerald-500/10",
                (section.variant === "INFO" || !section.variant) && "border-primary/25 bg-primary/[0.08]",
              )}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{section.variant}</p>
              {section.title ? <p className="mt-2 text-base font-semibold text-foreground">{section.title}</p> : null}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.content}</p>
            </div>
          );
        }

        if (section.type === "CODE") {
          return (
            <div key={`code-${index}`} className="overflow-hidden rounded-[24px] border border-border bg-background/35 shadow-theme-sm">
              <div className="border-b border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{section.lang || "code"}</div>
              <pre className="code-block whitespace-pre-wrap text-sm leading-7 text-foreground">
                <code>{section.content}</code>
              </pre>
            </div>
          );
        }

        if (section.type === "TABLE") {
          return (
            <div key={`table-${index}`} className="overflow-hidden rounded-[24px] border border-border shadow-theme-sm">
              <table className="w-full border-collapse text-sm">
                {section.headers?.length ? (
                  <thead className="bg-background/40 text-left">
                    <tr>
                      {section.headers.map((header) => (
                        <th key={header} className="border-b border-border px-4 py-3 font-semibold text-foreground">
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
            <div key={`image-${index}`} className="rounded-[24px] border border-dashed border-border bg-background/35 px-5 py-8 text-sm text-muted-foreground">
              이미지 섹션
              {section.alt ? ` · ${section.alt}` : ""}
              {section.url ? ` · ${section.url}` : ""}
            </div>
          );
        }

        if (section.type === "VIDEO") {
          return (
            <div key={`video-${index}`} className="rounded-[24px] border border-dashed border-border bg-background/35 px-5 py-8 text-sm text-muted-foreground">
              비디오 섹션 · file #{section.fileId}
            </div>
          );
        }

        if (section.type === "TABS") {
          return <TabsBlock key={`tabs-${index}`} items={section.items} />;
        }

        return (
          <div key={`unknown-${index}`} className="rounded-[24px] border border-border bg-background/35 px-5 py-5 text-sm text-muted-foreground">
            알 수 없는 섹션입니다.
          </div>
        );
      })}
    </div>
  );
}

function renderHeading(level: number, id: string, text: string, index: number) {
  const className = "scroll-mt-24 text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]";
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
    <div className="space-y-4 text-base leading-8 text-foreground">
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
    <div className="overflow-hidden rounded-[24px] border border-border bg-background/30 shadow-theme-sm">
      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={clsx(
              "rounded-xl px-3 py-1.5 text-sm transition-colors",
              item.key === active.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
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
