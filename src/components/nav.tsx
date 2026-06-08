'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, History, LayoutDashboard, ListChecks, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: '首页', icon: LayoutDashboard, id: 'nav-home' },
  { href: '/profile', label: '新建分析', icon: Sparkles, id: 'nav-profile' },
  { href: '/opportunities', label: '机会列表', icon: ListChecks, id: 'nav-opportunities' },
  { href: '/history', label: '历史', icon: History, id: 'nav-history' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/20 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30 transition-all group-hover:ring-primary/60">
            <Compass className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 rounded-lg bg-primary/5 blur-md group-hover:bg-primary/10 transition-colors" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              Niche Finder
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant tracking-wider uppercase">
              利基探测器
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((it) => {
            const active = pathname === it.href || pathname?.startsWith(it.href + '/');
            const Icon = it.icon;
            return (
              <Link
                key={it.id}
                id={it.id}
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container/40 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-outline-variant/20 bg-surface-container/30 px-2.5 py-1.5 text-xs">
            <Zap className="h-3 w-3 text-primary" />
            <span className="font-mono text-on-surface-variant">v2.0</span>
          </div>
          <Link
            href="/profile"
            className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-glow"
          >
            开始探索
          </Link>
        </div>
      </div>
    </header>
  );
}
