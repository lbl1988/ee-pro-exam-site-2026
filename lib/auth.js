// 认证辅助工具:密码哈希、session生成与校验、cookie读写

export const COOKIE_NAME = 'ee_session';
export const SESSION_TTL_SEC = 30 * 24 * 60 * 60; // 30天
export const USERS_KEY = 'ee:users'; // Hash map
export const SESSIONS_PREFIX = 'ee:sess:';
export const PROGRESS_PREFIX = 'ee:progress:'; // per user

// 密码哈希:PBKDF2 风格但用 WebCrypto Subtle(Edge 原生支持)
// 格式: salt$iter$hash(b64)
const ITER = 120000;
const ALGO = 'SHA-256';

// 注意:Edge Runtime / Node 18+ 均提供全局 btoa/atob/crypto,不引用 Node 内置模块(否则 esbuild 打包 Edge Functions 时会把 Node 模块引入 bundle 导致部署失败)
function b64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64Decode(s) {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function randStr(len) {
  const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  const arr = new Uint8Array(len);
  globalThis.crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += a[arr[i] % a.length];
  return s;
}

export function generateSessionId() {
  return randStr(32);
}

export async function hashPassword(pwd) {
  const salt = randStr(16);
  const textEnc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEnc.encode(pwd),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: textEnc.encode(salt), iterations: ITER, hash: ALGO },
    keyMaterial,
    256
  );
  return salt + '$' + ITER + '$' + b64(derived);
}

export async function verifyPassword(pwd, stored) {
  try {
    const [salt, iterStr, hashB64] = stored.split('$');
    const iter = parseInt(iterStr, 10);
    const textEnc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      textEnc.encode(pwd),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: textEnc.encode(salt), iterations: iter, hash: ALGO },
      keyMaterial,
      256
    );
    const derivedB64 = b64(derived);
    // 恒定时间比较
    const a = b64Decode(derivedB64);
    const b = b64Decode(hashB64);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch (e) {
    return false;
  }
}

// ===== Cookie 解析/序列化 =====
export function parseCookies(req) {
  const header = req.headers.get('cookie') || '';
  const out = {};
  if (!header) return out;
  header.split(';').forEach((p) => {
    const idx = p.indexOf('=');
    if (idx < 0) return;
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    try {
      out[k] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  });
  return out;
}

export function setCookieHeader(name, value, opts) {
  const parts = [name + '=' + encodeURIComponent(value)];
  if (opts && opts.maxAge != null) parts.push('Max-Age=' + opts.maxAge);
  if (opts && opts.expires) parts.push('Expires=' + new Date(opts.expires).toUTCString());
  parts.push('Path=/');
  parts.push('HttpOnly');
  parts.push('SameSite=Lax');
  if (opts && opts.secure !== false) parts.push('Secure');
  return parts.join('; ');
}

export function clearCookieHeader(name) {
  return name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax';
}

// ===== 统一响应 =====
export function json(data, status, extraHeaders) {
  const h = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };
  if (extraHeaders) {
    const keys = Object.keys(extraHeaders);
    for (let i = 0; i < keys.length; i++) h[keys[i]] = extraHeaders[keys[i]];
  }
  return new Response(JSON.stringify(data), { status: status || 200, headers: h });
}

export function err(message, status, extraHeaders) {
  return json({ success: false, message: message || 'error' }, status || 400, extraHeaders);
}

export function ok(data, extraHeaders) {
  return json({ success: true, ...(data || {}) }, 200, extraHeaders);
}

// ===== session 校验(最常用) =====
import { kvGet, kvDel } from './kv.js';

export async function requireSession(req) {
  const cookies = parseCookies(req);
  const sid = cookies[COOKIE_NAME];
  if (!sid) return { error: '未登录,请先登录', code: 'NO_SESSION', status: 401 };
  const r = await kvGet(SESSIONS_PREFIX + sid);
  if (r.error) return { error: r.error, status: 500 };
  if (!r.result) return { error: '登录已过期,请重新登录', code: 'SESSION_EXPIRED', status: 401 };
  return { sessionId: sid, username: r.result.username, createdAt: r.result.createdAt };
}

export async function deleteSession(sid) {
  return kvDel(SESSIONS_PREFIX + sid);
}

// ===== 工具: 用户表 HGET/HSET =====
import { kvRaw, kvSet } from './kv.js';

export async function getUserRecord(username) {
  const r = await kvRaw('HGET', USERS_KEY, username);
  if (r.error) return r;
  if (!r.result) return { result: null };
  try {
    return { result: JSON.parse(String(r.result)) };
  } catch (e) {
    return { result: null };
  }
}

export async function saveUserRecord(username, record) {
  return kvRaw('HSET', USERS_KEY, username, JSON.stringify(record));
}

export async function getAllUsers() {
  const r = await kvRaw('HGETALL', USERS_KEY);
  if (r.error) return r;
  const arr = r.result || [];
  const out = {};
  for (let i = 0; i < arr.length; i += 2) {
    try {
      out[arr[i]] = JSON.parse(String(arr[i + 1]));
    } catch {}
  }
  return { result: out };
}

// ===== 进度数据 =====
export function userProgressKey(username) {
  return PROGRESS_PREFIX + username;
}

export async function getUserProgress(username) {
  const r = await kvGet(userProgressKey(username));
  if (r.error) return r;
  if (!r.result) {
    return {
      result: {
        basic: {},
        hotpoints: {},
        videos: {},
        notes: [],
        shares: [],
      },
    };
  }
  // 兼容字段补齐
  const d = r.result;
  return {
    result: {
      basic: d.basic || {},
      hotpoints: d.hotpoints || {},
      videos: d.videos || {},
      notes: d.notes || [],
      shares: d.shares || [],
    },
  };
}

export async function saveUserProgress(username, data) {
  return kvSet(userProgressKey(username), data);
}
