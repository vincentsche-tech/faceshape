// 站点级常量 —— 部署前请在 Vercel 后台设 NEXT_PUBLIC_SITE_URL / AdSense pub ID
//
// 域名解析优先级：
//   1. NEXT_PUBLIC_SITE_URL → 生产必须设置（你的自定义域 或 推广用的 *.vercel.app 域）
//   2. 兜底占位             → 本地 dev / 未设环境变量时（http://localhost:3000）
//
// ⚠️ 切勿再依赖 VERCEL_URL 作为兜底：它是「构建时的部署域」，Vercel 改项目主域后
//    旧 VERCEL_URL 会变成失效地址（实测踩坑：旧域 302 跳 vercel.com/login，
//    导致 canonical/OG/sitemap 全指向死链，Google 无法正确索引）。
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
  if (process.env.NODE_ENV === "production") {
    // 生产环境没设 NEXT_PUBLIC_SITE_URL → 显式告警，避免静默产出错误 canonical
    console.warn(
      "[site] NEXT_PUBLIC_SITE_URL 未设置，canonical 回退到 localhost。请立即在 Vercel Environment Variables 配置！"
    );
  }
  return "http://localhost:3000";
}

export const SITE = {
  name: "FaceShape AI",
  // TODO(部署): 生产必须在 Vercel 配 NEXT_PUBLIC_SITE_URL
  //             默认 https://www.faceshapeai.app（与 Vercel 301 重定向主域保持一致；
  //             若改非 www 主域，需同步把 Vercel Domains 的 redirect 改回 non-www）。
  //             自定义域绑定：Vercel Domains 加 faceshapeai.app + Cloudflare DNS DNS-only 加 A/CNAME + Vercel 自动签 SSL
  get domain() {
    return resolveSiteUrl().replace(/^https?:\/\//, "");
  },
  get url() {
    return resolveSiteUrl();
  },
  // TODO(变现): 替换为你的真实 Google AdSense 发布商 ID
  adsensePub: "ca-pub-XXXXXX",
  // Google Analytics 4 Measurement ID（G- 开头）
  gaId: "G-Z0PC4GSZ1T",
  tagline: "Real-time face shape detector that runs entirely in your browser.",
  description:
    "Open your camera and see your face shape in real time — no photo upload, no sign-up. Our 478-landmark detector runs in-browser and names your shape.",
};
