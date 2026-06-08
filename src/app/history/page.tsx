'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, CheckCircle2, ChevronRight, Clock, Compass, Database, Filter, GitMerge, History, Microscope, Search, Star, Target, Trash2, X } from 'lucide-react';
import { ModeBadge } from '@/components/mode-badge';
import { MiniRadar } from '@/components/radar-chart';
import { getOrCreateUser, getHistory } from '@/lib/client-api';
import type { HistoryItem, DiscoveryMode } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATS = [
  { num: '12', label: '总分析次数', icon: History },
  { num: '18', label: '累计耗时 / 分钟', icon: Clock },
  { num: '3', label: '已收藏', icon: Star },
  { num: '0', label: '已实施', icon: CheckCircle2 },
];

const MODE_FILTERS: { v: DiscoveryMode; l: string; color: string }[] = [
  { v: 'blue-ocean', l: '蓝海', color: 'var(--color-mode-blue)' },
  { v: 'red-niche', l: '红海细分', color: 'var(--color-mode-amber)' },
  { v: 'cross-domain', l: '跨界', color: 'var(--color-mode-violet)' },
  { v: 'analyze', l: '深度分析', color: 'var(--color-mode-mint)' },
];

const SUGGESTIONS = ['AI 副业方向', '宠物经济', '银发市场', '独立开发者工具', '小众兴趣社区', '内容创作工具', 'AI × 教育', '企业出海'];

const FALLBACK_HISTORY: HistoryItem[] = [
  { id: 'h001', createdAt: '2 小时前', mode: 'blue-ocean', topic: '独立开发者 AI 副业方向', count: 5, topScore: 8.15, reportId: 'sample-blue-ocean-001', status: 'favorited' },
  { id: 'h002', createdAt: '昨天 14:32', mode: 'red-niche', topic: 'AI 写作工具', count: 4, topScore: 7.80, reportId: 'sample-red-niche-002', status: 'completed' },
  { id: 'h003', createdAt: '3 天前', mode: 'cross-domain', topic: 'AI × 健身', count: 3, topScore: 7.45, reportId: 'sample-cross-domain-003', status: 'completed' },
  { id: 'h004', createdAt: '上周', mode: 'analyze', topic: '宠物经济独立站', count: 1, topScore: 8.20, reportId: 'sample-analyze-004', status: 'favorited' },
  { id: 'h005', createdAt: '上周', mode: 'blue-ocean', topic: 'AI 副业 - 海外 SEO', count: 6, topScore: 7.60, reportId: 'sample-blue-ocean-005', status: 'completed' },
  { id: 'h006', createdAt: '上个月', mode: 'red-niche', topic: '餐饮 SaaS', count: 4, topScore: 6.95, reportId: 'sample-red-niche-006', status: 'completed' },
];

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<DiscoveryMode | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['h001', 'h004']));

  useEffect(() => {
    (async () => {
      try {
        const user = await getOrCreateUser();
        const h = await getHistory(user.apiKey);
        setItems(h.length > 0 ? h : FALLBACK_HISTORY);
      } catch {
        setItems(FALLBACK_HISTORY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = items.filter((h) => {
    if (search && !h.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (modeFilter && h.mode !== modeFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((cur) => {
      const n = new Set(cur);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleFav = (id: string) => {
    setFavorites((cur) => {
      const n = new Set(cur);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* 标题 */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">历史记录</span>
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            你共完成 <span className="text-foreground font-mono">12</span> 次分析，最早一次在 <span className="text-foreground font-mono">2026-05-12</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm hover:border-primary/40">
            导出全部
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            className="rounded-md border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm hover:border-destructive/40 hover:text-destructive"
          >
            清空历史
          </button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-outline-variant/30 bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between mb-2">
                <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">{s.label}</div>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
                {s.num}
              </div>
            </div>
          );
        })}
      </div>

      {/* 筛选 */}
      <div className="rounded-xl border border-outline-variant/30 bg-surface p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索机会名称或分析主题"
            className="w-full bg-surface-container border-none rounded-md pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={!modeFilter} onClick={() => setModeFilter(null)}>全部</FilterChip>
          {MODE_FILTERS.map((m) => (
            <FilterChip
              key={m.v}
              active={modeFilter === m.v}
              onClick={() => setModeFilter(m.v)}
              color={m.color}
            >
              {m.l}
            </FilterChip>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <FilterChip active>最新</FilterChip>
          <FilterChip>最旧</FilterChip>
          <FilterChip>综合分最高</FilterChip>
        </div>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="py-20 text-center text-on-surface-variant">加载中…</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((h) => {
            const modeColor = MODE_FILTERS.find((m) => m.v === h.mode)?.color ?? 'var(--color-primary)';
            const isSelected = selected.has(h.id);
            const isFav = favorites.has(h.id);
            return (
              <div
                key={h.id}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface p-4 transition-all hover:border-outline-variant/50 hover:bg-surface-container-lowest',
                  isSelected && 'border-primary/40 bg-primary/5'
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(h.id)}
                  className="h-4 w-4 rounded border-outline-variant/40 bg-surface-container text-primary focus:ring-primary/30"
                />
                <div className="w-1 h-12 rounded-full" style={{ background: modeColor }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <ModeBadge mode={h.mode} />
                    <span className="text-sm font-semibold text-foreground truncate">{h.topic}</span>
                    {isFav && <Star className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {h.count} 个机会 · {h.createdAt}
                  </div>
                </div>
                <div className="shrink-0">
                  <MiniRadar
                    sixDim={{
                      demand: 7 + (h.id.charCodeAt(2) % 3),
                      blue_ocean: 6 + (h.id.charCodeAt(1) % 4),
                      monetize: 6 + (h.id.charCodeAt(3) % 4),
                      tech_feasible: 7 + (h.id.charCodeAt(0) % 3),
                      entry_barrier: 6 + (h.id.charCodeAt(4) % 4),
                      growth: 5 + (h.id.charCodeAt(2) % 5),
                    }}
                    size={56}
                  />
                </div>
                <div className="text-right shrink-0 w-16">
                  <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">Top 分</div>
                  <div className="font-display text-lg font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
                    {h.topScore.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/opportunity/${h.reportId}`}
                    className="rounded-md border border-outline-variant/30 bg-surface px-2.5 py-1 text-xs text-foreground hover:border-primary/40"
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => toggleFav(h.id)}
                    className="rounded-md border border-outline-variant/30 bg-surface p-1.5 hover:border-primary/40"
                    title="收藏"
                  >
                    <Star className={cn('h-3.5 w-3.5', isFav && 'fill-primary text-primary')} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(h.id)}
                    className="rounded-md border border-outline-variant/30 bg-surface p-1.5 hover:border-destructive/40 hover:text-destructive"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 建议话题 */}
      <div className="mt-8 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mb-3">试试这些热门分析方向</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s}
              href={`/home?topic=${encodeURIComponent(s)}`}
              className="rounded-md border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm text-foreground hover:border-primary/40 hover:text-primary"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* 批量操作浮条 */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 shadow-float flex items-center gap-3">
          <span className="text-sm text-foreground">已选 <span className="font-mono font-bold text-primary">{selected.size}</span> 项</span>
          <button className="rounded-md border border-outline-variant/30 px-2.5 py-1 text-xs hover:border-primary/40">导出选中</button>
          <button className="rounded-md border border-outline-variant/30 px-2.5 py-1 text-xs hover:border-destructive/40 hover:text-destructive">删除选中</button>
          <button onClick={() => setSelected(new Set())} className="rounded-md p-1 text-on-surface-variant hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 二次确认模态 */}
      {confirmClear && (
        <ConfirmModal
          title="清空所有历史记录？"
          desc="此操作不可恢复。所有 12 条历史分析与收藏将被永久删除。"
          confirmLabel="确认清空"
          danger
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => { setConfirmClear(false); setItems([]); }}
        />
      )}
      {confirmDeleteId && (
        <ConfirmModal
          title="删除这条历史？"
          desc="此操作不可恢复。"
          confirmLabel="确认删除"
          danger
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            setItems((cur) => cur.filter((x) => x.id !== confirmDeleteId));
            setConfirmDeleteId(null);
          }}
        />
      )}
    </main>
  );
}

function FilterChip({ children, active, onClick, color }: { children: React.ReactNode; active?: boolean; onClick?: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md border px-2.5 py-1 text-xs transition-all',
        active
          ? 'border-primary/40 bg-primary/15 text-primary'
          : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-outline-variant/60'
      )}
      style={active && color ? { borderColor: `color-mix(in oklch, ${color} 50%, transparent)`, background: `color-mix(in oklch, ${color} 12%, transparent)`, color: color } : {}}
    >
      {children}
    </button>
  );
}

function ConfirmModal({ title, desc, confirmLabel, danger, onCancel, onConfirm }: { title: string; desc: string; confirmLabel: string; danger?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-float">
        <h3 className="font-display text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-on-surface-variant mb-6">{desc}</p>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm hover:border-outline-variant/60">取消</button>
          <button
            onClick={onConfirm}
            className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', danger ? 'bg-destructive text-destructive-foreground hover:opacity-90' : 'bg-primary text-primary-foreground hover:opacity-90')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
