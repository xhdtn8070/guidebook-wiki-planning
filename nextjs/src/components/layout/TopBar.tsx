"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Moon, Monitor, Palette, Search, Sun, User } from "@/components/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { docGroups } from "@/lib/mockData";
import { ThemeMode, ThemePreset, themeModes, themePresets } from "@/lib/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/components/ui/toaster";

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, mode, setTheme, setMode, effectiveMode } = useTheme();

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

  useEffect(() => {
    setIsDocsOpen(false);
    setIsThemeMenuOpen(false);
    setIsModeMenuOpen(false);
  }, [pathname]);

  const handleDocGroupClick = (groupId: string, isUsable: boolean) => {
    if (!isUsable) {
      toast.info("준비 중입니다", {
        description: "해당 문서는 곧 공개될 예정입니다.",
      });
      return;
    }
    router.push("/docs/getting-started");
    setIsDocsOpen(false);
  };

  const handleSearchFocus = () => {
    router.push("/search");
  };

  const getModeIcon = () => {
    if (mode === "system") return <Monitor className="h-4 w-4" />;
    if (effectiveMode === "dark") return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-surface-strong/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-90">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary font-extrabold text-sm">
            G
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold leading-tight">Guidebook Wiki</span>
            <span className="text-xs text-muted-foreground leading-tight">API 실전 플레이북</span>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-3 max-w-xl">
          <div className="relative">
            <Button
              variant="outline"
              className="gap-2 text-sm h-9 px-3"
              onClick={() => setIsDocsOpen((prev) => !prev)}
              aria-expanded={isDocsOpen}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            {isDocsOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-theme-md z-30">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">문서 그룹</div>
                <div className="divide-y divide-border">
                  {docGroups.map((group) => (
                    <button
                      key={group.id}
                      className={`w-full px-3 py-3 text-left hover:bg-muted/40 transition-colors ${!group.isUsable ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleDocGroupClick(group.id, group.isUsable)}
                      disabled={!group.isUsable}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{group.title}</span>
                        {group.status === "coming_soon" && (
                          <span className="pill text-[10px] py-0.5 px-1.5">Coming Soon</span>
                        )}
                        {group.status === "draft" && (
                          <span className="bg-muted text-muted-foreground text-[10px] py-0.5 px-1.5 rounded-full">Draft</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
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
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" onClick={() => setIsThemeMenuOpen((prev) => !prev)} aria-expanded={isThemeMenuOpen}>
              <Palette className="h-4 w-4" />
            </Button>
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-theme-md z-30">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">테마 선택</div>
                <div className="divide-y divide-border">
                  {(Object.keys(themePresets) as ThemePreset[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`w-full px-3 py-3 text-left hover:bg-muted/40 transition-colors ${theme === key ? "bg-accent/30" : ""}`}
                    >
                      <div className="font-medium">{themePresets[key].name}</div>
                      <div className="text-xs text-muted-foreground">{themePresets[key].description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsModeMenuOpen((prev) => !prev)} aria-expanded={isModeMenuOpen}>
              {getModeIcon()}
            </Button>
            {isModeMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-card shadow-theme-md z-30">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">컬러 모드</div>
                <div className="divide-y divide-border">
                  {(Object.keys(themeModes) as ThemeMode[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setMode(key)}
                      className={`w-full px-3 py-2 text-left hover:bg-muted/40 transition-colors ${mode === key ? "bg-accent/30" : ""}`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        {key === "system" && <Monitor className="h-4 w-4" />}
                        {key === "light" && <Sun className="h-4 w-4" />}
                        {key === "dark" && <Moon className="h-4 w-4" />}
                        {themeModes[key]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-primary/10 text-xs font-semibold">
            {themePresets[theme].name} · {effectiveMode === "dark" ? "다크" : "라이트"}
          </div>

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
