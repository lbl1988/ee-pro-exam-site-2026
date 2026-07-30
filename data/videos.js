// 注册电气工程师基础考试2026 - 视频资源数据
// 数据来源:桌面《注册电气工程师基础考试2025培训视频_播放链接.txt》
// BV号对应B站视频,可通过 https://www.bilibili.com/video/{BV号}?p={page} 访问

const VIDEOS = {

  // ========== 供配电方向 ==========
  powerDistribution: {

    // 2025公共基础精讲班 - 姜小白 (BV1BaJFzFERX, 52讲)
    jiangxiaobai: {
      title: '2025公共基础精讲班 - 姜小白',
      teacher: '姜小白',
      category: '公共基础',
      bvid: 'BV1BaJFzFERX',
      description: '系统讲解注册电气工程师公共基础科目,共52讲,覆盖高等数学/物理/化学/工程经济/信号/电磁场/电路/电机/模电/数电/理论力学,适合零基础系统学习。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%A7%9C%E5%B0%8F%E7%99%BD%20%E5%85%AC%E5%85%B1%E5%9F%BA%E7%A1%80',
      // 精选代表视频(12讲,各科首讲)
      episodes: [
        { title: '数学1-空间解析几何(一)', page: 1, desc: '高等数学开篇,空间向量与几何' },
        { title: '数学10-微分方程', page: 10, desc: '常微分方程求解' },
        { title: '物理1-热力学(一)', page: 19, desc: '普通物理·热力学基础' },
        { title: '化学1-原子和分子结构(一)', page: 24, desc: '普通化学·物质结构' },
        { title: '工程经济1-资金等值、财务评价', page: 31, desc: '工程经济·资金时间价值' },
        { title: '信号1-信号的概念、分类', page: 34, desc: '信号与信息基础' },
        { title: '电工1-电磁场', page: 37, desc: '电磁场基础·静电场/恒定场' },
        { title: '电工2-电路基础(一)', page: 38, desc: '电路·KCL/KVL/基本定律' },
        { title: '电工6-电动机与变压器', page: 42, desc: '电机·变压器/异步/同步/直流' },
        { title: '电工7-模拟电子技术(一)', page: 43, desc: '模电·二极管/三极管/运放' },
        { title: '电工10-数字电子技术(一)', page: 46, desc: '数电·门电路/逻辑化简' },
        { title: '理论力学1-静力学(上)', page: 48, desc: '理论力学·静力学平衡' }
      ],
      // 完整播放列表 (52讲 对应txt v001-v052)
      playlist: [
        { t: '数学1-空间解析几何(一)', p: 1 }, { t: '数学2-空间解析几何(二)', p: 2 },
        { t: '数学3-函数极限连续(一)', p: 3 }, { t: '数学4-函数极限连续(二)', p: 4 },
        { t: '数学5-导数与微分(一)', p: 5 }, { t: '数学6-导数与微分(二)', p: 6 },
        { t: '数学7-积分学(一)', p: 7 }, { t: '数学8-积分学(二)', p: 8 },
        { t: '数学9-积分学(三)', p: 9 }, { t: '数学10-微分方程', p: 10 },
        { t: '数学11-无穷级数(一)', p: 11 }, { t: '数学12-无穷级数(二)', p: 12 },
        { t: '数学13-线性代数(一)', p: 13 }, { t: '数学14-线性代数(二)', p: 14 },
        { t: '数学15-线性代数(三)', p: 15 }, { t: '数学16-概率统计(一)', p: 16 },
        { t: '数学17-概率统计(二)', p: 17 }, { t: '数学18-概率统计(三)', p: 18 },
        { t: '物理1-热力学(一)', p: 19 }, { t: '物理2-热力学(二)', p: 20 },
        { t: '物理3-波动学', p: 21 }, { t: '物理4-光学(一)', p: 22 },
        { t: '物理5-光学(二)', p: 23 },
        { t: '化学1-原子分子结构(一)', p: 24 }, { t: '化学2-原子分子结构(二)', p: 25 },
        { t: '化学2-原子分子结构(二)续', p: 26 }, { t: '化学3-化学反应速率', p: 27 },
        { t: '化学4-溶液', p: 28 }, { t: '化学5-氧化还原反应', p: 29 },
        { t: '化学6-有机化学', p: 30 },
        { t: '工程经济1-资金等值财务评价', p: 31 }, { t: '工程经济2-方案比选', p: 32 },
        { t: '工程经济3-不确定性分析', p: 33 },
        { t: '信号1-信号概念分类', p: 34 }, { t: '信号2-模拟信号与信息', p: 35 },
        { t: '信号3-数字信号与信息', p: 36 },
        { t: '电工1-电磁场', p: 37 },
        { t: '电工2-电路基础(一)', p: 38 }, { t: '电工3-电路基础(二)', p: 39 },
        { t: '电工4-电路基础(三)', p: 40 }, { t: '电工5-电路基础(四)', p: 41 },
        { t: '电工6-电动机与变压器', p: 42 },
        { t: '电工7-模拟电子技术(一)', p: 43 }, { t: '电工8-模拟电子技术(二)', p: 44 },
        { t: '电工9-模拟电子技术(三)', p: 45 },
        { t: '电工10-数字电子技术(一)', p: 46 }, { t: '电工11-数字电子技术(二)', p: 47 },
        { t: '理论力学1-静力学(上)', p: 48 }, { t: '理论力学2-静力学(下)', p: 49 },
        { t: '理论力学3-运动学', p: 50 }, { t: '理论力学4-动力学(上)', p: 51 },
        { t: '理论力学5-动力学(中)', p: 52 }
      ]
    },

    // 工控圈专业基础精讲 - 供配电 (BV1ie41127kX, 200+讲)
    gongkongquan: {
      title: '工控圈 - 专业精讲班(供配电方向)',
      teacher: '工控圈',
      category: '专业基础',
      bvid: 'BV1ie41127kX',
      description: '工控圈供配电专业基础精讲,覆盖电路/电磁场/模电/数电/电机/电气工程基础(电力系统、短路电流、负荷计算、继电保护、低压电器、安全、防雷接地、照明、布线、直流、智能化等)200+讲。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%B7%A5%E6%8E%A7%E5%9C%88%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E4%BE%9B%E9%85%8D%E7%94%B5',
      episodes: [
        { title: '01电路1-基本概念和定律(一)', page: 1, desc: '电路·欧姆定律/参考方向' },
        { title: '05电路5-正弦电流电路(一)', page: 5, desc: '电路·相量法/阻抗' },
        { title: '11电磁场1-静电场与高斯定律', page: 11, desc: '电磁场·静电场基础' },
        { title: '16模电1-半导体与二极管稳压管', page: 16, desc: '模电·二极管/三极管' },
        { title: '23数电1-数字电路基础、门电路', page: 23, desc: '数电·门电路/逻辑化简' },
        { title: '30电气1-变压器1', page: 30, desc: '电机·变压器原理与参数' },
        { title: '38电气6-电力系统基本知识及线路参数', page: 38, desc: '电气·电力系统/线路参数' },
        { title: '39电气7-简单电网的潮流计算', page: 39, desc: '电气·潮流计算' },
        { title: '50短路电流1', page: 50, desc: '电气·三相短路计算' },
        { title: '54负荷计算01', page: 54, desc: '供配电·负荷计算' },
        { title: '75防雷过电压答疑', page: 75, desc: '供配电·防雷过电压' },
        { title: '85接地答疑', page: 85, desc: '供配电·接地电阻计算' }
      ],
      // 精选完整播放列表(95讲核心章节)
      playlist: [
        { t: '电路1-基本概念和定律(一)', p: 1 }, { t: '电路2-基本概念和定律(二)', p: 2 },
        { t: '电路3-电路的分析方法(一)', p: 3 }, { t: '电路4-电路的分析方法(二)', p: 4 },
        { t: '电路5-正弦电流电路(一)', p: 5 }, { t: '电路6-正弦电流电路(二)', p: 6 },
        { t: '电路7-非正弦周期电路', p: 7 }, { t: '电路8-动态电路时域(一)', p: 8 },
        { t: '电路9-动态电路时域(二)', p: 9 }, { t: '电路10-考试方法技巧总结', p: 10 },
        { t: '电磁场1-静电场与高斯定律', p: 11 }, { t: '电磁场2-恒定电场类比法', p: 12 },
        { t: '电磁场3-恒定磁场与传输线', p: 13 }, { t: '电磁场4-镜像法与电轴法', p: 14 },
        { t: '电磁场5-无损耗传输线状态方程', p: 15 },
        { t: '模电1-半导体二极管稳压管', p: 16 }, { t: '模电2-三极管基本原理', p: 17 },
        { t: '模电3-负反馈与集成运放', p: 18 }, { t: '模电4-运放与波形发生器', p: 19 },
        { t: '模电5-三极管静态动态分析', p: 20 }, { t: '模电6-差动放大器原理', p: 21 },
        { t: '模电7-整流电路变化方式', p: 22 },
        { t: '数电1-数字电路基础门电路', p: 23 }, { t: '数电2-逻辑化简', p: 24 },
        { t: '数电3-组合逻辑电路', p: 25 }, { t: '数电4-触发器时序逻辑', p: 26 },
        { t: '数电5-脉冲波形电路', p: 27 }, { t: '数电6-数模模数转换', p: 28 },
        { t: '数电7-数字电路应试技巧', p: 29 },
        { t: '电气1-变压器1', p: 30 }, { t: '电气2-变压器2', p: 31 },
        { t: '电气3-感应电机', p: 32 }, { t: '电气4-同步电机', p: 33 },
        { t: '电气5-直流电机', p: 34 }, { t: '电机学补充1', p: 35 },
        { t: '电机学补充2', p: 36 }, { t: '电机学补充3', p: 37 },
        { t: '电气6-电力系统基本知识及线路参数', p: 38 }, { t: '电气7-简单电网潮流计算', p: 39 },
        { t: '电气8-电压平衡', p: 40 },
        { t: '安全1', p: 41 }, { t: '安全2', p: 42 }, { t: '安全3', p: 43 },
        { t: '安全4', p: 44 }, { t: '安全5', p: 45 },
        { t: '低压电器1', p: 46 }, { t: '低压电器2', p: 47 },
        { t: '低压电器3', p: 48 }, { t: '低压电器4', p: 49 },
        { t: '短路电流1', p: 50 }, { t: '短路电流2', p: 51 },
        { t: '短路电流3', p: 52 }, { t: '短路电流4', p: 53 },
        { t: '负荷计算1', p: 54 }, { t: '负荷计算2', p: 55 },
        { t: '负荷计算3', p: 56 }, { t: '负荷计算4', p: 57 },
        { t: '照明1', p: 58 }, { t: '照明2', p: 59 }, { t: '照明3', p: 60 },
        { t: '综合布线1', p: 61 }, { t: '综合布线2', p: 62 },
        { t: '安全答疑', p: 63 }, { t: '传动答疑', p: 65 },
        { t: '导体电缆答疑', p: 67 }, { t: '低压电器答疑', p: 69 },
        { t: '电气布置答疑', p: 71 }, { t: '短路电流计算答疑', p: 73 },
        { t: '防雷过电压答疑', p: 75 }, { t: '负荷计算答疑', p: 77 },
        { t: '高压电器答疑', p: 79 }, { t: '供配电系统答疑', p: 81 },
        { t: '继电保护答疑', p: 83 }, { t: '接地答疑', p: 85 },
        { t: '节能答疑', p: 87 }, { t: '线路答疑', p: 89 },
        { t: '照明答疑', p: 91 }, { t: '直流系统真题', p: 93 },
        { t: '智能化答疑', p: 94 }, { t: '智能化真题', p: 95 }
      ]
    },

    // 2025冲刺课公开课 - 大熊 (BV1PmsPzPEgJ, 6讲)
    daxiong: {
      title: '2025冲刺课公开课 - 大熊',
      teacher: '大熊',
      category: '冲刺串讲',
      bvid: 'BV1PmsPzPEgJ',
      description: '大熊老师专业基础考试冲刺系列公开课,共6讲,适合考前最后阶段快速过一遍专业基础核心考点与答题技巧。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%A4%A7%E7%86%8A%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%86%B2%E5%88%BA',
      episodes: [
        { title: '25年基础冲刺1 (2025-10-18)', page: 1, desc: '冲刺课第一讲·开篇总览' },
        { title: '25年基础冲刺2 (2025-10-19)', page: 2, desc: '冲刺课第二讲·核心考点' },
        { title: '25年基础冲刺3 (2025-10-20)', page: 3, desc: '冲刺课第三讲·专项突破' },
        { title: '25年基础冲刺4 (2025-10-22)', page: 4, desc: '冲刺课第四讲·答题技巧' },
        { title: '25年基础冲刺5 (2025-10-23)', page: 5, desc: '冲刺课第五讲·押题讲解' },
        { title: '25年基础冲刺6 (2025-10-27)', page: 6, desc: '冲刺课第六讲·考前总结' }
      ],
      playlist: [
        { t: '基础冲刺1 (2025-10-18)', p: 1 }, { t: '基础冲刺2 (2025-10-19)', p: 2 },
        { t: '基础冲刺3 (2025-10-20)', p: 3 }, { t: '基础冲刺4 (2025-10-22)', p: 4 },
        { t: '基础冲刺5 (2025-10-23)', p: 5 }, { t: '基础冲刺6 (2025-10-27)', p: 6 }
      ]
    },

    // 电教中心 - 全18讲 (BV1FE411W75f, 19讲)
    dianjiaozhongxin: {
      title: '电教中心 - 全18讲',
      teacher: '电教中心各科名师',
      category: '系统精讲',
      bvid: 'BV1FE411W75f',
      description: '电教中心注册电气工程师基础考试系统课程,全18讲,完整覆盖考试大纲全部章节。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E7%94%B5%E6%95%99%E4%B8%AD%E5%BF%83%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: [
        { title: '考试介绍+第01讲:高等数学', page: 1, desc: '课程导览 + 高等数学(第一章)' },
        { title: '第02讲:线性代数', page: 3, desc: '线性代数考点精讲' },
        { title: '第04讲:物理学', page: 5, desc: '物理·热学/波动/光学' },
        { title: '第09讲:电工电子技术', page: 10, desc: '电工电子综合复习' },
        { title: '第14讲:模拟电子技术', page: 14, desc: '模电·二极管/三极管/运放' },
        { title: '第18讲:电气工程基础', page: 19, desc: '电气工程基础总览' }
      ],
      playlist: [
        { t: '考试介绍', p: 1 }, { t: '第01讲-高等数学', p: 2 }, { t: '第02讲-线性代数', p: 3 },
        { t: '第03讲-概率统计', p: 4 }, { t: '第04讲-物理', p: 5 }, { t: '第05讲-化学', p: 6 },
        { t: '第06讲-理论力学(4.1)', p: 7 }, { t: '第07讲-材料力学(4.2)', p: 8 },
        { t: '第08讲-流体力学(4.3)', p: 9 }, { t: '第09讲-电工电子技术', p: 10 },
        { t: '第10讲-信号与信息基础', p: 11 }, { t: '第11讲-计算机应用基础', p: 12 },
        { t: '第12讲-工程经济', p: 13 }, { t: '第13讲-模拟电子技术', p: 14 },
        { t: '第14讲-数字电子技术', p: 15 }, { t: '第15讲-电路(11.1)', p: 16 },
        { t: '第16讲-电磁场(11.2)', p: 17 }, { t: '第17讲-电机与变压器', p: 18 },
        { t: '第18讲-电气工程基础', p: 19 }
      ]
    },

    // 历年真题讲解 (3个BV号组合:公共基础BV1Ks + 供配电专业BV1Ck + 发输电专业BV1uu)
    zhenti: {
      title: '历年真题讲解(2025)',
      teacher: '名师团队',
      category: '真题解析',
      bvid: 'BV1Ks15BaEuG', // 默认BV号(公共基础), 各episodes可覆盖
      description: '2025年注册电气工程师基础考试真题一题一视频对答案解析版:公共基础(BV1Ks15BaEuG,55讲) + 供配电专业基础(BV1Ck1FBXEBd,60讲) + 发输变电专业基础(BV1uuyfBtEig)。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%202025%20%E7%9C%9F%E9%A2%98%20%E4%B8%80%E9%A2%98%E4%B8%80%E8%A7%86%E9%A2%91',
      episodes: [
        { title: '2025公共基础真题·答案总览', page: 1, bv: 'BV1Ks15BaEuG', desc: '公共基础(上午120题)真题答案总览' },
        { title: '2025公共基础真题·2025001题', page: 2, bv: 'BV1Ks15BaEuG', desc: '真题一题一视频' },
        { title: '2025公共基础真题·2025009-010', page: 10, bv: 'BV1Ks15BaEuG', desc: '公共基础真题逐题讲' },
        { title: '2025公共基础真题·2025079', page: 28, bv: 'BV1Ks15BaEuG', desc: '公共基础真题逐题讲' },
        { title: '2025公共基础真题·2025115-120', page: 55, bv: 'BV1Ks15BaEuG', desc: '公共基础真题最后6题' },
        { title: '2025供配电专业基础真题·供2025001', page: 1, bv: 'BV1Ck1FBXEBd', desc: '供配电专业基础(下午60题)真题第1题' },
        { title: '2025供配电专业基础真题·供2025010', page: 10, bv: 'BV1Ck1FBXEBd', desc: '供配电专业真题逐题讲解' },
        { title: '2025供配电专业基础真题·变压器题', page: 38, bv: 'BV1Ck1FBXEBd', desc: '供配电变压器专项真题' },
        { title: '2025供配电专业基础真题·供2025060', page: 60, bv: 'BV1Ck1FBXEBd', desc: '供配电专业最后一题' }
      ],
      // 统一playlist格式:数组每项{t,p,bv?} bv可选,默认取course.bvid
      playlist: [
        // 公共基础真题 (BV1Ks15BaEuG)
        { t: '公共真题·答案总览', p: 1, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025001', p: 2, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025002', p: 3, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025003', p: 4, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025004', p: 5, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025005', p: 6, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025006', p: 7, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025007', p: 8, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025008', p: 9, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025009', p: 10, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025010', p: 11, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025011', p: 12, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025012', p: 13, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025013', p: 14, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025014', p: 15, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025015', p: 16, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025016', p: 17, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025017', p: 18, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025018', p: 19, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025019', p: 20, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025020', p: 21, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025021', p: 22, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025022', p: 23, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025023', p: 24, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025024', p: 25, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025025-036合集', p: 26, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025079', p: 28, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025080', p: 29, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025081', p: 30, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025082', p: 31, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025083', p: 32, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025084', p: 33, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025085', p: 34, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025086', p: 35, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025087', p: 36, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025088', p: 37, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025089', p: 38, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025090', p: 39, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025091', p: 40, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025092', p: 41, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025093', p: 42, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025094', p: 43, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025095', p: 44, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025096', p: 45, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025096-106合集', p: 46, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025107', p: 47, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025108', p: 48, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025109', p: 49, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025110', p: 50, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025111', p: 51, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025112', p: 52, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025113', p: 53, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025114', p: 54, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025115-120合集', p: 55, bv: 'BV1Ks15BaEuG' },
        // 供配电专业基础真题 (BV1Ck1FBXEBd, 60讲)
        { t: '供配电真题 2025001', p: 1, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025002', p: 2, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025003', p: 3, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025004', p: 4, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025005', p: 5, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025006', p: 6, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025007', p: 7, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025008', p: 8, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025009', p: 9, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025010', p: 10, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025011', p: 11, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025012', p: 12, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025013', p: 13, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025014', p: 14, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025015', p: 15, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025016', p: 16, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025017', p: 17, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025018', p: 18, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025019', p: 19, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025020', p: 20, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025021', p: 21, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025022', p: 22, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025023', p: 23, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025024', p: 24, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025025', p: 25, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025026', p: 26, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025027', p: 27, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025028', p: 28, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025029', p: 29, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025030', p: 30, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025031', p: 31, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025032', p: 32, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025033', p: 33, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025034', p: 34, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025035', p: 35, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025036', p: 36, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025037', p: 37, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025038变压器', p: 38, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025039', p: 39, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025040', p: 40, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025041', p: 41, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025042', p: 42, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025043', p: 43, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025044', p: 44, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025045', p: 45, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025046', p: 46, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025047', p: 47, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025048', p: 48, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025049', p: 49, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025050', p: 50, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025051', p: 51, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025052', p: 52, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025053', p: 53, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025054', p: 54, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025055', p: 55, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025056', p: 56, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025057', p: 57, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025058', p: 58, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025059', p: 59, bv: 'BV1Ck1FBXEBd' },
        { t: '供配电真题 2025060', p: 60, bv: 'BV1Ck1FBXEBd' }
      ]
    }
  },

  // ========== 发输变电方向 ==========
  powerTransmission: {

    jiangxiaobai: {
      title: '2025公共基础精讲班 - 姜小白',
      teacher: '姜小白',
      category: '公共基础',
      bvid: 'BV1BaJFzFERX',
      description: '发输变电方向与供配电方向上午卷相同,系统讲解公共基础52讲,涵盖高数/物理/化学/工程经济/信号/电磁场/电路/电机/模电/数电/理论力学。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%A7%9C%E5%B0%8F%E7%99%BD%20%E5%85%AC%E5%85%B1%E5%9F%BA%E7%A1%80',
      episodes: [
        { title: '数学1-空间解析几何(一)', page: 1, desc: '高等数学开篇' },
        { title: '数学10-微分方程', page: 10, desc: '常微分方程求解' },
        { title: '物理1-热力学(一)', page: 19, desc: '普通物理·热力学基础' },
        { title: '化学1-原子和分子结构(一)', page: 24, desc: '普通化学' },
        { title: '工程经济1-资金等值', page: 31, desc: '工程经济' },
        { title: '信号1-信号的概念', page: 34, desc: '信号基础' },
        { title: '电工1-电磁场', page: 37, desc: '电磁场' },
        { title: '电工2-电路基础(一)', page: 38, desc: '电路基础' },
        { title: '电工6-电动机与变压器', page: 42, desc: '电机/变压器' },
        { title: '电工7-模电(一)', page: 43, desc: '模拟电子' },
        { title: '电工10-数电(一)', page: 46, desc: '数字电子' },
        { title: '理论力学1-静力学(上)', page: 48, desc: '理论力学' }
      ],
      playlist: [
        { t: '数学1-空间解析几何(一)', p: 1 }, { t: '数学2-空间解析几何(二)', p: 2 },
        { t: '数学3-函数极限连续(一)', p: 3 }, { t: '数学4-函数极限连续(二)', p: 4 },
        { t: '数学5-导数与微分(一)', p: 5 }, { t: '数学6-导数与微分(二)', p: 6 },
        { t: '数学7-积分学(一)', p: 7 }, { t: '数学8-积分学(二)', p: 8 },
        { t: '数学9-积分学(三)', p: 9 }, { t: '数学10-微分方程', p: 10 },
        { t: '数学11-无穷级数(一)', p: 11 }, { t: '数学12-无穷级数(二)', p: 12 },
        { t: '数学13-线性代数(一)', p: 13 }, { t: '数学14-线性代数(二)', p: 14 },
        { t: '数学15-线性代数(三)', p: 15 }, { t: '数学16-概率统计(一)', p: 16 },
        { t: '数学17-概率统计(二)', p: 17 }, { t: '数学18-概率统计(三)', p: 18 },
        { t: '物理1-热力学(一)', p: 19 }, { t: '物理2-热力学(二)', p: 20 },
        { t: '物理3-波动学', p: 21 }, { t: '物理4-光学(一)', p: 22 },
        { t: '物理5-光学(二)', p: 23 },
        { t: '化学1-原子分子结构(一)', p: 24 }, { t: '化学2-原子分子结构(二)', p: 25 },
        { t: '化学3-化学反应速率', p: 27 }, { t: '化学4-溶液', p: 28 },
        { t: '化学5-氧化还原', p: 29 }, { t: '化学6-有机化学', p: 30 },
        { t: '工程经济1-资金等值', p: 31 }, { t: '工程经济2-方案比选', p: 32 },
        { t: '工程经济3-不确定性分析', p: 33 },
        { t: '信号1-概念分类', p: 34 }, { t: '信号2-模拟信号', p: 35 },
        { t: '信号3-数字信号', p: 36 },
        { t: '电工1-电磁场', p: 37 }, { t: '电工2-电路基础(一)', p: 38 },
        { t: '电工3-电路基础(二)', p: 39 }, { t: '电工4-电路基础(三)', p: 40 },
        { t: '电工5-电路基础(四)', p: 41 }, { t: '电工6-电动机与变压器', p: 42 },
        { t: '电工7-模电(一)', p: 43 }, { t: '电工8-模电(二)', p: 44 },
        { t: '电工9-模电(三)', p: 45 }, { t: '电工10-数电(一)', p: 46 },
        { t: '电工11-数电(二)', p: 47 },
        { t: '理论力学1-静力学(上)', p: 48 }, { t: '理论力学2-静力学(下)', p: 49 },
        { t: '理论力学3-运动学', p: 50 }, { t: '理论力学4-动力学(上)', p: 51 },
        { t: '理论力学5-动力学(中)', p: 52 }
      ]
    },

    // 工控圈 - 发输变电方向 (公共BV号,重点突出发输电特色章节)
    gongkongquan: {
      title: '工控圈 - 专业精讲班(发输变电方向)',
      teacher: '工控圈',
      category: '专业基础',
      bvid: 'BV1ie41127kX',
      description: '发输变电方向专业基础精讲:电路/电磁场/模电/数电/电机/电力系统基础(潮流、稳定、短路)及发输电特色:高压电气设备、绝缘配合、防雷过电压、电力系统继电保护。B站补充特色BV:BV1b8RiYhEo2(继电保护)。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%B7%A5%E6%8E%A7%E5%9C%88%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5',
      // 发输电方向特色搜索链接(补充)
      extraSearchUrls: [
        { label: '继电保护专项', url: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E7%94%B5%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5%20%E7%BB%A7%E7%94%B5%E4%BF%9D%E6%8A%A4' },
        { label: '高电压技术/绝缘配合', url: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5%20%E9%AB%98%E7%94%B5%E5%8E%8B%E6%8A%80%E6%9C%AF%20%E8%BF%87%E7%94%B5%E5%8E%8B%20%E7%BB%9D%E7%BC%98%E9%85%8D%E5%90%88' },
        { label: '电力系统分析(潮流/稳定)', url: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E7%94%B5%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5%20%E7%94%B5%E5%8A%9B%E7%B3%BB%E7%BB%9F%E5%88%86%E6%9E%90%20%E6%BD%AE%E6%B5%81%20%E7%A8%B3%E5%AE%9A' }
      ],
      episodes: [
        { title: '01电路1-基本概念和定律(一)', page: 1, desc: '电路基础(通用)' },
        { title: '05电路5-正弦电流电路(一)', page: 5, desc: '相量法(必考)' },
        { title: '11电磁场1-静电场与高斯定律', page: 11, desc: '电磁场(发输电占比高)' },
        { title: '16模电1-半导体与二极管', page: 16, desc: '模拟电子(基础)' },
        { title: '30电气1-变压器1', page: 30, desc: '电机·变压器原理' },
        { title: '38电气6-电力系统基本知识', page: 38, desc: '★电力系统/线路参数(发输电核心)' },
        { title: '39电气7-简单电网潮流计算', page: 39, desc: '★潮流计算(发输电必考)' },
        { title: '50短路电流1', page: 50, desc: '★三相短路计算(发输电重点)' },
        { title: '★高压电器答疑', page: 79, desc: '★高压电气设备(发输电特色)' },
        { title: '★防雷过电压答疑', page: 75, desc: '★过电压与绝缘配合(发输电特色)' },
        { title: '★继电保护答疑', page: 83, desc: '★电力系统继电保护(特色)' },
        { title: '电气工程基础-01', page: 125, desc: '专业基础综合精讲(一)' }
      ],
      playlist: [
        // 电路基础
        { t: '电路1-基本概念(一)', p: 1 }, { t: '电路2-基本概念(二)', p: 2 },
        { t: '电路3-分析方法(一)', p: 3 }, { t: '电路4-分析方法(二)', p: 4 },
        { t: '电路5-正弦电流(一)', p: 5 }, { t: '电路6-正弦电流(二)', p: 6 },
        { t: '电路7-非正弦周期电路', p: 7 }, { t: '电路8-动态电路(一)', p: 8 },
        { t: '电路9-动态电路(二)', p: 9 }, { t: '电路10-应试技巧', p: 10 },
        // 电磁场(发输电占比高)
        { t: '电磁场1-静电场高斯定律', p: 11 }, { t: '电磁场2-恒定电场', p: 12 },
        { t: '电磁场3-恒定磁场传输线', p: 13 }, { t: '电磁场4-镜像法', p: 14 },
        { t: '电磁场5-无损耗传输线', p: 15 },
        // 模电+数电
        { t: '模电1-二极管稳压管', p: 16 }, { t: '模电2-三极管', p: 17 },
        { t: '模电3-负反馈运放', p: 18 }, { t: '模电4-运放波形发生器', p: 19 },
        { t: '模电5-三极管动静态', p: 20 }, { t: '模电6-差动放大器', p: 21 },
        { t: '模电7-整流电路', p: 22 },
        { t: '数电1-数字电路基础', p: 23 }, { t: '数电2-逻辑化简', p: 24 },
        { t: '数电3-组合逻辑', p: 25 }, { t: '数电4-触发器时序逻辑', p: 26 },
        { t: '数电5-脉冲波形', p: 27 }, { t: '数电6-数模模数转换', p: 28 },
        { t: '数电7-应试技巧', p: 29 },
        // 电机
        { t: '电气1-变压器1', p: 30 }, { t: '电气2-变压器2', p: 31 },
        { t: '电气3-感应电机', p: 32 }, { t: '电气4-同步电机', p: 33 },
        { t: '电气5-直流电机', p: 34 },
        { t: '电机补充1', p: 35 }, { t: '电机补充2', p: 36 }, { t: '电机补充3', p: 37 },
        // ★电力系统(发输电核心)
        { t: '电气6-电力系统基本知识', p: 38 }, { t: '电气7-简单电网潮流', p: 39 },
        { t: '电气8-电压平衡', p: 40 },
        // ★短路计算(核心)
        { t: '短路电流1', p: 50 }, { t: '短路电流2', p: 51 },
        { t: '短路电流3', p: 52 }, { t: '短路电流4', p: 53 },
        // 发输电特色专项答疑
        { t: '短路电流计算答疑', p: 73 },
        { t: '★防雷过电压答疑', p: 75 },
        { t: '★高压电器答疑', p: 79 },
        { t: '★继电保护答疑', p: 83 },
        { t: '接地答疑', p: 85 }, { t: '线路答疑', p: 89 },
        // 电气工程基础综合精讲
        { t: '电气工程基础-01', p: 125 }, { t: '电气工程基础-02', p: 126 },
        { t: '电气工程基础-03', p: 127 }, { t: '电气工程基础-04', p: 128 },
        { t: '电气工程基础-05', p: 129 }, { t: '电气工程基础-06', p: 130 },
        { t: '电气工程基础-07', p: 131 }, { t: '电气工程基础-08', p: 132 },
        { t: '电气工程基础-09', p: 133 }, { t: '电气工程基础-10', p: 134 },
        // 电机专项
        { t: '电机-01', p: 96 }, { t: '电机-05', p: 100 }, { t: '电机-10', p: 105 },
        // 电路+电磁场综合
        { t: '电路电磁场-01', p: 106 }, { t: '电路电磁场-10', p: 115 }, { t: '电路电磁场-19', p: 124 }
      ]
    },

    daxiong: {
      title: '2025冲刺课公开课 - 大熊',
      teacher: '大熊',
      category: '冲刺串讲',
      bvid: 'BV1PmsPzPEgJ',
      description: '大熊老师专业基础考试冲刺系列公开课,共6讲,覆盖专业基础核心考点,发输电方向可重点关注电力系统、稳定、短路等专项内容。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E5%A4%A7%E7%86%8A%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%86%B2%E5%88%BA',
      episodes: [
        { title: '基础冲刺1', page: 1, desc: '冲刺课开篇' }, { title: '基础冲刺2', page: 2, desc: '核心考点' },
        { title: '基础冲刺3', page: 3, desc: '专项突破' }, { title: '基础冲刺4', page: 4, desc: '答题技巧' },
        { title: '基础冲刺5', page: 5, desc: '押题讲解' }, { title: '基础冲刺6', page: 6, desc: '考前总结' }
      ],
      playlist: [
        { t: '基础冲刺1', p: 1 }, { t: '基础冲刺2', p: 2 }, { t: '基础冲刺3', p: 3 },
        { t: '基础冲刺4', p: 4 }, { t: '基础冲刺5', p: 5 }, { t: '基础冲刺6', p: 6 }
      ]
    },

    dianjiaozhongxin: {
      title: '电教中心 - 全18讲',
      teacher: '电教中心各科名师',
      category: '系统精讲',
      bvid: 'BV1FE411W75f',
      description: '电教中心注册电气工程师基础考试系统课程(全18讲),大纲全覆盖,发输电方向可重点学习电力系统/过电压/高压设备章节。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E7%94%B5%E6%95%99%E4%B8%AD%E5%BF%83%20%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%20%E5%9F%BA%E7%A1%80%E8%80%83%E8%AF%95',
      episodes: [
        { title: '考试介绍', page: 1, desc: '课程导览' },
        { title: '第01讲:高等数学', page: 2, desc: '高数' },
        { title: '第04讲:物理', page: 5, desc: '物理' },
        { title: '第09讲:电工电子技术', page: 10, desc: '电工电子' },
        { title: '第16讲:电路(11.1)', page: 16, desc: '电路' },
        { title: '第18讲:电气工程基础', page: 19, desc: '电气工程基础(核心)' }
      ],
      playlist: [
        { t: '考试介绍', p: 1 }, { t: '第01讲-高等数学', p: 2 }, { t: '第02讲-线性代数', p: 3 },
        { t: '第03讲-概率统计', p: 4 }, { t: '第04讲-物理', p: 5 }, { t: '第05讲-化学', p: 6 },
        { t: '第06讲-理论力学', p: 7 }, { t: '第07讲-材料力学', p: 8 },
        { t: '第08讲-流体力学', p: 9 }, { t: '第09讲-电工电子', p: 10 },
        { t: '第10讲-信号与信息', p: 11 }, { t: '第11讲-计算机基础', p: 12 },
        { t: '第12讲-工程经济', p: 13 }, { t: '第13讲-模拟电子', p: 14 },
        { t: '第14讲-数字电子', p: 15 }, { t: '第15讲-电路', p: 16 },
        { t: '第16讲-电磁场', p: 17 }, { t: '第17讲-电机与变压器', p: 18 },
        { t: '第18讲-电气工程基础', p: 19 }
      ]
    },

    zhenti: {
      title: '历年真题讲解(2025·发输电方向)',
      teacher: '名师团队',
      category: '真题解析',
      bvid: 'BV1Ks15BaEuG',
      description: '2025年真题一题一视频:公共基础(BV1Ks15BaEuG) + 发输变电专业基础(BV1uuyfBtEig) + 供配电专业基础参考(BV1Ck1FBXEBd)。',
      searchUrl: 'https://search.bilibili.com/all?keyword=%E6%B3%A8%E5%86%8C%E7%94%B5%E6%B0%94%E5%B7%A5%E7%A8%8B%E5%B8%88%202025%20%E5%8F%91%E8%BE%93%E5%8F%98%E7%94%B5%20%E7%9C%9F%E9%A2%98%20%E8%A7%A3%E6%9E%90',
      episodes: [
        { title: '2025公共基础真题·答案总览', page: 1, bv: 'BV1Ks15BaEuG', desc: '公共基础(上午卷120题)真题答案总览' },
        { title: '2025公共基础真题·2025001', page: 2, bv: 'BV1Ks15BaEuG', desc: '真题一题一视频' },
        { title: '2025公共基础真题·2025050', page: 45, bv: 'BV1Ks15BaEuG', desc: '真题逐题讲解' },
        { title: '2025公共基础真题·2025115-120', page: 55, bv: 'BV1Ks15BaEuG', desc: '公共基础最后6题' },
        { title: '★发输变电专业基础真题·发202501', page: 1, bv: 'BV1uuyfBtEig', desc: '发输变电方向专业真题(核心推荐)' },
        { title: '参考:供配电专业基础真题·2025001', page: 1, bv: 'BV1Ck1FBXEBd', desc: '参考:供配电同大纲专业真题' },
        { title: '参考:供配电专业基础真题·2025060', page: 60, bv: 'BV1Ck1FBXEBd', desc: '参考:供配电真题最后1题' }
      ],
      playlist: [
        // 发输变电专业基础真题 (BV1uuyfBtEig)
        { t: '★发输变电专业真题 202501', p: 1, bv: 'BV1uuyfBtEig' },
        // 公共基础真题 (BV1Ks15BaEuG)
        { t: '公共真题·答案总览', p: 1, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025001', p: 2, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025002', p: 3, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025003', p: 4, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025004', p: 5, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025005', p: 6, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025006', p: 7, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025007', p: 8, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025008', p: 9, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025009', p: 10, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025010', p: 11, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025025-036合集', p: 26, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025079', p: 28, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025096', p: 45, bv: 'BV1Ks15BaEuG' },
        { t: '公共真题 2025115-120合集', p: 55, bv: 'BV1Ks15BaEuG' },
        // 供配电专业基础参考真题 (BV1Ck1FBXEBd)
        { t: '参考:供配电真题 2025001', p: 1, bv: 'BV1Ck1FBXEBd' },
        { t: '参考:供配电真题 2025010', p: 10, bv: 'BV1Ck1FBXEBd' },
        { t: '参考:供配电真题 2025038变压器', p: 38, bv: 'BV1Ck1FBXEBd' },
        { t: '参考:供配电真题 2025060', p: 60, bv: 'BV1Ck1FBXEBd' }
      ]
    }
  }
};

// ========== 5大课程分类 + 学科分组(共393讲全量) ==========
// 结构: COURSE_CATEGORIES(大类元数据) → COURSE_CARDS(方向→大类→学科→cards)
// 生成学科卡片的辅助函数
function makeCards(playlistItems, defaultBv, teacher) {
  return playlistItems.map(function (x) {
    return {
      title: x.t,
      page: x.p || 1,
      bv: x.bv || defaultBv,
      teacher: teacher,
      desc: '来源:' + teacher
    };
  });
}

// 5大课程分类(每个大类含 subjects 学科列表)
const COURSE_CATEGORIES = [
  {
    key: 'jiangxiaobai', name: '公共基础精讲班', teacher: '姜小白',
    icon: 'fas fa-chalkboard-teacher', color: '#e74c3c',
    desc: '姜小白老师系统讲解公共基础52讲,覆盖高数/线代/概率/物理/化学/力学/工程经济/信号/电磁场/电路/电机/模电/数电。',
    subjects: [
      { key: 'math', name: '高等数学', icon: 'fas fa-square-root-alt', color: '#e74c3c' },
      { key: 'linear', name: '线性代数', icon: 'fas fa-th', color: '#9b59b6' },
      { key: 'probability', name: '概率统计', icon: 'fas fa-dice', color: '#8e44ad' },
      { key: 'physics', name: '普通物理', icon: 'fas fa-atom', color: '#3498db' },
      { key: 'chemistry', name: '普通化学', icon: 'fas fa-flask', color: '#1abc9c' },
      { key: 'mech', name: '理论力学', icon: 'fas fa-cogs', color: '#f39c12' },
      { key: 'econ', name: '工程经济', icon: 'fas fa-coins', color: '#27ae60' },
      { key: 'signal', name: '信号与信息基础', icon: 'fas fa-wave-square', color: '#16a085' },
      { key: 'emf', name: '电磁场', icon: 'fas fa-magnet', color: '#8e44ad' },
      { key: 'circuit', name: '电路基础', icon: 'fas fa-project-diagram', color: '#2980b9' },
      { key: 'motor', name: '电机与变压器', icon: 'fas fa-cog', color: '#c0392b' },
      { key: 'analog', name: '模拟电子技术', icon: 'fas fa-microchip', color: '#d35400' },
      { key: 'digital', name: '数字电子技术', icon: 'fas fa-code-branch', color: '#27ae60' }
    ]
  },
  {
    key: 'gongkongquan', name: '专业基础精讲班', teacher: '工控圈',
    icon: 'fas fa-brain', color: '#2980b9',
    desc: '工控圈专业基础精讲200+讲,覆盖电路/电磁场/模电/数电/电机/电力系统/短路/负荷/安全/照明/防雷接地等。',
    subjects: [] // 动态填充(分方向)
  },
  {
    key: 'dianjiaozhongxin', name: '电教中心', teacher: '电教中心名师团队',
    icon: 'fas fa-graduation-cap', color: '#27ae60',
    desc: '电教中心注册电气工程师基础考试系统课程,全19讲,大纲全覆盖。',
    subjects: [
      { key: 'intro', name: '考试介绍', icon: 'fas fa-info-circle', color: '#2c3e50' },
      { key: 'math', name: '高等数学', icon: 'fas fa-square-root-alt', color: '#e74c3c' },
      { key: 'linear', name: '线性代数', icon: 'fas fa-th', color: '#9b59b6' },
      { key: 'probability', name: '概率统计', icon: 'fas fa-dice', color: '#8e44ad' },
      { key: 'physics', name: '物理', icon: 'fas fa-atom', color: '#3498db' },
      { key: 'chemistry', name: '化学', icon: 'fas fa-flask', color: '#1abc9c' },
      { key: 'mech', name: '理论力学', icon: 'fas fa-cogs', color: '#f39c12' },
      { key: 'matmech', name: '材料力学', icon: 'fas fa-hammer', color: '#e67e22' },
      { key: 'fluid', name: '流体力学', icon: 'fas fa-water', color: '#00a8cc' },
      { key: 'electro', name: '电工电子技术', icon: 'fas fa-bolt', color: '#f39c12' },
      { key: 'signal', name: '信号与信息', icon: 'fas fa-wave-square', color: '#16a085' },
      { key: 'computer', name: '计算机应用', icon: 'fas fa-laptop-code', color: '#2c3e50' },
      { key: 'econ', name: '工程经济', icon: 'fas fa-coins', color: '#27ae60' },
      { key: 'analog', name: '模拟电子', icon: 'fas fa-microchip', color: '#d35400' },
      { key: 'digital', name: '数字电子', icon: 'fas fa-code-branch', color: '#27ae60' },
      { key: 'circuit', name: '电路', icon: 'fas fa-project-diagram', color: '#2980b9' },
      { key: 'emf', name: '电磁场', icon: 'fas fa-magnet', color: '#8e44ad' },
      { key: 'motor', name: '电机与变压器', icon: 'fas fa-cog', color: '#c0392b' },
      { key: 'power', name: '电气工程基础', icon: 'fas fa-bolt', color: '#34495e' }
    ]
  },
  {
    key: 'daxiong', name: '冲刺课', teacher: '大熊',
    icon: 'fas fa-rocket', color: '#e74c3c',
    desc: '大熊老师专业基础考试冲刺系列公开课,共6讲,考前最后阶段快速过核心考点。',
    subjects: [
      { key: 'sprint', name: '冲刺串讲', icon: 'fas fa-rocket', color: '#e74c3c' }
    ]
  },
  {
    key: 'zhenti', name: '真题讲解', teacher: '名师团队',
    icon: 'fas fa-file-alt', color: '#16a085',
    desc: '2025年真题一题一视频对答案解析版:公共基础(BV1Ks)+供配电专业(BV1Ck)+发输变电专业(BV1uu)。',
    subjects: [] // 动态填充(分方向)
  }
];

// 工控圈专业基础精讲班 - 学科定义(分方向)
var GKQ_SUBJECTS_PD = [
  { key: 'circuit', name: '电路理论', icon: 'fas fa-project-diagram', color: '#2980b9' },
  { key: 'emf', name: '电磁场', icon: 'fas fa-magnet', color: '#8e44ad' },
  { key: 'analog', name: '模拟电子技术', icon: 'fas fa-microchip', color: '#d35400' },
  { key: 'digital', name: '数字电子技术', icon: 'fas fa-code-branch', color: '#27ae60' },
  { key: 'motor', name: '电机与变压器', icon: 'fas fa-cog', color: '#c0392b' },
  { key: 'power', name: '电气/电力系统基础', icon: 'fas fa-bolt', color: '#34495e' },
  { key: 'short', name: '短路电流计算', icon: 'fas fa-exclamation-triangle', color: '#e67e22' },
  { key: 'load', name: '负荷计算', icon: 'fas fa-tachometer-alt', color: '#2980b9' },
  { key: 'safety', name: '电气安全/低压电器', icon: 'fas fa-shield-alt', color: '#c0392b' },
  { key: 'light', name: '照明/布线/智能化', icon: 'fas fa-lightbulb', color: '#f1c40f' },
  { key: 'grounding', name: '防雷过电压/接地', icon: 'fas fa-cloud-bolt', color: '#8e44ad' },
  { key: 'extra', name: '综合补充精讲', icon: 'fas fa-layer-group', color: '#2c3e50' }
];
var GKQ_SUBJECTS_PT = [
  { key: 'circuit', name: '电路理论', icon: 'fas fa-project-diagram', color: '#2980b9' },
  { key: 'emf', name: '电磁场', icon: 'fas fa-magnet', color: '#8e44ad' },
  { key: 'analog', name: '模拟电子技术', icon: 'fas fa-microchip', color: '#d35400' },
  { key: 'digital', name: '数字电子技术', icon: 'fas fa-code-branch', color: '#27ae60' },
  { key: 'motor', name: '电机与变压器', icon: 'fas fa-cog', color: '#c0392b' },
  { key: 'power', name: '电力系统(潮流/稳定)', icon: 'fas fa-bolt', color: '#34495e' },
  { key: 'short', name: '短路电流计算', icon: 'fas fa-exclamation-triangle', color: '#e67e22' },
  { key: 'hv', name: '高压电器/高电压技术', icon: 'fas fa-tower-broadcast', color: '#2980b9' },
  { key: 'insulation', name: '绝缘配合/过电压/防雷接地', icon: 'fas fa-cloud-bolt', color: '#8e44ad' },
  { key: 'relay', name: '电力系统继电保护', icon: 'fas fa-shield-halved', color: '#c0392b' },
  { key: 'extra', name: '综合补充精讲', icon: 'fas fa-layer-group', color: '#2c3e50' }
];

// 真题讲解 - 学科定义(分方向)
var ZHENTI_SUBJECTS_PD = [
  { key: 'public', name: '公共基础真题(上午卷120题)', icon: 'fas fa-file-alt', color: '#16a085' },
  { key: 'professional', name: '供配电专业基础真题(下午卷60题)', icon: 'fas fa-file-alt', color: '#2980b9' }
];
var ZHENTI_SUBJECTS_PT = [
  { key: 'public', name: '公共基础真题(上午卷120题)', icon: 'fas fa-file-alt', color: '#16a085' },
  { key: 'professional', name: '发输变电专业基础真题', icon: 'fas fa-file-alt', color: '#8e44ad' }
];

// 课程卡片区: 方向→大类key→学科key→cards数组
const COURSE_CARDS = {};

// ========== 供配电方向 ==========
(function buildPd() {
  var V = VIDEOS.powerDistribution;
  var D = {};

  // === 大类1: 公共基础精讲班(姜小白 BV1BaJFzFERX, 52讲) ===
  D.jiangxiaobai = {};
  D.jiangxiaobai.math = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学[1-9]|^数学1[0-2]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.linear = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学1[3-5]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.probability = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学1[6-8]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.physics = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^物理/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.chemistry = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^化学/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.mech = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^理论力学/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.econ = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^工程经济/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.signal = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^信号/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.emf = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工1-电磁场/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.circuit = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工[2-5]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.motor = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工6/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.analog = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工[7-9]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.digital = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工1[01]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');

  // === 大类2: 专业基础精讲班(工控圈 BV1ie41127kX, 200+讲) ===
  D.gongkongquan = {};
  D.gongkongquan.circuit = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电路/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.emf = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电磁场/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.analog = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^模电/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.digital = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^数电/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.motor = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电气[1-5]|^电机学补充|^电机-/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.power = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电气[678]|电气布置答疑|供配电系统答疑|线路答疑|电气工程基础/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.short = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^短路电流|短路电流计算答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.load = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^负荷计算|负荷计算答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.safety = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^安全[1-5]|安全答疑|传动答疑|低压电器[1-4]|低压电器答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.light = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^照明[1-3]|照明答疑|综合布线|智能化答疑|智能化真题|直流系统真题/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.grounding = makeCards(V.gongkongquan.playlist.filter(function (x) { return /防雷|接地答疑|导体电缆答疑|节能答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.extra = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电路电磁场/.test(x.t); }), V.gongkongquan.bvid, '工控圈·补充');

  // === 大类3: 电教中心(BV1FE411W75f, 19讲) ===
  D.dianjiaozhongxin = {};
  var djz = V.dianjiaozhongxin.playlist;
  D.dianjiaozhongxin.intro = makeCards(djz.filter(function (x) { return /^考试介绍/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.math = makeCards(djz.filter(function (x) { return /^第01讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.linear = makeCards(djz.filter(function (x) { return /^第02讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.probability = makeCards(djz.filter(function (x) { return /^第03讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.physics = makeCards(djz.filter(function (x) { return /^第04讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.chemistry = makeCards(djz.filter(function (x) { return /^第05讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.mech = makeCards(djz.filter(function (x) { return /^第06讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.matmech = makeCards(djz.filter(function (x) { return /^第07讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.fluid = makeCards(djz.filter(function (x) { return /^第08讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.electro = makeCards(djz.filter(function (x) { return /^第09讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.signal = makeCards(djz.filter(function (x) { return /^第10讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.computer = makeCards(djz.filter(function (x) { return /^第11讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.econ = makeCards(djz.filter(function (x) { return /^第12讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.analog = makeCards(djz.filter(function (x) { return /^第13讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.digital = makeCards(djz.filter(function (x) { return /^第14讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.circuit = makeCards(djz.filter(function (x) { return /^第15讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.emf = makeCards(djz.filter(function (x) { return /^第16讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.motor = makeCards(djz.filter(function (x) { return /^第17讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.power = makeCards(djz.filter(function (x) { return /^第18讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');

  // === 大类4: 冲刺课(大熊 BV1PmsPzPEgJ, 6讲) ===
  D.daxiong = {};
  D.daxiong.sprint = makeCards(V.daxiong.playlist, V.daxiong.bvid, '大熊');

  // === 大类5: 真题讲解 ===
  D.zhenti = {};
  D.zhenti.public = makeCards(V.zhenti.playlist.filter(function (x) { return x.bv === 'BV1Ks15BaEuG'; }), 'BV1Ks15BaEuG', '名师团队·公共基础真题');
  D.zhenti.professional = makeCards(V.zhenti.playlist.filter(function (x) { return x.bv === 'BV1Ck1FBXEBd'; }), 'BV1Ck1FBXEBd', '名师团队·供配电专业真题');

  COURSE_CARDS.powerDistribution = D;
})();

// ========== 发输变电方向 ==========
(function buildPt() {
  var V = VIDEOS.powerTransmission;
  var Vpd = VIDEOS.powerDistribution;
  var D = {};

  // === 大类1: 公共基础精讲班(姜小白, 同供配电52讲) ===
  D.jiangxiaobai = {};
  D.jiangxiaobai.math = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学[1-9]|^数学1[0-2]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.linear = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学1[3-5]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.probability = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^数学1[6-8]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.physics = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^物理/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.chemistry = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^化学/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白').concat(makeCards([{ t: '化学2-原子分子结构(二)续', p: 26 }], V.jiangxiaobai.bvid, '姜小白'));
  D.jiangxiaobai.mech = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^理论力学/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.econ = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^工程经济/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.signal = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^信号/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.emf = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工1-电磁场/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.circuit = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工[2-5]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.motor = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工6/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.analog = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工[7-9]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');
  D.jiangxiaobai.digital = makeCards(V.jiangxiaobai.playlist.filter(function (x) { return /^电工1[01]/.test(x.t); }), V.jiangxiaobai.bvid, '姜小白');

  // === 大类2: 专业基础精讲班(工控圈, 发输电方向特色) ===
  D.gongkongquan = {};
  D.gongkongquan.circuit = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电路/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.emf = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电磁场/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.analog = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^模电/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.digital = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^数电/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.motor = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电气[1-5]|电机补充|电机-/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.power = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电气[678]|电气工程基础/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.short = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^短路电流|短路电流计算答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.hv = makeCards(V.gongkongquan.playlist.filter(function (x) { return /高压电器答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.insulation = makeCards(V.gongkongquan.playlist.filter(function (x) { return /防雷|接地答疑|线路答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.relay = makeCards(V.gongkongquan.playlist.filter(function (x) { return /继电保护答疑/.test(x.t); }), V.gongkongquan.bvid, '工控圈');
  D.gongkongquan.extra = makeCards(V.gongkongquan.playlist.filter(function (x) { return /^电路电磁场/.test(x.t); }), V.gongkongquan.bvid, '工控圈·补充');

  // === 大类3: 电教中心(同供配电19讲) ===
  D.dianjiaozhongxin = {};
  var djz = V.dianjiaozhongxin.playlist;
  D.dianjiaozhongxin.intro = makeCards(djz.filter(function (x) { return /^考试介绍/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.math = makeCards(djz.filter(function (x) { return /^第01讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.linear = makeCards(djz.filter(function (x) { return /^第02讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.probability = makeCards(djz.filter(function (x) { return /^第03讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.physics = makeCards(djz.filter(function (x) { return /^第04讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.chemistry = makeCards(djz.filter(function (x) { return /^第05讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.mech = makeCards(djz.filter(function (x) { return /^第06讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.matmech = makeCards(djz.filter(function (x) { return /^第07讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.fluid = makeCards(djz.filter(function (x) { return /^第08讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.electro = makeCards(djz.filter(function (x) { return /^第09讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.signal = makeCards(djz.filter(function (x) { return /^第10讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.computer = makeCards(djz.filter(function (x) { return /^第11讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.econ = makeCards(djz.filter(function (x) { return /^第12讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.analog = makeCards(djz.filter(function (x) { return /^第13讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.digital = makeCards(djz.filter(function (x) { return /^第14讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.circuit = makeCards(djz.filter(function (x) { return /^第15讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.emf = makeCards(djz.filter(function (x) { return /^第16讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.motor = makeCards(djz.filter(function (x) { return /^第17讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');
  D.dianjiaozhongxin.power = makeCards(djz.filter(function (x) { return /^第18讲/.test(x.t); }), V.dianjiaozhongxin.bvid, '电教中心');

  // === 大类4: 冲刺课(同供配电6讲) ===
  D.daxiong = {};
  D.daxiong.sprint = makeCards(V.daxiong.playlist, V.daxiong.bvid, '大熊');

  // === 大类5: 真题讲解 ===
  D.zhenti = {};
  D.zhenti.public = makeCards(Vpd.zhenti.playlist.filter(function (x) { return x.bv === 'BV1Ks15BaEuG'; }), 'BV1Ks15BaEuG', '名师团队·公共基础真题');
  var ptZhentiOnly = V.zhenti.playlist.filter(function (x) { return x.bv === 'BV1uuyfBtEig'; });
  var refPdZhenti = Vpd.zhenti.playlist.filter(function (x) { return x.bv === 'BV1Ck1FBXEBd'; }).map(function (x) { return { t: '参考:' + x.t, p: x.p, bv: x.bv }; });
  D.zhenti.professional = makeCards(ptZhentiOnly.concat(refPdZhenti), null, '名师团队·发输变电专业真题');

  COURSE_CARDS.powerTransmission = D;
})();

// B站工具函数
function getBiliSearchUrl(keyword) {
  return 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword);
}
function getBiliVideoUrl(bv, page) {
  page = page || 1;
  return 'https://www.bilibili.com/video/' + bv + '?p=' + page;
}
// B站嵌入:支持分p参数page,移动端直接内嵌播放
function getBiliEmbedUrl(bv, page) {
  page = page || 1;
  return 'https://player.bilibili.com/player.html?bvid=' + bv + '&page=' + page + '&high_quality=1&autoplay=0';
}
