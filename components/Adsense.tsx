'use client';

import { SITE } from '@/lib/site';

// 开发期：SITE.adsensePub 仍是占位 ca-pub-XXXXXX 时，仅渲染占位 div，不触发无效 AdSense 请求。
// 生产启用：把 lib/site.ts 的 adsensePub 换成真实发布商 ID，并给每个广告位分配真实 data-ad-slot，
// 再在 app/layout.tsx 加载 <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />，组件即可渲染真实 <ins>。
export default function Adsense({ slot, className }: { slot: string; className?: string }) {
  const enabled = !SITE.adsensePub.includes('XXXXXX');
  if (!enabled) {
    return (
      <div className={className ?? 'adslot'} aria-label="Advertisement">
        AdSense — {SITE.adsensePub} ({slot})
      </div>
    );
  }
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={SITE.adsensePub}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
