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
    <section className="mx-auto max-w-2xl rounded-[32px] border border-border bg-panel px-7 py-10 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{providerLabel}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">
        {state === "success" ? "세션 연결 완료" : "세션 연결 중"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{message}</p>
      {state === "error" ? (
        <a href="/login" className="mt-6 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium">
          로그인으로 돌아가기
        </a>
      ) : null}
    </section>
  );
}
