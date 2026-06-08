/**
 * 用户系统：API Key + 三级套餐 + 配额管理
 * 使用 Node.js 进程内 Map 持久化（生产环境建议替换为 Supabase）
 */
import { randomBytes } from 'crypto';
import { PLAN_QUOTA, type Plan, type User } from './types';

const users = new Map<string, User>();
const apiKeyIndex = new Map<string, string>(); // apiKey -> userId

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);

function genApiKey(): string {
  return 'nf_' + randomBytes(18).toString('hex');
}

export function createUser(plan: Plan = 'free'): User {
  const id = 'u_' + randomBytes(8).toString('hex');
  const apiKey = genApiKey();
  const u: User = {
    id,
    apiKey,
    plan,
    createdAt: new Date().toISOString(),
    usageCount: 0,
    dailyUsage: [{ date: today(), count: 0 }],
    monthlyUsage: [{ month: thisMonth(), count: 0 }],
  };
  users.set(id, u);
  apiKeyIndex.set(apiKey, id);
  return u;
}

export function getUserByApiKey(apiKey: string | null | undefined): User | undefined {
  if (!apiKey) return undefined;
  const id = apiKeyIndex.get(apiKey);
  if (!id) return undefined;
  return users.get(id);
}

export function getOrCreateAnonymous(): User {
  // 无 key 时返回一个 free 匿名用户（不持久化）
  return {
    id: 'anon',
    apiKey: 'anon',
    plan: 'free',
    createdAt: new Date().toISOString(),
    usageCount: 0,
  };
}

export interface QuotaCheck {
  ok: boolean;
  reason?: 'daily' | 'monthly' | 'total';
  remaining: { day: number; month: number; total: number };
  quota: { day: number; month: number; total: number };
}

export function checkQuota(user: User): QuotaCheck {
  const q = PLAN_QUOTA[user.plan];
  const td = today();
  const tm = thisMonth();
  const d = user.dailyUsage?.find((x) => x.date === td);
  const m = user.monthlyUsage?.find((x) => x.month === tm);
  const dayCount = d?.count ?? 0;
  const monthCount = m?.count ?? 0;
  const total = user.usageCount;
  if (dayCount >= q.perDay) return { ok: false, reason: 'daily', remaining: { day: 0, month: Math.max(0, q.perMonth - monthCount), total: Math.max(0, q.total - total) }, quota: { day: q.perDay, month: q.perMonth, total: q.total } };
  if (monthCount >= q.perMonth) return { ok: false, reason: 'monthly', remaining: { day: Math.max(0, q.perDay - dayCount), month: 0, total: Math.max(0, q.total - total) }, quota: { day: q.perDay, month: q.perMonth, total: q.total } };
  if (total >= q.total) return { ok: false, reason: 'total', remaining: { day: Math.max(0, q.perDay - dayCount), month: Math.max(0, q.perMonth - monthCount), total: 0 }, quota: { day: q.perDay, month: q.perMonth, total: q.total } };
  return { ok: true, remaining: { day: q.perDay - dayCount, month: q.perMonth - monthCount, total: q.total - total }, quota: { day: q.perDay, month: q.perMonth, total: q.total } };
}

export function consume(user: User): void {
  const td = today();
  const tm = thisMonth();
  if (!user.dailyUsage) user.dailyUsage = [];
  if (!user.monthlyUsage) user.monthlyUsage = [];
  let d = user.dailyUsage.find((x) => x.date === td);
  if (!d) { d = { date: td, count: 0 }; user.dailyUsage.push(d); }
  d.count++;
  let m = user.monthlyUsage.find((x) => x.month === tm);
  if (!m) { m = { month: tm, count: 0 }; user.monthlyUsage.push(m); }
  m.count++;
  user.usageCount++;
  user.lastUsedAt = new Date().toISOString();
}

export function listUsers(): User[] {
  return Array.from(users.values());
}

/** 演示用：构造若干假历史报告用户 */
export function seedDemoUsers(): void {
  if (users.size > 0) return;
  // 匿名演示用
  const demo = createUser('free');
  demo.usageCount = 12;
  demo.dailyUsage = [{ date: today(), count: 1 }];
  demo.monthlyUsage = [{ month: thisMonth(), count: 8 }];
}
