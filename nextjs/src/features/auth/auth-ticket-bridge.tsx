"use client";

import type { Route } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthTicketBridgeProps = {
  providerLabel?: string;
};

type BridgeState = "pending" | "success" | "error";

export function AuthTicketBridge({ providerLabel = "OAuth" }: AuthTicketBridgeProps) {
  const router = useRouter();
  const [state, setState] = useState<BridgeState>("pending");
  const [message, setMessage] = useState("로그인 티켓을 확인하는 중입니다.");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);
    const ticket = hashParams.get("ticket") ?? searchParams.get("ticket");

    if (!ticket) {
      setState("error");
      setMessage("티켓이 없어 로그인 세션을 복구하지 못했습니다.");
      return;
    }

    const exchange = async () => {
      const response = await fetch("/api/session/exchange-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket }),
      });

      const payload = (await response.json().catch(() => null)) as { redirectTo?: string; message?: string } | null;

      if (!response.ok) {
        setState("error");
        setMessage(payload?.message ?? "로그인 토큰을 저장하지 못했습니다.");
        return;
      }

      setState("success");
      setMessage(`${providerLabel} 세션을 연결했습니다. 작업 화면으로 이동합니다.`);
      router.replace((payload?.redirectTo || "/") as Route);
      router.refresh();
    };

    void exchange();
  }, [providerLabel, router]);

  return (
    <section className="animate-rise-in grid min-h-[calc(100vh-12rem)] gap-0 overflow-hidden border border-border bg-panel lg:grid-cols-2">
      <div className="flex items-center px-8 py-12 md:px-14">
        <div className="max-w-[480px]">
          <p className="editorial-eyebrow">{providerLabel}</p>
          <h1 className="mt-5 text-5xl text-foreground">{state === "success" ? "세션 연결 완료" : state === "error" ? "세션 연결 실패" : "세션 연결 중"}</h1>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">{message}</p>
          {state === "error" ? (
            <a href="/login" className="mt-8 inline-flex rounded-[6px] border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
              로그인으로 돌아가기
            </a>
          ) : null}
        </div>
      </div>

      <aside className="border-l border-border bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8de_100%)] px-8 py-12 md:px-12">
        <p className="editorial-eyebrow">Bridge status</p>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground">Ticket discovery</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">Hash fragment와 query parameter 모두에서 ticket를 확인합니다.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Session storage</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">브라우저 저장소가 아니라 httpOnly cookie에 세션을 고정해 이후 BFF 요청에서 사용합니다.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Redirect restore</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">성공 시 저장된 redirect 경로로 복귀하고, 실패 시 로그인 화면으로 되돌립니다.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
