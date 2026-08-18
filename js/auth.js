// 注册电气工程师基础考试2026 - 用户认证模块
// 双模式:云端模式(Vercel KV + Edge Functions + HttpOnly Cookie)
//        本地模式(localStorage 账号,后端不可达时自动降级,纯静态部署/Workers反代可用)
// 兼容暴露 window.EEAuth 原有同步读 API(内存缓存)+ 异步写 API(Promise)

(function () {
  'use strict';

  var API_BASE = '/api';
  var CACHE_KEY_USER = 'ee-cache-user-v2'; // session user 内存缓存(仅为同步API兼容)

  // ========= 本地模式(v1.0)存储 key =========
  var LS_USERS = 'ee-users';            // { username: { salt, hash, createdAt } }
  var LS_SESSION = 'ee-session';        // { username, createdAt } 或 null

  // ========= 运行模式:'cloud' | 'local' | null(未知,探测中) =========
  var mode = null;

  // ========= 内存缓存 =========
  var cache = {
    user: null, // {username, createdAt} 或 null
    ready: false,
    readyDefer: null,
    migrating: false,
    migrated: false,
  };

  function getUserCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY_USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }
  function setUserCache(u) {
    cache.user = u;
    try {
      if (u) sessionStorage.setItem(CACHE_KEY_USER, JSON.stringify(u));
      else sessionStorage.removeItem(CACHE_KEY_USER);
    } catch (e) {}
  }
  // 初始化时读 sessionStorage(刷新页面保持同步API立刻可用)
  cache.user = getUserCache();

  // ========= fetch 封装(仅云端模式使用) =========
  function req(path, method, body) {
    return fetch(API_BASE + path, {
      method: method || 'GET',
      credentials: 'include', // 关键:带 HttpOnly Cookie
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; },
        function () { return { ok: r.ok, status: r.status, data: { success: r.ok, message: r.ok ? 'ok' : '网络错误' } }; });
    }).catch(function () {
      return { ok: false, status: 0, data: { success: false, message: '网络异常,请检查后重试' } };
    });
  }

  // ========= 本地模式工具:简单 PBKDF2-like 哈希(前端够用,非安全临界场景) =========
  // 本地模式只是单机账号隔离,不承载敏感数据,用 SHA-256 + salt 多轮迭代即可
  function sha256Sync(str) {
    // 用 Web Crypto API (async) 不便,这里用纯 JS 实现 SHA-256
    // 来源:公共域 SHA-256 纯 JS 实现(简化版,足够 localStorage 场景)
    function rrot(x, n) { return (x >>> n) | (x << (32 - n)); }
    var K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var utf8 = unescape(encodeURIComponent(str));
    var len = utf8.length;
    var bitLen = len * 8;
    // 补位:0x80 + 0... + 64位长度
    var padLen = (len + 9 + 63) & ~63;
    var bytes = new Array(padLen);
    for (var i = 0; i < len; i++) bytes[i] = utf8.charCodeAt(i);
    bytes[len] = 0x80;
    for (i = len + 1; i < padLen - 8; i++) bytes[i] = 0;
    // 高位长度(这里 bitLen < 2^32,高 4 字节为 0)
    bytes[padLen - 8] = 0; bytes[padLen - 7] = 0; bytes[padLen - 6] = 0; bytes[padLen - 5] = 0;
    bytes[padLen - 4] = (bitLen >>> 24) & 0xff;
    bytes[padLen - 3] = (bitLen >>> 16) & 0xff;
    bytes[padLen - 2] = (bitLen >>> 8) & 0xff;
    bytes[padLen - 1] = bitLen & 0xff;

    var w = new Array(64);
    for (i = 0; i < bytes.length; i += 64) {
      for (var t = 0; t < 16; t++) {
        var j = i + t * 4;
        w[t] = (bytes[j] << 24) | (bytes[j+1] << 16) | (bytes[j+2] << 8) | bytes[j+3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = rrot(w[t-15],7) ^ rrot(w[t-15],18) ^ (w[t-15] >>> 3);
        var s1 = rrot(w[t-2],17) ^ rrot(w[t-2],19) ^ (w[t-2] >>> 10);
        w[t] = (w[t-16] + s0 + w[t-7] + s1) | 0;
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rrot(e,6) ^ rrot(e,11) ^ rrot(e,25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + K[t] + w[t]) | 0;
        var S0 = rrot(a,2) ^ rrot(a,13) ^ rrot(a,22);
        var mj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + mj) | 0;
        h=g; g=f; f=e; e=(d + temp1)|0; d=c; c=b; b=a; a=(temp1 + temp2)|0;
      }
      H[0]=(H[0]+a)|0; H[1]=(H[1]+b)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0;
      H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
    }
    var hex = '';
    for (i = 0; i < 8; i++) {
      var s = (H[i] >>> 0).toString(16);
      while (s.length < 8) s = '0' + s;
      hex += s;
    }
    return hex;
  }

  function randomHex(n) {
    var arr = new Uint8Array(n);
    try { (window.crypto || window.msCrypto).getRandomValues(arr); }
    catch (e) { for (var i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256); }
    var s = '';
    for (i = 0; i < n; i++) { var h = arr[i].toString(16); s += h.length < 2 ? '0' + h : h; }
    return s;
  }

  function hashPassword(password, salt) {
    // 多轮迭代:1000 次 SHA-256(password + salt),足够本地账号场景
    var h = password + ':' + salt;
    for (var i = 0; i < 1000; i++) h = sha256Sync(h + ':' + i);
    return h;
  }

  function readUsers() {
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeUsers(u) { localStorage.setItem(LS_USERS, JSON.stringify(u)); }
  function readSession() {
    try { return JSON.parse(localStorage.getItem(LS_SESSION) || 'null'); }
    catch (e) { return null; }
  }
  function writeSession(s) {
    if (s) localStorage.setItem(LS_SESSION, JSON.stringify(s));
    else localStorage.removeItem(LS_SESSION);
  }

  // ========= 同步兼容 API =========
  function isLoggedIn() { return !!cache.user; }
  function getCurrentUser() { return cache.user ? cache.user.username : null; }

  // ========= 模式探测:区分部署环境,决定是否强切本地模式 =========
  // 说明:手机端 Safari / 微信内置浏览器的 ITP(智能追踪预防) 会对以下共享/公网后缀域名拒绝设置 HttpOnly Cookie:
  //       vercel.app, workers.dev, onrender.com, render.com, pages.dev, netlify.app 等
  //       直接后果:登录 API 调通了(后端返回成功),但 Cookie 写不进浏览器,后续请求无 session → 登录态丢失 / "用户名不存在"
  //       所以上述域名一律强制 local 模式,不依赖 Cookie,改用 localStorage 本地账号。
  //
  // 规则:
  //   1) hostname 匹配已知公网/共享后缀 → 直接 local
  //   2) 其他(自定义备案域名/localhost/内网 IP) → 发 /api/auth/me 探测
  //      - 返回 JSON → cloud
  //      - 网络异常 / 404 / 非 JSON → local
  var SHARED_HOST_SUFFIXES = [
    '.workers.dev',
    '.vercel.app',
    '.onrender.com',
    '.render.com',
    '.pages.dev',
    '.netlify.app',
    '.github.io',
    '.surge.sh',
    '.firebaseapp.com',
    '.web.app',
    '.akamaized.net',
    '.herokuapp.com',
    '.glitch.me',
    '.repl.co',
    '.koyeb.app',
    '.fly.dev',
    '.railway.app',
    '.s3.amazonaws.com',
  ];
  function isSharedHost() {
    var h = (location.hostname || '').toLowerCase();
    if (!h) return false;
    for (var i = 0; i < SHARED_HOST_SUFFIXES.length; i++) {
      if (h.endsWith(SHARED_HOST_SUFFIXES[i])) return true;
    }
    // 纯 IP 地址(无点/四段数字)也视为不稳定环境,倾向于 local(方便本地测试和 http://ip 直访问)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return false; // IP 可以尝试 cloud 探测,不会被 ITP 限制
    return false;
  }
  async function detectMode() {
    if (mode) return mode;
    // 共享/公网后缀域名 → 强制 local 模式,跳过任何 API 探测,避免误以为 cloud 可用
    if (isSharedHost()) { mode = 'local'; return mode; }
    try {
      var r = await fetch(API_BASE + '/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {},
      });
      var ct = r.headers.get('content-type') || '';
      if (r.status === 404) { mode = 'local'; return mode; }
      if (ct.indexOf('json') >= 0) { mode = 'cloud'; return mode; }
      mode = 'local';
      return mode;
    } catch (e) {
      mode = 'local';
      return mode;
    }
  }

  // ========= 云端响应合法性判断 + fallback 工具(放在最前,确保任何 cloudXxx 函数调用时已可用) =========
  function cloudResponseLooksValid(r) {
    return r && r.ok && r.data && typeof r.data.success === 'boolean';
  }
  function fallbackToLocalOnce() {
    mode = 'local';
  }

  // ========= 云端模式 me =========
  async function cloudMe() {
    var r = await req('/auth/me', 'GET');
    // 响应不是合法 JSON success 结构 → 降级本地模式
    if (!cloudResponseLooksValid(r)) {
      fallbackToLocalOnce();
      return localMe();
    }
    if (r.data.success) {
      setUserCache(r.data.user);
      cache.ready = true;
      return { success: true, user: r.data.user };
    }
    setUserCache(null);
    cache.ready = true;
    return { success: false, message: r.data.message || '未登录', code: r.data.code };
  }

  // ========= 本地模式 me =========
  function localMe() {
    var s = readSession();
    if (s && s.username) {
      var users = readUsers();
      if (users[s.username]) {
        setUserCache({ username: s.username, createdAt: s.createdAt || users[s.username].createdAt });
        cache.ready = true;
        return Promise.resolve({ success: true, user: { username: s.username, createdAt: s.createdAt || users[s.username].createdAt } });
      }
    }
    setUserCache(null);
    cache.ready = true;
    return Promise.resolve({ success: false, message: '未登录' });
  }

  // ========= 统一 me =========
  async function me() {
    await detectMode();
    if (mode === 'cloud') return cloudMe();
    return localMe();
  }

  function fireAuthChanged() {
    var u = getCurrentUser();
    document.dispatchEvent(new CustomEvent('authChanged', { detail: { username: u } }));
  }

  // ========= 登录 =========
  async function cloudLogin(username, password) {
    var r = await req('/auth/login', 'POST', { username: username, password: password });
    // 响应不是合法 JSON success(静态站点 200 HTML/空 body):降级本地模式并重试
    if (!cloudResponseLooksValid(r)) {
      fallbackToLocalOnce();
      return localLogin(username, password);
    }
    if (r.data.success) {
      setUserCache({ username: r.data.username, createdAt: r.data.createdAt });
      try { autoMigrateOldProgress(r.data.username); } catch (e) {}
      fireAuthChanged();
      return { success: true, message: r.data.message || '登录成功' };
    }
    return { success: false, message: r.data.message || '登录失败' };
  }

  function localLogin(username, password) {
    var users = readUsers();
    var rec = users[username];
    if (!rec) return Promise.resolve({ success: false, message: '用户不存在,请先注册' });
    var h = hashPassword(password, rec.salt);
    if (h !== rec.hash) return Promise.resolve({ success: false, message: '密码错误' });
    var session = { username: username, createdAt: rec.createdAt };
    writeSession(session);
    setUserCache({ username: username, createdAt: rec.createdAt });
    fireAuthChanged();
    return Promise.resolve({ success: true, message: '登录成功(本地账号)' });
  }

  async function login(username, password) {
    await detectMode();
    if (mode === 'cloud') return cloudLogin(username, password);
    return localLogin(username, password);
  }

  // ========= 注册 =========
  async function cloudRegister(username, password, confirmPassword) {
    var r = await req('/auth/register', 'POST', { username: username, password: password, confirmPassword: confirmPassword || password });
    if (!cloudResponseLooksValid(r)) {
      fallbackToLocalOnce();
      return localRegister(username, password, confirmPassword);
    }
    if (r.data.success) return { success: true, message: r.data.message || '注册成功,请登录' };
    return { success: false, message: r.data.message || '注册失败' };
  }

  function localRegister(username, password, confirmPassword) {
    if (password !== (confirmPassword || password)) return Promise.resolve({ success: false, message: '两次输入的密码不一致' });
    var users = readUsers();
    if (users[username]) return Promise.resolve({ success: false, message: '用户名已存在' });
    var salt = randomHex(16);
    var hash = hashPassword(password, salt);
    var now = new Date().toISOString();
    users[username] = { salt: salt, hash: hash, createdAt: now };
    writeUsers(users);
    return Promise.resolve({ success: true, message: '注册成功(本地账号),请登录' });
  }

  async function register(username, password, confirmPassword) {
    await detectMode();
    if (mode === 'cloud') return cloudRegister(username, password, confirmPassword);
    return localRegister(username, password, confirmPassword);
  }

  // ========= 登出 =========
  async function cloudLogout() {
    await req('/auth/logout', 'POST');
    setUserCache(null);
    fireAuthChanged();
    return { success: true };
  }
  function localLogout() {
    writeSession(null);
    setUserCache(null);
    fireAuthChanged();
    return Promise.resolve({ success: true });
  }
  async function logout() {
    if (mode === 'cloud') return cloudLogout();
    // 本地模式
    return localLogout();
  }

  // ========= 修改密码 =========
  async function cloudChangePassword(username, oldPassword, newPassword) {
    var r = await req('/auth/change-password', 'POST', {
      oldPassword: oldPassword, newPassword: newPassword, confirmPassword: newPassword,
    });
    if (r.ok && r.data && r.data.success) return { success: true, message: r.data.message };
    return { success: false, message: r.data ? r.data.message : '修改失败' };
  }
  function localChangePassword(username, oldPassword, newPassword) {
    var users = readUsers();
    var rec = users[username];
    if (!rec) return Promise.resolve({ success: false, message: '用户不存在' });
    if (hashPassword(oldPassword, rec.salt) !== rec.hash) return Promise.resolve({ success: false, message: '旧密码错误' });
    if ((newPassword || '').length < 4) return Promise.resolve({ success: false, message: '新密码至少4位' });
    var salt = randomHex(16);
    users[username].hash = hashPassword(newPassword, salt);
    users[username].salt = salt;
    writeUsers(users);
    return Promise.resolve({ success: true, message: '密码修改成功(本地账号)' });
  }
  async function changePassword(username, oldPassword, newPassword) {
    if (mode === 'cloud') return cloudChangePassword(username, oldPassword, newPassword);
    return localChangePassword(username, oldPassword, newPassword);
  }

  // ========= 本地旧数据自动迁移 (登录成功后触发,仅云端模式有意义) =========
  function autoMigrateOldProgress(username) {
    if (cache.migrated) return;
    try {
      var localKey = 'ee-progress-' + username;
      var raw = localStorage.getItem(localKey);
      if (!raw) { cache.migrated = true; return; }
      var progress = JSON.parse(raw);
      if (!progress) { cache.migrated = true; return; }
      var has = Object.keys(progress.basic || {}).length + Object.keys(progress.hotpoints || {}).length
        + Object.keys(progress.videos || {}).length + (progress.notes || []).length + (progress.shares || []).length;
      if (!has) { cache.migrated = true; return; }
      cache.migrating = true;
      req('/progress/save', 'POST', { progress: progress, migratedFromLocal: true }).then(function () {
        cache.migrated = true;
        cache.migrating = false;
        document.dispatchEvent(new CustomEvent('progressChanged'));
      }).catch(function () { cache.migrating = false; });
    } catch (e) {}
  }

  // ========= UI: 登录/注册/修改密码弹窗 (保持原有样式与交互) =========
  function buildAuthUI() {
    var navContainer = document.querySelector('.navbar-container');
    if (!navContainer) return;

    var userArea = document.createElement('div');
    userArea.id = 'user-area';
    userArea.style.cssText = 'display:flex;align-items:center;gap:10px;color:#fff;';
    navContainer.appendChild(userArea);

    var modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML =
      '<div class="modal-box">' +
      '<button class="modal-close" id="auth-close" aria-label="关闭">&times;</button>' +
      '<div class="auth-tabs">' +
      '<button class="auth-tab active" data-mode="login">登录</button>' +
      '<button class="auth-tab" data-mode="register">注册</button>' +
      '</div>' +
      '<form id="auth-form" class="auth-form">' +
      '<div class="form-group">' +
      '<label for="auth-username">用户名</label>' +
      '<input type="text" id="auth-username" placeholder="请输入用户名" autocomplete="username" required>' +
      '</div>' +
      '<div class="form-group" id="grp-old-password" style="display:none;">' +
      '<label for="auth-old-password">旧密码</label>' +
      '<input type="password" id="auth-old-password" placeholder="请输入旧密码" autocomplete="current-password">' +
      '</div>' +
      '<div class="form-group">' +
      '<label for="auth-password" id="auth-password-label">密码</label>' +
      '<input type="password" id="auth-password" placeholder="请输入密码" autocomplete="current-password" required>' +
      '</div>' +
      '<div class="form-group" id="grp-confirm-password" style="display:none;">' +
      '<label for="auth-confirm-password">确认密码</label>' +
      '<input type="password" id="auth-confirm-password" placeholder="请再次输入新密码" autocomplete="new-password">' +
      '</div>' +
      '<button type="submit" class="btn btn-primary btn-block" id="auth-submit">登录</button>' +
      '<p class="auth-message" id="auth-message"></p>' +
      '<p class="auth-hint" id="auth-mode-hint">提示:用户数据云端保存,跨设备同步 · 账号在所有平台通用</p>' +
      '<p class="auth-hint">忘记密码?请联系管理员重置账号</p>' +
      '</form>' +
      '</div>';
    document.body.appendChild(modal);

    var pwdModal = document.createElement('div');
    pwdModal.id = 'pwd-modal';
    pwdModal.className = 'modal-overlay';
    pwdModal.innerHTML =
      '<div class="modal-box">' +
      '<button class="modal-close" id="pwd-close" aria-label="关闭">&times;</button>' +
      '<h3 class="pwd-modal-title"><i class="fas fa-key"></i> 修改密码</h3>' +
      '<form id="pwd-form" class="auth-form">' +
      '<div class="form-group">' +
      '<label for="pwd-username">用户名</label>' +
      '<input type="text" id="pwd-username" readonly>' +
      '</div>' +
      '<div class="form-group">' +
      '<label for="pwd-old">旧密码</label>' +
      '<input type="password" id="pwd-old" placeholder="请输入旧密码" autocomplete="current-password" required>' +
      '</div>' +
      '<div class="form-group">' +
      '<label for="pwd-new">新密码(至少4位)</label>' +
      '<input type="password" id="pwd-new" placeholder="请输入新密码" autocomplete="new-password" required>' +
      '</div>' +
      '<div class="form-group">' +
      '<label for="pwd-confirm">确认新密码</label>' +
      '<input type="password" id="pwd-confirm" placeholder="请再次输入新密码" autocomplete="new-password" required>' +
      '</div>' +
      '<button type="submit" class="btn btn-primary btn-block">确认修改</button>' +
      '<p class="auth-message" id="pwd-message"></p>' +
      '</form>' +
      '</div>';
    document.body.appendChild(pwdModal);

    bindAuthEvents();
    bindPwdEvents();
    renderUserArea();
  }

  function applyAuthMode(modeStr) {
    var submitBtn = document.getElementById('auth-submit');
    var msgEl = document.getElementById('auth-message');
    var oldPwdGrp = document.getElementById('grp-old-password');
    var confirmGrp = document.getElementById('grp-confirm-password');
    var pwdLabel = document.getElementById('auth-password-label');
    var pwdInput = document.getElementById('auth-password');
    var confirmInput = document.getElementById('auth-confirm-password');
    oldPwdGrp.style.display = 'none';
    confirmGrp.style.display = 'none';
    pwdInput.required = true;
    if (confirmInput) confirmInput.required = false;
    msgEl.textContent = '';
    if (modeStr === 'login') {
      submitBtn.textContent = '登录';
      pwdLabel.textContent = '密码';
      pwdInput.placeholder = '请输入密码';
      pwdInput.setAttribute('autocomplete', 'current-password');
    } else if (modeStr === 'register') {
      submitBtn.textContent = '注册';
      pwdLabel.textContent = '设置密码';
      pwdInput.placeholder = '请设置密码(至少4位)';
      pwdInput.setAttribute('autocomplete', 'new-password');
      confirmGrp.style.display = 'block';
      confirmInput.required = true;
    }
  }

  function showMsg(el, text, ok) {
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-message ' + (ok ? 'success' : 'error');
  }

  // 模式确定后更新底部提示文案
  function refreshModeHint() {
    var hint = document.getElementById('auth-mode-hint');
    if (!hint) return;
    if (mode === 'local') {
      hint.textContent = '提示:当前为本地账号模式(后端不可达),数据保存在本机浏览器,清缓存会丢失。';
    } else {
      hint.textContent = '提示:用户数据云端保存,跨设备同步 · 账号在所有平台通用';
    }
  }

  function bindAuthEvents() {
    var modal = document.getElementById('auth-modal');
    var closeBtn = document.getElementById('auth-close');
    var tabs = modal.querySelectorAll('.auth-tab');
    var form = document.getElementById('auth-form');

    closeBtn.addEventListener('click', closeAuthModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeAuthModal(); });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        applyAuthMode(tab.dataset.mode);
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var modeStr = modal.querySelector('.auth-tab.active').dataset.mode;
      var username = document.getElementById('auth-username').value;
      var password = document.getElementById('auth-password').value;
      var confirmPwd = document.getElementById('auth-confirm-password').value;
      var msgEl = document.getElementById('auth-message');
      var submitBtn = document.getElementById('auth-submit');
      submitBtn.disabled = true;
      var oldText = submitBtn.textContent;
      submitBtn.textContent = '处理中...';

      var result;
      if (modeStr === 'login') {
        result = await login(username, password);
      } else if (modeStr === 'register') {
        if (password !== confirmPwd) result = { success: false, message: '两次输入的密码不一致' };
        else result = await register(username, password, confirmPwd);
      }
      showMsg(msgEl, result.message, result.success);
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;

      if (result.success && modeStr === 'login') {
        setTimeout(function () {
          closeAuthModal();
          renderUserArea();
          form.reset();
        }, 600);
      } else if (result.success && modeStr === 'register') {
        setTimeout(function () {
          modal.querySelector('.auth-tab[data-mode="login"]').click();
          document.getElementById('auth-username').value = username;
          document.getElementById('auth-password').focus();
        }, 800);
      }
    });
  }

  function bindPwdEvents() {
    var modal = document.getElementById('pwd-modal');
    var closeBtn = document.getElementById('pwd-close');
    var form = document.getElementById('pwd-form');
    closeBtn.addEventListener('click', closePwdModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closePwdModal(); });
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var username = document.getElementById('pwd-username').value;
      var oldPwd = document.getElementById('pwd-old').value;
      var newPwd = document.getElementById('pwd-new').value;
      var confirmPwd = document.getElementById('pwd-confirm').value;
      var msgEl = document.getElementById('pwd-message');
      if (newPwd !== confirmPwd) { showMsg(msgEl, '两次输入的新密码不一致', false); return; }
      var result = await changePassword(username, oldPwd, newPwd);
      showMsg(msgEl, result.message, result.success);
      if (result.success) {
        setTimeout(function () { closePwdModal(); form.reset(); }, 1200);
      }
    });
  }

  function openAuthModal() {
    refreshModeHint();
    document.getElementById('auth-modal').classList.add('show');
  }
  function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
    var m = document.getElementById('auth-message'); if (m) m.textContent = '';
  }
  function openPwdModal() {
    var user = getCurrentUser();
    if (!user) return;
    document.getElementById('pwd-username').value = user;
    document.getElementById('pwd-message').textContent = '';
    document.getElementById('pwd-modal').classList.add('show');
  }
  function closePwdModal() {
    document.getElementById('pwd-modal').classList.remove('show');
    document.getElementById('pwd-message').textContent = '';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderUserArea() {
    var area = document.getElementById('user-area');
    if (!area) return;
    var user = getCurrentUser();
    if (user) {
      area.innerHTML =
        '<span class="user-greeting"><i class="fas fa-user-circle"></i> ' + escapeHtml(user) + '</span>' +
        '<button class="btn-pwd" id="btn-pwd" title="修改密码"><i class="fas fa-key"></i></button>' +
        '<button class="btn-logout" id="btn-logout" title="退出登录"><i class="fas fa-sign-out-alt"></i></button>';
      document.getElementById('btn-logout').addEventListener('click', function () { logout().then(renderUserArea); });
      var pwdBtn = document.getElementById('btn-pwd');
      if (pwdBtn) pwdBtn.addEventListener('click', openPwdModal);
    } else {
      area.innerHTML =
        '<button class="btn-login" id="btn-login"><i class="fas fa-sign-in-alt"></i> 登录 / 注册</button>';
      document.getElementById('btn-login').addEventListener('click', openAuthModal);
    }
  }

  // 暴露 API (保持原有同步方法名,写方法返回 Promise)
  window.EEAuth = {
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    login: login,
    register: register,
    logout: logout,
    changePassword: changePassword,
    openAuthModal: openAuthModal,
    openPwdModal: openPwdModal,
    buildAuthUI: buildAuthUI,
    getMode: function () { return mode; },
    // 内部工具:等待 session 拉取完成
    __ready: function () {
      if (cache.ready) return Promise.resolve({ user: cache.user });
      if (!cache.readyDefer) {
        cache.readyDefer = {};
        cache.readyDefer.p = new Promise(function (res) { cache.readyDefer.r = res; });
      }
      return cache.readyDefer.p;
    },
  };

  // 页面加载时异步拉取 me,成功后更新缓存并通知 progress 模块
  document.addEventListener('DOMContentLoaded', function () {
    buildAuthUI();
    me().then(function () {
      if (cache.readyDefer) cache.readyDefer.r({ user: cache.user });
      fireAuthChanged();
    });
  });
})();
