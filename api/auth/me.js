// GET /api/auth/me  (校验当前登录)
import {
  requireSession,
  getUserRecord,
  ok,
  err,
  clearCookieHeader,
  COOKIE_NAME,
} from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return err(envErr, 500);

  const sess = await requireSession(req);
  if (sess.error) {
    // session过期,清cookie
    return err(sess.error, sess.status, { 'Set-Cookie': clearCookieHeader(COOKIE_NAME) });
  }
  const user = await getUserRecord(sess.username);
  const info = user.result
    ? { username: user.result.username, createdAt: user.result.createdAt }
    : { username: sess.username };
  return ok({ user: info, sessionExpiresAt: sess.createdAt ? sess.createdAt + 30 * 24 * 3600 * 1000 : null });
}
