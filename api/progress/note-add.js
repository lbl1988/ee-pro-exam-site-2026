// POST /api/progress/note-add
// Body: { title, content }
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
  const title = String(body.title || '').trim().slice(0, 100);
  const content = String(body.content || '').trim().slice(0, 5000);
  if (!title || !content) return err('请填写标题和内容');

  const p = await getUserProgress(sess.username);
  if (p.error) return err(p.error, 500);
  const data = p.result;
  data.notes.unshift({
    id: 'n' + Date.now() + Math.floor(Math.random() * 1000),
    title,
    content,
    date: new Date().toISOString().slice(0, 10),
  });
  if (data.notes.length > 500) data.notes.length = 500;

  const saved = await saveUserProgress(sess.username, data);
  if (saved.error) return err(saved.error, 500);
  return ok({ note: data.notes[0], progress: data });
}
