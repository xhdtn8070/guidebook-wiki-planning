import React, { ButtonHTMLAttributes, isValidElement, cloneElement } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
};

const sizeClass = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-9 w-9 p-0",
};

const variantClass = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-theme-sm",
  outline: "border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary",
  ghost: "text-foreground hover:bg-muted/50",
};

export function Button({ className, variant = "primary", size = "md", asChild = false, ...props }: ButtonProps) {
  const { children, ...rest } = props;
  const classes = clsx(
    "rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2",
    sizeClass[size],
    variantClass[variant],
    rest.disabled && "opacity-60 cursor-not-allowed",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement;
    return cloneElement(child as React.ReactElement<any>, {
      className: clsx(classes, (child.props as { className?: string }).className),
    } as any);
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
