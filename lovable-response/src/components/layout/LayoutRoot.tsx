import React from 'react';
import { TopBar } from './TopBar';

interface LayoutRootProps {
  children: React.ReactNode;
}

export function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <div className="page-shell">
      <TopBar />
      {children}
    </div>
  );
}
