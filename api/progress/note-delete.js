// POST /api/progress/note-delete
// Body: { id }
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
  const id = String(body.id || '');
  if (!id) return err('id 必填');

  const p = await getUserProgress(sess.username);
  if (p.error) return err(p.error, 500);
  const data = p.result;
  const before = data.notes.length;
  data.notes = data.notes.filter((n) => n.id !== id);
  if (data.notes.length === before) return err('未找到该笔记', 404);

  const saved = await saveUserProgress(sess.username, data);
  if (saved.error) return err(saved.error, 500);
  return ok({ progress: data });
}
