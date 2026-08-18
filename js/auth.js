// 注册电气工程师基础考试2026 - 用户认证模块 (云端版本)
// 基于 Vercel KV + Edge Functions, HttpOnly Cookie 存 Session
// 跨设备同步, iPhone Safari ITP 兼容 (Cookie 不受脚本存储限制)
// 兼容暴露 window.EEAuth 原有同步读 API(内存缓存)+ 异步写 API(Promise)

(function () {
  'use strict';

  var API_BASE = '/api';
  var CACHE_KEY_USER = 'ee-cache-user-v2'; // session user 内存缓存(仅为同步API兼容)

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

  // ========= fetch 封装 =========
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

  // ========= 同步兼容 API =========
  function isLoggedIn() { return !!cache.user; }
  function getCurrentUser() { return cache.user ? cache.user.username : null; }

  // ========= 异步 API =========
  async function me() {
    var r = await req('/auth/me', 'GET');
    if (r.ok && r.data && r.data.success) {
      setUserCache(r.data.user);
      cache.ready = true;
      return { success: true, user: r.data.user };
    }
    setUserCache(null);
    cache.ready = true;
    return { success: false, message: r.data ? r.data.message : '未登录', code: r.data && r.data.code };
  }

  function fireAuthChanged() {
    var u = getCurrentUser();
    document.dispatchEvent(new CustomEvent('authChanged', { detail: { username: u } }));
  }

  async function login(username, password) {
    var r = await req('/auth/login', 'POST', { username: username, password: password });
    if (r.ok && r.data && r.data.success) {
      setUserCache({ username: r.data.username, createdAt: r.data.createdAt });
      // 登录成功后:尝试迁移本地 localStorage 的旧进度到云端(幂等)
      try { autoMigrateOldProgress(r.data.username); } catch (e) {}
      fireAuthChanged();
      return { success: true, message: r.data.message || '登录成功' };
    }
    return { success: false, message: r.data ? r.data.message : '登录失败' };
  }

  async function register(username, password, confirmPassword) {
    var r = await req('/auth/register', 'POST', { username: username, password: password, confirmPassword: confirmPassword || password });
    if (r.ok && r.data && r.data.success) {
      return { success: true, message: r.data.message || '注册成功,请登录' };
    }
    return { success: false, message: r.data ? r.data.message : '注册失败' };
  }

  async function logout() {
    await req('/auth/logout', 'POST');
    setUserCache(null);
    fireAuthChanged();
    return { success: true };
  }

  // 兼容原签名 changePassword(username, oldPwd, newPwd)  实际用 session 自带用户,忽略 username
  async function changePassword(username, oldPassword, newPassword) {
    var r = await req('/auth/change-password', 'POST', {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: newPassword,
    });
    if (r.ok && r.data && r.data.success) return { success: true, message: r.data.message };
    return { success: false, message: r.data ? r.data.message : '修改失败' };
  }

  // ========= 本地旧数据自动迁移 (登录成功后触发) =========
  function autoMigrateOldProgress(username) {
    if (cache.migrated) return;
    try {
      var localKey = 'ee-progress-' + username;
      var raw = localStorage.getItem(localKey);
      if (!raw) { cache.migrated = true; return; }
      var progress = JSON.parse(raw);
      if (!progress) { cache.migrated = true; return; }
      // 判断是否真的有数据(空结构不迁移)
      var has = Object.keys(progress.basic || {}).length + Object.keys(progress.hotpoints || {}).length
        + Object.keys(progress.videos || {}).length + (progress.notes || []).length + (progress.shares || []).length;
      if (!has) { cache.migrated = true; return; }
      cache.migrating = true;
      req('/progress/save', 'POST', { progress: progress, migratedFromLocal: true }).then(function () {
        cache.migrated = true;
        cache.migrating = false;
        // 迁移完成后派发 progressChanged 让页面重绘
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
      '<p class="auth-hint">提示:用户数据云端保存,跨设备同步 · 账号在所有平台通用</p>' +
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

  function applyAuthMode(mode) {
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
    if (mode === 'login') {
      submitBtn.textContent = '登录';
      pwdLabel.textContent = '密码';
      pwdInput.placeholder = '请输入密码';
      pwdInput.setAttribute('autocomplete', 'current-password');
    } else if (mode === 'register') {
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
      var mode = modal.querySelector('.auth-tab.active').dataset.mode;
      var username = document.getElementById('auth-username').value;
      var password = document.getElementById('auth-password').value;
      var confirmPwd = document.getElementById('auth-confirm-password').value;
      var msgEl = document.getElementById('auth-message');
      var submitBtn = document.getElementById('auth-submit');
      submitBtn.disabled = true;
      var oldText = submitBtn.textContent;
      submitBtn.textContent = '处理中...';

      var result;
      if (mode === 'login') {
        result = await login(username, password);
      } else if (mode === 'register') {
        if (password !== confirmPwd) result = { success: false, message: '两次输入的密码不一致' };
        else result = await register(username, password, confirmPwd);
      }
      showMsg(msgEl, result.message, result.success);
      submitBtn.disabled = false;
      submitBtn.textContent = oldText;

      if (result.success && mode === 'login') {
        setTimeout(function () {
          closeAuthModal();
          renderUserArea();
          form.reset();
        }, 600);
      } else if (result.success && mode === 'register') {
        setTimeout(function () {
          modal.querySelector('.auth-tab[data-mode="login"]').click();
          // 自动把刚注册的用户名填入登录框
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

  function openAuthModal() { document.getElementById('auth-modal').classList.add('show'); }
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
