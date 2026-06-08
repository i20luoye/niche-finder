/**
 * 用户系统 API
 * POST /api/user  - 创建新用户（返回 API Key）
 * GET  /api/user  - 查询当前用户配额（按 x-api-key）
 */
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByApiKey, getOrCreateAnonymous, checkQuota, seedDemoUsers } from '@/lib/user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 启动时 seed（演示）
seedDemoUsers();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const plan = body.plan === 'pro' || body.plan === 'enterprise' ? body.plan : 'free';
  const u = createUser(plan);
  return NextResponse.json({ user: u, quota: checkQuota(u) });
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.headers.get('x-session');
  const u = getUserByApiKey(apiKey) || getOrCreateAnonymous();
  return NextResponse.json({ user: u, quota: checkQuota(u) });
}
