// 注册电气工程师基础考试2026 - 学习进度跟踪模块
// 基于localStorage,按用户名隔离存储学习进度与笔记

(function () {
  'use strict';

  function getUserKey() {
    var user = window.EEAuth && window.EEAuth.getCurrentUser();
    return user ? 'ee-progress-' + user : null;
  }

  function getProgress() {
    var key = getUserKey();
    if (!key) return null;
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      basic: {},       // { 科目名: true }
      hotpoints: {},   // { 考点名: true }
      videos: {},      // { bv号: true }
      notes: []        // [{id,title,content,date}]
    };
  }

  function saveProgress(data) {
    var key = getUserKey();
    if (!key) return false;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }

  // 基础知识:标记/取消掌握
  function toggleBasic(subject) {
    var data = getProgress();
    if (!data) return null;
    data.basic[subject] = !data.basic[subject];
    saveProgress(data);
    return data.basic[subject];
  }

  // 高频考点:标记/取消掌握
  function toggleHotPoint(point) {
    var data = getProgress();
    if (!data) return null;
    data.hotpoints[point] = !data.hotpoints[point];
    saveProgress(data);
    return data.hotpoints[point];
  }

  // 视频:标记/取消已学
  function toggleVideo(bv) {
    var data = getProgress();
    if (!data) return null;
    data.videos[bv] = !data.videos[bv];
    saveProgress(data);
    return data.videos[bv];
  }

  // 笔记增删改
  function getNotes() {
    var data = getProgress();
    return data ? data.notes : [];
  }

  function addNote(title, content) {
    var data = getProgress();
    if (!data) return false;
    data.notes.unshift({
      id: 'n' + Date.now(),
      title: title,
      content: content,
      date: new Date().toISOString().slice(0, 10)
    });
    saveProgress(data);
    return true;
  }

  function deleteNote(id) {
    var data = getProgress();
    if (!data) return false;
    data.notes = data.notes.filter(function (n) { return n.id !== id; });
    saveProgress(data);
    return true;
  }

  function updateNote(id, title, content) {
    var data = getProgress();
    if (!data) return false;
    for (var i = 0; i < data.notes.length; i++) {
      if (data.notes[i].id === id) {
        data.notes[i].title = title;
        data.notes[i].content = content;
        data.notes[i].date = new Date().toISOString().slice(0, 10);
        break;
      }
    }
    saveProgress(data);
    return true;
  }

  // 计算掌握率统计
  function getStats() {
    var data = getProgress();
    if (!data) return null;

    // 总数依赖全局数据(若已加载)
    var basicTotal = 0, basicDone = 0;
    var hotTotal = 0, hotDone = 0;
    var videoTotal = 0, videoDone = 0;

    if (typeof BASIC_KNOWLEDGE !== 'undefined') {
      var dirKey = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      BASIC_KNOWLEDGE.common.subjects.forEach(function (s) { basicTotal++; if (data.basic[s.name]) basicDone++; });
      if (BASIC_KNOWLEDGE[dirKey]) {
        BASIC_KNOWLEDGE[dirKey].subjects.forEach(function (s) { basicTotal++; if (data.basic[s.name]) basicDone++; });
      }
    }

    if (typeof HOT_POINTS !== 'undefined') {
      var dirKey2 = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      HOT_POINTS.common.points.forEach(function (p) { hotTotal++; if (data.hotpoints[p.point]) hotDone++; });
      if (HOT_POINTS[dirKey2]) {
        HOT_POINTS[dirKey2].points.forEach(function (p) { hotTotal++; if (data.hotpoints[p.point]) hotDone++; });
      }
    }

    if (typeof VIDEOS !== 'undefined') {
      var dirKey3 = window.EEUtils ? window.EEUtils.getDirectionKey() : 'powerDistribution';
      var vids = VIDEOS[dirKey3];
      for (var k in vids) {
        if (vids[k].episodes) {
          vids[k].episodes.forEach(function (ep) {
            videoTotal++;
            if (data.videos[ep.bv]) videoDone++;
          });
        }
      }
    }

    return {
      basic: { done: basicDone, total: basicTotal, percent: basicTotal ? Math.round(basicDone / basicTotal * 100) : 0 },
      hotpoints: { done: hotDone, total: hotTotal, percent: hotTotal ? Math.round(hotDone / hotTotal * 100) : 0 },
      videos: { done: videoDone, total: videoTotal, percent: videoTotal ? Math.round(videoDone / videoTotal * 100) : 0 },
      notes: data.notes.length
    };
  }

  function isBasicMarked(subject) {
    var data = getProgress();
    return data && !!data.basic[subject];
  }
  function isHotPointMarked(point) {
    var data = getProgress();
    return data && !!data.hotpoints[point];
  }
  function isVideoMarked(bv) {
    var data = getProgress();
    return data && !!data.videos[bv];
  }

  // 暴露API
  window.EEProgress = {
    getProgress: getProgress,
    toggleBasic: toggleBasic,
    toggleHotPoint: toggleHotPoint,
    toggleVideo: toggleVideo,
    getNotes: getNotes,
    addNote: addNote,
    deleteNote: deleteNote,
    updateNote: updateNote,
    getStats: getStats,
    isBasicMarked: isBasicMarked,
    isHotPointMarked: isHotPointMarked,
    isVideoMarked: isVideoMarked
  };
})();
