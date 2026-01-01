"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, FileText, Folder, Lock } from "lucide-react";
import { WikiNavNode } from "@/lib/wikiData";
import { clsx } from "clsx";

interface SidebarNavProps {
  groupId: string;
  nodes: WikiNavNode[];
  className?: string;
}

const isParentActive = (item: WikiNavNode, path: string): boolean => {
  if (path === item.fullPath) return true;
  return item.children?.some((child) => isParentActive(child, path)) ?? false;
};

export function SidebarNav({ groupId, nodes, className }: SidebarNavProps) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/^\/docs\//, "");

  const renderNavItem = (item: WikiNavNode, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = currentPath === item.fullPath;
    const parentActive = isParentActive(item, currentPath);

    return (
      <li key={item.id} className="animate-slide-in" style={{ animationDelay: `${level * 30}ms` }}>
        <Link
          href={`/docs/${item.fullPath}?groupId=${groupId}`}
          className={clsx(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150",
            "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30",
            active && "bg-primary/15 text-primary font-semibold",
            !active && parentActive && level === 0 && "text-foreground font-semibold",
            !active && !parentActive && "text-muted-foreground",
            !item.isUsable && "opacity-50 cursor-not-allowed hover:bg-transparent",
            level > 0 && "pl-6",
          )}
          aria-disabled={!item.isUsable}
          tabIndex={!item.isUsable ? -1 : 0}
        >
          {hasChildren ? <Folder className="h-4 w-4 flex-shrink-0" /> : <FileText className="h-4 w-4 flex-shrink-0" />}
          <span className="flex-1 text-left truncate">{item.title}</span>
          {!item.isUsable && <Lock className="h-3 w-3 flex-shrink-0" />}
          {hasChildren && item.isUsable && (
            <ChevronRight className={clsx("h-3 w-3 flex-shrink-0 transition-transform", parentActive && "rotate-90")} />
          )}
        </Link>

        {hasChildren && parentActive && (
          <ul className="mt-1 space-y-1 border-l border-border/50 ml-4">
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={clsx(
        "w-60 shrink-0 border-r border-border bg-surface-strong",
        "h-[calc(100vh-56px)] sticky top-14 overflow-hidden",
        className,
      )}
    >
      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        <nav aria-label="문서 네비게이션">
          <ul className="space-y-1">{nodes.map((item) => renderNavItem(item))}</ul>
        </nav>

        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            플러그인 블록
          </h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 transition-colors">
                <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  A
                </div>
                <span>API Console</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 transition-colors opacity-50 cursor-not-allowed">
                <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  W
                </div>
                <span>Workflow</span>
                <Lock className="h-3 w-3 ml-auto" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
