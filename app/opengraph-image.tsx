import { ImageResponse } from 'next/og';

// 文件约定：app/opengraph-image.tsx 会自动为全站所有路由注入 og:image / twitter:image
// 自包含（无外部素材），Vercel 运行时用 next/og 动态生成 1200x630 分享卡。
export const runtime = 'edge';
export const alt = 'FaceShape AI — detect your face shape from a live camera, free and private';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #6D5DFC 0%, #4B3FD1 100%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            ◑
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 0.5 }}>FaceShape AI</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 820 }}>
          Find Your Face Shape in Real Time
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: 'rgba(255,255,255,0.85)' }}>
          Free · Private · No photo upload · 478 landmarks mapped in your browser
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 40,
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <span>Oval</span>
          <span>·</span>
          <span>Round</span>
          <span>·</span>
          <span>Square</span>
          <span>·</span>
          <span>Heart</span>
          <span>·</span>
          <span>Oblong</span>
          <span>·</span>
          <span>Diamond</span>
          <span>·</span>
          <span>Triangle</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
