# FaceShape AI — Next.js 生产栈

实时 / 隐私优先的脸部形状检测站。对标 faceshapedetector.app 的阶段 1 MVP：
**Next.js App Router + MediaPipe Tasks Vision（浏览器本地推理）+ Vercel + AdSense**。

## 技术栈
- Next.js 15（App Router, SSG）+ React 19 + TypeScript
- `@mediapipe/tasks-vision@0.10.12`（FaceLandmarker，float16 模型，VIDEO 实时 + IMAGE 上传兜底）
- GPU delegate，自动降级到 CPU（无 GPU 环境不崩）
- Inter 字体；设计系统 1:1 沿用已验证原型（CSS 变量，无 Tailwind 依赖）
- AdSense 占位组件：未配置真实 pub 时只渲染占位 div，不触发无效请求

## 路由
| 路径 | 类型 | 内容 / Schema |
|------|------|--------------|
| `/` | 静态 | 在线摄像头专页：LiveDetector + 7 段静态内容；SoftwareApplication + FAQPage + BreadcrumbList |
| `/face-shapes/[shape]` | SSG（7 页） | 7 脸型子页：Hero+特征+男女发型+眼镜+7 脸型互链+FAQ；FAQPage + BreadcrumbList |
| `/vs` | 静态 | 对比页：截流 faceshapedetector.app 品牌词 / best / alternatives；对比表+评分+差异化；FAQPage |
| `/robots.txt` | 动态 | 放行 `*` + GPTBot / ChatGPT-User / ClaudeBot / PerplexityBot / Google-Extended |
| `/sitemap.xml` | 动态 | 9 URL：专页 + 7 子页 + /vs |

## 本地运行
```bash
npm install
npm run dev      # 开发：http://localhost:3000
npm run build    # 生产构建（已验证 14 页全部生成）
npm run start    # 生产服务
```

## 上线前 Checklist（2 个 TODO）
1. **域名（已解耦，可后补）**：`lib/site.ts` 的 `SITE.url` 改为环境变量驱动，优先级
   `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL`（Vercel 自动 `*.vercel.app`）→ 占位兜底。
   → **未注册域名也能先部署到 Vercel 拿真实 HTTPS 验证**（摄像头/AdSense-ready）。
   → 注册好域名后，仅在 Vercel 项目设 `NEXT_PUBLIC_SITE_URL=https://www.xxx.com` 即可，无需改代码。
   （Vercel 强制裸域 308→www，URL 以 www 为准。）
2. **变现**：把 `lib/site.ts` 的 `adsensePub` 换成真实 `ca-pub-xxxxxxxx`；并为每个广告位分配真实
   `data-ad-slot`；再在 `app/layout.tsx` 加载
   `<Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />`（组件即渲染真实 `<ins>`）。

## 部署 SOP（建站 SOP 清单 v1.0）
domain → Cloudflare → GitHub → Vercel。Vercel 项目根即本目录。
GEO 前置：robots 已放行 LLM crawler，便于 AI 概述引用。

## SEO 红线（哥飞，沿用）
- 改既有 URL 内容 **不重提交 sitemap**；谷歌会自然重抓。
- 新增页（如本仓库的 /vs、7 子页）上线后走 **GSC URL Inspection → Request Indexing** 加速发现，
  动态 sitemap 已含这些 URL，无需日常重提交。

## 说明
- `classify()` 为原型级启发式（468 landmark 比例判定），生产建议用标注数据集校准。
- 摄像头/上传/模型加载均为客户端逻辑（`components/LiveDetector.tsx`，`'use client'`），构建期不执行。
