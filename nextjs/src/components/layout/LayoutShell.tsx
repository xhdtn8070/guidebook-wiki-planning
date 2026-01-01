import { TopBar } from "./TopBar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      {children}
    </div>
  );
}
