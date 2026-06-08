/**
 * POST /api/discover
 * 启动一次机会分析（异步执行）
 * Body: { mode, profile, realLlm? }
 * Returns: { reportId, status }
 */
import { NextRequest, NextResponse } from 'next/server';
import { runDiscovery, shouldUseRealLlm } from '@/lib/engine';
import { getUserByApiKey, getOrCreateAnonymous } from '@/lib/user';
import type { DiscoveryMode, UserProfile } from '@/lib/types';
import { MODE_CONFIG } from '@/lib/modes';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 分钟

export async function POST(req: NextRequest) {
  let body: { mode?: string; profile?: UserProfile; realLlm?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const mode = body.mode as DiscoveryMode;
  if (!mode || !(mode in MODE_CONFIG)) {
    return NextResponse.json({ error: 'Invalid mode. Use blue-ocean / red-niche / cross-domain / analyze' }, { status: 400 });
  }
  if (!body.profile) {
    return NextResponse.json({ error: 'Missing profile' }, { status: 400 });
  }
  // 配额校验
  const apiKey = req.headers.get('x-api-key') || req.headers.get('x-session');
  const user = getUserByApiKey(apiKey) || getOrCreateAnonymous();
  const { checkQuota } = await import('@/lib/user');
  const q = checkQuota(user);
  if (!q.ok) {
    return NextResponse.json(
      { error: 'Quota exceeded', reason: q.reason, quota: q.quota, remaining: q.remaining },
      { status: 429 }
    );
  }

  const useReal = body.realLlm ?? shouldUseRealLlm(req);

  // 同步执行（demo 数据快；真实 LLM 时 maxDuration=300s 也够用）
  const report = await runDiscovery({
    req, mode, profile: body.profile, useRealLlm: useReal,
  });

  return NextResponse.json({
    reportId: report.id,
    status: report.status,
    durationSec: report.durationSec,
    opportunityCount: report.opportunities.length,
    mode: report.mode,
  });
}
