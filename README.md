# 注册电气工程师基础考试2026复习网站

供配电 & 发输变电双方向 · 基础知识 · 高频考点 · 视频课程 · 学习笔记 · 学友分享

## 项目简介

本网站为注册电气工程师基础考试2026年备考复习平台,涵盖以下板块:

- **基础知识**: 公共基础(高数/物理/化学/力学/流体/计算机等)与专业基础(电路/模电/数电/电气工程基础)
- **高频考点**: 精选历年高频考点与公式速记,标注考频星级
- **视频直播**: B站视频课程嵌入播放,支持页面内直接观看
  - 2025公共基础精讲班 - 姜小白
  - 工控圈 - 专业精讲班
  - 2025冲刺课公开课 - 大熊
  - 电教中心 - 全18讲
  - 历年真题讲解
- **学习笔记**: 各科目知识总结与复习要点
- **学友分享**: 备考经验分享与资料交流

## 技术栈

- 纯静态网站(HTML + CSS + 原生JavaScript)
- 无需后端,无需构建工具
- 响应式设计,支持PC与移动端
- B站视频iframe嵌入,支持移动端直接播放

## 项目结构

```
.
├── index.html          # 首页
├── basic.html          # 基础知识
├── hot-points.html     # 高频考点
├── videos.html         # 视频直播
├── notes.html          # 学习笔记
├── share.html          # 学友分享
├── css/
│   └── style.css       # 样式表
├── js/
│   └── main.js         # 交互逻辑
├── data/
│   ├── videos.js           # 视频数据(B站BV号)
│   ├── basic-knowledge.js  # 基础知识数据
│   └── hot-points.js       # 高频考点数据
├── render.yaml         # Render部署配置
└── .gitignore
```

## 本地预览

直接用浏览器打开 `index.html`,或启动本地服务器:

```bash
python -m http.server 8000
```

访问 http://localhost:8000

## 部署

### GitHub仓库
https://github.com/lbl1988/ee-pro-exam-site-2026

### Render部署
https://dashboard.render.com/

项目已包含 `render.yaml` 配置文件,在Render中创建Static Site并关联GitHub仓库即可自动部署。

## 说明

- 视频资源均来源于B站(哔哩哔哩),仅供学习交流使用
- 支持供配电与发输变电方向切换,切换后页面内容自动更新
- 方向选择会保存在浏览器本地(localStorage),下次访问自动恢复
