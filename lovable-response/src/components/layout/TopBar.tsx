import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemePreset, ThemeMode } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { fetchWikiGroups, getDefaultPathForGroup, tenantInfo, wikiGroups, WikiGroup } from "@/lib/wikiData";
import {
  ChevronDown,
  Search,
  Sun,
  Moon,
  Monitor,
  Palette,
  User,
  BookOpen,
} from "lucide-react";

export function TopBar() {
  const { theme, mode, setTheme, setMode, themePresets, themeModes, effectiveMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const groupsQuery = useQuery({
    queryKey: ["wiki-groups"],
    queryFn: fetchWikiGroups,
    initialData: { success: true, data: { groups: wikiGroups, tenantCode: tenantInfo.code }, error: null },
  });

  const groups = groupsQuery.data?.data?.groups ?? [];

  const handleDocGroupClick = (group: WikiGroup) => {
    if (!group.isUsable) {
      toast.info("준비 중입니다", {
        description: `${group.name} 문서는 곧 공개될 예정입니다.`,
      });
      return;
    }
    const defaultPath = getDefaultPathForGroup(group.id);
    if (defaultPath) {
      navigate(`/docs/${defaultPath}?groupId=${group.id}`);
    }
  };

  const handleSearchFocus = () => {
    navigate("/search");
  };

  const getModeIcon = () => {
    if (mode === "system") return <Monitor className="h-4 w-4" />;
    if (effectiveMode === "dark") return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-surface-strong/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary font-extrabold text-sm">
            G
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold leading-tight">Guidebook Wiki</span>
            <span className="text-xs text-muted-foreground leading-tight">{tenantInfo.domain}</span>
          </div>
        </Link>

        {/* Center: Docs Dropdown + Search */}
        <div className="flex flex-1 items-center justify-center gap-3 max-w-xl">
          {/* Docs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 text-sm h-9 px-3">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Docs</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>문서 그룹</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  className={`flex flex-col items-start gap-1 p-3 ${!group.isUsable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                  <span className="text-xs text-muted-foreground">
                    defaultPath: {group.defaultPath}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
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

        {/* Right: Theme controls + Login */}
        <div className="flex items-center gap-2">
          {/* Theme Preset */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>테마 선택</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(themePresets) as ThemePreset[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex flex-col items-start ${theme === key ? "bg-accent" : ""}`}
                >
                  <span className="font-medium">{themePresets[key].name}</span>
                  <span className="text-xs text-muted-foreground">{themePresets[key].description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {getModeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>컬러 모드</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(themeModes) as ThemeMode[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setMode(key)}
                  className={mode === key ? "bg-accent" : ""}
                >
                  <span className="flex items-center gap-2">
                    {key === "system" && <Monitor className="h-4 w-4" />}
                    {key === "light" && <Sun className="h-4 w-4" />}
                    {key === "dark" && <Moon className="h-4 w-4" />}
                    {themeModes[key]}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Chip (Desktop only) */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-primary/10 text-xs font-semibold">
            {themePresets[theme].name} · {effectiveMode === 'dark' ? '다크' : '라이트'}
          </div>

          {/* Login Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname)}`)}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
