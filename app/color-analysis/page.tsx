import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { COLOR_SEASONS } from '@/lib/colorSeasons';
import ColorQuiz from '@/components/ColorQuiz';

export const metadata: Metadata = {
  title: 'Color Analysis Quiz — Find Your Season',
  description:
    'Answer 8 quick questions to discover your color season and the shades that flatter you. Free, private, in-browser — no sign-up, no photo upload.',
  alternates: { canonical: '/color-analysis' },
  openGraph: {
    title: 'Color Analysis Quiz — Find Your Season',
    description: SITE.description,
    url: `${SITE.url}/color-analysis`,
  },
};

const FAQ = [
  {
    q: 'How accurate is the color analysis quiz?',
    a: 'It follows classic seasonal color theory — undertone, value and chroma — to point you to your season. It is a practical styling guide, not a lab test, so treat the palette as a strong starting point.',
  },
  {
    q: 'Is my answer data private?',
    a: 'Yes. The whole quiz runs locally in your browser. Nothing you pick is uploaded or stored — no server, no account.',
  },
  {
    q: 'Can my season change over time?',
    a: 'Your undertone is stable, but hair color and tanning can shift which shades suit you day to day. Re-take the quiz whenever your look changes.',
  },
  {
    q: 'What if I seem between two seasons?',
    a: 'Season borders overlap, so the Wear list is the safest guide — start with those shades and borrow from neighboring seasons as you like.',
  },
];

const moreTools = TOOLS.filter((t) => t.available && t.slug !== 'color');

const colorLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Color Analysis Quiz',
      operatingSystem: 'Any',
      applicationCategory: 'BrowserApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free, in-browser seasonal color analysis quiz.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function ColorAnalysisPage() {
  return (
    <>
      <section className="hero" id="detect">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="hero-left">
            <h1>Discover your color season</h1>
            <p className="subhead">
              Answer 8 quick questions about your natural coloring and get the shades that flatter you — your personal palette,
              instantly.
            </p>
            <div className="ctarow">
              <a className="btn-primary" href="#quiz">
                Start the quiz
              </a>
              <a className="btn-secondary" href="#steps">
                How it works
              </a>
            </div>
            <div className="trustrow">
              <span className="trustbadge primary">100% Private</span>
              <span className="trustbadge">No sign-up</span>
              <span className="trustbadge">8 questions</span>
              <span className="trustbadge">Instant result</span>
            </div>
          </div>
          <div className="colorhero">
            {Object.values(COLOR_SEASONS).map((season) => (
              <div className="chcard" key={season.name}>
                <div className="cpal">
                  {season.palette.slice(0, 5).map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                </div>
                <div className="cname">{season.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ColorQuiz />

      <section className="steps" id="steps">
        <div className="wrap">
          <h2>How color analysis works</h2>
          <div className="steprow">
            <div className="stepcard">
              <div className="stepnum">01</div>
              <h3 className="t">Answer 8 questions</h3>
              <div className="d">A few quick picks about your hair, eyes and skin undertones.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">02</div>
              <h3 className="t">See your season</h3>
              <div className="d">Get your season — Spring, Summer, Autumn or Winter.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">03</div>
              <h3 className="t">Get your palette</h3>
              <div className="d">Your wearable shades, what to avoid, and makeup tips.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="moretools">
        <div className="wrap">
          <h2>Explore more tools</h2>
          <div className="mtgrid">
            {moreTools.map((t) => (
              <a key={t.slug} className="mtcard" href={t.href}>
                <div className="mt">{t.name}</div>
                <div className="md">{t.tagline}</div>
              </a>
            ))}
            <a className="mtcard" href="/tools">
              <div className="mt">All Tools</div>
              <div className="md">Browse the full FaceShape AI toolkit</div>
            </a>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="wrap">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="fitem" key={f.q}>
              <div className="q">{f.q}</div>
              <div className="a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(colorLd) }} />
    </>
  );
}
