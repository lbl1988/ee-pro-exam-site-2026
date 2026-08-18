// POST /api/auth/change-password
// Body: { oldPassword, newPassword, confirmPassword }
import {
  requireSession,
  getUserRecord,
  saveUserRecord,
  verifyPassword,
  hashPassword,
  err,
  ok,
  clearCookieHeader,
  COOKIE_NAME,
} from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return err(envErr, 500);

  if (req.method !== 'POST') return err('仅支持POST', 405);

  const sess = await requireSession(req);
  if (sess.error) return err(sess.error, sess.status);

  let body;
  try {
    body = await req.json();
  } catch {
    return err('请求体格式错误', 400);
  }

  const oldPwd = body.oldPassword || '';
  const newPwd = body.newPassword || '';
  const confirmPwd = body.confirmPassword != null ? body.confirmPassword : newPwd;

  if (!oldPwd || !newPwd) return err('请填写完整信息');
  if (newPwd.length < 4) return err('新密码至少4个字符');
  if (oldPwd === newPwd) return err('新密码不能与旧密码相同');
  if (newPwd !== confirmPwd) return err('两次输入的新密码不一致');

  const u = await getUserRecord(sess.username);
  if (u.error) return err(u.error, 500);
  if (!u.result) return err('用户名不存在', 400, { 'Set-Cookie': clearCookieHeader(COOKIE_NAME) });

  const okPwd = await verifyPassword(oldPwd, u.result.password);
  if (!okPwd) return err('旧密码错误');

  const newHash = await hashPassword(newPwd);
  const record = { ...u.result, password: newHash, updatedAt: new Date().toISOString() };
  const saved = await saveUserRecord(sess.username, record);
  if (saved.error) return err(saved.error, 500);

  return ok({ message: '密码修改成功,下次登录请使用新密码' });
}
