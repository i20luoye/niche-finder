'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpDown, BarChart3, Compass, Database, DollarSign, GitMerge, Microscope, RotateCw, Target, TrendingUp, Zap, Cpu, ShieldCheck, Gauge, Rocket } from 'lucide-react';
import { ScoreBar } from '@/components/score-bar';
import { MiniRadar } from '@/components/radar-chart';
import { ModeBadge } from '@/components/mode-badge';
import { getSampleReports, getOrCreateUser, getHistory } from '@/lib/client-api';
import type { Report, HistoryItem } from '@/lib/types';

const SORT_OPTIONS = [
  { v: 'overall', l: '综合分' },
  { v: 'demand', l: '市场需求' },
  { v: 'blue_ocean', l: '蓝海度' },
  { v: 'recency', l: '最新' },
];

export default function OpportunitiesPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('overall');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getOrCreateUser();
        const [samples, history] = await Promise.all([
          getSampleReports(),
          getHistory(user.apiKey),
        ]);
        // 合并样本 + 用户历史（用户历史优先）
        const userReports = history.map((h) => h.report);
        const merged = [...userReports, ...samples.filter((s) => !userReports.some((r) => r.id === s.id))];
        setReports(merged);
        setHistoryItems(history);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const sorted = [...reports].sort((a, b) => {
    if (sortBy === 'overall') return b.scores.overall - a.scores.overall;
    if (sortBy === 'demand') return b.scores.six_dim.demand - a.scores.six_dim.demand;
    if (sortBy === 'blue_ocean') return b.scores.six_dim.blue_ocean - a.scores.six_dim.blue_ocean;
    if (sortBy === 'recency') return b.createdAt.localeCompare(a.createdAt);
    return 0;
  });

  const userReport = historyItems[0];
  const mode = userReport?.report.mode ?? 'blue-ocean';

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* 顶部信息条 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <ModeBadge mode={mode} inline />
            <span className="text-on-surface-variant">· 独立开发者 AI 副业方向</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-on-surface-variant font-mono">
          {userReport && (
            <span>分析耗时 {userReport.report.analysisTime.toFixed(1)}s · 生成于 {userReport.report.createdAt.slice(0, 16)}</span>
          )}
          <button
            onClick={() => showToast('已加入重新生成队列（演示）')}
            className="inline-flex items-center gap-1 rounded-md border border-outline-variant/30 bg-surface px-2.5 py-1 hover:border-primary/40"
          >
            <RotateCw className="h-3 w-3" /> 重新生成
          </button>
        </div>
      </div>

      {/* 页面标题 */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            为你发现的 <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">{sorted.length}</span> 个机会
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            基于你的画像（5万预算 / 兼职 / 技术背景 / 月入 2万目标）综合评估
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-md border border-outline-variant/30 bg-surface pl-3 pr-8 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.v} value={o.v}>按 {o.l} 排序</option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-on-surface-variant" />
          </div>
          <button
            onClick={() => showToast('报告已导出（演示）')}
            className="rounded-md border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm text-foreground hover:border-primary/40"
          >
            导出报告
          </button>
        </div>
      </div>

      {/* 筛选栏（演示） */}
      <div className="rounded-xl border border-outline-variant/30 bg-surface p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">评分范围</span>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md border border-outline-variant/30 bg-surface-container px-2 py-0.5 text-xs font-mono">60</span>
              <span className="text-on-surface-variant">—</span>
              <span className="rounded-md border border-outline-variant/30 bg-surface-container px-2 py-0.5 text-xs font-mono">100</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider mr-1">市场规模</span>
            {['< 1 亿', '1-10 亿', '10-50 亿', '50-100 亿', '> 100 亿'].map((s, i) => (
              <button
                key={s}
                onClick={() => showToast(`已切换筛选：${s}（演示）`)}
                className={i === 2 ? 'rounded-md border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs text-primary' : 'rounded-md border border-outline-variant/30 bg-surface-container px-2.5 py-1 text-xs text-on-surface-variant'}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono">
            <span>已应用 3 个筛选</span>
            <button onClick={() => showToast('已清空筛选（演示）')} className="text-primary hover:underline">清空</button>
          </div>
        </div>
      </div>

      {/* 卡片列表 */}
      {loading ? (
        <div className="py-20 text-center text-on-surface-variant">加载中…</div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-5' : 'flex flex-col gap-3'}>
          {sorted.map((r, i) => (
            <Link
              key={r.id}
              href={`/opportunity/${r.id}`}
              className="group relative rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-float"
            >
              {/* 顶部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      'inline-flex h-9 w-9 items-center justify-center rounded-full font-display font-bold font-mono text-sm ' +
                      (i === 0
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-surface-container-high text-foreground')
                    }
                  >
                    #{r.rank ?? i + 1}
                  </span>
                  <ModeBadge mode={r.mode} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">综合分</div>
                  <div className="font-display text-2xl font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
                    {r.scores.overall.toFixed(2)}
                  </div>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {r.name}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-2">{r.tagline}</p>

              {/* 6 维进度条 */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                {[
                  { l: '市场需求', icon: TrendingUp, v: r.scores.six_dim.demand },
                  { l: '蓝海度', icon: Compass, v: r.scores.six_dim.blue_ocean },
                  { l: '变现潜力', icon: DollarSign, v: r.scores.six_dim.monetize },
                  { l: '技术可行', icon: Cpu, v: r.scores.six_dim.tech_feasible },
                  { l: '启动门槛', icon: ShieldCheck, v: r.scores.six_dim.entry_barrier },
                  { l: '增长飞轮', icon: Rocket, v: r.scores.six_dim.growth },
                ].map((s) => (
                  <ScoreBar key={s.l} label={s.l} value={s.v} />
                ))}
              </div>

              {/* 底部 */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/15 text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> 规模 {r.marketSize}
                </span>
                <span>· 壁垒 {r.entryBarrier}</span>
                <span>· 启动 {r.startCost}</span>
                <span className="ml-auto inline-flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  查看完整报告 <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 6 维模型说明 */}
      <div className="mt-12 rounded-2xl border border-outline-variant/30 bg-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">如何看懂这 6 个维度的评分？</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {[
            { l: '市场需求', d: '目标用户规模、付费意愿、增长趋势' },
            { l: '蓝海度', d: '竞争激烈程度、巨头关注度' },
            { l: '变现潜力', d: '客单价、LTV、回本周期' },
            { l: '技术可行', d: '实现难度、所需人力、依赖外部资源' },
            { l: '启动门槛', d: '资源投入、行业经验、关系链' },
            { l: '增长飞轮', d: '用户增长→产品增强的正反馈强度' },
          ].map((x) => (
            <div key={x.l} className="rounded-md border border-outline-variant/15 bg-surface-container-lowest p-3">
              <div className="font-semibold text-foreground mb-1">{x.l}</div>
              <div className="text-xs text-on-surface-variant">{x.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-outline-variant/40 bg-surface px-4 py-2.5 text-sm text-foreground shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
