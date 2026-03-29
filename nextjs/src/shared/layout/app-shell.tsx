import type { ReactNode } from "react";
import { clsx } from "clsx";
import type { ViewerSession } from "@/shared/lib/api-types";
import { GlobalHeader } from "@/shared/layout/global-header";

type AppShellProps = {
  viewer: ViewerSession;
  preferredTenantId?: number | null;
  sidebar?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

export function AppShell({ viewer, preferredTenantId = null, sidebar, aside, children }: AppShellProps) {
  const hasSidebar = Boolean(sidebar);
  const hasAside = Boolean(aside);

  return (
    <div className="page-shell bg-background text-foreground">
      <GlobalHeader viewer={viewer} preferredTenantId={preferredTenantId} />
      <div
        className={clsx(
          "mx-auto w-full px-4 pb-12 pt-6 md:px-6 xl:px-8",
          hasSidebar || hasAside ? "max-w-[1600px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[260px_minmax(0,1fr)_220px]" : "max-w-[1360px]",
        )}
      >
        <div className={clsx("hidden lg:block", hasSidebar ? "" : "lg:hidden")}>{sidebar}</div>
        <main className="min-w-0">{children}</main>
        <div className={clsx("hidden xl:block", hasAside ? "" : "xl:hidden")}>{aside}</div>
      </div>
    </div>
  );
}
