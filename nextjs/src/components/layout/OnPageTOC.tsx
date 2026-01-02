"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

interface OnPageTOCProps {
  items: TocItem[];
  className?: string;
}

export function OnPageTOC({ items, className }: OnPageTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -80% 0%",
        threshold: 0,
      },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <aside
      className={clsx(
        "w-44 shrink-0 hidden xl:block h-[calc(100vh-56px)] sticky top-14",
        className,
      )}
    >
      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">현재 문서 목차</h3>
        <nav aria-label="현재 문서 목차">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={clsx(
                    "block w-full text-left text-sm py-1 transition-colors rounded",
                    "hover:text-primary focus:outline-none focus:text-primary",
                    item.level === 2 && "pl-3",
                    activeId === item.id ? "text-primary font-medium" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
