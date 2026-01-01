import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navItems, NavItem } from '@/lib/mockData';
import { toast } from 'sonner';
import { ChevronRight, FileText, Folder, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item: NavItem) => {
    if (!item.isUsable) {
      toast.info('준비 중입니다', {
        description: '이 문서는 곧 공개될 예정입니다.',
      });
      return;
    }
    navigate(item.path);
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.path);
    const parentActive = isParentActive(item);

    return (
      <li key={item.id} className="animate-slide-in" style={{ animationDelay: `${level * 30}ms` }}>
        <button
          onClick={() => handleNavClick(item)}
          disabled={!item.isUsable && !hasChildren}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150',
            'hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30',
            active && 'bg-primary/15 text-primary font-semibold',
            !active && parentActive && level === 0 && 'text-foreground font-semibold',
            !active && !parentActive && 'text-muted-foreground',
            !item.isUsable && 'opacity-50 cursor-not-allowed hover:bg-transparent',
            level > 0 && 'pl-6'
          )}
        >
          {hasChildren ? (
            <Folder className="h-4 w-4 flex-shrink-0" />
          ) : (
            <FileText className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="flex-1 text-left truncate">{item.title}</span>
          {!item.isUsable && <Lock className="h-3 w-3 flex-shrink-0" />}
          {hasChildren && item.isUsable && (
            <ChevronRight className={cn(
              'h-3 w-3 flex-shrink-0 transition-transform',
              parentActive && 'rotate-90'
            )} />
          )}
        </button>

        {/* Children */}
        {hasChildren && parentActive && (
          <ul className="mt-1 space-y-1 border-l border-border/50 ml-4">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className={cn(
      'w-60 shrink-0 border-r border-border bg-surface-strong',
      'h-[calc(100vh-56px)] sticky top-14 overflow-hidden',
      className
    )}>
      <div className="p-4 h-full overflow-y-auto custom-scrollbar">
        <nav aria-label="문서 네비게이션">
          <ul className="space-y-1">
            {navItems.map(item => renderNavItem(item))}
          </ul>
        </nav>

        {/* Plugin Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            플러그인 블록
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 transition-colors"
                onClick={() => toast.info('준비 중입니다')}
              >
                <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  A
                </div>
                <span>API Console</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 transition-colors opacity-50 cursor-not-allowed"
              >
                <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  W
                </div>
                <span>Workflow</span>
                <Lock className="h-3 w-3 ml-auto" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
