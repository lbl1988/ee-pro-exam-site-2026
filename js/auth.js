// 注册电气工程师基础考试2026 - 用户认证模块
// 基于localStorage实现的纯前端用户系统(无后端)
// 说明:密码以简单哈希存储,仅供学习用途,非生产级安全方案

(function () {
  'use strict';

  var USERS_KEY = 'ee-users';
  var CURRENT_USER_KEY = 'ee-current-user';

  // 简单字符串哈希(非加密安全,仅用于避免明文存储)
  function simpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash;
    }
    return 'h' + Math.abs(hash);
  }

  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY) || null;
  }

  function setCurrentUser(username) {
    if (username) {
      localStorage.setItem(CURRENT_USER_KEY, username);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  function isLoggedIn() {
    return !!getCurrentUser();
  }

  // 注册
  function register(username, password) {
    username = (username || '').trim();
    if (!username || !password) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    if (username.length < 2) {
      return { success: false, message: '用户名至少2个字符' };
    }
    if (password.length < 4) {
      return { success: false, message: '密码至少4个字符' };
    }
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        return { success: false, message: '该用户名已被注册' };
      }
    }
    users.push({
      username: username,
      password: simpleHash(password),
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
    return { success: true, message: '注册成功,请登录' };
  }

  // 登录
  function login(username, password) {
    username = (username || '').trim();
    if (!username || !password) {
      return { success: false, message: '请输入用户名和密码' };
    }
    var users = getUsers();
    var found = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        found = users[i];
        break;
      }
    }
    if (!found) {
      return { success: false, message: '用户名不存在' };
    }
    if (found.password !== simpleHash(password)) {
      return { success: false, message: '密码错误' };
    }
    setCurrentUser(username);
    return { success: true, message: '登录成功' };
  }

  // 登出
  function logout() {
    setCurrentUser(null);
  }

  // ===== UI: 顶部用户状态与登录弹窗 =====
  function buildAuthUI() {
    // 创建顶部用户区域(注入到导航栏)
    var navContainer = document.querySelector('.navbar-container');
    if (!navContainer) return;

    var userArea = document.createElement('div');
    userArea.id = 'user-area';
    userArea.style.cssText = 'display:flex;align-items:center;gap:10px;color:#fff;';
    navContainer.appendChild(userArea);

    // 创建登录/注册弹窗
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
      '<div class="form-group">' +
      '<label for="auth-password">密码</label>' +
      '<input type="password" id="auth-password" placeholder="请输入密码" autocomplete="current-password" required>' +
      '</div>' +
      '<button type="submit" class="btn btn-primary btn-block" id="auth-submit">登录</button>' +
      '<p class="auth-message" id="auth-message"></p>' +
      '<p class="auth-hint">提示:用户数据保存在本地浏览器,纯前端演示用途</p>' +
      '</form>' +
      '</div>';
    document.body.appendChild(modal);

    bindAuthEvents();
    renderUserArea();
  }

  function bindAuthEvents() {
    var modal = document.getElementById('auth-modal');
    var closeBtn = document.getElementById('auth-close');
    var tabs = modal.querySelectorAll('.auth-tab');
    var form = document.getElementById('auth-form');

    closeBtn.addEventListener('click', closeAuthModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAuthModal();
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var mode = tab.dataset.mode;
        document.getElementById('auth-submit').textContent = mode === 'login' ? '登录' : '注册';
        document.getElementById('auth-message').textContent = '';
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mode = modal.querySelector('.auth-tab.active').dataset.mode;
      var username = document.getElementById('auth-username').value;
      var password = document.getElementById('auth-password').value;
      var msgEl = document.getElementById('auth-message');

      var result;
      if (mode === 'login') {
        result = login(username, password);
      } else {
        result = register(username, password);
      }

      msgEl.textContent = result.message;
      msgEl.className = 'auth-message ' + (result.success ? 'success' : 'error');

      if (result.success && mode === 'login') {
        setTimeout(function () {
          closeAuthModal();
          renderUserArea();
          document.dispatchEvent(new CustomEvent('authChanged', { detail: { username: getCurrentUser() } }));
          form.reset();
        }, 600);
      } else if (result.success && mode === 'register') {
        // 注册成功后切到登录
        setTimeout(function () {
          modal.querySelector('.auth-tab[data-mode="login"]').click();
        }, 800);
      }
    });
  }

  function openAuthModal() {
    document.getElementById('auth-modal').classList.add('show');
  }

  function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
    document.getElementById('auth-message').textContent = '';
  }

  function renderUserArea() {
    var area = document.getElementById('user-area');
    if (!area) return;
    var user = getCurrentUser();
    if (user) {
      area.innerHTML =
        '<span class="user-greeting"><i class="fas fa-user-circle"></i> ' + escapeHtml(user) + '</span>' +
        '<button class="btn-logout" id="btn-logout" title="退出登录"><i class="fas fa-sign-out-alt"></i></button>';
      var logoutBtn = document.getElementById('btn-logout');
      logoutBtn.addEventListener('click', function () {
        logout();
        renderUserArea();
        document.dispatchEvent(new CustomEvent('authChanged', { detail: { username: null } }));
      });
    } else {
      area.innerHTML =
        '<button class="btn-login" id="btn-login"><i class="fas fa-sign-in-alt"></i> 登录 / 注册</button>';
      document.getElementById('btn-login').addEventListener('click', openAuthModal);
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 暴露API
  window.EEAuth = {
    isLoggedIn: isLoggedIn,
    getCurrentUser: getCurrentUser,
    openAuthModal: openAuthModal,
    buildAuthUI: buildAuthUI
  };

  // 自动初始化UI
  document.addEventListener('DOMContentLoaded', buildAuthUI);
})();
