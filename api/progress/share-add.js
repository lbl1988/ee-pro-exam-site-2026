// POST /api/progress/share-add
// Body: { title, content, direction }
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
  const direction = String(body.direction || '通用').trim().slice(0, 16);

  if (title.length < 5) return err('标题至少5个字符');
  if (title.length > 50) return err('标题不超过50个字符');
  if (content.length < 10) return err('内容至少10个字符');
  if (content.length > 1000) return err('内容不超过1000个字符');

  const p = await getUserProgress(sess.username);
  if (p.error) return err(p.error, 500);
  const data = p.result;
  data.shares.unshift({
    id: 's' + Date.now() + Math.floor(Math.random() * 1000),
    title,
    content,
    author: sess.username,
    date: new Date().toISOString().slice(0, 10),
    direction: direction || '通用',
    views: 0,
  });
  if (data.shares.length > 200) data.shares.length = 200;

  const saved = await saveUserProgress(sess.username, data);
  if (saved.error) return err(saved.error, 500);
  return ok({ share: data.shares[0], progress: data });
}
