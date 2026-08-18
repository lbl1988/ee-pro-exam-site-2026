// POST /api/auth/login
// Body: { username, password }
// 成功: Set-Cookie: ee_session (HttpOnly Secure SameSite=Lax Max-Age=30d)
import {
  getUserRecord,
  verifyPassword,
  generateSessionId,
  SESSIONS_PREFIX,
  SESSION_TTL_SEC,
  COOKIE_NAME,
  setCookieHeader,
  err,
  ok,
} from '../../lib/auth.js';
import { getEnvError, kvSet } from '../../lib/kv.js';
import { rateLimit, clientIp } from '../../lib/rate-limit.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return err('服务未配置KV存储: ' + envErr, 500);

  if (req.method !== 'POST') return err('仅支持POST', 405);

  // 频控:防暴力破解,每 IP 15 分钟内最多 20 次登录尝试
  const ip = clientIp(req);
  const rl = await rateLimit('login:' + ip, 20, 15 * 60);
  if (rl.error) return err(rl.error, 500);
  if (rl.limited) return err('登录尝试过于频繁,请 ' + Math.max(1, Math.ceil(rl.retryAfter / 60)) + ' 分钟后再试', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return err('请求体格式错误', 400);
  }

  const username = (body.username || '').trim();
  const password = body.password || '';

  if (!username || !password) return err('请输入用户名和密码');

  const r = await getUserRecord(username);
  if (r.error) return err(r.error, 500);
  if (!r.result) return err('用户名不存在');

  const okPwd = await verifyPassword(password, r.result.password);
  if (!okPwd) return err('密码错误');

  const sid = generateSessionId();
  const sessData = { username, createdAt: Date.now() };
  const saved = await kvSet(SESSIONS_PREFIX + sid, sessData, { ex: SESSION_TTL_SEC });
  if (saved.error) return err(saved.error, 500);

  const cookie = setCookieHeader(COOKIE_NAME, sid, { maxAge: SESSION_TTL_SEC });
  return ok(
    {
      message: '登录成功',
      username,
      createdAt: r.result.createdAt,
    },
    { 'Set-Cookie': cookie }
  );
}
