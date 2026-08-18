// POST /api/progress/note-update
// Body: { id, title, content }
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
  const title = String(body.title || '').trim().slice(0, 100);
  const content = String(body.content || '').trim().slice(0, 5000);
  if (!id) return err('id 必填');
  if (!title || !content) return err('请填写标题和内容');

  const p = await getUserProgress(sess.username);
  if (p.error) return err(p.error, 500);
  const data = p.result;
  let found = null;
  for (let i = 0; i < data.notes.length; i++) {
    if (data.notes[i].id === id) {
      data.notes[i].title = title;
      data.notes[i].content = content;
      data.notes[i].date = new Date().toISOString().slice(0, 10);
      found = data.notes[i];
      break;
    }
  }
  if (!found) return err('未找到该笔记', 404);

  const saved = await saveUserProgress(sess.username, data);
  if (saved.error) return err(saved.error, 500);
  return ok({ note: found, progress: data });
}
