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
        "surface-elevated rounded-[28px] border px-6 py-7 shadow-theme-md",
        tone === "default" && "border-border",
        tone === "warning" && "border-primary/40 bg-primary/10",
        tone === "muted" && "border-border bg-secondary/50",
      )}
    >
      {eyebrow ? <p className="pill text-[10px]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
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
