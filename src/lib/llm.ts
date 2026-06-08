/**
 * LLM 客户端封装（coze-coding-dev-sdk）
 * 默认 streaming 输出，invoke 仅在需要全量 JSON 时使用
 */
import { LLMClient, Config, HeaderUtils, type Message } from 'coze-coding-dev-sdk';
import type { NextRequest } from 'next/server';

export interface InvokeJsonOptions {
  temperature?: number;
  model?: string;
  jsonMode?: boolean;
  thinking?: 'enabled' | 'disabled';
  maxRetries?: number;
}

const DEFAULT_MODEL = 'doubao-seed-1-8-251228';

export function getLLMClient(req?: NextRequest): LLMClient {
  const config = new Config();
  const customHeaders = req ? HeaderUtils.extractForwardHeaders(req.headers) : undefined;
  return new LLMClient(config, customHeaders);
}

/** 非流式调用 */
export async function invoke(
  messages: Message[],
  req: NextRequest,
  options: InvokeJsonOptions = {}
): Promise<string> {
  const client = getLLMClient(req);
  const { temperature = 0.7, model = DEFAULT_MODEL, maxRetries = 2 } = options;
  let lastErr: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const resp = await client.invoke(messages, { temperature, model });
      return resp.content;
    } catch (e) {
      lastErr = e;
      if (i === maxRetries) break;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw lastErr;
}

/** 强 JSON 输出：从 LLM 返回中安全提取 JSON 块 */
export async function invokeJson<T = unknown>(
  messages: Message[],
  req: NextRequest,
  options: InvokeJsonOptions = {}
): Promise<T> {
  const text = await invoke(messages, req, options);
  return extractJson<T>(text);
}

export function extractJson<T>(text: string): T {
  // 尝试直接解析
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // 尝试从 ```json 块中提取
    const m = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (m) {
      try {
        return JSON.parse(m[1]) as T;
      } catch {
        // 继续
      }
    }
    // 尝试提取第一个 { ... } 块
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1)) as T;
      } catch {
        // 继续
      }
    }
    // 尝试 [ ... ]
    const lb = text.indexOf('[');
    const rb = text.lastIndexOf(']');
    if (lb !== -1 && rb !== -1 && rb > lb) {
      try {
        return JSON.parse(text.slice(lb, rb + 1)) as T;
      } catch {
        // 继续
      }
    }
    throw new Error(`LLM 响应无法解析为 JSON: ${text.slice(0, 200)}...`);
  }
}

/** 简化 prompt 构造 */
export const sys = (s: string) => ({ role: 'system' as const, content: s });
export const usr = (s: string) => ({ role: 'user' as const, content: s });
