"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search, Sun, Moon, Monitor, Palette, User, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { fetchWikiGroups, getDefaultPathForGroup, tenantInfo, wikiGroups, type WikiGroup } from "@/lib/wikiData";
import { useEffect, useState } from "react";

const modeLabels = {
  system: "시스템",
  light: "라이트",
  dark: "다크",
} as const;

type ThemeMode = keyof typeof modeLabels;

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [groups, setGroups] = useState<WikiGroup[]>(wikiGroups);
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchWikiGroups().then((res) => {
      if (res.data?.groups) {
        setGroups(res.data.groups);
      }
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode === "system" ? "light" : mode);
  }, [mode]);

  const handleDocGroupClick = (group: WikiGroup) => {
    if (!group.isUsable) return;
    const defaultPath = getDefaultPathForGroup(group.id);
    if (defaultPath) {
      router.push(`/docs/${defaultPath}?groupId=${group.id}`);
      setIsMenuOpen(false);
    }
  };

  const handleSearchFocus = () => {
    router.push("/search");
  };

  const getModeIcon = () => {
    if (mode === "system") return <Monitor className="h-4 w-4" />;
    if (mode === "dark") return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-surface-strong/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary font-extrabold text-sm">
            G
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold leading-tight">Guidebook Wiki</span>
            <span className="text-xs text-muted-foreground leading-tight">{tenantInfo.domain}</span>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-3 max-w-xl">
          <div className="relative">
            <Button
              variant="outline"
              className="gap-2 text-sm h-9 px-3"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-theme-md z-20">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">문서 그룹</div>
                <div className="divide-y divide-border">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      className="w-full px-3 py-3 text-left hover:bg-muted/40 disabled:opacity-50"
                      onClick={() => handleDocGroupClick(group)}
                      disabled={!group.isUsable}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{group.name}</span>
                        {group.status === "COMING_SOON" && (
                          <span className="pill text-[10px] py-0.5 px-1.5">Coming Soon</span>
                        )}
                        {group.status === "DRAFT" && (
                          <span className="bg-muted text-muted-foreground text-[10px] py-0.5 px-1.5 rounded-full">Draft</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">defaultPath: {group.defaultPath}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="문서 검색..."
              className="pl-9 pr-12 h-9 bg-secondary/50 border-border/50"
              onFocus={handleSearchFocus}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 px-2" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
            {getModeIcon()} <span className="hidden md:inline text-xs font-semibold">{modeLabels[mode]}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 hidden md:inline-flex"
          >
            <Palette className="h-4 w-4" />
            Midnight Console
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`)}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
