// POST /api/progress/save  整体保存用户进度(通常用于本地迁移一次性上传)
// Body: { progress: {basic,hotpoints,videos,notes,shares} }
import {
  requireSession,
  getUserProgress,
  saveUserProgress,
  ok,
  err,
} from '../../lib/auth.js';
import { getEnvError } from '../../lib/kv.js';

export const config = { runtime: 'edge' };

const MAX_NOTES = 500;
const MAX_SHARES = 200;
const MAX_STR_LEN = 5000;

function sanitizeProgress(p) {
  const out = {
    basic: {},
    hotpoints: {},
    videos: {},
    notes: [],
    shares: [],
  };
  if (!p) return out;

  function copyObj(src, dst) {
    if (!src || typeof src !== 'object') return;
    const keys = Object.keys(src).slice(0, 2000);
    keys.forEach((k) => {
      if (src[k]) dst[String(k).slice(0, 200)] = true;
    });
  }
  copyObj(p.basic, out.basic);
  copyObj(p.hotpoints, out.hotpoints);
  copyObj(p.videos, out.videos);

  if (Array.isArray(p.notes)) {
    out.notes = p.notes.slice(0, MAX_NOTES).map((n, i) => ({
      id: String(n.id || ('n' + Date.now() + i)).slice(0, 64),
      title: String(n.title || '无标题').slice(0, 100),
      content: String(n.content || '').slice(0, MAX_STR_LEN),
      date: /^\d{4}-\d{2}-\d{2}$/.test(n.date) ? n.date : new Date().toISOString().slice(0, 10),
    }));
  }
  if (Array.isArray(p.shares)) {
    out.shares = p.shares.slice(0, MAX_SHARES).map((s, i) => ({
      id: String(s.id || ('s' + Date.now() + i)).slice(0, 64),
      title: String(s.title || '无标题').slice(0, 100),
      content: String(s.content || '').slice(0, MAX_STR_LEN),
      author: String(s.author || '').slice(0, 32),
      date: /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? s.date : new Date().toISOString().slice(0, 10),
      direction: String(s.direction || '通用').slice(0, 16),
      views: typeof s.views === 'number' ? s.views : 0,
    }));
  }
  return out;
}

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

  const sanitized = sanitizeProgress(body.progress);

  // merge 策略:远端已有数据优先,本地非空字段若远端为空则合并
  const remote = await getUserProgress(sess.username);
  if (remote.error) return err(remote.error, 500);
  const rp = remote.result;

  function mergeObj(r, l) {
    const out = {};
    Object.keys(r).forEach((k) => (out[k] = true));
    Object.keys(l).forEach((k) => {
      if (l[k]) out[k] = true;
    });
    return out;
  }

  const merged = {
    basic: mergeObj(rp.basic, sanitized.basic),
    hotpoints: mergeObj(rp.hotpoints, sanitized.hotpoints),
    videos: mergeObj(rp.videos, sanitized.videos),
    // 笔记/分享:云端非空则保留云端,否则用本地迁移过来的
    notes: rp.notes.length > 0 ? rp.notes : sanitized.notes,
    shares: rp.shares.length > 0 ? rp.shares : sanitized.shares,
  };

  const saved = await saveUserProgress(sess.username, merged);
  if (saved.error) return err(saved.error, 500);
  return ok({ progress: merged, migrated: body.migratedFromLocal ? true : false });
}
