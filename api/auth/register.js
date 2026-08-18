// POST /api/auth/register
// Body: { username, password, confirmPassword? }
import {
  getUserRecord,
  saveUserRecord,
  hashPassword,
  err,
  ok,
} from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';
import { rateLimit, clientIp } from '../../lib/rate-limit.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return err('服务未配置KV存储: ' + envErr, 500);

  if (req.method !== 'POST') return err('仅支持POST', 405);

  // 频控:防批量注册,每 IP 24 小时内最多 10 次注册
  const ip = clientIp(req);
  const rl = await rateLimit('register:' + ip, 10, 24 * 3600);
  if (rl.error) return err(rl.error, 500);
  if (rl.limited) return err('注册过于频繁,请 ' + Math.max(1, Math.ceil(rl.retryAfter / 3600)) + ' 小时后再试', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return err('请求体格式错误', 400);
  }

  const username = (body.username || '').trim();
  const password = body.password || '';
  const confirmPwd = body.confirmPassword != null ? body.confirmPassword : password;

  if (!username || !password) return err('用户名和密码不能为空');
  if (username.length < 2) return err('用户名至少2个字符');
  if (password.length < 4) return err('密码至少4个字符');
  if (password !== confirmPwd) return err('两次输入的密码不一致');

  // 用户名只允许中英文/数字/下划线
  if (!/^[\u4e00-\u9fa5A-Za-z0-9_]{2,32}$/.test(username)) {
    return err('用户名只能包含中英文、数字或下划线(2-32位)');
  }

  const exists = await getUserRecord(username);
  if (exists.error) return err(exists.error, 500);
  if (exists.result) return err('该用户名已被注册');

  const hashed = await hashPassword(password);
  const record = {
    username,
    password: hashed,
    createdAt: new Date().toISOString(),
  };
  const saved = await saveUserRecord(username, record);
  if (saved.error) return err(saved.error, 500);

  return ok({ message: '注册成功,请登录' });
}
