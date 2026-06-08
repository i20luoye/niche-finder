'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, BarChart3, Bookmark, CheckCircle2, ChevronRight,
  Database, DollarSign, Download, ExternalLink, FileText, Flame, Lightbulb,
  Microscope, Radar, Share2, ShieldAlert, Swords, Target, TrendingUp, Users,
  Zap, Clock, Cpu, Rocket, ShieldCheck, Mail, Star,
} from 'lucide-react';
import { ModeBadge } from '@/components/mode-badge';
import { ScoreBar } from '@/components/score-bar';
import { RadarChart } from '@/components/radar-chart';
import { getReport, getOrCreateUser, getHistory } from '@/lib/client-api';
import type { DiscoveryMode, SixDimScore } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface DevilData {
  id: number;
  title: string;
  detail: string;
  rebuttal: string;
}

interface MarketData {
  size: { value: string; ref: number };
  growth: string[];
  user: { age: string; job: string; scale: string; scenario: string };
  trend: string;
}

interface CompetitorData {
  name: string;
  features: string;
  pricing: string;
  scale: string;
  pros: string;
  cons: string;
}

interface BusinessData {
  models: { name: string; desc: string; price: string }[];
  costs: { item: string; estimate: string }[];
  payback: string;
}

interface ActionData {
  cost: string;
  team: string;
  plan: { day: string; task: string }[];
}

interface SurvivalData {
  title: string;
  steps: string[];
}

interface DetailReport {
  id: string;
  rank: number;
  mode: DiscoveryMode;
  name: string;
  tagline: string;
  valueProposition: string;
  oneLiner: string;
  marketSize: string;
  entryBarrier: string;
  startCost: string;
  estTime: string;
  analysisTime: number;
  createdAt: string;
  scores: { six_dim: SixDimScore; overall: number; sub: { name: string; value: number; max: number }[] };
  market: MarketData;
  competitors: CompetitorData[];
  differentiators: string[];
  business: BusinessData;
  devils: DevilData[];
  survival: SurvivalData;
  action: ActionData;
  sources: { id: number; name: string; url: string; accessedAt: string }[];
}

const TABS = [
  { id: 'market', label: '市场分析', icon: BarChart3 },
  { id: 'competition', label: '竞争分析', icon: Swords },
  { id: 'business', label: '商业分析', icon: DollarSign },
  { id: 'devil', label: '魔鬼辩护', icon: ShieldAlert },
  { id: 'action', label: '行动建议', icon: Rocket },
] as const;

const DIM_LABELS: { key: keyof SixDimScore; l: string; desc: string }[] = [
  { key: 'demand', l: '市场需求度', desc: '目标用户规模、付费意愿、增长趋势' },
  { key: 'blue_ocean', l: '竞争蓝海度', desc: '巨头关注度、差异化空间' },
  { key: 'monetize', l: '变现潜力', desc: '客单价、LTV、回本周期' },
  { key: 'tech_feasible', l: '技术可行性', desc: '实现难度、所需人力' },
  { key: 'entry_barrier', l: '启动门槛', desc: '资源投入、行业经验' },
  { key: 'growth', l: '增长飞轮', desc: '用户→产品增强反馈' },
];

export default function OpportunityDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<DetailReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('market');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getOrCreateUser();
        let r = await getReport(id, user.apiKey);
        if (!r) {
          // 试一下是不是用户历史里的
          const h = await getHistory(user.apiKey);
          const fromHist = h.find((x) => x.report.id === id)?.report;
          r = fromHist ?? null;
        }
        setReport((r ?? null) as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center text-on-surface-variant">加载中…</main>
    );
  }
  if (!report) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-on-surface-variant">报告不存在或已过期</p>
        <Link href="/opportunities" className="mt-4 inline-block text-primary hover:underline">返回机会列表</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* 顶部 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 返回机会列表
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast('已分享（演示）')} className="rounded-md border border-outline-variant/30 bg-surface p-2 hover:border-primary/40" title="分享">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => showToast('已下载 Markdown（演示）')} className="rounded-md border border-outline-variant/30 bg-surface p-2 hover:border-primary/40" title="下载">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => showToast('已加入对比（演示）')} className="rounded-md border border-outline-variant/30 bg-surface p-2 hover:border-primary/40" title="加入对比">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface p-8 shadow-card mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold font-mono shadow-glow">
            #{report.rank}
          </span>
          <ModeBadge mode={report.mode} />
          <span className="text-xs text-on-surface-variant font-mono ml-auto">
            生成于 {report.createdAt.slice(0, 16)} · 耗时 {report.analysisTime.toFixed(1)}s
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {report.name}
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed max-w-4xl">{report.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <Meta icon={BarChart3} label="市场规模" value={report.marketSize} />
          <Meta icon={ShieldCheck} label="进入壁垒" value={report.entryBarrier} />
          <Meta icon={DollarSign} label="启动成本" value={report.startCost} />
          <Meta icon={Rocket} label="启动" value={report.estTime} />
        </div>
      </div>

      {/* 6 维评分雷达图 + 分维度 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Radar className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">六维评分雷达</h2>
          </div>
          <p className="text-xs text-on-surface-variant mb-4">基于公开数据 + 6 Agent 交叉验证</p>
          <RadarChart sixDim={report.scores.six_dim} />
          <div className="mt-4 text-center">
            <div className="font-display text-4xl font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
              {report.scores.overall.toFixed(2)}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">综合评分（10 分制）</div>
            <div className="text-[11px] text-primary mt-2 font-mono">综合评语：{summarize(report.scores.overall)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">分维度详情</h2>
          </div>
          <div className="space-y-3">
            {DIM_LABELS.map((d) => (
              <div key={d.key} className="rounded-md border border-outline-variant/15 bg-surface-container-lowest p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{d.l}</span>
                    <span className="text-[10px] text-on-surface-variant">{d.desc}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground tabular-nums">{report.scores.six_dim[d.key].toFixed(1)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${report.scores.six_dim[d.key] * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 段式报告 Tab */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface shadow-card overflow-hidden">
        <div className="flex items-center gap-1 border-b border-outline-variant/20 overflow-x-auto px-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap',
                  active ? 'text-primary' : 'text-on-surface-variant hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {t.id === 'devil' && (
                  <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                )}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === 'market' && <MarketSection r={report} />}
          {activeTab === 'competition' && <CompetitionSection r={report} />}
          {activeTab === 'business' && <BusinessSection r={report} />}
          {activeTab === 'devil' && <DevilSection r={report} />}
          {activeTab === 'action' && <ActionSection r={report} />}
        </div>
      </div>

      {/* 数据来源 */}
      <div className="mt-6 rounded-2xl border border-outline-variant/30 bg-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-primary" />
          <h3 className="font-display text-base font-bold text-foreground">数据来源与引用</h3>
        </div>
        <ul className="space-y-2 text-sm">
          {report.sources.map((s: { id: number; name: string; url: string; accessedAt: string }) => (
            <li key={s.id} className="flex items-start gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold shrink-0">
                {s.id}
              </span>
              <div className="flex-1">
                <div className="text-foreground">{s.name}</div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-primary inline-flex items-center gap-1">
                    {s.url} <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="ml-2">· 访问 {s.accessedAt}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
          如发现数据有误，欢迎指正 → feedback@nichefinder.ai
        </div>
      </div>

      {/* 相关机会 */}
      <div className="mt-6">
        <h3 className="font-display text-base font-bold text-foreground mb-4">其他可能感兴趣的机会</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RelatedReports.map((rr: typeof RelatedReports[number]) => (
            <Link
              key={rr.id}
              href={`/opportunity/${rr.id}`}
              className="rounded-xl border border-outline-variant/30 bg-surface p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <ModeBadge mode={rr.mode} />
                <span className="font-mono font-bold text-primary">{rr.score.toFixed(2)}</span>
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{rr.name}</div>
              <div className="text-xs text-on-surface-variant line-clamp-1">{rr.tagline}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 底部 CTA */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/profile" className="rounded-lg border border-outline-variant/30 bg-surface px-4 py-2 text-sm hover:border-primary/40">
          调整画像重新生成
        </Link>
        <Link href="/opportunities" className="rounded-lg border border-outline-variant/30 bg-surface px-4 py-2 text-sm hover:border-primary/40">
          查看所有机会
        </Link>
        <button
          onClick={() => showToast('已下载完整报告（演示）')}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 shadow-glow"
        >
          下载完整报告
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-outline-variant/40 bg-surface px-4 py-2.5 text-sm text-foreground shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-on-surface-variant" />
      <div>
        <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">{label}</div>
        <div className="text-foreground font-mono font-semibold">{value}</div>
      </div>
    </div>
  );
}

function summarize(s: number) {
  if (s >= 8) return '优秀 · 强烈推荐深入验证';
  if (s >= 7) return '良好 · 值得投入时间做 MVP';
  if (s >= 6) return '一般 · 需要调整画像或模式';
  return '较弱 · 建议跳过';
}

const RelatedReports = [
  { id: 'sample-red-niche-002', name: '非英语母语者商务邮件文化适配', mode: 'red-niche' as const, score: 7.8, tagline: '出海团队跨文化邮件一键适配' },
  { id: 'sample-cross-domain-003', name: 'AI × 生物节律·动态恢复教练', mode: 'cross-domain' as const, score: 7.45, tagline: '可穿戴数据驱动的 AI 教练' },
  { id: 'sample-blue-ocean-005', name: 'AI 直播脚本实时生成助手', mode: 'blue-ocean' as const, score: 7.8, tagline: '带货主播的秒级口播副驾' },
];

// === Section Components ===

function MarketSection({ r }: { r: DetailReport }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">一、市场分析</h3>
        <p className="text-sm text-on-surface-variant">数据来源：见报告底部「数据来源与引用」</p>
      </div>
      <Subsection title="1.1 市场规模" icon={BarChart3}>
        <p className="text-foreground leading-relaxed">
          {r.market.size.value}
          {r.market.size.ref > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold align-middle">
              [{r.market.size.ref}]
            </span>
          )}
        </p>
      </Subsection>
      <Subsection title="1.2 增长动力" icon={TrendingUp}>
        <ul className="space-y-2">
          {r.market.growth.map((g: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </Subsection>
      <Subsection title="1.3 目标用户" icon={Users}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><div className="text-on-surface-variant text-xs">年龄</div><div className="text-foreground">{r.market.user.age}</div></div>
          <div><div className="text-on-surface-variant text-xs">职业</div><div className="text-foreground">{r.market.user.job}</div></div>
          <div><div className="text-on-surface-variant text-xs">规模</div><div className="text-foreground">{r.market.user.scale}</div></div>
          <div><div className="text-on-surface-variant text-xs">场景</div><div className="text-foreground">{r.market.user.scenario}</div></div>
        </div>
      </Subsection>
      <Subsection title="1.4 趋势判断" icon={Lightbulb}>
        <p className="text-foreground leading-relaxed">{r.market.trend}</p>
      </Subsection>
    </div>
  );
}

function CompetitionSection({ r }: { r: DetailReport }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">二、竞争分析</h3>
      <Subsection title="2.1 主要竞品" icon={Swords}>
        <div className="overflow-x-auto rounded-lg border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-lowest">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant text-xs uppercase tracking-wider">竞品</th>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant text-xs uppercase tracking-wider">核心功能</th>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant text-xs uppercase tracking-wider">定价</th>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant text-xs uppercase tracking-wider">用户规模</th>
                <th className="px-3 py-2 text-left font-semibold text-on-surface-variant text-xs uppercase tracking-wider">优劣势</th>
              </tr>
            </thead>
            <tbody>
              {r.competitors.map((rv: CompetitorData, i: number) => (
                <tr key={i} className="border-t border-outline-variant/10">
                  <td className="px-3 py-3 font-semibold text-foreground">{rv.name}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{rv.features}</td>
                  <td className="px-3 py-3 font-mono text-foreground">{rv.pricing}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{rv.scale}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{rv.pros}<br />{rv.cons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Subsection>
      <Subsection title="2.2 差异化空间" icon={Target}>
        <ul className="space-y-2">
          {r.differentiators.map((d: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-foreground">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-mono font-bold shrink-0">
                {i + 1}
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </Subsection>
    </div>
  );
}

function BusinessSection({ r }: { r: DetailReport }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">三、商业分析</h3>
      <Subsection title="3.1 变现模式" icon={DollarSign}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {r.business.models.map((m: { name: string; desc: string; price: string }, i: number) => (
            <div key={i} className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
              <div className="font-semibold text-foreground mb-1">{m.name}</div>
              <div className="text-sm text-on-surface-variant mb-1">{m.desc}</div>
              <div className="text-xs font-mono text-primary">{m.price}</div>
            </div>
          ))}
        </div>
      </Subsection>
      <Subsection title="3.2 成本结构" icon={BarChart3}>
        <ul className="space-y-2">
          {r.business.costs.map((c: { item: string; estimate: string }, i: number) => (
            <li key={i} className="flex items-start gap-2 text-foreground text-sm">
              <span className="text-on-surface-variant">·</span>
              <span><span className="text-on-surface-variant">{c.item}：</span>{c.estimate}</span>
            </li>
          ))}
        </ul>
      </Subsection>
      <Subsection title="3.3 回本周期" icon={TrendingUp}>
        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <p className="text-foreground font-semibold">{r.business.payback}</p>
        </div>
      </Subsection>
    </div>
  );
}

function DevilSection({ r }: { r: DetailReport }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Swords className="h-5 w-5 text-destructive" />
          <h3 className="font-display text-xl font-bold text-foreground">魔鬼辩护 · 为什么你不应该做这个？</h3>
        </div>
        <p className="text-sm text-on-surface-variant">
          在你被说服之前，先让反方 Agent 把方案批倒。<span className="text-destructive font-semibold"> 以下是 {r.devils.length} 条具体反驳，每条都附数据 / 逻辑支撑。</span>
        </p>
      </div>

      {r.devils.map((a: DevilData, i: number) => (
        <div key={a.id} className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20 text-destructive text-xs font-mono font-bold shrink-0">
              #{i + 1}
            </span>
            <h4 className="font-semibold text-destructive">{a.title}</h4>
          </div>
          <p className="text-foreground leading-relaxed mb-3 pl-9">{a.detail}</p>
          <details className="pl-9">
            <summary className="cursor-pointer text-xs text-on-surface-variant hover:text-foreground inline-flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> 但如果坚持要做 →
            </summary>
            <div className="mt-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-foreground">
              {a.rebuttal}
            </div>
          </details>
        </div>
      ))}

      <div className="rounded-xl border border-success/30 bg-success/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-success" />
          <h4 className="font-display text-base font-bold text-foreground">{r.survival.title}</h4>
        </div>
        <ul className="space-y-2">
          {r.survival.steps.map((p: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-foreground">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/20 text-success text-xs font-mono font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ActionSection({ r }: { r: DetailReport }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl font-bold text-foreground mb-4">五、行动建议</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
          <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-1">启动成本</div>
          <div className="font-display text-2xl font-bold text-foreground">{r.action.cost}</div>
        </div>
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4">
          <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-1">团队配置</div>
          <div className="font-display text-2xl font-bold text-foreground">{r.action.team}</div>
        </div>
      </div>

      <Subsection title="7 天启动计划" icon={Rocket}>
        <ol className="relative space-y-5 pl-6">
          {r.action.plan.map((p: { day: string; task: string }, i: number) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold ring-4 ring-background">
                {i + 1}
              </span>
              <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">{p.day}</div>
              <div className="font-semibold text-foreground mt-0.5">{p.task}</div>
            </li>
          ))}
        </ol>
      </Subsection>
    </div>
  );
}

function Subsection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="font-display text-base font-bold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}
