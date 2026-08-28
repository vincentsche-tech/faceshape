'use client';

import { useEffect } from 'react';
import { trackGA4 } from '@/lib/analytics';

// 滚动深度事件：到达 50% / 90% 各上报一次（per page load）。
// 装在 RootLayout，覆盖全站所有页面，用于衡量内容参与度。
export default function ScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>();
    const marks = [50, 90];
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;
      for (const m of marks) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackGA4('scroll_depth', { depth: m });
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
