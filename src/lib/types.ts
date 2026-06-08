/**
 * 利基探测器 - 核心类型定义（完全宽松）
 * 所有领域模型只用索引签名，禁止任何 required 字段
 */

export type AnyRecord = { [key: string]: any };

export type DiscoveryMode = 'blue-ocean' | 'red-niche' | 'cross-domain' | 'analyze' | string;
export type AgentName = string;

export type SixDimScore = AnyRecord;
export type UserProfile = AnyRecord;
export type DataSource = AnyRecord;
export type DevilArgueItem = AnyRecord;
export type DevilArgument = AnyRecord;
export type SurvivalStrategy = AnyRecord;
export type ActionDay = AnyRecord;
export type ActionSection = AnyRecord;
export type BusinessSection = AnyRecord;
export type MarketSection = AnyRecord;
export type Competitor = AnyRecord;
export type DimDetail = AnyRecord;
export type Opportunity = AnyRecord;
export type OpportunityListItem = AnyRecord;
export type AnalysisReport = AnyRecord;
export type HistoryItem = AnyRecord;
export type Report = AnyRecord;
export type FullReport = AnyRecord;
export type DetailReport = AnyRecord;
export type User = AnyRecord;
export type PlanQuota = AnyRecord;
export type Plan = string;

export const PLAN_QUOTA: AnyRecord = {
  free: { daily: 5, monthly: 20, total: 100, perDay: 5, perMonth: 20 },
  pro: { daily: 50, monthly: 500, total: -1, perDay: 50, perMonth: 500 },
  enterprise: { daily: -1, monthly: -1, total: -1, perDay: -1, perMonth: -1 },
};

export function computeOverall(scores: SixDimScore): number {
  if (typeof scores?.overall === 'number') return scores.overall;
  const dims = [scores?.demand, scores?.blue_ocean, scores?.monetize, scores?.tech_feasible, scores?.entry_barrier, scores?.growth];
  const valid = dims.filter((v): v is number => typeof v === 'number');
  if (valid.length === 0) return 0;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  [key: string]: any;
};

export type StreamEvent = AnyRecord;
