// 注册电气工程师基础考试2026 - 视频资源数据
// 视频来源: B站(哔哩哔哩)
// BV号对应B站视频,可通过 https://www.bilibili.com/video/{BV号} 访问

const VIDEOS = {
  // ===== 供配电方向视频 =====
  powerDistribution: {
    // 2025公共基础精讲班 - 姜小白
    jiangxiaobai: {
      title: '2025公共基础精讲班 - 姜小白',
      teacher: '姜小白',
      category: '公共基础',
      description: '系统讲解注册电气工程师公共基础科目,涵盖高等数学、物理、化学等公共基础内容,适合零基础学员入门。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%A7%9C%E5%B0%8F%E7%99%BD%20%E5%85%AC%E5%85%B1%E5%9F%BA%E7%A1%80',
      episodes: [
        { title: '公共基础-高等数学', bv: 'BV1yE411v7Fp', desc: '高等数学基础讲解' },
        { title: '公共基础-计算机基础', bv: 'BV1p54y1171Q', desc: '计算机基础知识精讲' }
      ]
    },
    // 工控圈 - 专业精讲班
    gongkongquan: {
      title: '工控圈 - 专业精讲班(供配电)',
      teacher: '工控圈',
      category: '专业基础',
      description: '工控圈供配电专业精讲班,深入讲解高压电器、输电线路、防雷接地等专业核心知识。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%B7%A5%E6%8E%A7%E5%9C%88%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E4%BE%9B%E9%85%8D%E7%94%B5',
      episodes: [
        { title: '供配电专业精讲-高压电器 第1次', bv: 'BV1To96YvEqD', desc: '高压电器精讲,仟帆教育' },
        { title: '供配电专业精讲-输电线路力学计算', bv: 'BV1FZ7fz8EQW', desc: '输电线路百米弧垂、防震防舞、荷载计算' }
      ]
    },
    // 2025冲刺课公开课 - 大熊
    daxiong: {
      title: '2025冲刺课公开课 - 大熊',
      teacher: '大熊',
      category: '冲刺串讲',
      description: '大熊老师冲刺串讲,聚焦电路基础等高频考点,适合考前最后冲刺复习。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%A4%A7%E7%86%8A%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: [
        { title: '基础考试-电路基础第一讲', bv: 'BV1HX4y1K7NE', desc: '电路基础知识串讲' }
      ]
    },
    // 电教中心 - 全18讲
    dianjiaozhongxin: {
      title: '电教中心 - 全18讲',
      teacher: '电教中心',
      category: '系统精讲',
      description: '电教中心注册电气工程师基础考试系统课程,共18讲,全面覆盖考试大纲。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E7%94%B5%E6%95%99%E4%B8%AD%E5%BF%83%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: []
    },
    // 历年真题讲解
    zhenti: {
      title: '历年真题讲解',
      teacher: '多位讲师',
      category: '真题解析',
      description: '历年注册电气工程师考试真题详细讲解,包含供配电案例真题解析,帮助考生掌握解题技巧。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%8E%86%E5%B9%B4%E7%9C%9F%E9%A2%98%20%E8%AE%B2%E8%A7%A3',
      episodes: [
        { title: '2025年供配电案例(上午)真题讲解', bv: 'BV1vK1vBKERe', desc: '供配电专业案例上午真题详解' }
      ]
    }
  },

  // ===== 发输变电方向视频 =====
  powerTransmission: {
    jiangxiaobai: {
      title: '2025公共基础精讲班 - 姜小白',
      teacher: '姜小白',
      category: '公共基础',
      description: '系统讲解注册电气工程师公共基础科目,涵盖高等数学、物理、化学等公共基础内容。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%A7%9C%E5%B0%8F%E7%99%BD%20%E5%85%AC%E5%85%B1%E5%9F%BA%E7%A1%80',
      episodes: [
        { title: '公共基础-高等数学', bv: 'BV1yE411v7Fp', desc: '高等数学基础讲解' },
        { title: '公共基础-计算机基础', bv: 'BV1p54y1171Q', desc: '计算机基础知识精讲' }
      ]
    },
    gongkongquan: {
      title: '工控圈 - 专业精讲班(发输变电)',
      teacher: '工控圈',
      category: '专业基础',
      description: '工控圈发输变电专业精讲班,重点讲解输电线路、变电站、发电厂等专业知识。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%B7%A5%E6%8E%A7%E5%9C%88%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5',
      episodes: [
        { title: '供配电专业精讲-输电线路力学计算', bv: 'BV1FZ7fz8EQW', desc: '输电线路百米弧垂、防震防舞、荷载计算' }
      ]
    },
    daxiong: {
      title: '2025冲刺课公开课 - 大熊',
      teacher: '大熊',
      category: '冲刺串讲',
      description: '大熊老师冲刺串讲,聚焦电路基础等高频考点,适合考前最后冲刺复习。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%A4%A7%E7%86%8A%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: [
        { title: '基础考试-电路基础第一讲', bv: 'BV1HX4y1K7NE', desc: '电路基础知识串讲' }
      ]
    },
    dianjiaozhongxin: {
      title: '电教中心 - 全18讲',
      teacher: '电教中心',
      category: '系统精讲',
      description: '电教中心注册电气工程师基础考试系统课程,共18讲,全面覆盖考试大纲。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E7%94%B5%E6%95%99%E4%B8%AD%E5%BF%83%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: []
    },
    zhenti: {
      title: '历年真题讲解',
      teacher: '多位讲师',
      category: '真题解析',
      description: '历年注册电气工程师考试真题详细讲解,帮助考生掌握解题技巧。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%8E%86%E5%B9%B4%E7%9C%9F%E9%A2%98%20%E8%AE%B2%E8%A7%A3%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5',
      episodes: [
        { title: '2025年供配电案例(上午)真题讲解', bv: 'BV1vK1vBKERe', desc: '案例真题详解' }
      ]
    }
  }
};

// B站搜索链接生成
function getBiliSearchUrl(keyword) {
  return 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword);
}

// B站视频播放页链接
function getBiliVideoUrl(bv) {
  return 'https://www.bilibili.com/video/' + bv;
}

// B站视频嵌入链接(支持移动端内嵌播放)
function getBiliEmbedUrl(bv, page) {
  page = page || 1;
  return 'https://player.bilibili.com/player.html?bvid=' + bv + '&page=' + page + '&high_quality=1&autoplay=0';
}
