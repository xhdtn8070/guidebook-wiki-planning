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
        "surface-elevated overflow-hidden rounded-[28px] border px-6 py-7 shadow-theme-md",
        tone === "default" && "border-border",
        tone === "warning" && "border-primary/35 bg-primary/[0.08]",
        tone === "muted" && "border-border bg-secondary/55",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="pill text-[10px]">{eyebrow}</p> : null}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className={clsx("hidden h-20 w-20 rounded-full blur-2xl md:block", tone === "warning" ? "bg-primary/18" : "bg-primary/12")} />
      </div>
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
