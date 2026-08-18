# 注册电气工程师基础考试2026复习网站 (双模式版 v2.1)

供配电 & 发输变电双方向 · 基础知识 · 高频考点 · 视频课程 · 学习笔记 · 学友分享

**版本 2.1.0** — 前端 **自动探测后端可用性,兼容 v1.0/v2.0 双模式**:Vercel 直连时走 v2.0 云端(Vercel KV + HttpOnly Cookie);后端不可达时(纯静态部署 / Cloudflare Workers 反代 / 本地预览)自动降级为 v1.0 本地账号(localStorage)。同一套代码兼顾两种部署形态,无需改动后端。

> **v2.0.1 修复记录**(2026-08-18,部署前必须包含,否则账号系统无法工作):
> 1. `lib/kv.js` 的 `kvRaw` 漏加 `export` → 注册/登录运行时 `ReferenceError`(所有用户表操作 500)
> 2. `api/auth/login.js` 误从 `lib/auth.js` 导入未导出的 `kvSet` → esbuild 打包直接失败
> 3. `lib/auth.js` 移除 `require('crypto')` 和 `Buffer` fallback(Edge Runtime 无 Node 内置模块,esbuild 会把 Node 模块引入 bundle 导致部署失败),改用全局 `crypto`/`btoa`/`atob`(Edge Runtime 与 Node 18+ 均原生支持)
>
> 已通过 **esbuild `platform=neutral` 打包验证(15/15 API)** + **内存 mock Upstash KV 端到端测试(11/11:注册/重复注册/非法用户名/登录/Cookie 标志/错误密码/会话校验/进度标记/迁移合并)**,可作为部署前的回归测试基线。
>
> **v2.0.2 修复记录**(2026-08-18,登录体验与安全加固):
> 1. 移除"忘记密码"死路 tab(云端无验证重置本就不可用),改为提示联系管理员
> 2. 登录/注册增加 KV 频控:登录每 IP 15 分钟 ≤20 次,注册每 IP 24 小时 ≤10 次(新增 `lib/rate-limit.js`)
> 3. `clearCookieHeader` 补上 `Secure` 属性,与设置 cookie 时保持一致
> 4. 注册表单增加"确认密码"字段,前后端二次校验
>
> **🚀 部署状态**(2026-08-18):
> - 生产站点:**https://ee-pro-exam-site-2026.vercel.app**
> - KV 存储:已创建并连接 `upstash-kv-fuchsia-saddle`(Singapore 区域,free 计划)
> - 环境变量:`KV_REST_API_URL` / `KV_REST_API_TOKEN` / `KV_REST_API_READ_ONLY_TOKEN` / `KV_URL` / `REDIS_URL` 已注入 Production + Preview
> - 线上冒烟测试:**11/11 通过**(注册、重复注册被拒、登录、me 会话校验、视频标记、笔记添加、未登录拦截、退出登录、静态页面访问)
> - 本地 `.env.local` 已由 Vercel CLI 自动生成(含开发环境 OIDC Token,**请勿提交**)


## ✨ v2.0 版本新特性

| 对比项 | v1.0 (localStorage版) | v2.0 (云端版) |
|---|---|---|
| 账号系统 | 纯前端本地存储,无后端 | ✅ Vercel KV 云端用户表 |
| 登录状态存储 | localStorage (受 Safari ITP 限制) | ✅ HttpOnly Secure Cookie (Safari 无限制) |
| 跨设备同步 | ❌ 每台设备独立账号 | ✅ 同一账号手机/电脑/平板通用 |
| 清缓存后果 | ❌ 账号+笔记+进度 全丢失 | ✅ 数据在云端,清缓存无任何影响 |
| iPhone 兼容性 | ❌ vercel.app 域名下经常登录失败 | ✅ Cookie 模式 Safari 原生支持 |
| 本地旧数据迁移 | — | ✅ 登录时自动检测并迁移到云端 |

## 🔁 v2.1 双模式机制(同一套代码兼顾 v1.0/v2.0)

### 触发逻辑
`js/auth.js` 在页面加载时调用 `/api/auth/me` 探活:
- **返回 JSON**(无论 success) → `mode='cloud'`(v2.0 云端模式)
- **网络异常 / 404 / 非 JSON 响应** → `mode='local'`(v1.0 本地模式)

### 两种模式对比

| 项目 | cloud 模式(v2.0) | local 模式(v1.0) |
|---|---|---|
| 触发条件 | Vercel 直连,KV 可达 | 纯静态 / Workers 反代 / 本地预览 |
| 账号存储 | Vercel KV 云端用户表 | `localStorage['ee-users']`(salt+SHA-256 多轮) |
| 会话 | HttpOnly Secure Cookie,30 天 TTL | `localStorage['ee-session']` |
| 进度/笔记/分享 | KV 云端,跨设备同步 | `localStorage['ee-progress-{username}']`,本机隔离 |
| 写操作 | 乐观更新缓存 + 异步落云端,失败回滚 | 直接写 localStorage,立即生效 |
| 修改密码 | Edge Function 重哈希 | 本地用户表更新 salt+hash |
| 兼容性 | iPhone Safari / 微信内置浏览器 | 受 Safari ITP 限制(7天/拒绝),纯静态场景可用 |

### 行为说明
- **登录弹窗底部提示文案会随模式切换**:本地模式明确告知"数据保存在本机,清缓存会丢失"
- **本地模式不会触发云端迁移**(无意义,后端不通);迁移只在 cloud 模式登录时自动触发
- **模式不可中途切换**:页面加载时探测一次,生命周期内固定;切换部署只需重新加载页面

### 部署建议
- **生产主站**:Vercel → cloud 模式,完整功能
- **国内访问入口**:Cloudflare Workers 反代静态资源 → 自动 local 模式,手机能登录使用所有功能,数据存本机
- **本地预览**:`python -m http.server` → local 模式,可直接测试注册/登录/笔记全流程

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

- **前端**: 纯静态 (HTML + CSS + 原生 JavaScript), 0 打包,响应式设计
- **认证**: Vercel Edge Functions + Vercel KV (Upstash Redis)
  - 密码哈希: PBKDF2-SHA256,120k 轮迭代
  - Session: 随机 32 字节 Token 存 HttpOnly SameSite=Lax Secure Cookie,30 天 TTL
  - 0 npm 依赖(Edge Functions 直接调 KV REST API,无需安装)
- **部署**: Vercel (自动识别 Edge Functions,无需构建)

## 项目结构

```
.
├── index.html          # 首页
├── basic.html          # 基础知识
├── hot-points.html     # 高频考点
├── videos.html         # 视频直播
├── my-notes.html       # 学习笔记
├── share.html          # 学友分享
├── css/style.css       # 样式表
├── js/
│   ├── auth.js         # 认证模块(云端版 v2)
│   ├── progress.js     # 学习进度/笔记/分享(云端版 v2)
│   └── main.js         # 页面交互逻辑(无需改动)
├── data/               # 静态题库/视频数据
├── lib/
│   ├── kv.js           # Vercel KV REST API 封装 (0 依赖)
│   └── auth.js         # 密码哈希、cookie、session 校验工具
├── api/
│   ├── auth/           # 认证 Edge Functions
│   │   ├── register.js         # POST 注册
│   │   ├── login.js            # POST 登录 + Set-Cookie
│   │   ├── logout.js           # POST 登出 + 清Cookie
│   │   ├── me.js               # GET  校验session+获取用户信息
│   │   └── change-password.js  # POST 修改密码
│   └── progress/       # 学习进度 Edge Functions
│       ├── get.js              # GET  拉取用户全部进度
│       ├── save.js             # POST 整体保存(含本地迁移合并)
│       ├── toggle-basic.js     # POST 基础知识 标记掌握
│       ├── toggle-hotpoint.js  # POST 高频考点 标记掌握
│       ├── toggle-video.js     # POST 视频 标记已学
│       ├── note-add.js / note-update.js / note-delete.js
│       └── share-add.js / share-delete.js
├── vercel.json         # Vercel 路由与安全头配置
├── package.json        # 仅声明项目,无生产依赖
├── render.yaml         # (保留) Render 静态部署配置(仅静态页面可用,无Edge功能)
└── .gitignore
```

## 🚀 部署步骤 (Vercel)

### 前置: 创建 Vercel KV 存储

KV 是整个账号系统的唯一数据存储,**必须创建否则所有 API 返回 500**。

1. 打开 Vercel 控制台 → 你的项目 → `Storage` 选项卡
2. 点击 **Create Database** → 选择 **KV**
3. 起个名字(比如 `ee-pro-exam-kv`),Region 选 **East US (iad1)** 或任何免费可用区域
4. 创建完成后,在该 KV 的 **Connect** 选项卡 → **Connect to Project** → 绑定到你的项目
5. 绑定成功后,项目的 **Settings → Environment Variables** 会自动新增以下两个变量:
   - `KV_REST_API_URL` = `https://***.upstash.io`
   - `KV_REST_API_TOKEN` = `********`

   这就是 Edge Functions 内部使用的环境变量,无需手动配置。

### 部署代码

有两种方式:

#### 方式 A: 直接通过 Vercel 网站部署 (最简单,推荐)

1. 把本项目推送到你自己的 GitHub 仓库
2. 打开 [vercel.com](https://vercel.com/new) → Import Project → 选择该仓库
3. Framework Preset 选 **Other** (因为是纯静态)
4. Build Command 留空,Output Directory 留空 (或填 `.`)
5. 点 **Deploy**
6. 部署完成后 → 进项目 Settings → Storage → 按上面步骤 **绑定 KV**
7. 绑定后重新 Redeploy 一次 (Settings → Git → Deploy Hooks 或直接 Push 一次)

#### 方式 B: 用 Vercel CLI 本地部署

```bash
npm i -g vercel
cd project
vercel          # 首次:一路回车,选关联 Vercel 账号+项目名
# 部署好后,在网页版给项目绑定 KV (见前置步骤)
vercel --prod   # 重新部署生产环境
```

### 验证部署成功

打开你的 `https://xxx.vercel.app/`:
1. 右上角应该出现 **「登录 / 注册」** 按钮
2. 点注册 → 填写用户名(中英文/数字/下划线,2-32位) + 密码(≥4位) → 提示「注册成功」
3. 切登录 → 输入用户名密码 → 应显示欢迎语 + 钥匙 + 退出按钮
4. 打开「学习笔记」→ 添加一条笔记 → 刷新页面 → **笔记仍在** ✅ (如果是旧版清缓存就没了)
5. iPhone Safari 打开同一个网址 → 直接登录成功 ✅ (不再受 ITP 影响)

## 🔐 本地旧数据自动迁移

如果用户之前在 v1.0 版本(localStorage版)已经注册过并保存了笔记/进度:

1. 升级到 v2.0 后,在用户**第一次登录成功**时
2. 前端会自动检测 `ee-progress-{用户名}` 这个 localStorage key 是否还存在
3. 如果存在且有内容 → 自动 POST 到 `/api/progress/save`
4. 后端 merge 策略: **云端已有数据优先,本地非空字段补齐** (不会覆盖已有云数据)
5. 迁移完成后自动派发 `progressChanged` → 页面刷新显示已迁移的内容

用户无任何感知,完全透明。

## 📱 iPhone 兼容性说明 (解决的核心问题)

旧版无法登录的原因不是 Vercel vs Render,而是 **Safari ITP (智能追踪预防) 对高频共享子域名 `*.vercel.app` 的 localStorage/sessionStorage 写入限制**:

- localStorage 由 JavaScript 读写 → 归类为「脚本可写存储」→ ITP 严格限制,7 天或直接拒绝
- HttpOnly Cookie 只有服务器能改,脚本读不到 → ITP **完全不限制** ✅

v2.0 登录后只在浏览器里留下一个 `ee_session` Cookie,属性:
- `HttpOnly` ✅ (XSS 无法窃取)
- `Secure` ✅ (仅 HTTPS 发送,HTTP 部署时自动降级)
- `SameSite=Lax` ✅ (防 CSRF,同时支持从外链跳转过来仍保持登录)
- `Max-Age=2592000` → 30 天有效期

iPhone Safari、微信内置浏览器、Chrome iOS 全部完美兼容。

## 💻 本地预览

**注意**:本地预览可以打开静态页面,但 **登录/笔记等 API 功能不可用**(Edge Functions 必须部署到 Vercel 或使用 `vercel dev`)。

```bash
# 方式1: Python 内置服务器
cd project
python -m http.server 8000
# 访问 http://localhost:8000 (静态页面可看,登录按钮不可用)

# 方式2: 完整本地联调 (需要 Vercel 账号 + 绑定 KV)
npm i -g vercel
cd project
vercel dev  # 首次按提示关联项目,会把线上 KV 的 env 拉到本地
# 访问 http://localhost:3000 (API 也能正常工作)
```

## 🔒 安全说明

- 密码使用 **PBKDF2-HMAC-SHA256** 哈希,120000 轮迭代,每用户独立 16 字节 salt
- Session ID 为 32 字节加密安全随机字符串 (`crypto.getRandomValues`),TTL 30 天
- KV REST API Token 仅 Vercel 后端可见,永远不暴露到前端
- 所有写 API 都有输入长度/字符集校验,笔记/分享字段做了截断保护
- 如果需要进一步加固:
  - 给 `/api/auth/*` 加登录频控(可在 KV 里做 INCR + EXPIRE)
  - 增加邮箱验证(接入 Resend + Edge Functions Mail)
  - 接入 Apple Sign in / OAuth 第三方登录

## 📋 API 列表 (留给后续扩展)

所有 API 都要求 `Content-Type: application/json`,写操作需 POST;Cookie 自动 `credentials: include`。

| Method | Path | 参数 | 说明 |
|---|---|---|---|
| POST | `/api/auth/register` | `{username,password,confirmPassword?}` | 注册 |
| POST | `/api/auth/login` | `{username,password}` | 登录 + Set-Cookie |
| POST | `/api/auth/logout` | — | 清 Cookie |
| GET  | `/api/auth/me` | — | 校验登录,返回用户信息 |
| POST | `/api/auth/change-password` | `{oldPassword,newPassword,confirmPassword}` | 改密码 |
| GET  | `/api/progress/get` | — | 拉取全部进度/笔记/分享 |
| POST | `/api/progress/save` | `{progress,migratedFromLocal?}` | 整体保存(支持迁移) |
| POST | `/api/progress/toggle-basic` | `{subject}` | 基础知识 标记/取消 |
| POST | `/api/progress/toggle-hotpoint` | `{point}` | 高频考点 标记/取消 |
| POST | `/api/progress/toggle-video` | `{bv}` | 视频已学 标记/取消 |
| POST | `/api/progress/note-add` | `{title,content}` | 新增笔记 |
| POST | `/api/progress/note-update` | `{id,title,content}` | 修改笔记 |
| POST | `/api/progress/note-delete` | `{id}` | 删除笔记 |
| POST | `/api/progress/share-add` | `{title,content,direction}` | 发布分享 |
| POST | `/api/progress/share-delete` | `{id}` | 删除分享 |

## 说明

- 视频资源均来源于B站(哔哩哔哩),仅供学习交流使用
- 支持供配电与发输变电方向切换,切换后页面内容自动更新
- 方向选择仍保存在浏览器 localStorage (`ee-direction`),不影响账号功能
