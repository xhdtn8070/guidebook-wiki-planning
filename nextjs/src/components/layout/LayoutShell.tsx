import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Providers } from "@/components/providers";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <Providers>
      <div className="page-shell">
        <TopBar />
        {children}
      </div>
    </Providers>
  );
}
