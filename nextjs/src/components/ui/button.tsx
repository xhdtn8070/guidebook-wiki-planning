import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

const sizeClass = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

const variantClass = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-theme-sm",
  outline:
    "border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary",
  ghost: "text-foreground hover:bg-muted/50",
};

export function Button({ className, variant = "primary", size = "md", asChild = false, ...props }: ButtonProps) {
  const classes = clsx(
    "rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2",
    sizeClass[size],
    variantClass[variant],
    props.disabled && "opacity-60 cursor-not-allowed",
    className,
  );

  if (asChild && props.children) {
    return <span className={classes}>{props.children}</span>;
  }

  return <button className={classes} {...props} />;
}
