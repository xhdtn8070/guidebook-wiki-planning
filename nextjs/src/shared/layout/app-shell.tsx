import type { ReactNode } from "react";
import type { ViewerSession } from "@/shared/lib/api-types";
import { GlobalHeader } from "@/shared/layout/global-header";
import { WorkspaceRail } from "@/shared/layout/workspace-rail";

type AppShellProps = {
  viewer: ViewerSession;
  sidebar?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  variant?: "auto" | "workspace" | "minimal";
};

export function AppShell({ viewer, sidebar, aside, children, variant = "auto" }: AppShellProps) {
  const resolvedVariant = variant === "auto" ? (viewer.user ? "workspace" : "minimal") : variant;

  if (resolvedVariant === "workspace") {
    return (
      <div className="site-shell min-h-screen bg-background text-foreground">
        <GlobalHeader viewer={viewer} variant="workspace" />
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-12">
          <WorkspaceRail viewer={viewer} />
          <main className="min-w-0 px-5 py-8 md:px-8 lg:col-span-10 lg:border-l lg:border-border/70 lg:px-10 lg:py-10">
            {sidebar || aside ? (
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="hidden lg:col-span-3 lg:block">{sidebar}</div>
                <div className="min-w-0 lg:col-span-6">{children}</div>
                <div className="hidden xl:col-span-3 xl:block">{aside}</div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell min-h-screen bg-background text-foreground">
      <GlobalHeader viewer={viewer} variant="minimal" />
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-10 md:px-8">
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
