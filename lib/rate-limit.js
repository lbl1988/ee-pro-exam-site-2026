// 简易频控:基于 Vercel KV (Upstash Redis) 的 INCR + EXPIRE
// 用于登录/注册接口防暴力破解,0 依赖,Edge Runtime 直接运行

import { kvRaw } from './kv.js';

export const RL_PREFIX = 'ee:rl:';

// 提取客户端 IP(Edge Runtime 常见头)
export function clientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0];
    if (first && first.trim()) return first.trim();
  }
  const realIp = req.headers.get('x-real-ip');
  return (realIp || 'unknown').trim();
}

// 固定窗口计数:key 在 windowSec 秒内超过 limit 次即拦截
// 返回 { limited:boolean, count:number, retryAfter?:number } 或 { error:string }
export async function rateLimit(key, limit, windowSec) {
  const k = RL_PREFIX + key;
  const incr = await kvRaw('INCR', k);
  if (incr.error) return { error: incr.error };
  const count = Number(incr.result) || 0;

  if (count === 1) {
    // 首次计数,设置整个窗口的过期时间
    await kvRaw('EXPIRE', k, String(windowSec));
  }

  if (count > limit) {
    const ttl = await kvRaw('TTL', k);
    const retryAfter = (ttl.result != null && Number(ttl.result) > 0) ? Number(ttl.result) : windowSec;
    return { limited: true, count, retryAfter };
  }
  return { limited: false, count };
}
