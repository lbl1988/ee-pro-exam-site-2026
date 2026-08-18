// GET /api/progress/get  返回当前用户全部学习进度
import {
  requireSession,
  getUserProgress,
  ok,
  err,
} from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const envErr = getEnvError();
  if (envErr) return err(envErr, 500);

  const sess = await requireSession(req);
  if (sess.error) return err(sess.error, sess.status);

  const r = await getUserProgress(sess.username);
  if (r.error) return err(r.error, 500);
  return ok({ progress: r.result });
}
