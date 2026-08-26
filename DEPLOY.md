# FaceShape AI · 部署 Runbook

> 代码已就绪：本地 git 仓库已初始化，18 个文件已提交于 `main` 分支，`node_modules`/`.next` 已被 `.gitignore` 排除。
> 设计/SEO 已验证：`npm run build` 通过 14 页静态生成；`/robots.txt` 放行 GPTBot/ClaudeBot/PerplexityBot/Google-Extended；`/sitemap.xml` 含 9 条 URL。

---

## Step 1 · GitHub 建仓（网页，~1 分钟）

1. 打开 github.com → 右上 `+` → **New repository**
2. Repository name：`face-shape-detector`
3. 可见性：**Public**（Private 也行，Vercel 都能导入）
4. **不要**勾选 *Initialize with README* / *Add .gitignore* / *Add license*（保持空仓，避免和本地已提交内容冲突）
5. 点 **Create repository**
6. 把仓库地址发我，形如 `https://github.com/<你的用户名>/face-shape-detector`（或只说 owner 也行）

---

## Step 2 · 推送代码（二选一）

**A. 你本机推**（项目就在 `D:\workbuddy-出海web\face-shape-detector`，若本机有 GitHub 登录态直接跑）：

```bash
cd D:/workbuddy-出海web/face-shape-detector
git remote add origin https://github.com/<OWNER>/face-shape-detector.git
git branch -M main
git push -u origin main
```

**B. 我代推**：你给我一个 GitHub PAT（`repo` 权限，classic 或 fine-grained 均可），我配 remote + push。
> token 仅本次内存使用，不落盘、不回显。

---

## Step 3 · Vercel 部署（网页，~2 分钟，不需我的 token）

1. 打开 vercel.com → **Add New** → **Project**
2. **Import Git Repository** → 选刚建的 `face-shape-detector` → **Deploy**
3. Framework 自动识别为 **Next.js**，Build 命令用 `next build`，无需改
4. 部署完得到公网 HTTPS 链接：`https://<project>.vercel.app`
5. 你本机浏览器打开该链接 → **实测摄像头实时检测**

---

## Step 4 · 上线前 2 个环境变量（Vercel 后台 → Settings → Environment Variables）

| 变量 | 值 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.faceshapeai.com` | 没域名先用 `.vercel.app` 也行；`SITE.url` 解析优先级：此变量 → `VERCEL_URL` → 占位兜底 |
| `NEXT_PUBLIC_ADSENSE_PUB` | `ca-pub-xxxxxx` | 没 AdSense 就留空，组件只渲染占位 div，不触发无效请求 |

配完 **Redeploy** 即可。改这两个变量**不需要改代码**。

---

## 验证清单

- [ ] `/` 摄像头专页：Open Camera → 授权 → 看实时 landmark 检测 + 结果高亮 + chip 深链子页
- [ ] `/face-shapes/oval` 等 7 页：SVG 轮廓、男女发型/眼镜、FAQ 折叠、底部 7 脸型互链
- [ ] `/vs`：对比表 + 评分条 + 差异化段（实时+隐私）
- [ ] `/robots.txt`、`/sitemap.xml`：直接访问看内容
- [ ] view-source 看 `<head>` 里的 `application/ld+json`（专页 3 段、子页 FAQPage/Question）

---

## 注意事项

- **HTTPS 是摄像头硬前提**：`localhost` 和 `*.vercel.app` 都是安全源可调用 `getUserMedia`；自定域必须配 SSL 否则摄像头被禁。
- **MediaPipe 模型**从 jsdelivr CDN 运行时拉取，需联网；无 GPU 自动降级 CPU delegate。
- **哥飞红线**：新页上线走 GSC *URL Inspection → Request Indexing* 加速发现，**不重提交 sitemap**。
- **License**：MediaPipe 模型为 **MPL 2.0**，可商用，须保留版权声明。
