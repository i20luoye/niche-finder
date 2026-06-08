import type { DiscoveryMode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ModeBadgeProps {
  mode: DiscoveryMode;
  className?: string;
  /** inline 模式：纯文字 + 颜色点，无背景无边框 */
  inline?: boolean;
}

const MODE_META: Record<DiscoveryMode, { label: string; dot: string; text: string; bg: string; border: string }> = {
  'blue-ocean': {
    label: '蓝海模式',
    dot: 'var(--color-mode-blue)',
    text: 'var(--color-mode-blue)',
    bg: 'color-mix(in oklch, var(--color-mode-blue) 12%, transparent)',
    border: 'color-mix(in oklch, var(--color-mode-blue) 35%, transparent)',
  },
  'red-niche': {
    label: '红海细分',
    dot: 'var(--color-mode-amber)',
    text: 'var(--color-mode-amber)',
    bg: 'color-mix(in oklch, var(--color-mode-amber) 12%, transparent)',
    border: 'color-mix(in oklch, var(--color-mode-amber) 35%, transparent)',
  },
  'cross-domain': {
    label: '跨界迁移',
    dot: 'var(--color-mode-violet)',
    text: 'var(--color-mode-violet)',
    bg: 'color-mix(in oklch, var(--color-mode-violet) 12%, transparent)',
    border: 'color-mix(in oklch, var(--color-mode-violet) 35%, transparent)',
  },
  'analyze': {
    label: '深度分析',
    dot: 'var(--color-mode-mint)',
    text: 'var(--color-mode-mint)',
    bg: 'color-mix(in oklch, var(--color-mode-mint) 12%, transparent)',
    border: 'color-mix(in oklch, var(--color-mode-mint) 35%, transparent)',
  },
};

export function ModeBadge({ mode, className, inline = false }: ModeBadgeProps) {
  const m = MODE_META[mode];
  if (inline) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs font-medium font-mono', className)} style={{ color: m.text }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
        {m.label}
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono',
        className
      )}
      style={{ color: m.text, background: m.bg, borderColor: m.border }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: m.dot }}
      />
      {m.label}
    </span>
  );
}

export { MODE_META };
