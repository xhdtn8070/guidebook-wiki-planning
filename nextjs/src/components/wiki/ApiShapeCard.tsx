import { Code2 } from "lucide-react";
import { clsx } from "clsx";

interface ApiShapeCardProps {
  title: string;
  endpoint: string;
  description?: string;
  sample: unknown;
  className?: string;
}

export function ApiShapeCard({ title, endpoint, description, sample, className }: ApiShapeCardProps) {
  return (
    <div className={clsx("rounded-xl border border-border bg-card shadow-theme-sm p-4 space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="pill text-[10px] uppercase">API</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Code2 className="h-4 w-4 text-primary" />
      </div>
      <div className="text-xs bg-muted/60 border border-border rounded-lg px-3 py-2 font-mono">{endpoint}</div>
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      <pre className="code-block text-xs leading-relaxed whitespace-pre-wrap">{JSON.stringify(sample, null, 2)}</pre>
    </div>
  );
}
