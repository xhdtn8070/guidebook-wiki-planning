"use client";

import { LayoutShell } from "@/components/layout/LayoutShell";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return (
    <LayoutShell>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-xl border border-border bg-card shadow-theme-lg">
            <div className="mb-6">
              <span className="pill text-xs mb-3">OAuth</span>
              <h1 className="text-2xl font-bold mt-2">카카오로 시작하기</h1>
              <p className="text-muted-foreground mt-2">5초 만에 간편하게 로그인하세요.</p>
            </div>

            {redirect !== "/" && (
              <div className="mb-6 p-3 rounded-lg bg-muted text-sm">
                <span className="text-muted-foreground">로그인 후 이동: </span>
                <code className="text-primary">{redirect}</code>
              </div>
            )}

            <div className="space-y-3">
              <Button className="w-full h-12 bg-[#FEE500] text-[#191919] hover:bg-[#FDD800] font-semibold">
                카카오로 시작하기
              </Button>
              <Button variant="outline" className="w-full h-12 border-[#FEE500]/50 text-foreground">
                다른 카카오계정으로 시작하기
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              로그인 시 서비스 이용약관에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </main>
    </LayoutShell>
  );
}
