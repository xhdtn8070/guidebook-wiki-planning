import type { Route } from "next";
import Link from "next/link";
import { clsx } from "clsx";
import { ButtonFrame } from "@/shared/ui/button";

type StatusPanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: Route;
  tone?: "default" | "warning" | "muted";
};

export function StatusPanel({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  tone = "default",
}: StatusPanelProps) {
  return (
    <section
      className={clsx(
        "rounded-[10px] border px-7 py-8",
        tone === "default" && "border-border bg-panel shadow-[0_8px_30px_rgba(44,35,26,0.04)]",
        tone === "warning" && "border-primary/25 bg-accent-soft",
        tone === "muted" && "border-border bg-panel-soft",
      )}
    >
      {eyebrow ? <p className="editorial-eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 max-w-2xl text-3xl text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <div className="mt-5">
          <Link href={actionHref}>
            <ButtonFrame size="md">{actionLabel}</ButtonFrame>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
