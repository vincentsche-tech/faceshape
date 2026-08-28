// GA4 自定义事件封装。仅能在 client component 调用；gtag 未加载时静默 no-op。
// 写库即生效，无需改 layout —— 已通过 Next 的 gtag 初始化（window.gtag）上报。

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type GAEventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * 上报一个 GA4 事件。
 * @param event 事件名（snake_case，如 tool_complete）
 * @param params 事件参数（后续可在 GA4 后台注册为自定义维度后用于细分）
 */
export function trackGA4(event: string, params: GAEventParams = {}): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
