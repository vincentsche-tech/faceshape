# 部署收尾 Checklist（活文档）

> 用途：每次「代码改完 → 上线」之间，按顺序过一遍，避免 README/DEPLOY 滞后于代码导致反复返工。
> 维护原则：**代码改了什么，这里同步改什么**。任何 `lib/site.ts` 逻辑变动都要回头更新本表对应项。

---

## 0. 上线前自检（每次必做）

- [ ] `npx tsc --noEmit` 通过（无类型错误）
- [ ] `npm run build` 通过（Next.js 全路由编译成功）
- [ ] 本地 dev 实测核心路径（摄像头/表单/结果页）

---

## 1. 域名 / URL 切换（换域或改主域）

**触发**：注册域名、改 `NEXT_PUBLIC_SITE_URL`、调整 www/非 www 主域。

1. **Vercel → Settings → Environment Variables**
   - 设 `NEXT_PUBLIC_SITE_URL`（如 `https://www.faceshapeai.app`）
   - ⚠️ **改 `NEXT_PUBLIC_*` 后不会自动重部署** —— 必须手动 Redeploy，或 push 一行改动触发新构建（`NEXT_PUBLIC_*` 是构建期内联进 bundle 的）
2. **Vercel → Settings → Domains**
   - 添加自定义域 → 按页面给的 DNS 记录加（以 Vercel 实际值为准，勿抄死值）
   - 设 www 主域（非 www 自动 301→www）
3. **Cloudflare DNS**（faceshapeai.app 后台 → DNS → Records）
   - A `@` → Vercel 给的 A 值；CNAME `www` → `cname.vercel-dns.com`
   - ⚠️ **Proxy status 必须 DNS-only（灰色云）**，否则 Cloudflare 接管 443，Vercel 签不出 Let's Encrypt
4. **部署完成后验证（curl）**：
   ```bash
   # 1) 非 www 应 301 跳 www
   curl -sI https://faceshapeai.app/ | grep -iE 'HTTP/|location'
   # 2) canonical / og:url / og:image 必须带 www（与重定向一致）
   curl -s https://www.faceshapeai.app/ | grep -ioE '<link rel="canonical"[^>]*>|<meta property="og:url"[^>]*>|<meta property="og:image"[^>]*>'
   # 3) sitemap 内 URL 全部为新域
   curl -s https://www.faceshapeai.app/sitemap.xml | grep -oE 'https://[^<]+' | head
   ```
   任一项残留旧域 → 说明 env 没真烧进新构建，回到步骤 1 重来。

---

## 1.5. SEO Title / Description 长度（Gotcha ⚠️）

**踩坑复盘（2026-08-27 一次全站返工）**：

- 11 个页面（4 个工具 + 7 个脸型子页）title/description 超 Google 显示上限
- 4 工具 T: 65-73（标准 ≤60）
- 7 脸型 T+D 双超：T 72-76 / D 168-174（标准 ≤160）

**根因**：`app/layout.tsx` 的 `title.template = '%s · FaceShape AI'` 自动加 14 字符品牌后缀，**所以每页 title 输入 ≤ 46 字符**，否则渲染出来超限。

**长度规则**（设计/`lib/*.ts` 时按这个走）：

| 项 | 上限 | 加成后 |
|---|---|---|
| Title 输入 | **≤ 46 字符** | + 14 (品牌后缀) = **≤ 60** |
| Description | ≤ 160 字符 | — |

**验收脚本**（每次部署前跑一次，已固化在 `scripts/audit_seo.py`）：

```bash
python scripts/audit_seo.py
```

输出任意 `T[XX]` 或 `D[XX]` 标签 = 超限，回对应文件改。

**新增页面时**：先把元数据写进 `lib/<feature>.ts` 数据源（标题 ≤ 46、描述 ≤ 155 给 5 字符 buffer），再让 `app/<feature>/page.tsx` 通过 `generateMetadata` 或 metadata 静态字段拉取。

---

## 2. AdSense 变现（当前占位：未接）

**代码现状**（`lib/site.ts` + `components/Adsense.tsx`）：
- `SITE.adsensePub` = `"ca-pub-XXXXXX"`（占位）
- `components/Adsense.tsx` 第 10 行：`if (SITE.adsensePub.includes('XXXXXX')) return null` —— **占位时整站广告位不渲染任何框，避免空白块与无效请求**

**接入步骤**：
1. 把 `lib/site.ts` 的 `adsensePub` 换成真实 `ca-pub-xxxxxxxx`
2. 每个广告位 `<Adsense slot="..." />` 分配真实 `data-ad-slot`（AdSense 后台创建广告单元拿到的 slot ID）
3. `app/layout.tsx` 加载 `<Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />`
4. redeploy 后确认广告位出现（不会再有 `return null` 隐藏）

> ⚠️ 没 AdSense 就**保持占位**即可，组件已自动隐藏，不必动代码。

---

## 3. Google Analytics（已接）

- `lib/site.ts`：`gaId: "G-Z0PC4GSZ1T"`（已填真实 ID）
- `app/layout.tsx`：`next/script` 接入 gtag.js + init（afterInteractive），含 `googletagmanager.com` 预连接
- 验证：GA4 后台 → 实时报告 → 打开站点应看到活跃用户 1；或查看网页源代码搜 `G-Z0PC4GSZ1T`
- 多环境需要不同 ID 时 → 改读 `NEXT_PUBLIC_GA_ID` env（当前单环境硬编码足够）

---

## 4. 代码 ↔ 文档一致性（最高频返工点）

每次改动后，确认这三处文档与 `lib/site.ts` **实际逻辑**一致：

| 文档 | 易错点 | 正确值 |
|---|---|---|
| `README.md` | 上线 Checklist 域名段 | 已上线 → 写 `https://www.faceshapeai.app`，移除过时的 `VERCEL_URL` fallback 说法 |
| `DEPLOY.md` | env 表域名 | `.com` 是错字，必须是 `.app`；AdSense 是改 `lib/site.ts` 字段，**不是** `NEXT_PUBLIC_ADSENSE_PUB` env |
| `README.md` | landmark 计数 | **478**（非 468）—— 与 `lib/faceShapes.ts` 一致 |

---

## 5. SEO / GSC 红线（哥飞规范）

- **改既有 URL（标题/内容/标签） → ❌ 不重交 sitemap**，Google 自己重抓；想快点就走 GSC → URL Inspection → Request Indexing
- **仅以下情况可一次性提交**（命中红线豁免）：
  ① 新站首次上线 ② 换域名/整体迁移 ③ sitemap URL 变了（换生成器）
- 换域时：GSC 加新 Property（DNS TXT 验证最省事）→ 提交 sitemap 一次 → 核心 5–6 页逐个 URL Inspection 催收录
- 新页面只需确保进了动态 `sitemap.xml`，爬虫顺内链即可发现

---

## 6. CSS Grid + 原生表单元素（经典坑）

- **症状**：`<input type="number">` 默认 `size=20` + padding 28 + border 3 + spinner 17 ≈ 228px min-content；grid 裸 `1fr` 实际是 `minmax(auto, 1fr)`，尊重子项 min-content，导致多列被顶出父容器（如 Body 表单 Hips 字段飘到卡片外）
- **修法**：列定义用 `repeat(3, minmax(0, 1fr))` + grid 子项 `min-width: 0` + input `width: 100%; min-width: 0; box-sizing: border-box`
- **规则**：任何带原生表单元素的 grid，第一反应就是 `minmax(0, 1fr)`，不要用裸 `1fr`

---

## 7. 博客 / 内容矩阵范式（数据驱动）

**适用场景**：支撑博客、对比页、扩展内容矩阵等**与工具页抢意图则让位**的内容。

**三个反踩坑原则**：
1. **选题互补工具页**：避开「检测/工具」意图（那已被 `/face-shape` 等覆盖），专攻「how to / vs / for X」长尾
2. **每篇必须导流**：底部「相关工具」CTA 卡链回 Face/Eye/Nose/Color/Body，形成内链权重闭环
3. **复用视觉 token**：复用 lilac/purple 主题 + Inter，**不要另起设计语言**

**数据驱动骨架**（以博客为例，照搬到对比页/Hub 子页都行）：

```
app/blog/page.tsx              # 列表页（SSG，遍历数据源）
app/blog/[slug]/page.tsx       # 详情页（generateStaticParams 全部 SSG）
lib/blogPosts.ts               # ← 数据源（一切内容在这里）
app/sitemap.ts                 # 加 BLOG 路由
app/layout.tsx                 # Nav + Footer 加入口
```

**`lib/blogPosts.ts` 每条记录的字段约束**：

| 字段 | 约束 | 来源§1.5 重申 |
|---|---|---|
| `title` | ≤ 46 字符（加品牌后缀 ≤ 60）| §1.5 |
| `description` | ≤ 155 字符（留 5 buffer）| §1.5 |
| `slug` | URL 友好短词，2-5 段 `-` 分隔 | — |
| `excerpt` | ≤ 160 字符，给列表页卡片用 | — |
| `readTime` | "X min read"，按 200 wpm 估算 | — |
| `category` | 单选枚举，避免分类爆炸 | — |
| `relatedTools` | 1-3 个 `{href, label}`，必须有导流目标 | §5 内链闭环 |
| `body` | 数组，元素是 `{type, text}` 段落；不放 inline JSX 让序列化稳定 | — |
| `publishDate` | ISO 字符串，便于排序和 future 排序 | — |

**新增一篇博客的 SOP**：

1. 在 `lib/blogPosts.ts` 数组末尾 push 一条记录（标题/描述按 §1.5 长度）
2. `app/blog/[slug]/page.tsx` 的 `generateStaticParams` 自动接住，无需改代码
3. `app/sitemap.ts` 自动接住（`BLOG_SLUGS.map(...)`）
4. `npx tsc --noEmit && npx next build` —— 验证新路由 SSG 成功
5. `python scripts/audit_seo.py` —— 验证新页 SEO 长度合规
6. 推送 → Vercel 自动重部署 → 新 URL 收录

> 不新建独立路由文件 = 加内容 = 加数据 = 0 文件改动。这一条可作为后续所有"内容驱动页"的范式。

---

## 8. SEO 审计脚本（部署前必跑）

**位置**：`scripts/audit_seo.py`

**设计意图**：替代记忆性标题长度检查，自动读 sitemap.xml 覆盖全部页面，**以后加页自动覆盖审计范围**。

**用法**：

```bash
python scripts/audit_seo.py
```

**输出约定**：
- `OK` = 该页 T/D 都合规
- `T[XX]` = Title 超限当前 XX 字符
- `D[XX]` = Description 超限当前 XX 字符
- `404` / `ERR` = 该 URL 抓取失败（sitemap/路由不一致）

**集成进 PR / Deploy 流程**：
- 部署前本地跑一次，0 个 `T[` / `D[` 标签才能 push
- CI（如未来接入）可在 GitHub Action 加 `python scripts/audit_seo.py` 步骤，失败则 block merge

**审计规则同步**：
- 长度阈值在脚本里硬编码（60/160），如未来调品牌后缀长度（如换成 `· FaceShape AI powered by X`），**脚本里这俩数字也要同步改**
- 软阈值（描述在 100-160 之间打 `✓`）只用于观察，不挡部署

**审计脚本也曾踩坑**：早期版 hardcoded 14 个手动维护的路径，加博客后立刻陈旧；改成读 sitemap.xml 后永远跟站点同步。

---

## 变动记录

| 日期 | 变更 |
|---|---|
| 2026-08-27 | 新建本活文档；收敛 AdSense/GA/域名/SEO 收尾流程与踩坑 |
| 2026-08-27 | 加 §1.5 SEO 长度规则 + `scripts/audit_seo.py` 自动审计 |
| 2026-08-27 | 加 §6 CSS Grid `minmax(0,1fr)` 规则 |
| 2026-08-27 | 加 §7 博客数据驱动范式 + §8 SEO 审计脚本 SOP（部署前必跑） |
