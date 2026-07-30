// 注册电气工程师基础考试2026 - 主交互逻辑

(function () {
  'use strict';

  // 方向标识: pd=供配电, pt=发输变电
  let currentDirection = localStorage.getItem('ee-direction') || 'pd';

  // ===== 方向切换功能 =====
  function initDirectionSwitcher() {
    const tabs = document.querySelectorAll('.direction-tab');
    if (!tabs.length) return;
    updateActiveTab();
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const dir = tab.dataset.direction;
        if (dir === currentDirection) return;
        currentDirection = dir;
        localStorage.setItem('ee-direction', dir);
        updateActiveTab();
        document.dispatchEvent(new CustomEvent('directionChanged', { detail: { direction: dir } }));
      });
    });
  }

  function updateActiveTab() {
    const tabs = document.querySelectorAll('.direction-tab');
    tabs.forEach(function (tab) {
      if (tab.dataset.direction === currentDirection) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  function getDirectionKey() {
    return currentDirection === 'pd' ? 'powerDistribution' : 'powerTransmission';
  }

  function getDirectionLabel() {
    return currentDirection === 'pd' ? '供配电' : '发输变电';
  }

  // ===== 移动端导航菜单 =====
  function initMobileNav() {
    const toggle = document.querySelector('.navbar-toggle');
    const nav = document.querySelector('.navbar-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () { nav.classList.toggle('show'); });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('show'); });
    });
  }

  // ===== 登录状态判断 =====
  function isLoggedIn() {
    return window.EEAuth && window.EEAuth.isLoggedIn();
  }

  function requireLoginToast() {
    alert('请先登录后再使用该功能');
    if (window.EEAuth) window.EEAuth.openAuthModal();
  }

  // ===== 生成标记掌握按钮 =====
  function buildMarkButton(type, key, marked) {
    if (!isLoggedIn()) return '';
    var cls = marked ? 'marked' : 'unmarked';
    var icon = marked ? 'fas fa-check-circle' : 'far fa-circle';
    var text = marked ? '已掌握' : '标记掌握';
    return '<button class="mark-btn ' + cls + '" data-mark-type="' + type + '" data-mark-key="' + escapeAttr(key) + '">' +
      '<i class="' + icon + '"></i> ' + text + '</button>';
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  // 绑定标记按钮点击事件(事件委托)
  function bindMarkButtons(container) {
    if (!container) return;
    container.querySelectorAll('.mark-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!isLoggedIn()) { requireLoginToast(); return; }
        var type = btn.dataset.markType;
        var key = btn.dataset.markKey;
        var result = null;
        if (type === 'basic') result = window.EEProgress.toggleBasic(key);
        else if (type === 'hotpoint') result = window.EEProgress.toggleHotPoint(key);
        else if (type === 'video') result = window.EEProgress.toggleVideo(key);

        if (result !== null) {
          updateMarkButton(btn, result);
          // 进度可能变化,刷新主页统计
          document.dispatchEvent(new CustomEvent('progressChanged'));
        }
      });
    });
  }

  function updateMarkButton(btn, marked) {
    if (marked) {
      btn.classList.remove('unmarked');
      btn.classList.add('marked');
      btn.innerHTML = '<i class="fas fa-check-circle"></i> 已掌握';
      // 给父卡片加标记样式
      var card = btn.closest('.subject-card, .point-card, .video-card');
      if (card) card.classList.add('marked');
    } else {
      btn.classList.remove('marked');
      btn.classList.add('unmarked');
      btn.innerHTML = '<i class="far fa-circle"></i> 标记掌握';
      var card = btn.closest('.subject-card, .point-card, .video-card');
      if (card) card.classList.remove('marked');
    }
  }

  // ===== 首页板块渲染 =====
  function initHomePage() {
    const container = document.getElementById('home-sections');
    if (!container) return;

    const sections = [
      { icon: 'fas fa-book-open', title: '基础知识', desc: '系统梳理公共基础与专业基础知识体系,涵盖高等数学、电路、电气工程基础等全部考试科目。', link: 'basic.html', btnText: '查看知识体系' },
      { icon: 'fas fa-fire', title: '高频考点', desc: '精选历年高频考点与公式速记,标注考频星级,帮助高效复习,直击考试重点。', link: 'hot-points.html', btnText: '查看高频考点' },
      { icon: 'fas fa-video', title: '视频直播', desc: 'B站视频课程集合:姜小白公共基础精讲、工控圈专业精讲、大熊冲刺课、电教中心全18讲、历年真题讲解。', link: 'videos.html', btnText: '观看视频' },
      { icon: 'fas fa-pencil-alt', title: '学习笔记', desc: '整理各科目学习笔记与知识总结,登录后可自定义笔记,方便随时查阅复习。', link: 'my-notes.html', btnText: '查看笔记' },
      { icon: 'fas fa-users', title: '学友分享', desc: '学友备考经验分享、资料交流、问答互助,共同进步,一起通关。', link: 'share.html', btnText: '查看分享' }
    ];

    container.innerHTML = sections.map(function (s) {
      return '<div class="section-card">' +
        '<div class="section-card-icon"><i class="' + s.icon + '"></i></div>' +
        '<h3>' + s.title + '</h3>' +
        '<p>' + s.desc + '</p>' +
        '<a href="' + s.link + '" class="btn btn-primary">' + s.btnText + '</a>' +
        '</div>';
    }).join('');
  }

  // ===== 首页学习进度统计板块 =====
  function initProgressDashboard() {
    const container = document.getElementById('progress-dashboard');
    if (!container) return;
    renderProgressDashboard();
    document.addEventListener('authChanged', renderProgressDashboard);
    document.addEventListener('directionChanged', renderProgressDashboard);
    document.addEventListener('progressChanged', renderProgressDashboard);
  }

  function renderProgressDashboard() {
    const container = document.getElementById('progress-dashboard');
    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML =
        '<div class="login-prompt">' +
        '<i class="fas fa-user-lock"></i>' +
        '<h3>登录后查看你的学习进度</h3>' +
        '<p>登录/注册账号后,可记录基础知识、高频考点、视频学习进度,实时统计复习完成率。</p>' +
        '<button class="btn btn-primary" id="prompt-login-btn"><i class="fas fa-sign-in-alt"></i> 登录 / 注册</button>' +
        '</div>';
      var btn = document.getElementById('prompt-login-btn');
      if (btn) btn.addEventListener('click', function () { window.EEAuth.openAuthModal(); });
      return;
    }

    var stats = window.EEProgress.getStats();
    if (!stats) return;
    var user = window.EEAuth.getCurrentUser();

    container.innerHTML =
      '<div class="progress-dashboard">' +
      '<div class="progress-dashboard-header">' +
      '<h2><i class="fas fa-chart-line"></i> 我的学习进度</h2>' +
      '<span style="color:var(--text-gray);font-size:14px;">' + getDirectionLabel() + '方向 · 用户: ' + escapeHtml(user) + '</span>' +
      '</div>' +
      '<div class="progress-grid">' +
      renderProgressItem('基础知识掌握', stats.basic) +
      renderProgressItem('高频考点掌握', stats.hotpoints) +
      renderProgressItem('视频学习进度', stats.videos) +
      '<div class="progress-item">' +
      '<div class="progress-item-title">个人笔记数</div>' +
      '<div class="progress-percent">' + stats.notes + '</div>' +
      '<div class="progress-detail">篇笔记</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    // 动画进度条
    setTimeout(function () {
      container.querySelectorAll('.progress-bar').forEach(function (bar) {
        bar.style.width = bar.dataset.percent + '%';
      });
    }, 50);
  }

  function renderProgressItem(title, data) {
    return '<div class="progress-item">' +
      '<div class="progress-item-title">' + title + '</div>' +
      '<div class="progress-bar-wrapper">' +
      '<div class="progress-bar" data-percent="' + data.percent + '"></div>' +
      '</div>' +
      '<div class="progress-percent">' + data.percent + '%</div>' +
      '<div class="progress-detail">' + data.done + ' / ' + data.total + ' 已完成</div>' +
      '</div>';
  }

  // ===== 基础知识页面渲染 =====
  function initBasicPage() {
    const container = document.getElementById('basic-content');
    if (!container || typeof BASIC_KNOWLEDGE === 'undefined') return;

    function render() {
      const dirKey = getDirectionKey();
      const dirLabel = getDirectionLabel();
      const common = BASIC_KNOWLEDGE.common;
      const professional = BASIC_KNOWLEDGE[dirKey];

      let html = '';
      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="' + common.icon + '"></i>' + common.title + '</h2>';
      html += common.subjects.map(function (subj) { return renderSubjectCard(subj); }).join('');
      html += '</div>';

      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="' + professional.icon + '"></i>' + professional.title + '</h2>';
      html += professional.subjects.map(function (subj) { return renderSubjectCard(subj); }).join('');
      html += '</div>';

      container.innerHTML = html;
      const dirLabelEl = document.getElementById('current-direction-label');
      if (dirLabelEl) dirLabelEl.textContent = dirLabel;
      bindMarkButtons(container);
      applyMarkedCardStyle(container);
    }

    render();
    document.addEventListener('directionChanged', render);
    document.addEventListener('authChanged', render);
  }

  function renderSubjectCard(subj) {
    var marked = isLoggedIn() && window.EEProgress.isBasicMarked(subj.name);
    return '<div class="subject-card' + (marked ? ' marked' : '') + '">' +
      '<div class="subject-card-header">' +
      '<h4>' + subj.name + '</h4>' +
      '<div style="display:flex;gap:8px;align-items:center;">' +
      '<span class="subject-weight">' + subj.weight + '</span>' +
      buildMarkButton('basic', subj.name, marked) +
      '</div>' +
      '</div>' +
      '<div class="subject-topics">' +
      subj.topics.map(function (t) { return '<span class="topic-tag">' + t + '</span>'; }).join('') +
      '</div>' +
      '<div class="subject-keypoints"><strong>重点:</strong> ' + subj.keyPoints + '</div>' +
      '</div>';
  }

  // ===== 高频考点页面渲染 =====
  function initHotPointsPage() {
    const container = document.getElementById('hotpoints-content');
    if (!container || typeof HOT_POINTS === 'undefined') return;

    function render() {
      const dirKey = getDirectionKey();
      const dirLabel = getDirectionLabel();
      const common = HOT_POINTS.common;
      const professional = HOT_POINTS[dirKey];

      let html = '';
      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="fas fa-fire"></i>' + common.title + '</h2>';
      html += common.points.map(renderPointCard).join('');
      html += '</div>';

      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="fas fa-fire"></i>' + professional.title + '</h2>';
      html += professional.points.map(renderPointCard).join('');
      html += '</div>';

      container.innerHTML = html;
      const dirLabelEl = document.getElementById('current-direction-label');
      if (dirLabelEl) dirLabelEl.textContent = dirLabel;
      bindMarkButtons(container);
      applyMarkedCardStyle(container);
    }

    render();
    document.addEventListener('directionChanged', render);
    document.addEventListener('authChanged', render);
  }

  function renderPointCard(pt) {
    var marked = isLoggedIn() && window.EEProgress.isHotPointMarked(pt.point);
    return '<div class="point-card' + (marked ? ' marked' : '') + '">' +
      '<div class="point-card-header">' +
      '<div>' +
      '<div class="point-subject">' + pt.subject + '</div>' +
      '<h4>' + pt.point + '</h4>' +
      '</div>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
      '<span class="point-frequency">考频 ' + pt.frequency + '</span>' +
      buildMarkButton('hotpoint', pt.point, marked) +
      '</div>' +
      '</div>' +
      '<div class="point-formula">' + pt.formula + '</div>' +
      '<div class="point-tip">' + pt.tip + '</div>' +
      '</div>';
  }

  // ===== 视频页面渲染(5大课程大类 × 学科 两层Tab + 全量393讲) =====
  function initVideosPage() {
    const container = document.getElementById('videos-content');
    if (!container || typeof VIDEOS === 'undefined' || typeof COURSE_CATEGORIES === 'undefined' || typeof COURSE_CARDS === 'undefined') return;

    // 当前激活的大类key + 学科key
    var activeCategory = null;
    var activeSubject = null;

    // 取某大类在某方向下的学科列表(静态学科直接用,动态学科按方向查表)
    function getCategorySubjects(category, dirKey) {
      if (category.subjects && category.subjects.length > 0) return category.subjects;
      if (category.key === 'gongkongquan') {
        return dirKey === 'powerDistribution' ? GKQ_SUBJECTS_PD : GKQ_SUBJECTS_PT;
      }
      if (category.key === 'zhenti') {
        return dirKey === 'powerDistribution' ? ZHENTI_SUBJECTS_PD : ZHENTI_SUBJECTS_PT;
      }
      return [];
    }

    function countCards(categoryKey, subjectKey, dirKey) {
      var cardsMap = (COURSE_CARDS[dirKey] || {})[categoryKey] || {};
      var cards = cardsMap[subjectKey];
      return (cards && cards.length) ? cards.length : 0;
    }

    function countCategoryTotal(categoryKey, dirKey) {
      var cat = COURSE_CATEGORIES.find(function (c) { return c.key === categoryKey; });
      if (!cat) return 0;
      var subjects = getCategorySubjects(cat, dirKey);
      var total = 0;
      subjects.forEach(function (s) { total += countCards(categoryKey, s.key, dirKey); });
      return total;
    }

    function countGrandTotal(dirKey) {
      var total = 0;
      COURSE_CATEGORIES.forEach(function (c) { total += countCategoryTotal(c.key, dirKey); });
      return total;
    }

    // 选首个有卡片的大类和学科作为默认
    function pickDefaults(dirKey) {
      for (var i = 0; i < COURSE_CATEGORIES.length; i++) {
        var cat = COURSE_CATEGORIES[i];
        var subjects = getCategorySubjects(cat, dirKey);
        for (var j = 0; j < subjects.length; j++) {
          if (countCards(cat.key, subjects[j].key, dirKey) > 0) {
            return { category: cat.key, subject: subjects[j].key };
          }
        }
      }
      return { category: null, subject: null };
    }

    function ensureActiveValid(dirKey) {
      var validCats = COURSE_CATEGORIES.filter(function (c) { return countCategoryTotal(c.key, dirKey) > 0; });
      var catOk = activeCategory && validCats.some(function (c) { return c.key === activeCategory; });
      if (!catOk) {
        var d = pickDefaults(dirKey);
        activeCategory = d.category;
        activeSubject = d.subject;
        return;
      }
      // 大类OK,校验学科
      var cat = validCats.find(function (c) { return c.key === activeCategory; });
      var subs = getCategorySubjects(cat, dirKey);
      if (!activeSubject || countCards(activeCategory, activeSubject, dirKey) === 0) {
        activeSubject = null;
        for (var k = 0; k < subs.length; k++) {
          if (countCards(activeCategory, subs[k].key, dirKey) > 0) { activeSubject = subs[k].key; break; }
        }
      }
    }

    function render() {
      var dirKey = getDirectionKey();
      var dirLabel = getDirectionLabel();
      var cardsByDir = COURSE_CARDS[dirKey] || {};
      ensureActiveValid(dirKey);

      var validCats = COURSE_CATEGORIES.filter(function (c) { return countCategoryTotal(c.key, dirKey) > 0; });
      var grandTotal = countGrandTotal(dirKey);
      var html = '';

      // 顶部概览统计
      html += '<div class="subject-overview">';
      html += '<div class="subject-overview-stat">';
      html += '<div class="stat-big-num">' + validCats.length + '</div>';
      html += '<div class="stat-label">课程大类</div>';
      html += '</div>';
      html += '<div class="subject-overview-stat">';
      html += '<div class="stat-big-num" style="color:#f1c40f">' + grandTotal + '</div>';
      html += '<div class="stat-label">讲 (全量整合)</div>';
      html += '</div>';
      var biliAllSearchUrl = dirKey === 'powerDistribution'
        ? 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95%20%E4%BE%9B%E9%85%8D%E7%94%B5'
        : 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5';
      html += '<a href="' + biliAllSearchUrl + '" target="_blank" rel="noopener" class="btn btn-bili" style="margin-left:auto;"><i class="fab fa-bilibili"></i> B站综合搜索 · ' + dirLabel + '</a>';
      html += '</div>';

      // === 第一层:大类Tab栏 ===
      html += '<div class="category-tabs" role="tablist">';
      validCats.forEach(function (cat) {
        var cnt = countCategoryTotal(cat.key, dirKey);
        if (cnt <= 0) return;
        var active = (cat.key === activeCategory);
        var styleAttr = active ? ' style="background:' + cat.color + ';border-color:' + cat.color + ';color:#fff;"' : '';
        html += '<button class="category-tab' + (active ? ' active' : '') + '" data-category="' + cat.key + '" role="tab" aria-selected="' + active + '"' + styleAttr + '>';
        html += '<i class="' + cat.icon + '"></i>';
        html += '<span class="category-tab-name">' + escapeHtml(cat.name) + '</span>';
        html += '<span class="category-tab-count">' + cnt + '讲</span>';
        html += '</button>';
      });
      html += '</div>';

      // === 大类信息条(描述+主讲老师) ===
      var activeCat = COURSE_CATEGORIES.find(function (c) { return c.key === activeCategory; });
      if (activeCat) {
        html += '<div class="category-info-bar" style="border-left:6px solid ' + activeCat.color + ';">';
        html += '<div class="category-info-text">';
        html += '<h2><i class="' + activeCat.icon + '" style="color:' + activeCat.color + '"></i>' + escapeHtml(activeCat.name) + '</h2>';
        html += '<p>' + escapeHtml(activeCat.desc || '') + '</p>';
        html += '</div>';
        if (activeCat.teacher) {
          html += '<div class="category-info-teacher"><i class="fas fa-user-tie"></i> 主讲:' + escapeHtml(activeCat.teacher) + '</div>';
        }
        html += '</div>';

        // === 第二层:学科Tab栏 ===
        var subjects = getCategorySubjects(activeCat, dirKey);
        var validSubjects = subjects.filter(function (s) { return countCards(activeCategory, s.key, dirKey) > 0; });
        if (validSubjects.length > 0) {
          html += '<div class="subject-tabs" role="tablist">';
          validSubjects.forEach(function (s) {
            var cnt = countCards(activeCategory, s.key, dirKey);
            var active = (s.key === activeSubject);
            html += '<button class="subject-tab' + (active ? ' active' : '') + '" data-subject="' + s.key + '" role="tab" aria-selected="' + active + '">';
            html += '<i class="' + s.icon + '" style="color:' + s.color + '"></i>';
            html += '<span class="subject-tab-name">' + escapeHtml(s.name) + '</span>';
            html += '<span class="subject-tab-count">' + cnt + '</span>';
            html += '</button>';
          });
          html += '</div>';
        }

        // === 当前学科的视频卡片 ===
        var subjectMeta = validSubjects.find(function (s) { return s.key === activeSubject; });
        var cards = (cardsByDir[activeCategory] || {})[activeSubject] || [];
        if (subjectMeta) {
          html += '<div class="subject-section">';
          html += '<div class="subject-section-header" style="border-left: 6px solid ' + subjectMeta.color + '">';
          html += '<h2 class="subject-section-title"><i class="' + subjectMeta.icon + '" style="color:' + subjectMeta.color + '"></i>' + escapeHtml(subjectMeta.name) + '</h2>';
          html += '<div class="subject-section-count"><i class="fas fa-list"></i> 共 ' + cards.length + ' 讲视频</div>';
          html += '</div>';
          html += '<div class="video-grid">';
          cards.forEach(function (card, i) {
            var seq = i + 1;
            html += renderSubjectVideoCard(card, seq);
          });
          var kw = subjectMeta.name + ' 注册电气工程师基础考试';
          var subjectSearch = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(kw);
          html += renderSubjectSearchCard(subjectMeta, subjectSearch);
          html += '</div>';
          html += '</div>';
        }
      }

      container.innerHTML = html;
      var dirLabelEl = document.getElementById('current-direction-label');
      if (dirLabelEl) dirLabelEl.textContent = dirLabel;
      bindMarkButtons(container);
      applyMarkedCardStyle(container);
      bindCategoryTabs(container);
      bindSubjectTabs(container);
    }

    function bindCategoryTabs(scope) {
      if (!scope) scope = document;
      scope.querySelectorAll('.category-tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var newCat = btn.dataset.category;
          if (newCat === activeCategory) return;
          activeCategory = newCat;
          // 重置学科为该大类下首个有卡片的学科
          var dirKey = getDirectionKey();
          var cat = COURSE_CATEGORIES.find(function (c) { return c.key === activeCategory; });
          var subs = cat ? getCategorySubjects(cat, dirKey) : [];
          activeSubject = null;
          for (var k = 0; k < subs.length; k++) {
            if (countCards(activeCategory, subs[k].key, dirKey) > 0) { activeSubject = subs[k].key; break; }
          }
          render();
          scrollToTabsEl('.category-tabs');
        });
      });
    }

    function bindSubjectTabs(scope) {
      if (!scope) scope = document;
      scope.querySelectorAll('.subject-tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeSubject = btn.dataset.subject;
          render();
          scrollToTabsEl('.subject-tabs');
        });
      });
    }

    function scrollToTabsEl(selector) {
      if (!window.scrollTo) return;
      var el = document.querySelector(selector);
      if (el) {
        var rect = el.getBoundingClientRect();
        window.scrollTo({ top: window.pageYOffset + rect.top - 80, behavior: 'smooth' });
      }
    }

    render();
    document.addEventListener('directionChanged', function () { activeCategory = null; activeSubject = null; render(); });
    document.addEventListener('authChanged', render);
  }

  // 构建视频唯一key (BV号 + 分p)，确保不同分p能独立标记
  function buildVideoKey(bv, page) {
    return String(bv || '') + '@p' + String(page || 1);
  }

  // 渲染学科视频卡片(直接从card:{title,page,bv,teacher,desc}生成)
  function renderSubjectVideoCard(card, seq) {
    var bv = card.bv;
    var page = card.page || 1;
    var vkey = buildVideoKey(bv, page);
    var marked = isLoggedIn() && window.EEProgress.isVideoMarked(vkey);
    return '<div class="video-card' + (marked ? ' marked' : '') + '">' +
      '<div class="video-embed-wrapper">' +
      '<iframe src="' + getBiliEmbedUrl(bv, page) + '" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>' +
      '</div>' +
      '<div class="video-card-body">' +
      '<div class="video-card-seq">#<strong>' + (seq || 1) + '</strong></div>' +
      '<h4>' + escapeHtml(card.title) + '</h4>' +
      '<p>' +
      (card.teacher ? ('<span class="badge badge-teacher"><i class="fas fa-user-tie"></i>' + escapeHtml(card.teacher) + '</span> ') : '') +
      (card.desc ? escapeHtml(card.desc) : '') +
      '</p>' +
      '<div class="video-card-footer">' +
      '<a href="' + getBiliVideoUrl(bv, page) + '" target="_blank" rel="noopener" class="btn btn-bili"><i class="fab fa-bilibili"></i> B站观看 P' + page + '</a>' +
      buildMarkButton('video', vkey, marked) +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // 学科级搜索卡片
  function renderSubjectSearchCard(subjectMeta, searchUrl) {
    return '<div class="video-card">' +
      '<div class="video-embed-wrapper video-placeholder" style="background: linear-gradient(135deg, #2980b9, #8e44ad);">' +
      '<i class="fas fa-search"></i>' +
      '<span>搜索更多 · ' + subjectMeta.name + '</span>' +
      '</div>' +
      '<div class="video-card-body">' +
      '<h4><i class="' + subjectMeta.icon + '"></i> B站查找更多「' + subjectMeta.name + '」视频</h4>' +
      '<p>当前已整合来自姜小白/工控圈/大熊/电教中心/真题5大系列的相关讲次,点击下方按钮在B站继续搜索最新相关视频。</p>' +
      '<div class="video-card-footer">' +
      '<a href="' + searchUrl + '" target="_blank" rel="noopener" class="btn btn-bili"><i class="fab fa-bilibili"></i> B站搜索</a>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // 兼容保留:renderVideoCard/resolveVideoRef/playlist系列,防止其他地方调用报错
  function resolveVideoRef(ep, course) {
    var bv = ep.bv || (course ? course.bvid : '');
    var page = ep.page || 1;
    return { bv: bv, page: page, key: buildVideoKey(bv, page) };
  }
  function renderVideoCard(ep, course) {
    return renderSubjectVideoCard({
      title: ep.title,
      page: resolveVideoRef(ep, course).page,
      bv: resolveVideoRef(ep, course).bv,
      teacher: (course && course.teacher ? course.teacher : ''),
      desc: ep.desc || ''
    }, 1);
  }
  function renderPlaylist() { return ''; }
  function bindPlaylistToggles() { }
  function bindPlaylistItems() { }
  function renderSearchCard(course) {
    var extraBtns = '';
    if (course.extraSearchUrls && course.extraSearchUrls.length > 0) {
      extraBtns = '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">' +
        course.extraSearchUrls.map(function (ex) {
          return '<a href="' + ex.url + '" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:12px;padding:4px 10px;"><i class="fas fa-search"></i> ' + escapeHtml(ex.label) + '</a>';
        }).join('') + '</div>';
    }
    return '<div class="video-card"><div class="video-embed-wrapper video-placeholder"><i class="fas fa-search"></i><span>在B站查找更多视频</span></div>' +
      '<div class="video-card-body"><h4>查找更多「' + course.title + '」视频</h4>' +
      '<p>点击下方按钮在B站搜索相关课程视频。</p>' + extraBtns +
      '<div class="video-card-footer"><a href="' + course.searchUrl + '" target="_blank" rel="noopener" class="btn btn-bili"><i class="fab fa-bilibili"></i> 在B站查找</a></div>' +
      '</div></div>';
  }

  // ===== 笔记页面(登录后可编辑) =====
  function initNotesPage() {
    const container = document.getElementById('notes-content');
    if (!container) return;

    // 默认示例笔记(所有人可见)
    var sampleNotes = [
      { title: '电路基本分析方法总结', tags: ['电路', '公共基础', '专业基础'], date: '2025-12-15', author: '平台', views: 1280, content: '节点电压法、网孔电流法、叠加定理、戴维南定理与诺顿定理是电路分析的五大基本方法。节点电压法适合节点少支路多的电路;网孔电流法适合网孔少的平面电路。戴维南定理用于求某支路电流时非常方便,等效电阻的求法要注意独立源置零(电压源短路,电流源开局)。' },
      { title: '高等数学极限计算技巧', tags: ['高等数学', '公共基础'], date: '2025-12-05', author: '平台', views: 1680, content: '极限计算三板斧:1.先直接代入,能定值则定值;2.若是0/0或∞/∞未定式,用洛必达法则;3.配合等价无穷小替换简化计算。常用等价无穷小(x→0):sinx~x, tanx~x, ln(1+x)~x, ex-1~x, 1-cosx~x²/2。' }
    ];

    function render() {
      var html = '';

      if (isLoggedIn()) {
        // 已登录:显示笔记编辑表单 + 用户笔记 + 示例笔记
        html += '<div class="note-form">' +
          '<h3><i class="fas fa-plus-circle"></i> 添加新笔记</h3>' +
          '<input type="text" id="note-title-input" placeholder="笔记标题" maxlength="50">' +
          '<textarea id="note-content-input" placeholder="在这里输入笔记内容..."></textarea>' +
          '<div class="form-actions">' +
          '<button class="btn btn-primary" id="note-save-btn"><i class="fas fa-save"></i> 保存笔记</button>' +
          '<button class="btn btn-outline" id="note-clear-btn">清空</button>' +
          '</div>' +
          '</div>';

        html += '<h2 class="knowledge-section-title" style="margin-bottom:16px;"><i class="fas fa-user-edit"></i> 我的笔记</h2>';
        var userNotes = window.EEProgress.getNotes();
        if (userNotes.length === 0) {
          html += '<div class="empty-state"><i class="fas fa-pencil-alt"></i><p>你还没有笔记,使用上方表单添加第一篇笔记吧!</p></div>';
        } else {
          userNotes.forEach(function (n) {
            html += '<div class="note-card">' +
              '<div class="note-card-header">' +
              '<h4>' + escapeHtml(n.title) + '</h4>' +
              '<div class="note-actions">' +
              '<button class="btn-edit" data-id="' + n.id + '"><i class="fas fa-edit"></i> 编辑</button>' +
              '<button class="btn-delete" data-id="' + n.id + '"><i class="fas fa-trash"></i> 删除</button>' +
              '</div>' +
              '</div>' +
              '<div class="note-meta"><span><i class="far fa-calendar"></i>' + n.date + '</span></div>' +
              '<div class="note-content" style="margin-top:10px;white-space:pre-wrap;">' + escapeHtml(n.content) + '</div>' +
              '</div>';
          });
        }

        html += '<h2 class="knowledge-section-title" style="margin:32px 0 16px;"><i class="fas fa-book"></i> 平台精选笔记(参考)</h2>';
        sampleNotes.forEach(function (n) {
          html += renderSampleNote(n);
        });
      } else {
        // 未登录:只显示示例笔记 + 登录提示
        html += '<div class="login-prompt">' +
          '<i class="fas fa-user-lock"></i>' +
          '<h3>登录后创建个人笔记</h3>' +
          '<p>登录/注册账号后,可添加、编辑、删除个人专属学习笔记,笔记数据保存在你的账户下。</p>' +
          '<button class="btn btn-primary" id="notes-login-btn"><i class="fas fa-sign-in-alt"></i> 登录 / 注册</button>' +
          '</div>';

        html += '<h2 class="knowledge-section-title" style="margin:24px 0 16px;"><i class="fas fa-book"></i> 平台精选笔记(参考)</h2>';
        sampleNotes.forEach(function (n) {
          html += renderSampleNote(n);
        });
      }

      container.innerHTML = html;
      bindNotesEvents();
    }

    function renderSampleNote(n) {
      return '<div class="note-card">' +
        '<div class="note-card-header">' +
        '<h4>' + n.title + '</h4>' +
        '<div class="note-meta">' +
        '<span><i class="far fa-calendar"></i>' + n.date + '</span>' +
        '<span><i class="far fa-user"></i>' + n.author + '</span>' +
        '<span><i class="far fa-eye"></i>' + n.views + '</span>' +
        '</div>' +
        '</div>' +
        '<div style="margin-bottom:10px;">' +
        n.tags.map(function (t) { return '<span class="note-tag">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="note-content">' + n.content + '</div>' +
        '</div>';
    }

    function bindNotesEvents() {
      var loginBtn = document.getElementById('notes-login-btn');
      if (loginBtn) loginBtn.addEventListener('click', function () { window.EEAuth.openAuthModal(); });

      var saveBtn = document.getElementById('note-save-btn');
      if (saveBtn) saveBtn.addEventListener('click', function () {
        var title = document.getElementById('note-title-input').value.trim();
        var content = document.getElementById('note-content-input').value.trim();
        if (!title || !content) { alert('请填写标题和内容'); return; }
        window.EEProgress.addNote(title, content);
        document.dispatchEvent(new CustomEvent('progressChanged'));
        render();
      });

      var clearBtn = document.getElementById('note-clear-btn');
      if (clearBtn) clearBtn.addEventListener('click', function () {
        document.getElementById('note-title-input').value = '';
        document.getElementById('note-content-input').value = '';
      });

      container.querySelectorAll('.btn-edit').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.dataset.id;
          var notes = window.EEProgress.getNotes();
          var note = notes.find(function (n) { return n.id === id; });
          if (!note) return;
          document.getElementById('note-title-input').value = note.title;
          document.getElementById('note-content-input').value = note.content;
          window.EEProgress.deleteNote(id);
          document.dispatchEvent(new CustomEvent('progressChanged'));
          render();
          document.getElementById('note-title-input').scrollIntoView({ behavior: 'smooth' });
        });
      });

      container.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('确认删除该笔记?')) return;
          window.EEProgress.deleteNote(btn.dataset.id);
          document.dispatchEvent(new CustomEvent('progressChanged'));
          render();
        });
      });
    }

    render();
    document.addEventListener('authChanged', render);
  }

  // ===== 学友分享页面 =====
  function initSharePage() {
    const container = document.getElementById('share-content');
    if (!container) return;

    const shares = [
      { title: '一次通关供配电基础考试经验分享', author: '学长-阿强', date: '2025-12-18', direction: '供配电', views: 3200, content: '我是2025年一次通过供配电基础考试的,分享几点经验:1.公共基础一定要扎实,高数和物理占分多,不要放弃;2.专业基础电路和电气工程基础是重中之重;3.真题至少刷3遍;4.考前一个月做模拟卷控制时间。祝大家2026顺利通关!' },
      { title: '发输变电基础考试备考心得', author: '学友-阿梅', date: '2025-12-12', direction: '发输变电', views: 2100, content: '发输变电方向相对供配电考试人数少,但内容同样多。建议:1.电力系统分析(短路、稳定、潮流)是核心;2.标幺值计算是基础中的基础;3.内部过电压和绝缘配合是发输变电特色考点;4.工控圈的视频对理解专业概念很有帮助。' },
      { title: '工作党如何高效备考注电基础', author: '学友-小张', date: '2025-12-08', direction: '通用', views: 4500, content: '作为工作党,时间最宝贵。策略:1.利用碎片时间听姜小白公共基础音频;2.每天保证2小时集中学习;3.周末做套题;4.用艾宾浩斯遗忘曲线安排复习;5.加入学习群互相督促。坚持4-6个月,通关不是梦。' },
      { title: '电路基础薄弱如何补救', author: '学友-阿杰', date: '2025-12-01', direction: '通用', views: 2800, content: '非电专业同学电路基础薄弱不用担心:1.先看大熊老师电路基础第一讲入门;2.重点掌握欧姆定律、KCL、KVL、节点电压法;3.正弦交流电路相量法必须学会;4.三相电路功率计算公式要背熟;5.一阶电路三要素法。' },
      { title: '推荐几个好用的备考资料', author: '学友-老陈', date: '2025-11-25', direction: '通用', views: 3600, content: '推荐:1.官方指定教材(天津大学出版社);2.历年真题集(至少近10年);3.姜小白公共基础精讲班;4.工控圈专业精讲班;5.大熊冲刺课;6.电教中心全18讲;7.考试允许的科学计算器。资料不在多,在于吃透。' },
      { title: '考试当天注意事项', author: '学长-阿强', date: '2025-11-15', direction: '通用', views: 5200, content: '考试当天:1.带好准考证、身份证、计算器、2B铅笔、橡皮、黑色签字笔;2.上午公共基础(8:00-12:00,120题),下午专业基础(14:00-18:00,60题);3.每题平均2分钟,不会的先跳过;4.注意审题反向题。祝好运!' }
    ];

    container.innerHTML = shares.map(function (s) {
      return '<div class="share-card">' +
        '<div class="share-card-header">' +
        '<h4>' + s.title + '</h4>' +
        '<div class="share-meta">' +
        '<span><i class="far fa-user"></i>' + s.author + '</span>' +
        '<span><i class="far fa-calendar"></i>' + s.date + '</span>' +
        '<span class="note-tag">' + s.direction + '</span>' +
        '<span><i class="far fa-eye"></i>' + s.views + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="share-content">' + s.content + '</div>' +
        '</div>';
    }).join('');
  }

  // ===== 给已标记卡片加样式 =====
  function applyMarkedCardStyle(container) {
    if (!container) return;
    container.querySelectorAll('.mark-btn.marked').forEach(function (btn) {
      var card = btn.closest('.subject-card, .point-card, .video-card');
      if (card) card.classList.add('marked');
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  // ===== 高亮当前导航 =====
  function highlightNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path) link.classList.add('active');
    });
  }

  // ===== 初始化 =====
  document.addEventListener('DOMContentLoaded', function () {
    initDirectionSwitcher();
    initMobileNav();
    initHomePage();
    initProgressDashboard();
    initBasicPage();
    initHotPointsPage();
    initVideosPage();
    initNotesPage();
    initSharePage();
    highlightNav();
  });

  window.EEUtils = {
    getDirectionKey: getDirectionKey,
    getDirectionLabel: getDirectionLabel,
    isLoggedIn: isLoggedIn
  };
})();
