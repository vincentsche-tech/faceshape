import { ImageResponse } from 'next/og';

// Shared OG card renderer for faceshapeai.app per-page social previews.
// Mirrors the live root opengraph-image.tsx visual system (purple gradient,
// ◑ logo, bold title, subtitle, shape/tool chips) so every route shares one
// consistent brand look. Generated at request time via next/og — no static
// assets to ship or keep in sync.
export function makeOgImage({
  title,
  subtitle,
  chips,
}: {
  title: string;
  subtitle: string;
  chips: string[];
}) {
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
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: 'rgba(255,255,255,0.85)' }}>
          {subtitle}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 40,
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
            flexWrap: 'wrap',
          }}
        >
          {chips.map((c, i) => (
            <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {i > 0 ? <span style={{ opacity: 0.5 }}>·</span> : null}
              <span>{c}</span>
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
