import type { ReactNode } from "react";
import type { ViewerSession } from "@/shared/lib/api-types";
import { GlobalHeader } from "@/shared/layout/global-header";

type AppShellProps = {
  viewer: ViewerSession;
  sidebar?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

export function AppShell({ viewer, sidebar, aside, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalHeader viewer={viewer} />
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-12 pt-8 md:px-8 lg:grid-cols-[260px_minmax(0,1fr)_220px]">
        <div className="hidden lg:block">{sidebar}</div>
        <main className="min-w-0">{children}</main>
        <div className="hidden xl:block">{aside}</div>
      </div>
    </div>
  );
}
