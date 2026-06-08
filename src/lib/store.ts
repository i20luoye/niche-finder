/**
 * 报告存储：内存 Map（生产环境应替换为 Supabase / Database）
 * Key: reportId
 */
import type { FullReport, AnalysisReport, Opportunity } from './types';

const reports = new Map<string, FullReport>();

export function saveReport(r: FullReport): void {
  reports.set(r.id, r);
}

export function getReport(id: string): FullReport | undefined {
  return reports.get(id);
}

export function listReports(): AnalysisReport[] {
  return Array.from(reports.values())
    .map((r) => ({
      id: r.id, mode: r.mode, userProfile: r.userProfile,
      opportunities: r.opportunities, durationSec: r.durationSec,
      status: r.status, createdAt: r.createdAt, completedAt: r.completedAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listReportsByUser(_userId: string): AnalysisReport[] {
  // 演示用：返回所有（不区分用户）
  return listReports();
}

export function listFullReports(): FullReport[] {
  return Array.from(reports.values());
}

export function updateReport(id: string, patch: Partial<FullReport>): void {
  const r = reports.get(id);
  if (!r) return;
  Object.assign(r, patch);
}

export function newReportId(): string {
  return 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}
