// Vercel KV (Upstash Redis) REST API wrapper
// 环境变量: KV_REST_API_URL, KV_REST_API_TOKEN
// 0 依赖,纯 fetch,直接在 Edge Runtime 运行

function getConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return { error: 'KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN env vars.' };
  }
  const base = url.endsWith('/') ? url.slice(0, -1) : url;
  return { base, token };
}

export async function kvRaw(cmd, ...args) {
  const cfg = getConfig();
  if (cfg.error) return { error: cfg.error };
  const parts = [cmd, ...args].map((a) => encodeURIComponent(String(a)));
  const u = cfg.base + '/' + parts.join('/');
  const res = await fetch(u, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + cfg.token },
  });
  const j = await res.json();
  if (j && j.error) return { error: j.error };
  return { result: j.result };
}

export async function kvGet(key) {
  const r = await kvRaw('GET', key);
  if (r.error) return r;
  if (r.result == null) return { result: null };
  try {
    return { result: JSON.parse(String(r.result)) };
  } catch (e) {
    return { result: r.result };
  }
}

export async function kvSet(key, value, opts) {
  const val = typeof value === 'string' ? value : JSON.stringify(value);
  const args = ['SET', key, val];
  if (opts && opts.ex) args.push('EX', String(opts.ex));
  const r = await kvRaw.apply(null, args);
  return r;
}

export async function kvDel(key) {
  return kvRaw('DEL', key);
}

export async function kvExists(key) {
  const r = await kvRaw('EXISTS', key);
  if (r.error) return r;
  return { result: r.result === 1 };
}

export function getEnvError() {
  const cfg = getConfig();
  return cfg.error || null;
}
