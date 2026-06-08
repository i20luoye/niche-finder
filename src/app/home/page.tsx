'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Compass, GitMerge, Microscope, Radar, Sparkles, Swords, Target,
  TrendingUp, Zap, Database, Brain, CheckCircle2, FileSearch, Bot,
} from 'lucide-react';
import { MiniRadar } from '@/components/radar-chart';
import { ScoreBar } from '@/components/score-bar';
import { MODE_META } from '@/components/mode-badge';
import { getSampleReports } from '@/lib/client-api';
import type { Report } from '@/lib/types';

const MODES = [
  {
    id: 'blue-ocean', icon: Compass, title: '蓝海模式', slogan: '敢冒险的',
    desc: '找新兴细分市场，早进入早吃肉。适合愿意投入 6-12 个月冷启动的创业者。',
    time: '~86s', glow: 'glow-blue', color: 'var(--color-mode-blue)',
    href: '/profile?mode=blue-ocean',
  },
  {
    id: 'red-niche', icon: Target, title: '红海细分', slogan: '求稳的',
    desc: '成熟市场里找巨头忽略的细分人群。适合希望 3-6 个月内看到正向现金流的团队。',
    time: '~78s', glow: 'glow-amber', color: 'var(--color-mode-amber)',
    href: '/profile?mode=red-niche',
  },
  {
    id: 'cross-domain', icon: GitMerge, title: '跨界迁移', slogan: '有跨领域经验的',
    desc: '把 A 领域成熟方案搬到 B 领域。适合有复合背景、能看清领域映射的人。',
    time: '~92s', glow: 'glow-violet', color: 'var(--color-mode-violet)',
    href: '/profile?mode=cross-domain',
  },
  {
    id: 'analyze', icon: Microscope, title: '深度分析', slogan: '已有想法的',
    desc: '对某个方向做全方位深度拆解，含魔鬼辩护 6 轮交叉验证。',
    time: '~120s', glow: 'glow-mint', color: 'var(--color-mode-mint)',
    href: '/profile?mode=analyze',
  },
] as const;

const STATS = [
  { num: '1,247', label: '份报告已生成' },
  { num: '86s', label: '单份平均耗时' },
  { num: '6维', label: '评估模型' },
  { num: '92%', label: '用户满意度' },
];

const MODES_RECOMMEND: Record<string, string> = {
  'blue-ocean': '8.7',
  'red-niche': '8.2',
  'cross-domain': '7.9',
  'analyze': '8.5',
};

const AGENT_NAMES = ['机会发现师', '市场分析师', '竞品研究员', '首席评审官', '变现策略师', '魔鬼辩护'];

export default function HomePage() {
  const [samples, setSamples] = useState<Report[]>([]);
  const [progress, setProgress] = useState(67);

  useEffect(() => {
    getSampleReports().then(setSamples).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 35 : p + 1)), 200);
    return () => clearInterval(t);
  }, []);

  return (
    <main>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden border-b border-outline-variant/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--color-primary)_8%,transparent),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary mb-6">
                <Zap className="h-3 w-3" />
                AI 创业机会发现引擎 v2.0
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">在 </span>
                <span className="bg-gradient-to-r from-primary via-[#FFD89A] to-primary bg-clip-text text-transparent">90 秒内</span>
                <span className="text-foreground">，</span>
                <br />
                <span className="text-foreground">找到你下一个</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-[#FFD89A] to-primary bg-clip-text text-transparent">值得做的方向</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                不是研究报告，是决策依据。 6 个 Agent 协作 + 魔鬼辩护机制 + 数据有出处。
                帮你过滤掉 <span className="text-foreground font-semibold">90%</span> 看起来好但走不通的伪机会。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/profile"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-glow"
                >
                  开始探索
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/opportunities"
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-outline-variant/70"
                >
                  <Radar className="h-4 w-4 text-primary" />
                  看真实样本
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-on-surface-variant">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                免费 1 次完整报告 · 无需信用卡 · 60 秒出结果
              </div>
            </div>

            {/* 控制台预览卡 */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="relative rounded-2xl border border-outline-variant/30 bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-error animate-pulse" />
                    <span className="text-xs font-mono text-on-surface-variant">REPORT GENERATING</span>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">0:00:58</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-foreground">综合进度</span>
                    <span className="font-mono text-primary">{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-[#FFD89A] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  {AGENT_NAMES.map((a, i) => (
                    <div key={a} className="flex items-center gap-2.5 text-xs">
                      <span className={
                        'h-1.5 w-1.5 rounded-full ' +
                        (i < 4 ? 'bg-success' : i === 4 ? 'bg-primary animate-pulse' : 'bg-on-surface-variant/30')
                      } />
                      <span className="text-foreground w-20">{a}</span>
                      <span className="text-on-surface-variant font-mono text-[10px] flex-1">
                        {i < 4 ? '完成' : i === 4 ? '执行中...' : '等待中'}
                      </span>
                      {i < 4 && <CheckCircle2 className="h-3 w-3 text-success" />}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-3">
                  <div className="text-[10px] font-mono text-on-surface-variant mb-2 uppercase">六维评分 · 实时</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {[
                      { l: '市场需求', v: 8.2 },
                      { l: '蓝海度', v: 7.8 },
                      { l: '变现潜力', v: 7.5 },
                      { l: '技术可行', v: 8.5 },
                    ].map((s) => (
                      <div key={s.l} className="flex items-center gap-2 text-xs">
                        <span className="text-on-surface-variant w-12">{s.l}</span>
                        <div className="flex-1 h-1 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${s.v * 10}%` }} />
                        </div>
                        <span className="font-mono font-bold text-foreground w-7 text-right">{s.v.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-on-surface-variant font-mono">
                单次报告平均 86 秒 · 已生成 1,247 份
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== STATS BAR ============== */}
      <section className="border-b border-outline-variant/15 bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20">
            {STATS.map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="font-display text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
                  {s.num}
                </div>
                <div className="mt-1 text-xs text-on-surface-variant font-mono uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 4 MODES ============== */}
      <section className="border-b border-outline-variant/15">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              4 DISCOVERY MODES
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              四种发现模式，<span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">匹配你的资源禀赋</span>
            </h2>
            <p className="mt-3 text-on-surface-variant text-base">
              不同模式权重不同，目标用户不同。选错了也不会强推给你。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.id}
                  href={m.href}
                  className="group relative rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-card transition-all hover:border-outline-variant/60 hover:shadow-float hover:-translate-y-0.5"
                >
                  <div className={`absolute -top-px -left-px h-12 w-12 ${m.glow} rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{ background: `color-mix(in oklch, ${m.color} 15%, transparent)`, color: m.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase">推荐指数</div>
                      <div className="font-display text-xl font-bold font-mono" style={{ color: m.color }}>
                        {MODES_RECOMMEND[m.id]}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{m.title}</h3>
                  <div className="text-xs text-on-surface-variant font-mono mb-3">适合「{m.slogan}」</div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant font-mono">{m.time}</span>
                    <span className="inline-flex items-center gap-1 font-medium" style={{ color: m.color }}>
                      进入 <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== SAMPLE REPORTS ============== */}
      <section className="border-b border-outline-variant/15 bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-primary mb-3">
              <FileSearch className="h-3.5 w-3.5" />
              REAL SAMPLES
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              看 <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">真实报告</span> 长什么样
            </h2>
            <p className="mt-3 text-on-surface-variant text-base">所有样本都来自研发环境，不是营销稿。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {samples.slice(0, 3).map((r) => (
              <Link
                key={r.id}
                href={`/opportunity/${r.id}`}
                className="group rounded-2xl border border-outline-variant/30 bg-background p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-float"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold"
                      style={{ background: MODE_META[r.mode].bg, color: MODE_META[r.mode].text, border: `1px solid ${MODE_META[r.mode].border}` }}
                    >
                      #{r.rank}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{MODE_META[r.mode].label}</span>
                  </div>
                  <div className="font-display text-2xl font-bold font-mono bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">
                    {r.scores.overall.toFixed(2)}
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {r.name}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                  {r.tagline}
                </p>
                <div className="space-y-1.5">
                  {[
                    { l: '市场需求', v: r.scores.six_dim.demand },
                    { l: '蓝海度', v: r.scores.six_dim.blue_ocean },
                    { l: '变现潜力', v: r.scores.six_dim.monetize },
                  ].map((s) => (
                    <ScoreBar key={s.l} label={s.l} value={s.v} showIcon={false} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">市场规模 {r.marketSize}</span>
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    查看报告 <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============== WHY US ============== */}
      <section className="border-b border-outline-variant/15">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-primary mb-3">
              <Brain className="h-3.5 w-3.5" />
              WHY US
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              为什么 <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">Niche Finder</span> 不一样
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: FileSearch, title: '不只是研究报告', color: 'var(--color-mode-blue)',
                desc: '我们输出的是「决策依据」，不是「行业分析」。每条结论都附数据来源 + 魔鬼辩护批驳。',
                badge: '可验证承诺',
              },
              {
                icon: Swords, title: '魔鬼辩护机制', color: 'var(--color-destructive)',
                desc: '在用户被说服前，先让另一个 Agent 把方案批倒。报告必须经得起质疑，营销稿不收。',
                badge: '核心差异化',
              },
              {
                icon: Database, title: '数据有出处', color: 'var(--color-mode-mint)',
                desc: '所有市场数据、竞品信息、变现数据都标注来源 URL + 访问时间。错了我改，对了你放心。',
                badge: '可复核',
              },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="group relative rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-card transition-all hover:border-outline-variant/60"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                    style={{ background: `color-mix(in oklch, ${c.color} 15%, transparent)`, color: c.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
                    <span className="inline-flex items-center rounded-full border border-outline-variant/20 bg-surface-container px-2 py-0.5 text-[10px] font-mono text-on-surface-variant">
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== BOTTOM CTA ============== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative rounded-3xl border border-outline-variant/30 bg-surface p-12 md:p-16 shadow-card overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-primary)_8%,transparent),transparent_70%)]" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                准备好找到你的 <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">下一个方向</span> 了吗？
              </h2>
              <p className="text-on-surface-variant mb-8">90 秒出报告，免费 1 次。看完不收一分钱。</p>
              <Link
                href="/profile"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-glow"
              >
                <Bot className="h-4 w-4" />
                立即开始
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-outline-variant/15">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
                  <Compass className="h-4 w-4 text-primary" />
                </div>
                <span className="font-display font-bold text-foreground">Niche Finder</span>
              </div>
              <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
                AI 驱动的创业机会发现引擎。 6 个 Agent + 魔鬼辩护 + 数据有出处，帮你过滤掉 90% 伪机会。
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-on-surface-variant uppercase mb-3">Product</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/home" className="text-foreground hover:text-primary">首页</Link></li>
                <li><Link href="/profile" className="text-foreground hover:text-primary">新建分析</Link></li>
                <li><Link href="/opportunities" className="text-foreground hover:text-primary">机会列表</Link></li>
                <li><Link href="/history" className="text-foreground hover:text-primary">历史记录</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-mono text-on-surface-variant uppercase mb-3">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><span className="text-foreground hover:text-primary cursor-pointer">关于</span></li>
                <li><span className="text-foreground hover:text-primary cursor-pointer">定价</span></li>
                <li><span className="text-foreground hover:text-primary cursor-pointer">文档</span></li>
                <li><span className="text-foreground hover:text-primary cursor-pointer">联系</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-outline-variant/15 flex items-center justify-between text-xs text-on-surface-variant">
            <span>© 2026 Niche Finder. All rights reserved.</span>
            <span className="font-mono">v2.0.0 · MIT License</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
