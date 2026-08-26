import type { Metadata } from 'next';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Beauty Tools — FaceShape AI',
  description:
    'A growing suite of free, private, in-browser beauty tools: face shape, eye shape and nose shape detectors — plus color analysis and body shape coming soon.',
  alternates: { canonical: '/tools' },
};

const CATS: { key: 'features' | 'colors'; title: string; sub: string }[] = [
  { key: 'features', title: 'Know my features', sub: 'Live detectors that read your facial structure from 478 landmarks' },
  { key: 'colors', title: 'Find my colors', sub: 'Discover the shades and shapes that flatter you' },
];

export default function ToolsPage() {
  return (
    <section className="hub">
      <div className="wrap">
        <h1>Beauty tools, free &amp; private</h1>
        <p className="sub">
          Every tool runs entirely in your browser — no photo upload, no sign-up, no data leaving your device. Start with what you want to
          discover.
        </p>

        <div className="hubcats">
          {CATS.map((cat) => {
            const items = TOOLS.filter((t) => t.category === cat.key);
            return (
              <div className="hubcat" key={cat.key}>
                <h2>{cat.title}</h2>
                <p className="hubsub">{cat.sub}</p>
                <div className="hubgrid">
                  {items.map((t) =>
                    t.available ? (
                      <a className="hubcard" href={t.href} key={t.slug}>
                        <span className="htag">{t.type === 'camera' ? 'Live camera' : t.type === 'quiz' ? 'Quiz' : 'Measure'}</span>
                        <div className="ht">{t.name}</div>
                        <div className="hb">{t.blurb}</div>
                        <div className="hgo">Open tool →</div>
                      </a>
                    ) : (
                      <div className="hubcard soon" key={t.slug}>
                        <span className="htag">Coming soon</span>
                        <div className="ht">{t.name}</div>
                        <div className="hb">{t.blurb}</div>
                        <div className="hgo">In progress</div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
