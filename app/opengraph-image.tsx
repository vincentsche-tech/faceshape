import { makeOgImage } from '@/lib/ogCard';

// 文件约定：app/opengraph-image.tsx 自动为 / 及各未自定义路由注入 og:image / twitter:image。
// 改为复用 lib/ogCard，使全站 OG 卡视觉统一（首页 = face 卡；eye/nose/body/color 各有独立路由卡）。
export const runtime = 'edge';
export const alt = 'FaceShape AI — detect your face shape from a live camera, free and private';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return makeOgImage({
    title: 'Find Your Face Shape in Real Time',
    subtitle: 'Free · Private · No photo upload · 478 landmarks mapped in your browser',
    chips: ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond', 'Triangle'],
  });
}
