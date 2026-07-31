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

  // 修改密码(需验证旧密码,已登录用户使用)
  function changePassword(username, oldPassword, newPassword) {
    username = (username || '').trim();
    if (!username || !oldPassword || !newPassword) {
      return { success: false, message: '请填写完整信息' };
    }
    if (newPassword.length < 4) {
      return { success: false, message: '新密码至少4个字符' };
    }
    if (oldPassword === newPassword) {
      return { success: false, message: '新密码不能与旧密码相同' };
    }
    var users = getUsers();
    var found = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) { found = users[i]; break; }
    }
    if (!found) {
      return { success: false, message: '用户名不存在' };
    }
    if (found.password !== simpleHash(oldPassword)) {
      return { success: false, message: '旧密码错误' };
    }
    found.password = simpleHash(newPassword);
    found.updatedAt = new Date().toISOString();
    saveUsers(users);
    return { success: true, message: '密码修改成功,请使用新密码登录' };
  }

  // 忘记密码:重置密码(纯前端无邮箱验证,简化为凭用户名直接重置)
  function resetPassword(username, newPassword) {
    username = (username || '').trim();
    if (!username || !newPassword) {
      return { success: false, message: '请输入用户名和新密码' };
    }
    if (newPassword.length < 4) {
      return { success: false, message: '新密码至少4个字符' };
    }
    var users = getUsers();
    var found = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) { found = users[i]; break; }
    }
    if (!found) {
      return { success: false, message: '用户名不存在' };
    }
    found.password = simpleHash(newPassword);
    found.updatedAt = new Date().toISOString();
    saveUsers(users);
    return { success: true, message: '密码已重置,请使用新密码登录' };
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

    // 创建登录/注册/重置密码弹窗
    var modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML =
      '<div class="modal-box">' +
      '<button class="modal-close" id="auth-close" aria-label="关闭">&times;</button>' +
      '<div class="auth-tabs">' +
      '<button class="auth-tab active" data-mode="login">登录</button>' +
      '<button class="auth-tab" data-mode="register">注册</button>' +
      '<button class="auth-tab" data-mode="reset">忘记密码</button>' +
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
      '<label for="auth-confirm-password">确认新密码</label>' +
      '<input type="password" id="auth-confirm-password" placeholder="请再次输入新密码" autocomplete="new-password">' +
      '</div>' +
      '<button type="submit" class="btn btn-primary btn-block" id="auth-submit">登录</button>' +
      '<p class="auth-message" id="auth-message"></p>' +
      '<p class="auth-hint">提示:用户数据保存在本地浏览器,纯前端演示用途</p>' +
      '</form>' +
      '</div>';
    document.body.appendChild(modal);

    // 创建修改密码弹窗(已登录用户使用)
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

  // 根据模式切换登录弹窗字段显示
  function applyAuthMode(mode) {
    var modal = document.getElementById('auth-modal');
    var submitBtn = document.getElementById('auth-submit');
    var msgEl = document.getElementById('auth-message');
    var oldPwdGrp = document.getElementById('grp-old-password');
    var confirmGrp = document.getElementById('grp-confirm-password');
    var pwdLabel = document.getElementById('auth-password-label');
    var pwdInput = document.getElementById('auth-password');
    var confirmInput = document.getElementById('auth-confirm-password');

    // 默认全部隐藏
    oldPwdGrp.style.display = 'none';
    confirmGrp.style.display = 'none';
    pwdInput.required = true;
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
    } else if (mode === 'reset') {
      submitBtn.textContent = '重置密码';
      pwdLabel.textContent = '新密码';
      pwdInput.placeholder = '请输入新密码(至少4位)';
      pwdInput.setAttribute('autocomplete', 'new-password');
      confirmGrp.style.display = 'block';
      confirmInput.required = true;
    }
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
        applyAuthMode(tab.dataset.mode);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mode = modal.querySelector('.auth-tab.active').dataset.mode;
      var username = document.getElementById('auth-username').value;
      var password = document.getElementById('auth-password').value;
      var confirmPwd = document.getElementById('auth-confirm-password').value;
      var msgEl = document.getElementById('auth-message');

      var result;
      if (mode === 'login') {
        result = login(username, password);
      } else if (mode === 'register') {
        result = register(username, password);
      } else if (mode === 'reset') {
        if (password !== confirmPwd) {
          result = { success: false, message: '两次输入的新密码不一致' };
        } else {
          result = resetPassword(username, password);
        }
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
      } else if (result.success && mode === 'reset') {
        // 重置成功后切到登录
        setTimeout(function () {
          modal.querySelector('.auth-tab[data-mode="login"]').click();
        }, 1000);
      }
    });
  }

  // 修改密码弹窗事件绑定
  function bindPwdEvents() {
    var modal = document.getElementById('pwd-modal');
    var closeBtn = document.getElementById('pwd-close');
    var form = document.getElementById('pwd-form');

    closeBtn.addEventListener('click', closePwdModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePwdModal();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var username = document.getElementById('pwd-username').value;
      var oldPwd = document.getElementById('pwd-old').value;
      var newPwd = document.getElementById('pwd-new').value;
      var confirmPwd = document.getElementById('pwd-confirm').value;
      var msgEl = document.getElementById('pwd-message');

      if (newPwd !== confirmPwd) {
        msgEl.textContent = '两次输入的新密码不一致';
        msgEl.className = 'auth-message error';
        return;
      }
      var result = changePassword(username, oldPwd, newPwd);
      msgEl.textContent = result.message;
      msgEl.className = 'auth-message ' + (result.success ? 'success' : 'error');
      if (result.success) {
        setTimeout(function () {
          closePwdModal();
          form.reset();
        }, 1200);
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

  function renderUserArea() {
    var area = document.getElementById('user-area');
    if (!area) return;
    var user = getCurrentUser();
    if (user) {
      area.innerHTML =
        '<span class="user-greeting"><i class="fas fa-user-circle"></i> ' + escapeHtml(user) + '</span>' +
        '<button class="btn-pwd" id="btn-pwd" title="修改密码"><i class="fas fa-key"></i></button>' +
        '<button class="btn-logout" id="btn-logout" title="退出登录"><i class="fas fa-sign-out-alt"></i></button>';
      var logoutBtn = document.getElementById('btn-logout');
      logoutBtn.addEventListener('click', function () {
        logout();
        renderUserArea();
        document.dispatchEvent(new CustomEvent('authChanged', { detail: { username: null } }));
      });
      var pwdBtn = document.getElementById('btn-pwd');
      if (pwdBtn) pwdBtn.addEventListener('click', openPwdModal);
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
    buildAuthUI: buildAuthUI,
    changePassword: changePassword,
    resetPassword: resetPassword,
    openPwdModal: openPwdModal
  };

  // 自动初始化UI
  document.addEventListener('DOMContentLoaded', buildAuthUI);
})();
