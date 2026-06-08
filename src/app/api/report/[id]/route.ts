/**
 * GET /api/report/[id]
 * 获取报告当前状态 / 完整内容
 * Query: ?full=1 返回 full content
 */
import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = getReport(id);
  if (!r) {
    // 演示模式：允许通过 demo ID 拿到样本
    if (id.startsWith('demo_')) {
      const { getDemoOpportunities, getDemoHistory } = await import('@/lib/seed');
      const demo = getDemoHistory().find((d) => d.id === id);
      if (demo) return NextResponse.json({ report: demo, full: true });
      // demo_opp_xxx 形式：返回一个单机会详情（包装成 report）
      const m = id.match(/^demo_(bo|rn|cd|an)_(\d+)$/);
      if (m) {
        const modeMap: Record<string, 'blue-ocean' | 'red-niche' | 'cross-domain' | 'analyze'> = {
          bo: 'blue-ocean', rn: 'red-niche', cd: 'cross-domain', an: 'analyze',
        };
        const mode = modeMap[m[1]];
        const opps = getDemoOpportunities(mode);
        const target = opps.find((o) => o.id === id);
        if (target) {
          return NextResponse.json({
            report: {
              id, mode, userProfile: { budget: '5w_20w', time: 'half_time', skills: ['tech'], goal: '20k' },
              opportunities: [target], durationSec: 86.4, status: 'completed', createdAt: target.createdAt, completedAt: target.createdAt,
            },
            full: true,
          });
        }
      }
    }
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json({ report: r, full: true });
}
