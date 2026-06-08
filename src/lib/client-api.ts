'use client';

import { SAMPLE_REPORTS } from './samples';
import type { Report, UserProfile, HistoryItem } from './types';

const API = '/api';

export async function getSampleReports(): Promise<Report[]> {
  return SAMPLE_REPORTS;
}

export interface DiscoverRequest {
  mode: string;
  profile: UserProfile;
  apiKey?: string;
}

export interface DiscoverResponse {
  ok: boolean;
  reportId?: string;
  estimatedTime?: number;
  error?: string;
}

export async function startDiscover(req: DiscoverRequest): Promise<DiscoverResponse> {
  const res = await fetch(`${API}/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-session': req.apiKey ?? '' },
    body: JSON.stringify(req),
  });
  return res.json();
}

export async function getReport(id: string, apiKey?: string): Promise<Report | null> {
  const res = await fetch(`${API}/report/${id}`, {
    headers: { 'x-session': apiKey ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const j = await res.json();
  return j.report ?? null;
}

export async function getHistory(apiKey?: string): Promise<HistoryItem[]> {
  const res = await fetch(`${API}/history`, {
    headers: { 'x-session': apiKey ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const j = await res.json();
  return j.items ?? [];
}

export interface UserInfo {
  apiKey: string;
  tier: 'free' | 'pro' | 'enterprise';
  quotaDaily: number;
  quotaMonthly: number;
  quotaTotal: number;
  usedDaily: number;
  usedMonthly: number;
  usedTotal: number;
}

export async function getOrCreateUser(): Promise<UserInfo> {
  // 本地优先（key 在 localStorage），无 key 时调后端创建
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('nf_api_key');
    if (local) {
      const r = await fetchUserByKey(local);
      if (r) return r;
    }
  }
  const res = await fetch(`${API}/user`, { method: 'POST' });
  const j = await res.json();
  if (typeof window !== 'undefined' && j.user?.apiKey) {
    localStorage.setItem('nf_api_key', j.user.apiKey);
  }
  return j.user;
}

export async function fetchUserByKey(key: string): Promise<UserInfo | null> {
  const res = await fetch(`${API}/user`, {
    headers: { 'x-session': key },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const j = await res.json();
  return j.user ?? null;
}
