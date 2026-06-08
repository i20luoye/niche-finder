'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight, Briefcase, Building2, ChevronDown, Clock, Code2, Compass, DollarSign,
  GitMerge, Lightbulb, MapPin, Microscope, PenLine, Plus, Rocket, Sparkles, Target,
  TrendingUp, Wallet, X, Zap,
} from 'lucide-react';
import { LoadingState } from '@/components/loading-state';
import { ModeBadge } from '@/components/mode-badge';
import { startDiscover, getOrCreateUser } from '@/lib/client-api';
import type { DiscoveryMode, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

const MODES: { id: DiscoveryMode; label: string; color: string }[] = [
  { id: 'blue-ocean', label: '蓝海模式', color: 'var(--color-mode-blue)' },
  { id: 'red-niche', label: '红海细分', color: 'var(--color-mode-amber)' },
  { id: 'cross-domain', label: '跨界迁移', color: 'var(--color-mode-violet)' },
  { id: 'analyze', label: '深度分析', color: 'var(--color-mode-mint)' },
];

const BUDGET_OPTIONS = [
  { v: '5万以下', desc: '轻量启动', icon: Wallet },
  { v: '5-20万', desc: 'MVP 阶段', icon: DollarSign },
  { v: '20-50万', desc: '小团队', icon: Briefcase },
  { v: '50万以上', desc: '可规模投入', icon: Building2 },
];

const TIME_OPTIONS = [
  { v: '兼职', desc: '10-20h/周', icon: Clock },
  { v: '半全职', desc: '20-40h/周', icon: TrendingUp },
  { v: '全职', desc: '40h+/周', icon: Rocket },
];

const SKILL_OPTIONS = ['产品', '技术', '运营', '销售', '设计', '营销', '内容', '数据', '其他'];
const INCOME_OPTIONS = [
  { v: '月入 5k', desc: '副业起步' },
  { v: '月入 2 万', desc: '稳定副业' },
  { v: '月入 10 万', desc: '主营业务' },
  { v: '越多越好', desc: '高速增长' },
];
const DOMAIN_OPTIONS = ['AI', '电商', '教育', '健康', '金融', '社交', '工具', '内容'];

function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') as DiscoveryMode) || 'blue-ocean';

  const [mode, setMode] = useState<DiscoveryMode>(initialMode);
  const [budget, setBudget] = useState<string>('5-20万');
  const [time, setTime] = useState<string>('半全职');
  const [skills, setSkills] = useState<string[]>(['技术', '设计']);
  const [income, setIncome] = useState<string>('月入 2 万');
  const [city, setCity] = useState('上海');
  const [experience, setExperience] = useState('3 年 SaaS 产品经理');
  const [domains, setDomains] = useState<string[]>(['AI', '内容']);
  const [note, setNote] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const STEPS = [
    '初始化用户会话与配额',
    '机会发现师扫描市场信号',
    '市场分析师交叉验证',
    '竞品研究员 + 变现策略师',
    '首席评审打分排序',
    '魔鬼辩护反向论证',
    '生成最终报告',
  ];

  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  const toggleDomain = (d: string) =>
    setDomains((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const summary = [
    { l: '启动预算', v: budget },
    { l: '可投入时间', v: time },
    { l: '核心技能', v: skills.join(' / ') || '未填' },
    { l: '目标收益', v: income },
    { l: '关注领域', v: domains.join(' / ') || '未填' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingStep(0);
    const user = await getOrCreateUser();
    const profile: UserProfile = {
      budget: budget as UserProfile['budget'],
      time: time as UserProfile['time'],
      skills: skills as UserProfile['skills'],
      goal: income as UserProfile['goal'],
      city,
      industryExp: experience,
      interests: domains as UserProfile['interests'],
      notes: note,
    };
    const stepTimer = setInterval(() => {
      setLoadingStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 9000);
    const resp = await startDiscover({ mode, profile, apiKey: user.apiKey });
    clearInterval(stepTimer);
    if (resp.ok && resp.reportId) {
      router.push(`/opportunity/${resp.reportId}`);
    } else {
      setLoading(false);
      alert('生成失败：' + (resp.error ?? '未知错误'));
    }
  };

  const handleLazy = async () => {
    setLoading(true);
    const user = await getOrCreateUser();
    const profile: UserProfile = {
      budget: budget as UserProfile['budget'],
      time: time as UserProfile['time'],
      skills: skills as UserProfile['skills'],
      goal: income as UserProfile['goal'],
      city,
      industryExp: experience,
      interests: domains as UserProfile['interests'],
      notes: note,
    };
    const resp = await startDiscover({ mode, profile, apiKey: user.apiKey });
    if (resp.ok && resp.reportId) {
      router.push(`/opportunity/${resp.reportId}`);
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <LoadingState steps={STEPS} currentStep={loadingStep} />
        <p className="mt-6 text-center text-xs text-on-surface-variant font-mono">
          6 个 Agent 正在协作 · 魔鬼辩护正在进行
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* 顶部模式徽章 */}
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
          <Sparkles className="h-3 w-3" />
          智能机会发现
        </span>
        <ModeBadge mode={mode} />
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
        告诉我们你的 <span className="bg-gradient-to-r from-primary to-[#FFD89A] bg-clip-text text-transparent">资源禀赋</span>
      </h1>
      <p className="mt-3 text-on-surface-variant">7 个问题，帮你定制专属的创业机会推荐。全部可跳过。</p>

      {/* 模式选择（4 个 tab） */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-outline-variant/30 bg-surface text-on-surface-variant hover:border-outline-variant/60'
              )}
              style={active ? { borderColor: `color-mix(in oklch, ${m.color} 60%, transparent)`, background: `color-mix(in oklch, ${m.color} 12%, transparent)`, color: m.color } : {}}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左：表单 */}
        <div className="lg:col-span-2 space-y-5">
          <QuestionCard n={1} title="启动预算" subtitle="你愿意投入多少钱？">
            <div className="grid grid-cols-2 gap-2.5">
              {BUDGET_OPTIONS.map((o) => {
                const active = budget === o.v;
                const Icon = o.icon;
                return (
                  <button
                    key={o.v}
                    onClick={() => setBudget(o.v)}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
                      active
                        ? 'border-primary bg-primary/10'
                        : 'border-outline-variant/30 bg-surface hover:border-outline-variant/60'
                    )}
                  >
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', active ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface-variant')}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className={cn('text-sm font-semibold', active ? 'text-primary' : 'text-foreground')}>{o.v}</div>
                      <div className="text-[11px] text-on-surface-variant">{o.desc}</div>
                    </div>
                    {active && <span className="text-primary text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </QuestionCard>

          <QuestionCard n={2} title="可投入时间" subtitle="每周能花多少时间？">
            <div className="grid grid-cols-3 gap-2.5">
              {TIME_OPTIONS.map((o) => {
                const active = time === o.v;
                const Icon = o.icon;
                return (
                  <button
                    key={o.v}
                    onClick={() => setTime(o.v)}
                    className={cn(
                      'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all',
                      active ? 'border-primary bg-primary/10' : 'border-outline-variant/30 bg-surface hover:border-outline-variant/60'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-on-surface-variant')} />
                    <div className={cn('text-sm font-semibold', active ? 'text-primary' : 'text-foreground')}>{o.v}</div>
                    <div className="text-[10px] text-on-surface-variant">{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </QuestionCard>

          <QuestionCard n={3} title="核心技能" subtitle="多选，影响 6 维模型里的「团队适配度」权重">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">已选 {skills.length} 项</div>
              {skills.length > 0 && (
                <button onClick={() => setSkills([])} className="text-[11px] text-on-surface-variant hover:text-foreground flex items-center gap-1">
                  <X className="h-3 w-3" /> 清空
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((s) => {
                const active = skills.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition-all',
                      active
                        ? 'border-primary/40 bg-primary/15 text-primary'
                        : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-outline-variant/60'
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </QuestionCard>

          <QuestionCard n={4} title="目标收益" subtitle="希望的现金回报？">
            <div className="grid grid-cols-2 gap-2.5">
              {INCOME_OPTIONS.map((o) => {
                const active = income === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => setIncome(o.v)}
                    className={cn(
                      'rounded-lg border p-3 text-left transition-all',
                      active ? 'border-primary bg-primary/10' : 'border-outline-variant/30 bg-surface hover:border-outline-variant/60'
                    )}
                  >
                    <div className={cn('text-sm font-semibold', active ? 'text-primary' : 'text-foreground')}>{o.v}</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </QuestionCard>

          {/* 折叠选答 */}
          <div className="rounded-xl border border-outline-variant/30 bg-surface overflow-hidden">
            <button
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary font-mono text-xs font-bold">+</span>
                <div>
                  <div className="text-sm font-semibold text-foreground">补充信息（选填）</div>
                  <div className="text-xs text-on-surface-variant">让推荐更精准</div>
                </div>
              </div>
              <ChevronDown className={cn('h-4 w-4 text-on-surface-variant transition-transform', expanded && 'rotate-180')} />
            </button>
            <div className={cn('collapse-content', expanded && 'expanded')} style={{ maxHeight: expanded ? 500 : 0 }}>
              <div className="space-y-4 p-4 pt-0 border-t border-outline-variant/15">
                <Field label="所在城市" icon={MapPin}>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface-container border-none rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="如：上海"
                  />
                </Field>
                <Field label="行业经验" icon={Briefcase}>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-surface-container border-none rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="如：3 年 SaaS 产品经理"
                  />
                </Field>
                <Field label="关注领域" icon={Target}>
                  <div className="flex flex-wrap gap-2">
                    {DOMAIN_OPTIONS.map((d) => {
                      const active = domains.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDomain(d)}
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-xs transition-all',
                            active
                              ? 'border-primary/40 bg-primary/15 text-primary'
                              : 'border-outline-variant/30 bg-surface-container text-on-surface-variant'
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="补充说明" icon={PenLine}>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full bg-surface-container border-none rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="其他想告诉我们的，比如：希望避开的赛道、必须远程工作等"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* 右：摘要 + 隐私 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-foreground">你的画像摘要</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> 实时同步
              </span>
            </div>
            <ul className="space-y-1.5 text-xs">
              {summary.map((s) => (
                <li key={s.l} className="flex items-center justify-between gap-2">
                  <span className="text-on-surface-variant">{s.l}</span>
                  <span className="text-foreground font-mono truncate max-w-[160px] text-right">{s.v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-primary/20 text-[11px] text-on-surface-variant">
              基于你的画像，预计发现 <span className="font-mono font-bold text-primary">12-18</span> 个相关机会
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">我们如何使用这些信息</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              这些信息仅用于本次机会分析，不会上传、不存储、不用于训练。分析完成后即销毁。
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">为什么我们要问这些？</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              6 个 Agent 会基于这些资源禀赋，为你过滤掉不切实际的方向。<br /> 魔鬼辩护模块会主动质疑「用户高估自身能力」的盲区。
            </p>
          </div>
        </div>
      </div>

      {/* 提交 */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={handleSubmit}
          className="w-full max-w-md inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-glow"
        >
          <Rocket className="h-4 w-4" />
          生成我的机会
          <ArrowRight className="h-4 w-4" />
        </button>
        <button onClick={handleLazy} className="text-xs text-on-surface-variant hover:text-foreground underline underline-offset-2">
          懒人模式：跳过全部
        </button>
        <p className="text-[11px] text-on-surface-variant font-mono">预计耗时 60-90 秒 · 免费 1 次</p>
      </div>
    </main>
  );
}

function QuestionCard({ n, title, subtitle, children }: { n: number; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface p-6 shadow-card">
      <div className="flex items-start gap-4 mb-4">
        <span className="font-display font-mono text-2xl font-bold text-on-surface-variant/60 leading-none">
          {String(n).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-1.5">
        <Icon className="h-3 w-3" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-6 py-20 text-center text-on-surface-variant">加载中…</main>}>
      <ProfileForm />
    </Suspense>
  );
}
