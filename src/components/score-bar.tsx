'use client';

import { cn } from '@/lib/utils';

interface ScoreBarProps {
  label: string;
  value: number; // 0-10
  max?: number;
  color?: string;
  className?: string;
  showIcon?: boolean;
}

const ICON_MAP: Record<string, string> = {
  '需求': 'trending-up', '市场': 'trending-up', '蓝海': 'shield',
  '变现': 'dollar-sign', '技术': 'cpu', '门槛': 'zap', '增长': 'rocket',
};

export function ScoreBar({ label, value, max = 10, color, className, showIcon = true }: ScoreBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const fillColor = color ?? 'var(--color-primary)';
  const iconName = Object.entries(ICON_MAP).find(([k]) => label.includes(k))?.[1];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2 w-28 shrink-0">
        {showIcon && iconName && (
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-mono"
            style={{ background: `color-mix(in oklch, ${fillColor} 15%, transparent)`, color: fillColor }}
          >
            {label.charAt(0)}
          </span>
        )}
        <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wide truncate">
          {label}
        </span>
      </div>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-surface-container">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
      <span className="font-display font-mono font-bold text-sm tabular-nums w-8 text-right text-foreground">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
