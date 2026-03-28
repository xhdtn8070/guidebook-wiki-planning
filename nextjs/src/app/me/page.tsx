import { AppShell } from "@/shared/layout/app-shell";
import { loadViewerSession } from "@/server/api";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const viewer = await loadViewerSession();

  return (
    <AppShell viewer={viewer}>
      <section className="space-y-8">
        <header className="border-b border-border pb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Session</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground">현재 사용자와 워크스페이스 컨텍스트</h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-border bg-panel px-6 py-6">
            <p className="text-sm font-medium text-foreground">Viewer</p>
            <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[24px] bg-background px-4 py-4 text-xs leading-6 text-muted-foreground">
              {JSON.stringify(viewer.user, null, 2)}
            </pre>
          </section>
          <section className="rounded-[28px] border border-border bg-panel px-6 py-6">
            <p className="text-sm font-medium text-foreground">Tenants</p>
            <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[24px] bg-background px-4 py-4 text-xs leading-6 text-muted-foreground">
              {JSON.stringify(
                {
                  activeTenantId: viewer.activeTenantId,
                  items: viewer.tenants,
                },
                null,
                2,
              )}
            </pre>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
