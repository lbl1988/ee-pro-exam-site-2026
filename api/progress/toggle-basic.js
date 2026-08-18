// POST /api/progress/toggle-basic  标记/取消标记某个基础知识科目
// Body: { subject }
import {
  requireSession,
  getUserProgress,
  saveUserProgress,
  ok,
  err,
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
  const subject = String(body.subject || '').slice(0, 100);
  if (!subject) return err('subject 必填');

  const p = await getUserProgress(sess.username);
  if (p.error) return err(p.error, 500);
  const data = p.result;
  data.basic[subject] = !data.basic[subject];
  if (!data.basic[subject]) delete data.basic[subject];

  const saved = await saveUserProgress(sess.username, data);
  if (saved.error) return err(saved.error, 500);
  return ok({ marked: !!data.basic[subject], progress: data });
}
