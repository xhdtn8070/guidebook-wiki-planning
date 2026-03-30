"use client";

import { useFormStatus } from "react-dom";
import { togglePageStarAction } from "@/app/actions/page-star";
import { Star } from "@/shared/icons";

type PageStarToggleProps = {
  pageId: number;
  starred: boolean;
  returnTo: string;
  compact?: boolean;
};

export function PageStarToggle({ pageId, starred, returnTo, compact = false }: PageStarToggleProps) {
  return (
    <form action={togglePageStarAction}>
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="intent" value={starred ? "unstar" : "star"} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <SubmitButton starred={starred} compact={compact} />
    </form>
  );
}

function SubmitButton({ starred, compact }: { starred: boolean; compact: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl border transition-colors",
        compact ? "h-9 px-3 text-xs font-medium" : "h-10 px-4 text-sm font-medium",
        starred
          ? "border-amber-300/60 bg-amber-200/30 text-foreground hover:bg-amber-200/40"
          : "border-border bg-background/70 text-muted-foreground hover:bg-background hover:text-foreground",
        pending ? "cursor-wait opacity-70" : "",
      ].join(" ")}
      aria-label={starred ? "별표 해제" : "별표 추가"}
    >
      <Star className={starred ? "h-4 w-4 fill-current text-amber-500" : "h-4 w-4"} />
      <span>{pending ? "저장 중" : starred ? "Starred" : "Star"}</span>
    </button>
  );
}
