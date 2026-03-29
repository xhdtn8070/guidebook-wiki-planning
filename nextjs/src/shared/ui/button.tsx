import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { clsx } from "clsx";

export const buttonStyles = (options?: {
  variant?: "solid" | "outline" | "quiet";
  size?: "sm" | "md" | "lg";
}) =>
  clsx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    options?.size === "sm" && "h-9 px-3.5 text-sm font-medium",
    (!options?.size || options.size === "md") && "h-10 px-4 text-sm font-medium",
    options?.size === "lg" && "h-11 px-5 text-sm font-semibold",
    options?.variant === "outline" &&
      "border-border bg-transparent text-foreground hover:border-primary/40 hover:bg-foreground/[0.04]",
    options?.variant === "quiet" && "border-transparent text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
    (!options?.variant || options.variant === "solid") &&
      "border-primary bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
  );

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return <button className={clsx(buttonStyles(), className)} {...props} />;
}

export function ButtonFrame({
  className,
  variant,
  size,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: "solid" | "outline" | "quiet";
  size?: "sm" | "md" | "lg";
}) {
  return <span className={clsx(buttonStyles({ variant, size }), className)} {...props} />;
}
