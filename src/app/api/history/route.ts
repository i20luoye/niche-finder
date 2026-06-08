/**
 * GET /api/history
 * 历史分析记录列表
 */
import { NextRequest, NextResponse } from 'next/server';
import { listReports } from '@/lib/store';
import { getDemoHistory } from '@/lib/seed';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const real = listReports();
  const demo = getDemoHistory();
  // 合并：真实记录 + 演示记录，按 createdAt 倒序
  const merged = [...real, ...demo].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ items: merged });
}
