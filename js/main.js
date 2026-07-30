// 注册电气工程师基础考试2026 - 主交互逻辑

(function () {
  'use strict';

  // 方向标识: pd=供配电, pt=发输变电
  let currentDirection = localStorage.getItem('ee-direction') || 'pd';

  // ===== 方向切换功能 =====
  function initDirectionSwitcher() {
    const tabs = document.querySelectorAll('.direction-tab');
    if (!tabs.length) return;

    // 设置初始激活状态
    updateActiveTab();

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const dir = tab.dataset.direction;
        if (dir === currentDirection) return;
        currentDirection = dir;
        localStorage.setItem('ee-direction', dir);
        updateActiveTab();
        // 触发方向变更事件,供页面内容动态更新
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

    toggle.addEventListener('click', function () {
      nav.classList.toggle('show');
    });

    // 点击导航链接后关闭菜单
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('show');
      });
    });
  }

  // ===== 首页板块渲染 =====
  function initHomePage() {
    const container = document.getElementById('home-sections');
    if (!container) return;

    const sections = [
      {
        icon: 'fas fa-book-open',
        title: '基础知识',
        desc: '系统梳理公共基础与专业基础知识体系,涵盖高等数学、电路、电气工程基础等全部考试科目。',
        link: 'basic.html',
        btnText: '查看知识体系'
      },
      {
        icon: 'fas fa-fire',
        title: '高频考点',
        desc: '精选历年高频考点与公式速记,标注考频星级,帮助高效复习,直击考试重点。',
        link: 'hot-points.html',
        btnText: '查看高频考点'
      },
      {
        icon: 'fas fa-video',
        title: '视频直播',
        desc: 'B站视频课程集合:姜小白公共基础精讲、工控圈专业精讲、大熊冲刺课、电教中心全18讲、历年真题讲解。',
        link: 'videos.html',
        btnText: '观看视频'
      },
      {
        icon: 'fas fa-pencil-alt',
        title: '学习笔记',
        desc: '整理各科目学习笔记与知识总结,方便随时查阅复习,巩固薄弱环节。',
        link: 'notes.html',
        btnText: '查看笔记'
      },
      {
        icon: 'fas fa-users',
        title: '学友分享',
        desc: '学友备考经验分享、资料交流、问答互助,共同进步,一起通关。',
        link: 'share.html',
        btnText: '查看分享'
      }
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

      // 公共基础部分
      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="' + common.icon + '"></i>' + common.title + '</h2>';
      html += common.subjects.map(function (subj) {
        return renderSubjectCard(subj);
      }).join('');
      html += '</div>';

      // 专业基础部分
      html += '<div class="knowledge-section">';
      html += '<h2 class="knowledge-section-title"><i class="' + professional.icon + '"></i>' + professional.title + '</h2>';
      html += professional.subjects.map(function (subj) {
        return renderSubjectCard(subj);
      }).join('');
      html += '</div>';

      container.innerHTML = html;
      // 更新方向标识
      const dirLabelEl = document.getElementById('current-direction-label');
      if (dirLabelEl) dirLabelEl.textContent = dirLabel;
    }

    render();
    document.addEventListener('directionChanged', render);
  }

  function renderSubjectCard(subj) {
    return '<div class="subject-card">' +
      '<div class="subject-card-header">' +
      '<h4>' + subj.name + '</h4>' +
      '<span class="subject-weight">' + subj.weight + '</span>' +
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
    }

    render();
    document.addEventListener('directionChanged', render);
  }

  function renderPointCard(pt) {
    return '<div class="point-card">' +
      '<div class="point-card-header">' +
      '<div>' +
      '<div class="point-subject">' + pt.subject + '</div>' +
      '<h4>' + pt.point + '</h4>' +
      '</div>' +
      '<span class="point-frequency">考频 ' + pt.frequency + '</span>' +
      '</div>' +
      '<div class="point-formula">' + pt.formula + '</div>' +
      '<div class="point-tip">' + pt.tip + '</div>' +
      '</div>';
  }

  // ===== 视频页面渲染 =====
  function initVideosPage() {
    const container = document.getElementById('videos-content');
    if (!container || typeof VIDEOS === 'undefined') return;

    function render() {
      const dirKey = getDirectionKey();
      const dirLabel = getDirectionLabel();
      const videos = VIDEOS[dirKey];
      const order = ['jiangxiaobai', 'gongkongquan', 'daxiong', 'dianjiaozhongxin', 'zhenti'];

      let html = '';
      order.forEach(function (key) {
        const course = videos[key];
        if (!course) return;
        html += '<div class="video-category">';
        html += '<h2 class="video-category-title"><i class="fas fa-play-circle"></i>' + course.title + '</h2>';
        html += '<p class="video-category-desc">' + course.description + '</p>';
        html += '<div class="video-grid">';

        if (course.episodes && course.episodes.length > 0) {
          course.episodes.forEach(function (ep) {
            html += renderVideoCard(ep, course);
          });
        }

        // 始终添加一个搜索引导卡片
        html += renderSearchCard(course);

        html += '</div></div>';
      });

      container.innerHTML = html;
      const dirLabelEl = document.getElementById('current-direction-label');
      if (dirLabelEl) dirLabelEl.textContent = dirLabel;
    }

    render();
    document.addEventListener('directionChanged', render);
  }

  function renderVideoCard(ep, course) {
    return '<div class="video-card">' +
      '<div class="video-embed-wrapper">' +
      '<iframe src="' + getBiliEmbedUrl(ep.bv) + '" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>' +
      '</div>' +
      '<div class="video-card-body">' +
      '<h4>' + ep.title + '</h4>' +
      '<p>' + (ep.desc || '') + '</p>' +
      '<div class="video-card-footer">' +
      '<a href="' + getBiliVideoUrl(ep.bv) + '" target="_blank" rel="noopener" class="btn btn-bili"><i class="fab fa-bilibili"></i> B站观看</a>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function renderSearchCard(course) {
    return '<div class="video-card">' +
      '<div class="video-embed-wrapper video-placeholder">' +
      '<i class="fas fa-search"></i>' +
      '<span>在B站查找更多视频</span>' +
      '</div>' +
      '<div class="video-card-body">' +
      '<h4>查找更多「' + course.title + '」视频</h4>' +
      '<p>点击下方按钮在B站搜索相关课程视频,获取最新更新内容。</p>' +
      '<div class="video-card-footer">' +
      '<a href="' + course.searchUrl + '" target="_blank" rel="noopener" class="btn btn-bili"><i class="fab fa-bilibili"></i> 在B站查找</a>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  // ===== 笔记页面 =====
  function initNotesPage() {
    const container = document.getElementById('notes-content');
    if (!container) return;

    const notes = [
      {
        title: '电路基本分析方法总结',
        tags: ['电路', '公共基础', '专业基础'],
        date: '2025-12-15',
        author: '管理员',
        views: 1280,
        content: '节点电压法、网孔电流法、叠加定理、戴维南定理与诺顿定理是电路分析的五大基本方法。节点电压法适合节点少支路多的电路;网孔电流法适合网孔少的平面电路。戴维南定理用于求某支路电流时非常方便,等效电阻的求法要注意独立源置零(电压源短路,电流源开路)。'
      },
      {
        title: '三相短路计算步骤详解',
        tags: ['电气工程基础', '供配电', '发输变电'],
        date: '2025-12-10',
        author: '管理员',
        views: 2150,
        content: '三相短路计算步骤:1.选取基准值Sb和Ub;2.计算各元件标幺值电抗;3.绘制等值电路;4.网络化简求等效总电抗XΣ;5.计算短路电流I″=1/XΣ;6.计算短路容量和冲击电流。注意:变压器变比按平均额定电压比计算,各级电压Ub取平均额定电压(1.05UN)。'
      },
      {
        title: '运放电路速记口诀',
        tags: ['模拟电子', '专业基础'],
        date: '2025-12-05',
        author: '学友-小李',
        views: 890,
        content: '运放线性应用两大法宝:虚短(U+=U-)和虚断(I+=I-=0)。反相比例:Uo=-(Rf/R1)Ui;同相比例:Uo=(1+Rf/R1)Ui;加法器:Uo=-Rf(ΣUi/Ri);积分器:Uo=-(1/RC)∫Ui dt。记住这四个基本电路,考试中的运放题基本都能迎刃而解。'
      },
      {
        title: '高等数学极限计算技巧',
        tags: ['高等数学', '公共基础'],
        date: '2025-11-28',
        author: '管理员',
        views: 1680,
        content: '极限计算三板斧:1.先直接代入,能定值则定值;2.若是0/0或∞/∞未定式,用洛必达法则;3.配合等价无穷小替换简化计算。常用等价无穷小(x→0):sinx~x, tanx~x, arcsinx~x, arctanx~x, ln(1+x)~x, ex-1~x, (1+x)n-1~nx, 1-cosx~x²/2。'
      },
      {
        title: '电力系统稳定性快速判断',
        tags: ['电气工程基础', '发输变电'],
        date: '2025-11-20',
        author: '学友-老王',
        views: 1320,
        content: '静态稳定性看功角特性曲线工作点斜率dP/dδ>0则稳定;静态稳定储备系数Kp≥15%~20%。暂态稳定性用等面积定则:加速面积等于减速面积时为临界状态。减小故障切除时间、强励装置、快速重合闸都能提高暂态稳定性。'
      }
    ];

    container.innerHTML = notes.map(function (n) {
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
    }).join('');
  }

  // ===== 学友分享页面 =====
  function initSharePage() {
    const container = document.getElementById('share-content');
    if (!container) return;

    const shares = [
      {
        title: '一次通关供配电基础考试经验分享',
        author: '学长-阿强',
        date: '2025-12-18',
        direction: '供配电',
        views: 3200,
        content: '我是2025年一次通过供配电基础考试的,分享几点经验:1.公共基础一定要扎实,高数和物理占分多,不要放弃;2.专业基础电路和电气工程基础是重中之重,占了专业基础大部分分值;3.真题至少刷3遍,2015年后的真题价值最高;4.考前一个月做模拟卷,控制时间,考试时间比较紧张。祝大家2026顺利通关!'
      },
      {
        title: '发输变电基础考试备考心得',
        author: '学友-阿梅',
        date: '2025-12-12',
        direction: '发输变电',
        views: 2100,
        content: '发输变电方向相对供配电考试人数少一些,但内容同样多。建议:1.电力系统分析(短路、稳定、潮流)是核心,一定要理解透彻;2.标幺值计算是基础中的基础,要熟练;3.内部过电压和绝缘配合是发输变电特色考点;4.工控圈的视频对理解专业概念很有帮助;5.大熊老师的冲刺课适合最后阶段快速过一遍知识点。'
      },
      {
        title: '工作党如何高效备考注电基础',
        author: '学友-小张',
        date: '2025-12-08',
        direction: '通用',
        views: 4500,
        content: '作为工作党,时间是最宝贵的。我的策略:1.利用碎片时间,通勤路上听姜小白的公共基础音频;2.每天保证2小时集中学习时间;3.周末大块时间做套题;4.用艾宾浩斯遗忘曲线安排复习;5.加入学习群互相督促;6.最后一个月冲刺,回归真题和错题。坚持4-6个月,每天不间断,通关不是梦。'
      },
      {
        title: '电路基础薄弱如何补救',
        author: '学友-阿杰',
        date: '2025-12-01',
        direction: '通用',
        views: 2800,
        content: '很多非电专业的同学电路基础薄弱,不用担心:1.先看大熊老师的电路基础第一讲入门;2.重点掌握欧姆定律、KCL、KVL、节点电压法;3.正弦交流电路的相量法必须学会,考试必考;4.三相电路功率计算公式要背熟;5.一阶电路的RC/RL暂态分析,三要素法一定要掌握。电路这部分学好了,专业基础的其他科目也会轻松很多。'
      },
      {
        title: '推荐几个好用的备考资料',
        author: '学友-老陈',
        date: '2025-11-25',
        direction: '通用',
        views: 3600,
        content: '推荐备考资料:1.官方指定教材(天津大学出版社);2.历年真题集(至少近10年);3.姜小白公共基础精讲班视频;4.工控圈专业精讲班视频;5.大熊冲刺课(考前突击);6.电教中心全18讲(系统学习);7.一个科学计算器(考试允许的型号)。资料不在多,在于吃透。'
      },
      {
        title: '考试当天注意事项',
        author: '学长-阿强',
        date: '2025-11-15',
        direction: '通用',
        views: 5200,
        content: '考试当天:1.带好准考证、身份证、计算器、2B铅笔、橡皮、黑色签字笔;2.上午考公共基础(8:00-12:00,120题),下午考专业基础(14:00-18:00,60题);3.时间分配:每题平均2分钟,不会的先跳过;4.答题卡填涂要规范;5.注意审题,特别是"不正确的是"这种反向题;6.最后15分钟检查答题卡填涂是否完整。祝大家好运!'
      }
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

  // ===== 高亮当前导航 =====
  function highlightNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });
  }

  // ===== 初始化 =====
  document.addEventListener('DOMContentLoaded', function () {
    initDirectionSwitcher();
    initMobileNav();
    initHomePage();
    initBasicPage();
    initHotPointsPage();
    initVideosPage();
    initNotesPage();
    initSharePage();
    highlightNav();
  });

  // 暴露全局工具函数
  window.EEUtils = {
    getDirectionKey: getDirectionKey,
    getDirectionLabel: getDirectionLabel
  };
})();
