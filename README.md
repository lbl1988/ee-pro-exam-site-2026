# 注册电气工程师基础考试2026复习网站

供配电 & 发输变电双方向 · 基础知识 · 高频考点 · 视频课程 · 学习笔记 · 学友分享

**当前部署**:Render 静态站点(纯前端 local 模式,零后端依赖)

线上地址:**https://ee-pro-exam-site-2026.onrender.com/**

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
- **学习笔记**: 各科目知识总结与复习要点,登录后可自定义笔记
- **学友分享**: 备考经验分享与资料交流

## 账号系统(Render 静态部署 · local 模式)

Render 为纯静态托管,无后端 API,前端自动探测为 **local 模式**,所有数据存储在浏览器 `localStorage`。

### 功能一览

| 功能 | 说明 |
|---|---|
| 注册 | 用户名 + 密码(≥4位),salt + SHA-256 哈希后存入 `localStorage['ee-users']` |
| 登录 | 校验用户名 + 密码哈希,成功后写 `localStorage['ee-session']` |
| 忘记密码 | 输入用户名 + 新密码即可重置(无需旧密码,local 模式无邮箱验证) |
| 修改密码 | 需验证旧密码,设置新密码 |
| 学习进度 | 标记基础知识/高频考点/视频完成状态,存入 `localStorage['ee-progress-{用户名}']` |
| 个人笔记 | 新增/编辑/删除笔记,随进度一起存储 |
| 数据导出 | 一键导出全部 `ee-*` 数据为 JSON 文本 / .json 文件 |
| 数据导入 | 粘贴 JSON 文本或选择 .json 文件,恢复账号+笔记+进度 |
| 跨设备同步 | 在设备 A 导出 JSON → 发到设备 B → 粘贴导入,实现手动跨设备同步 |

### 使用方式

1. 打开 `https://ee-pro-exam-site-2026.onrender.com/`
2. 右上角点 **登录 / 注册**
3. 切到 **注册** Tab → 填用户名 + 密码 → 注册
4. 自动切回 **登录** Tab → 输入用户名密码 → 登录
5. 登录后导航栏显示:用户名 · 数据同步 · 修改密码 · 退出登录

**忘记密码**:切到 **忘记密码** Tab → 输入用户名 + 新密码 + 确认密码 → 重置成功后自动切回登录 Tab

**跨设备同步**:
1. 设备 A:点导航栏 **数据同步** 按钮 → 导出 Tab → 复制 JSON 或下载 .json 文件
2. 通过微信/QQ/邮件发送到设备 B
3. 设备 B:打开同一网站 → 点 **登录/注册** → 弹窗底部 **从文本导入数据** → 粘贴 JSON 或选文件 → 导入
4. 刷新页面,账号自动处于登录态,笔记/进度全部恢复

## 技术栈

- **前端**: 纯静态(HTML + CSS + 原生 JavaScript),0 打包,0 npm 依赖,响应式设计
- **部署**: Render 静态站点(`render.yaml` 配置,自动从 GitHub 部署)
- **存储**: 浏览器 localStorage(无后端数据库)

## 项目结构

```
.
├── index.html              # 首页
├── basic.html              # 基础知识
├── hot-points.html         # 高频考点
├── videos.html             # 视频直播
├── my-notes.html           # 学习笔记
├── share.html              # 学友分享
├── css/style.css           # 样式表
├── js/
│   ├── auth.js             # 认证模块(注册/登录/忘记密码/修改密码/数据导出导入)
│   ├── progress.js         # 学习进度/笔记/分享
│   └── main.js             # 页面交互逻辑
├── data/                   # 静态题库/视频数据
│   ├── basic-knowledge.js
│   ├── hot-points.js
│   └── videos.js
├── lib/                    # 后端工具(仅 Vercel 部署时使用)
│   ├── kv.js               # Vercel KV REST API 封装
│   ├── auth.js             # 密码哈希/cookie/session 工具
│   └── rate-limit.js      # API 频率限制
├── api/                    # Vercel Edge Functions(仅 Vercel 部署时使用)
│   ├── auth/               # 认证 API
│   └── progress/           # 进度 API
├── render.yaml             # Render 静态部署配置
├── package.json            # 项目声明(无生产依赖)
└── .gitignore
```

> `lib/` 和 `api/` 目录仅在 Vercel 部署时启用,Render 静态部署不使用后端 API,前端自动降级为 local 模式。

## 双模式兼容机制

`js/auth.js` 在页面加载时探测后端可用性:

1. **共享后缀域名检测**:`*.onrender.com`、`*.vercel.app`、`*.workers.dev` 等 18 个共享域名后缀 → 强制 `local` 模式(避免 Safari ITP 限制)
2. **API 探活**:对非共享域名,fetch `/api/auth/me`,返回 JSON 则 `cloud` 模式,否则 `local` 模式
3. **响应合法性校验**:cloud 模式下若 API 返回非 JSON 或无 `success` 字段(静态站点 200 空 body),自动降级为 `local` 模式

| 模式 | 触发条件 | 账号存储 | 跨设备 |
|---|---|---|---|
| local | Render 静态 / 共享域名 / 本地预览 | localStorage | 手动导出/导入 JSON |
| cloud | Vercel 直连 + KV 可达 | Vercel KV + HttpOnly Cookie | 自动同步 |

当前 Render 部署固定为 **local 模式**。

## Render 部署配置

`render.yaml` 关键配置:

```yaml
services:
  - type: static_site
    name: ee-pro-exam-site-2026
    buildCommand: echo "No build needed for static site"
    staticPublishPath: ./
    cleanUrls: true
    headers:
      - path: /
        name: Cache-Control
        value: no-cache, no-store, must-revalidate, max-age=0
      - path: /*.html
        name: Cache-Control
        value: no-cache, no-store, must-revalidate, max-age=0
```

HTML 禁用缓存,防止 Render 静态托管 Pre-render 返回他人登录态快照。

## 本地预览

```bash
cd ee-pro-exam-site-2026
python -m http.server 8765
# 访问 http://localhost:8765 (自动 local 模式,注册/登录/笔记全流程可用)
```

## 安全说明

- 密码使用 salt + SHA-256 哈希存储,不保存明文
- local 模式数据存储在浏览器 localStorage,清缓存会丢失(可用数据导出功能备份)
- 数据导出/导入只处理 `ee-` 前缀的 key,不会写入其他数据

## 说明

- 视频资源均来源于B站(哔哩哔哩),仅供学习交流使用
- 支持供配电与发输变电方向切换,切换后页面内容自动更新
- 方向选择保存在浏览器 localStorage (`ee-direction`)
