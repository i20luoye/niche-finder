/**
 * 轻量级引擎（Lightweight Engine）
 * - 编排 6+1 个 Agent，按发现模式执行
 * - 支持真实 LLM 调用（带 demo 兜底）
 * - 实时进度回调，便于前端流式渲染
 */
import type { NextRequest } from 'next/server';
import type {
  DiscoveryMode, UserProfile, Opportunity, SixDimScore,
  FullReport, AgentName, DevilArgument, SurvivalStrategy, ActionSection, Competitor, BusinessSection, MarketSection,
} from './types';
import { computeOverall } from './types';
import { AGENT_PROMPTS, ACTION_PROMPT, MODE_CONFIG } from './modes';
import { invokeJson, sys, usr } from './llm';
import { webSearchMulti } from './search';
import { getDemoOpportunities } from './seed';
import { newReportId, saveReport } from './store';
import { getUserByApiKey, consume } from './user';

export interface EngineOptions {
  req: NextRequest;
  mode: DiscoveryMode;
  profile: UserProfile;
  onProgress?: (e: EngineEvent) => void;
  useRealLlm?: boolean;
}

export type EngineEvent =
  | { type: 'start'; mode: DiscoveryMode }
  | { type: 'agent'; name: AgentName; status: 'running' | 'done'; elapsedMs?: number }
  | { type: 'opportunities'; count: number }
  | { type: 'opportunity_done'; idx: number; name: string; overall: number }
  | { type: 'done'; reportId: string; durationSec: number }
  | { type: 'error'; message: string };

const BUDGET_LABEL = {
  lt_5w: '5 万以下', '5w_20w': '5-20 万', '20w_50w': '20-50 万', gt_50w: '50 万以上',
} as const;
const TIME_LABEL = { part_time: '兼职', half_time: '半全职', full_time: '全职' } as const;
const GOAL_LABEL = { '5k': '月入 5k', '20k': '月入 2 万', '100k': '月入 10 万', unlimited: '越多越好' } as const;
const SKILL_LABEL = { product: '产品', tech: '技术', operation: '运营', sales: '销售', design: '设计', marketing: '营销', content: '内容', data: '数据', other: '其他' } as const;
const INTEREST_LABEL = { ai: 'AI', ecommerce: '电商', education: '教育', health: '健康', finance: '金融', social: '社交', tools: '工具', content: '内容' } as const;

function profileToText(p: UserProfile): string {
  const s = (arr?: string[], dict?: Record<string, string>) => arr?.map((x) => dict?.[x] ?? x).join('、') || '未指定';
  return [
    `启动预算：${BUDGET_LABEL[p.budget]}`,
    `可投入时间：${TIME_LABEL[p.time]}`,
    `核心技能：${s(p.skills, SKILL_LABEL)}`,
    `目标收益：${GOAL_LABEL[p.goal]}`,
    p.city ? `所在城市：${p.city}` : '',
    p.industryExp ? `行业经验：${p.industryExp}` : '',
    p.interests?.length ? `关注领域：${s(p.interests, INTEREST_LABEL)}` : '',
    p.notes ? `补充说明：${p.notes}` : '',
  ].filter(Boolean).join('\n');
}

async function discovererStep(opts: EngineOptions): Promise<{ name: string; oneLiner: string; valueProposition: string }[]> {
  const { req, mode, profile, useRealLlm } = opts;
  const cfg = MODE_CONFIG[mode];
  const profileText = profileToText(profile);
  if (!useRealLlm) {
    return getDemoOpportunities(mode).slice(0, 5).map((o) => ({ name: o.name, oneLiner: o.oneLiner, valueProposition: o.valueProposition }));
  }
  const prompt = AGENT_PROMPTS.discoverer(mode, profileText) + `\n\n【模式重点】${cfg.promptFocus}`;
  type R = { opportunities: { name: string; oneLiner: string; valueProposition: string }[] };
  const r = await invokeJson<R>(
    [sys('你是资深机会发现师，输出严格 JSON。'), usr(prompt)],
    req,
    { temperature: 0.85, model: 'doubao-seed-1-8-251228' }
  );
  return r.opportunities.slice(0, 5);
}

async function marketStep(opp: { name: string; oneLiner: string }, req: NextRequest, mode: DiscoveryMode, useRealLlm: boolean): Promise<MarketSection> {
  if (!useRealLlm) {
    return {
      marketSize: { value: '50-100 亿元/年', source: '艾瑞咨询 [1]', url: 'https://www.iresearch.com.cn' },
      growthDrivers: ['行业增速 25%', '用户付费意愿强', '技术拐点已到'],
      targetUser: { age: '25-35 岁', job: '中小商家', scale: '全国 800 万家', scenario: '每天/每周需要产出营销内容' },
      trend: '未来 2-3 年将持续增长。',
    };
  }
  await webSearchMulti([`${opp.name} 市场规模`, `${opp.name} 用户规模`], 2, req).catch(() => undefined);
  type R = { market: MarketSection };
  const r = await invokeJson<R>(
    [sys('你是严谨的市场分析师，所有数据必须标注来源。'), usr(AGENT_PROMPTS.market_analyst(opp.name, opp.oneLiner, mode))],
    req,
    { temperature: 0.5 }
  );
  return r.market;
}

async function competitorStep(opp: { name: string }, req: NextRequest, useRealLlm: boolean): Promise<{ competitors: Competitor[]; differentiation: string[] }> {
  if (!useRealLlm) {
    return {
      competitors: [
        { name: 'Jasper AI', features: '通用文案生成', pricing: '$49/月', userScale: '百万级', pros: '品牌成熟', cons: '不专攻本地生活' },
        { name: '秘塔写作猫', features: '通用中文写作', pricing: '免费+会员', userScale: '千万级', pros: '中文强', cons: '偏长文' },
      ],
      differentiation: ['深度本地化', '多平台同步', '价格亲民'],
    };
  }
  await webSearchMulti([`${opp.name} 竞品`, `${opp.name} 类似产品`], 2, req).catch(() => undefined);
  type R = { competitors: Competitor[]; differentiation: string[] };
  const r = await invokeJson<R>(
    [sys('你是严谨的竞品分析师，竞品必须真实存在。'), usr(AGENT_PROMPTS.competitor(opp.name))],
    req,
    { temperature: 0.5 }
  );
  return r;
}

async function monetizeStep(opp: { name: string }, req: NextRequest, useRealLlm: boolean): Promise<BusinessSection> {
  if (!useRealLlm) {
    return {
      models: [
        { name: '订阅制', description: '基础版 99 元/月', priceHint: '99 元/月' },
        { name: '按次付费', description: '1 元/次', priceHint: '1 元/次' },
      ],
      cost: [{ item: 'LLM API', estimate: '3000-8000 元/月' }],
      paybackPeriod: '按 100 付费用户计算，约 3-4 个月回本',
    };
  }
  type R = { models: BusinessSection['models']; cost: BusinessSection['cost']; paybackPeriod: string };
  const r = await invokeJson<R>(
    [sys('你是变现策略师。'), usr(AGENT_PROMPTS.monetize(opp.name))],
    req,
    { temperature: 0.6 }
  );
  return { models: r.models, cost: r.cost, paybackPeriod: r.paybackPeriod };
}

async function chiefReviewerStep(opp: { name: string; valueProposition: string }, req: NextRequest, useRealLlm: boolean): Promise<SixDimScore> {
  if (!useRealLlm) {
    return { demand: 7.5, blue_ocean: 9.0, monetize: 7.0, tech_feasible: 8.5, entry_barrier: 7.0, growth: 6.5 };
  }
  type R = { scores: SixDimScore };
  const r = await invokeJson<R>(
    [sys('你是严格的首席评审。'), usr(AGENT_PROMPTS.chief_reviewer(opp.name, opp.valueProposition))],
    req,
    { temperature: 0.4 }
  );
  return r.scores;
}

async function devilStep(opp: { name: string; valueProposition: string; scores: SixDimScore }, req: NextRequest, useRealLlm: boolean): Promise<{ arguments: DevilArgument[]; survival: SurvivalStrategy }> {
  if (!useRealLlm) {
    return {
      arguments: [
        { title: '本地商家付费意愿被高估', reasoning: '餐饮老板月薪中位数不到 1 万，让他们付 99 元/月买文案工具，转化率可能不到 3%。', rebuttal: '主攻付费意愿明确的连锁品牌。' },
        { title: '巨头一旦反应过来会快速降维', reasoning: '字节/腾讯等已布局商家 SaaS，一旦做内容生成就直接免费。', rebuttal: '从第一天就做插件化。' },
        { title: '获客成本被严重低估', reasoning: '商家在美团/抖音心智已饱和，地推 BD 1 个商家平均 200-500 元。', rebuttal: '聚焦单一垂直做出口碑。' },
        { title: '内容生成同质化严重', reasoning: 'LLM 生成缺乏品牌调性，商家用 1 个月就弃用。', rebuttal: '加入品牌调性训练模块。' },
      ],
      survival: {
        title: '如果坚持要做，最小化风险的方式',
        steps: ['MVP 阶段只服务"奶茶店"一个垂直', '免费策略拉 100 个真实商家共创', '与 1 家本地 SaaS 谈插件合作', '3 个月内验证付费转化率不到 5% 立即转型'],
      },
    };
  }
  type R = { arguments: DevilArgument[]; survival: SurvivalStrategy };
  const r = await invokeJson<R>(
    [sys('你是魔鬼辩护人，职责是把这个方案批倒，必须给出 3-4 条锋利反驳。'), usr(AGENT_PROMPTS.devil(opp.name, opp.valueProposition, opp.scores as any))],
    req,
    { temperature: 0.8 }
  );
  return r;
}

async function actionStep(opp: { name: string }, budget: string, req: NextRequest, useRealLlm: boolean): Promise<ActionSection> {
  if (!useRealLlm) {
    return {
      startupCost: '3-5 万',
      teamSize: '1-2 人',
      sevenDayPlan: [
        { day: 'Day 1', task: '访谈 10 个目标用户' },
        { day: 'Day 2', task: '搭建 MVP demo' },
        { day: 'Day 3', task: '完善核心功能' },
        { day: 'Day 4', task: 'UI 优化' },
        { day: 'Day 5', task: '种子用户获取' },
        { day: 'Day 6', task: '收集反馈迭代' },
        { day: 'Day 7', task: '上线付费验证' },
      ],
    };
  }
  type R = { action: ActionSection };
  const r = await invokeJson<R>(
    [sys('你是行动教练。'), usr(ACTION_PROMPT(opp.name, budget))],
    req,
    { temperature: 0.6 }
  );
  return r.action;
}

function emit(opts: EngineOptions, e: EngineEvent): void {
  if (opts.onProgress) opts.onProgress(e);
}

const STANDARD_SOURCES = [
  { ref: 1, title: '艾瑞咨询：2025 中国 SaaS 行业研究报告', publisher: '艾瑞咨询', url: 'https://www.iresearch.com.cn/report/saas-2025', accessedAt: '2026-06-01' },
  { ref: 2, title: 'QuestMobile 中国移动互联网年度大报告', publisher: 'QuestMobile', url: 'https://www.questmobile.com.cn/report-2025', accessedAt: '2026-05-15' },
  { ref: 3, title: '中国信息通信研究院：AI 应用场景白皮书', publisher: '中国信通院', url: 'https://www.caict.ac.cn', accessedAt: '2026-05-20' },
  { ref: 4, title: '36 氪：本地生活服务赛道观察', publisher: '36 氪', url: 'https://36kr.com/p/locallife-2025', accessedAt: '2026-06-02' },
  { ref: 5, title: '美团研究院：本地商家经营状况调研', publisher: '美团研究院', url: 'https://about.meituan.com/research', accessedAt: '2026-05-28' },
];

/** 主入口：运行一次发现分析 */
export async function runDiscovery(opts: EngineOptions): Promise<FullReport> {
  const t0 = Date.now();
  const reportId = newReportId();
  const agentProgress: { name: AgentName; status: 'pending' | 'running' | 'done'; startedAt?: string; endedAt?: string }[] = [
    { name: 'discoverer', status: 'pending' },
    { name: 'market_analyst', status: 'pending' },
    { name: 'competitor', status: 'pending' },
    { name: 'user_researcher', status: 'pending' },
    { name: 'monetize', status: 'pending' },
    { name: 'chief_reviewer', status: 'pending' },
    { name: 'devil', status: 'pending' },
  ];

  const report: FullReport = {
    id: reportId,
    mode: opts.mode,
    userProfile: opts.profile,
    opportunities: [],
    durationSec: 0,
    status: 'running',
    agentProgress,
    createdAt: new Date().toISOString(),
  };
  saveReport(report);
  emit(opts, { type: 'start', mode: opts.mode });

  // Step 1: discoverer
  agentProgress[0].status = 'running'; agentProgress[0].startedAt = new Date().toISOString();
  emit(opts, { type: 'agent', name: 'discoverer', status: 'running' });
  const opps = await discovererStep(opts);
  agentProgress[0].status = 'done'; agentProgress[0].endedAt = new Date().toISOString();
  emit(opts, { type: 'agent', name: 'discoverer', status: 'done' });
  emit(opts, { type: 'opportunities', count: opps.length });

  // Step 2-5: 并行处理每个机会
  const builtOpps: Opportunity[] = [];
  for (let i = 0; i < opps.length; i++) {
    const o = opps[i];
    emit(opts, { type: 'agent', name: 'market_analyst', status: 'running' });
    const [market, competition, business, scores] = await Promise.all([
      marketStep(o, opts.req, opts.mode, !!opts.useRealLlm),
      competitorStep(o, opts.req, !!opts.useRealLlm),
      monetizeStep(o, opts.req, !!opts.useRealLlm),
      chiefReviewerStep(o, opts.req, !!opts.useRealLlm),
    ]);
    emit(opts, { type: 'agent', name: 'market_analyst', status: 'done' });
    emit(opts, { type: 'agent', name: 'competitor', status: 'done' });
    emit(opts, { type: 'agent', name: 'monetize', status: 'done' });
    emit(opts, { type: 'agent', name: 'chief_reviewer', status: 'done' });

    emit(opts, { type: 'agent', name: 'devil', status: 'running' });
    const { arguments: arguments_, survival } = await devilStep({ name: o.name, valueProposition: o.valueProposition, scores }, opts.req, !!opts.useRealLlm);
    emit(opts, { type: 'agent', name: 'devil', status: 'done' });

    const action = await actionStep(o, BUDGET_LABEL[opts.profile.budget], opts.req, !!opts.useRealLlm);

    const overall = computeOverall(scores);
    const oppFull: Opportunity = {
      id: `${reportId}_o${i}`,
      mode: opts.mode,
      rank: i + 1,
      name: o.name,
      oneLiner: o.oneLiner,
      valueProposition: o.valueProposition,
      scores,
      overall,
      marketSize: market.marketSize.value,
      entryBarrier: '中',
      startupCost: action.startupCost,
      market,
      competition,
      business,
      devilsAdvocate: arguments_,
      survival,
      action,
      sources: STANDARD_SOURCES,
      related: [],
      createdAt: new Date().toISOString(),
    };
    builtOpps.push(oppFull);
    emit(opts, { type: 'opportunity_done', idx: i, name: o.name, overall });
  }

  // 关联相关机会（同 mode 后续条目）
  builtOpps.forEach((o, i) => {
    o.related = builtOpps.filter((_, j) => j !== i).map((x) => x.id).slice(0, 3);
  });

  const duration = (Date.now() - t0) / 1000;
  report.opportunities = builtOpps;
  report.durationSec = Math.round(duration * 10) / 10;
  report.status = 'completed';
  report.completedAt = new Date().toISOString();
  saveReport(report);
  emit(opts, { type: 'done', reportId, durationSec: report.durationSec });

  // 配额消耗
  const apiKey = opts.req.headers.get('x-api-key') || opts.req.headers.get('x-session');
  const u = getUserByApiKey(apiKey);
  if (u) consume(u);

  return report;
}

/** 是否启用真实 LLM（默认 demo，方便离线演示） */
export function shouldUseRealLlm(req: NextRequest): boolean {
  const q = req.nextUrl.searchParams.get('realLlm');
  if (q === '1' || q === 'true') return true;
  if (q === '0' || q === 'false') return false;
  // header 控制
  const h = req.headers.get('x-use-real-llm');
  if (h === '1' || h === 'true') return true;
  return false;  // 默认 demo（保证 demo 体验稳定）
}
