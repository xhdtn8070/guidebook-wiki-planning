"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/shared/icons";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    await fetch("/api/session/logout", { method: "POST" });
    startTransition(() => {
      router.push("/introduce");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-background/70"
    >
      <User className="h-4 w-4" />
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
