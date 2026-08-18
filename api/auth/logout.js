// POST /api/auth/logout
import { requireSession, deleteSession, clearCookieHeader, COOKIE_NAME, ok } from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return ok({ message: envErr }, { 'Set-Cookie': clearCookieHeader(COOKIE_NAME) });

  const sess = await requireSession(req);
  if (!sess.error) {
    await deleteSession(sess.sessionId);
  }
  return ok({ message: '已退出登录' }, { 'Set-Cookie': clearCookieHeader(COOKIE_NAME) });
}
