"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Layers, Spark } from "@/shared/icons";
import { slugifyCode } from "@/shared/lib/slugs";
import { buttonStyles } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type OnboardingFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  redirectTo: string | null;
};

export function OnboardingForm({ action, redirectTo }: OnboardingFormProps) {
  const [tenantName, setTenantName] = useState("");
  const [tenantCode, setTenantCode] = useState("");
  const [tenantCodeLocked, setTenantCodeLocked] = useState(false);
  const [guidebookName, setGuidebookName] = useState("Core Docs");
  const [guidebookCode, setGuidebookCode] = useState("core-docs");
  const [guidebookCodeLocked, setGuidebookCodeLocked] = useState(false);

  useEffect(() => {
    if (!tenantCodeLocked) {
      setTenantCode(slugifyCode(tenantName, "workspace"));
    }
  }, [tenantCodeLocked, tenantName]);

  useEffect(() => {
    if (!guidebookCodeLocked) {
      setGuidebookCode(slugifyCode(guidebookName, "guidebook"));
    }
  }, [guidebookCodeLocked, guidebookName]);

  return (
    <form action={action} className="surface-elevated rounded-[32px] border border-border px-6 py-6 shadow-theme-lg md:px-8">
      <input type="hidden" name="redirect" value={redirectTo ?? ""} />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="pill">Onboarding</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">첫 워크스페이스와 첫 guidebook을 한 번에 생성합니다.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            tenant와 guidebook만 만들면 `/tenant/[tenantId]`, search, reader, admin entry가 모두 실제 데이터 위에서 움직입니다. 이 화면은 소개 이후 첫 진입을
            위한 최소 생성 플로우입니다.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-border bg-background/55 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                Tenant first
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">workspace 이름과 코드가 먼저 정해집니다.</p>
            </div>
            <div className="rounded-[24px] border border-border bg-background/55 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Spark className="h-4 w-4 text-primary" />
                Guidebook ready
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">첫 guidebook까지 만들고 바로 workspace hub로 이동합니다.</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace name</label>
            <Input
              name="tenantName"
              value={tenantName}
              onChange={(event) => setTenantName(event.target.value)}
              placeholder="예: Guidebook Platform"
              className="h-12 rounded-2xl"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace code</label>
            <Input
              name="tenantCode"
              value={tenantCode}
              onChange={(event) => {
                setTenantCodeLocked(true);
                setTenantCode(event.target.value);
              }}
              placeholder="guidebook-platform"
              className="h-12 rounded-2xl"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Visibility</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-[22px] border border-border bg-background/55 px-4 py-4 text-sm text-foreground">
                <input type="radio" name="visibility" value="PRIVATE" defaultChecked className="mr-2 accent-[hsl(var(--primary))]" />
                Private workspace
              </label>
              <label className="rounded-[22px] border border-border bg-background/55 px-4 py-4 text-sm text-foreground">
                <input type="radio" name="visibility" value="PUBLIC" className="mr-2 accent-[hsl(var(--primary))]" />
                Public workspace
              </label>
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">First guidebook</label>
            <Input
              name="guidebookName"
              value={guidebookName}
              onChange={(event) => setGuidebookName(event.target.value)}
              placeholder="예: Core Docs"
              className="h-12 rounded-2xl"
              required
            />
            <Input
              name="guidebookCode"
              value={guidebookCode}
              onChange={(event) => {
                setGuidebookCodeLocked(true);
                setGuidebookCode(event.target.value);
              }}
              placeholder="core-docs"
              className="h-12 rounded-2xl"
              required
            />
            <textarea
              name="guidebookDescription"
              placeholder="이 guidebook이 어떤 문서 집합인지 간단히 설명합니다."
              className="min-h-[132px] w-full rounded-[24px] border border-border bg-input/80 px-4 py-3 text-sm text-foreground shadow-theme-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={buttonStyles({ size: "lg" })} disabled={pending}>
      {pending ? "워크스페이스 생성 중..." : "워크스페이스 만들기"}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
