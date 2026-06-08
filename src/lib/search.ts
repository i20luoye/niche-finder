/**
 * Web 搜索封装
 */
import { SearchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import type { NextRequest } from 'next/server';

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  source?: string;
  publishTime?: string;
  authorityLevel?: number;
}

export interface SearchResponse {
  summary: string;
  results: SearchResultItem[];
}

export function getSearchClient(req?: NextRequest): SearchClient {
  const config = new Config();
  const customHeaders = req ? HeaderUtils.extractForwardHeaders(req.headers) : undefined;
  return new SearchClient(config, customHeaders);
}

export async function webSearch(
  query: string,
  count = 5,
  req?: NextRequest
): Promise<SearchResponse> {
  const client = getSearchClient(req);
  try {
    const r = await client.webSearch(query, count, true);
    return {
      summary: r.summary ?? '',
      results: (r.web_items ?? []).map((it) => ({
        title: it.title,
        url: it.url ?? '',
        snippet: it.snippet ?? '',
        source: it.site_name,
        publishTime: it.publish_time,
        authorityLevel: it.auth_info_level,
      })),
    };
  } catch (e) {
    console.error('[webSearch] error', e);
    return { summary: '', results: [] };
  }
}

/** 多次搜索：取并集去重 */
export async function webSearchMulti(
  queries: string[],
  perQuery = 3,
  req?: NextRequest
): Promise<SearchResponse> {
  const all: SearchResultItem[] = [];
  const seen = new Set<string>();
  let summary = '';
  for (const q of queries) {
    const r = await webSearch(q, perQuery, req);
    if (r.summary && !summary) summary = r.summary;
    for (const it of r.results) {
      const key = it.url || it.title;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(it);
    }
  }
  return { summary, results: all };
}
