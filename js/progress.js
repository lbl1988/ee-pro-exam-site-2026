// 注册电气工程师基础考试2026 - 学习进度跟踪模块
// 双模式:云端模式(与 Vercel KV + Edge Functions 同步)
//        本地模式(后端不可达时,全部读写走 localStorage,账号隔离按 ee-progress-{username})
// 读: 内存缓存,同步 API(兼容原调用方式)
// 写: 乐观更新缓存 + 异步落云端(云端模式)/ 立即写本地(本地模式)
// 登录后自动从云端拉取;本地旧数据已由 auth.js 在登录时自动迁移(仅云端模式)

(function () {
  'use strict';

  var API_BASE = '/api';
  var EMPTY = { basic: {}, hotpoints: {}, videos: {}, notes: [], shares: [] };

  var state = {
    progress: null,  // 内存缓存: {basic,hotpoints,videos,notes,shares}
    loading: false,
    loaded: false,
    user: null,
  };

  function req(path, method, body) {
    return fetch(API_BASE + path, {
      method: method || 'GET',
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; },
        function () { return { ok: r.ok, status: r.status, data: { success: r.ok } }; });
    }).catch(function () { return { ok: false, status: 0, data: { success: false, message: '网络异常' } }; });
  }

  function cloneProgress(p) {
    if (!p) return JSON.parse(JSON.stringify(EMPTY));
    return {
      basic: Object.assign({}, p.basic || {}),
      hotpoints: Object.assign({}, p.hotpoints || {}),
      videos: Object.assign({}, p.videos || {}),
      notes: Array.isArray(p.notes) ? p.notes.map(function (n) { return Object.assign({}, n); }) : [],
      shares: Array.isArray(p.shares) ? p.shares.map(function (s) { return Object.assign({}, s); }) : [],
    };
  }

  function isLoggedIn() { return window.EEAuth && window.EEAuth.isLoggedIn(); }
  function currentUser() { return window.EEAuth ? window.EEAuth.getCurrentUser() : null; }
  function isLocalMode() { return window.EEAuth && typeof window.EEAuth.getMode === 'function' && window.EEAuth.getMode() === 'local'; }

  // ========= 本地模式存储 key =========
  function localProgressKey() {
    var u = currentUser();
    return u ? ('ee-progress-' + u) : null;
  }
  function readLocalProgress() {
    var k = localProgressKey();
    if (!k) return cloneProgress(EMPTY);
    try {
      var raw = localStorage.getItem(k);
      if (raw) {
        var p = JSON.parse(raw);
        return cloneProgress(p);
      }
    } catch (e) {}
    return cloneProgress(EMPTY);
  }
  function writeLocalProgress(p) {
    var k = localProgressKey();
    if (!k) return;
    try { localStorage.setItem(k, JSON.stringify(p)); } catch (e) {}
  }

  // ========= 云端拉取 =========
  async function fetchProgress() {
    if (!isLoggedIn()) {
      state.progress = null;
      state.loaded = false;
      state.user = null;
      return null;
    }
    var u = currentUser();
    state.loading = true;

    // 本地模式:直接读 localStorage
    if (isLocalMode()) {
      state.progress = readLocalProgress();
      state.loaded = true;
      state.user = u;
      state.loading = false;
      return state.progress;
    }

    var r = await req('/progress/get', 'GET');
    state.loading = false;
    if (r.ok && r.data && r.data.success) {
      state.progress = cloneProgress(r.data.progress);
      state.loaded = true;
      state.user = u;
      return state.progress;
    }
    // 拉取失败:用空结构兜底,保持 UI 可操作
    state.progress = cloneProgress(EMPTY);
    state.loaded = true;
    state.user = u;
    return state.progress;
  }

  // 懒加载:首次 get 时确保有数据;未登录返回 EMPTY
  function ensureData() {
    if (!isLoggedIn()) { state.progress = null; state.loaded = false; state.user = null; return null; }
    var u = currentUser();
    // 切换用户后需要重新拉
    if (state.user && state.user !== u) {
      state.progress = null; state.loaded = false;
    }
    if (state.loaded && state.progress) return state.progress;
    if (state.loading) return null;
    // 触发异步拉取,立即返回 EMPTY 让页面先渲染;拉取完成后派发 progressChanged
    if (!state.loaded && !state.loading) {
      fetchProgress().then(function () {
        document.dispatchEvent(new CustomEvent('progressChanged'));
      });
      // auth 就绪后的兜底拉取
      if (window.EEAuth && typeof window.EEAuth.__ready === 'function') {
        window.EEAuth.__ready().then(function () {
          if (isLoggedIn() && !state.loaded) return fetchProgress().then(function () {
            document.dispatchEvent(new CustomEvent('progressChanged'));
          });
        });
      }
    }
    return state.progress || cloneProgress(EMPTY);
  }

  // ========= 同步 API (读) =========
  function getProgress() {
    var d = ensureData();
    return d ? cloneProgress(d) : null;
  }

  function getNotes() {
    var d = ensureData();
    return d ? d.notes.map(function (n) { return Object.assign({}, n); }) : [];
  }
  function getShares() {
    var d = ensureData();
    return d ? d.shares.map(function (s) { return Object.assign({}, s); }) : [];
  }
  function isBasicMarked(subject) {
    var d = ensureData();
    return !!(d && d.basic[subject]);
  }
  function isHotPointMarked(point) {
    var d = ensureData();
    return !!(d && d.hotpoints[point]);
  }
  function isVideoMarked(bv) {
    var d = ensureData();
    return !!(d && d.videos[bv]);
  }

  // ========= 写操作:云端模式走乐观更新,本地模式直接改 localStorage =========
  function afterWrite(promise, snapshot, dispatchOnRollback) {
    promise.then(function (r) {
      if (r.ok && r.data && r.data.success) {
        if (r.data.progress) state.progress = cloneProgress(r.data.progress);
        document.dispatchEvent(new CustomEvent('progressChanged'));
      } else {
        state.progress = snapshot;
        if (dispatchOnRollback) document.dispatchEvent(new CustomEvent('progressChanged'));
      }
    }).catch(function () {
      state.progress = snapshot;
      if (dispatchOnRollback) document.dispatchEvent(new CustomEvent('progressChanged'));
    });
  }
  function localPersist() {
    if (state.progress) writeLocalProgress(state.progress);
    document.dispatchEvent(new CustomEvent('progressChanged'));
  }

  // ========= 写 API =========
  function toggleBasic(subject) {
    var data = ensureData();
    if (!data) return null;
    var snap = cloneProgress(data);
    data.basic[subject] = !data.basic[subject];
    var newVal = !!data.basic[subject];
    if (!newVal) delete data.basic[subject];
    if (isLocalMode()) { localPersist(); return newVal; }
    var p = req('/progress/toggle-basic', 'POST', { subject: subject });
    afterWrite(p, snap, true);
    return newVal;
  }
  function toggleHotPoint(point) {
    var data = ensureData();
    if (!data) return null;
    var snap = cloneProgress(data);
    data.hotpoints[point] = !data.hotpoints[point];
    var newVal = !!data.hotpoints[point];
    if (!newVal) delete data.hotpoints[point];
    if (isLocalMode()) { localPersist(); return newVal; }
    var p = req('/progress/toggle-hotpoint', 'POST', { point: point });
    afterWrite(p, snap, true);
    return newVal;
  }
  function toggleVideo(bv) {
    var data = ensureData();
    if (!data) return null;
    var snap = cloneProgress(data);
    data.videos[bv] = !data.videos[bv];
    var newVal = !!data.videos[bv];
    if (!newVal) delete data.videos[bv];
    if (isLocalMode()) { localPersist(); return newVal; }
    var p = req('/progress/toggle-video', 'POST', { bv: bv });
    afterWrite(p, snap, true);
    return newVal;
  }

  function addNote(title, content) {
    var data = ensureData();
    if (!data) return false;
    var snap = cloneProgress(data);
    var n = {
      id: 'n' + Date.now() + Math.floor(Math.random() * 1000),
      title: String(title || '').slice(0, 100),
      content: String(content || '').slice(0, 5000),
      date: new Date().toISOString().slice(0, 10),
    };
    data.notes.unshift(n);
    if (isLocalMode()) { localPersist(); return true; }
    var p = req('/progress/note-add', 'POST', { title: title, content: content });
    afterWrite(p, snap, true);
    return true;
  }
  function updateNote(id, title, content) {
    var data = ensureData();
    if (!data) return false;
    var snap = cloneProgress(data);
    var found = false;
    for (var i = 0; i < data.notes.length; i++) {
      if (data.notes[i].id === id) {
        data.notes[i].title = String(title || '').slice(0, 100);
        data.notes[i].content = String(content || '').slice(0, 5000);
        data.notes[i].date = new Date().toISOString().slice(0, 10);
        found = true;
        break;
      }
    }
    if (!found) return false;
    if (isLocalMode()) { localPersist(); return true; }
    var p = req('/progress/note-update', 'POST', { id: id, title: title, content: content });
    afterWrite(p, snap, true);
    return true;
  }
  function deleteNote(id) {
    var data = ensureData();
    if (!data) return false;
    var snap = cloneProgress(data);
    var before = data.notes.length;
    data.notes = data.notes.filter(function (n) { return n.id !== id; });
    if (data.notes.length === before) return false;
    if (isLocalMode()) { localPersist(); return true; }
    var p = req('/progress/note-delete', 'POST', { id: id });
    afterWrite(p, snap, true);
    return true;
  }

  function addShare(title, content, direction) {
    var data = ensureData();
    if (!data) return false;
    var snap = cloneProgress(data);
    var u = currentUser() || '匿名学友';
    var s = {
      id: 's' + Date.now() + Math.floor(Math.random() * 1000),
      title: String(title || '').slice(0, 100),
      content: String(content || '').slice(0, 5000),
      author: u,
      date: new Date().toISOString().slice(0, 10),
      direction: direction || '通用',
      views: 0,
    };
    data.shares.unshift(s);
    if (isLocalMode()) { localPersist(); return true; }
    var p = req('/progress/share-add', 'POST', { title: title, content: content, direction: direction });
    afterWrite(p, snap, true);
    return true;
  }
  function deleteShare(id) {
    var data = ensureData();
    if (!data) return false;
    var snap = cloneProgress(data);
    var before = data.shares.length;
    data.shares = data.shares.filter(function (s) { return s.id !== id; });
    if (data.shares.length === before) return false;
    if (isLocalMode()) { localPersist(); return true; }
    var p = req('/progress/share-delete', 'POST', { id: id });
    afterWrite(p, snap, true);
    return true;
  }

  // ========= 统计 =========
  function getStats() {
    var data = ensureData();
    if (!data) return null;

    var basicTotal = 0, basicDone = 0;
    var hotTotal = 0, hotDone = 0;
    var videoTotal = 0, videoDone = 0;

    if (typeof BASIC_KNOWLEDGE !== 'undefined') {
      var dirKey = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      if (BASIC_KNOWLEDGE.common && BASIC_KNOWLEDGE.common.subjects) {
        BASIC_KNOWLEDGE.common.subjects.forEach(function (s) {
          basicTotal++; if (data.basic[s.name]) basicDone++;
        });
      }
      if (BASIC_KNOWLEDGE[dirKey] && BASIC_KNOWLEDGE[dirKey].subjects) {
        BASIC_KNOWLEDGE[dirKey].subjects.forEach(function (s) {
          basicTotal++; if (data.basic[s.name]) basicDone++;
        });
      }
    }
    if (typeof HOT_POINTS !== 'undefined') {
      var dirKey2 = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      if (HOT_POINTS.common && HOT_POINTS.common.points) {
        HOT_POINTS.common.points.forEach(function (p) {
          hotTotal++; if (data.hotpoints[p.point]) hotDone++;
        });
      }
      if (HOT_POINTS[dirKey2] && HOT_POINTS[dirKey2].points) {
        HOT_POINTS[dirKey2].points.forEach(function (p) {
          hotTotal++; if (data.hotpoints[p.point]) hotDone++;
        });
      }
    }
    if (typeof COURSE_CARDS !== 'undefined') {
      var dirKey3 = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      var dirCards = COURSE_CARDS[dirKey3];
      if (dirCards) {
        for (var catKey in dirCards) {
          if (!dirCards.hasOwnProperty(catKey)) continue;
          var catSubjects = dirCards[catKey];
          if (!catSubjects) continue;
          for (var subjKey in catSubjects) {
            if (!catSubjects.hasOwnProperty(subjKey)) continue;
            var cards = catSubjects[subjKey];
            if (!cards || !cards.length) continue;
            cards.forEach(function (card) {
              videoTotal++;
              var vkey = String(card.bv || '') + '@p' + String(card.page || 1);
              if (data.videos[vkey]) videoDone++;
            });
          }
        }
      }
    }

    return {
      basic: { done: basicDone, total: basicTotal, percent: basicTotal ? Math.round(basicDone / basicTotal * 100) : 0 },
      hotpoints: { done: hotDone, total: hotTotal, percent: hotTotal ? Math.round(hotDone / hotTotal * 100) : 0 },
      videos: { done: videoDone, total: videoTotal, percent: videoTotal ? Math.round(videoDone / videoTotal * 100) : 0 },
      notes: data.notes.length,
    };
  }

  // ========= 事件联动:登录/登出/方向切换时,重拉云端进度 =========
  document.addEventListener('authChanged', function () {
    state.loaded = false;
    state.progress = null;
    if (isLoggedIn()) {
      fetchProgress().then(function () {
        document.dispatchEvent(new CustomEvent('progressChanged'));
      });
    }
  });

  window.EEProgress = {
    getProgress: getProgress,
    toggleBasic: toggleBasic,
    toggleHotPoint: toggleHotPoint,
    toggleVideo: toggleVideo,
    getNotes: getNotes,
    addNote: addNote,
    deleteNote: deleteNote,
    updateNote: updateNote,
    getShares: getShares,
    addShare: addShare,
    deleteShare: deleteShare,
    getStats: getStats,
    isBasicMarked: isBasicMarked,
    isHotPointMarked: isHotPointMarked,
    isVideoMarked: isVideoMarked,
    __fetchProgress: fetchProgress, // 外部可手动触发刷新
  };
})();
