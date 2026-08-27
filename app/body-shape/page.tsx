import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import { BODY_SHAPES, BODY_SHAPE_ORDER } from '@/lib/bodyShapes';
import BodyMeasure from '@/components/BodyMeasure';

export const metadata: Metadata = {
  title: 'Body Shape Calculator — Find Your Shape',
  description:
    'Enter your shoulder, waist and hip measurements to find your body shape and get personalized clothing suggestions. Free, private, in-browser — no sign-up.',
  alternates: { canonical: '/body-shape' },
  openGraph: {
    title: 'Body Shape Calculator — Find Your Shape',
    description: SITE.description,
    url: `${SITE.url}/body-shape`,
  },
};

const FAQ = [
  {
    q: 'How do I measure accurately?',
    a: 'Use the same unit for all three. Shoulders: straight across the widest point. Waist: the narrowest part, usually above the navel. Hips: around the fullest part.',
  },
  {
    q: 'Is my measurement data private?',
    a: 'Yes. The calculator runs entirely in your browser. Your numbers are never uploaded or stored — no server, no account.',
  },
  {
    q: 'What if my measurements fall between shapes?',
    a: 'The calculator returns the closest match from your ratios. The Wear and Avoid tips for that shape still apply as a reliable styling guide.',
  },
  {
    q: 'Does weight change my body shape?',
    a: 'Weight changes overall size, but your shape category is about proportions (shoulder-to-waist-to-hip ratios), which stay fairly stable. The guidance follows your proportions.',
  },
];

const moreTools = TOOLS.filter((t) => t.available && t.slug !== 'body');

const bodyLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Body Shape Calculator',
      operatingSystem: 'Any',
      applicationCategory: 'BrowserApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Free, in-browser body shape calculator from shoulder, waist and hip measurements.',
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

export default function BodyShapePage() {
  return (
    <>
      <section className="hero" id="detect">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="hero-left">
            <h1>Find your body shape</h1>
            <p className="subhead">
              Enter three measurements and see your body shape — plus the cuts that flatter your proportions. Private, instant, no
              sign-up.
            </p>
            <div className="ctarow">
              <a className="btn-primary" href="#measure">
                Measure now
              </a>
              <a className="btn-secondary" href="#steps">
                How it works
              </a>
            </div>
            <div className="trustrow">
              <span className="trustbadge primary">100% Private</span>
              <span className="trustbadge">No sign-up</span>
              <span className="trustbadge">3 measurements</span>
              <span className="trustbadge">Instant result</span>
            </div>
          </div>
          <div className="bodyhero">
            {BODY_SHAPE_ORDER.map((name) => (
              <div className="bhcard" key={name}>
                <svg viewBox="0 0 200 240" aria-hidden="true">
                  <circle cx="100" cy="34" r="16" fill="#E9E6FB" stroke="#6D5DFC" strokeWidth="2.5" />
                  <path d={BODY_SHAPES[name].svg} fill="#E9E6FB" stroke="#6D5DFC" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
                <div className="bhname">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BodyMeasure />

      <section className="steps" id="steps">
        <div className="wrap">
          <h2>How the body shape calculator works</h2>
          <div className="steprow">
            <div className="stepcard">
              <div className="stepnum">01</div>
              <h3 className="t">Enter 3 measurements</h3>
              <div className="d">Shoulders, waist and hips — all in the same unit.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">02</div>
              <h3 className="t">See your shape</h3>
              <div className="d">Get your shape — Hourglass, Pear, Apple, Rectangle or Inverted Triangle.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">03</div>
              <h3 className="t">Get styling tips</h3>
              <div className="d">What to emphasize, what to minimize, and what to wear.</div>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bodyLd) }} />
    </>
  );
}
