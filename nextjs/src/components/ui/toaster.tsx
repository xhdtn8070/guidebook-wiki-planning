"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
};

type ToastPayload = Omit<ToastItem, "id">;

let listeners: Array<(toast: ToastItem) => void> = [];
let counter = 0;

function emitToast(payload: ToastPayload) {
  counter += 1;
  const toast: ToastItem = { id: counter, ...payload };
  listeners.forEach((listener) => listener(toast));
}

export const toast = {
  info: (title: string, options?: { description?: string }) => emitToast({ title, description: options?.description }),
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 2600);
    };
    listeners = [...listeners, handler];
    return () => {
      listeners = listeners.filter((listener) => listener !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-lg border border-border bg-card shadow-theme-lg px-4 py-3 max-w-sm animate-fade-in"
        >
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.description && <div className="text-xs text-muted-foreground mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
