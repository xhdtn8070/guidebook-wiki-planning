import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      suppressHydrationWarning
      className={clsx(
        "w-full rounded-xl border border-border bg-input/80 px-4 py-2.5 text-sm text-foreground shadow-theme-sm",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
});
