import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import NoseTool from '@/components/NoseTool';

export const metadata: Metadata = {
  title: 'Nose Shape Detector — Live & Free',
  description:
    'Map your nose width and length proportions live in your browser. 478 landmarks, 100% in-browser, no photo upload, no sign-up.',
  alternates: { canonical: '/nose-shape' },
  openGraph: {
    title: 'Nose Shape Detector — Live & Free',
    description: SITE.description,
    url: `${SITE.url}/nose-shape`,
  },
};

const FAQ = [
  {
    q: 'How does the nose shape detector work?',
    a: 'It uses Google\'s MediaPipe FaceLandmarker to map 478 facial landmarks in your browser, then compares your nose width (across the nostrils) and nose length (bridge to tip) against your overall face proportions.',
  },
  {
    q: 'Is my photo private?',
    a: 'Yes. Everything runs locally in your browser. Your camera feed and any uploaded photo never leave your device — no server, no account.',
  },
  {
    q: 'What nose shapes can it detect?',
    a: 'We read the stable, measurable structure: Balanced, Wide, Narrow, Long and Short. Fine subdivisions (e.g. Roman vs aquiline bridge) need a side-profile 3D scan, so we don\'t guess them from a flat photo.',
  },
  {
    q: 'Can I use the result for makeup?',
    a: 'Yes — your nose structure guides where to place contour and highlight so the proportions look balanced.',
  },
];

const moreTools = TOOLS.filter((t) => t.available && t.slug !== 'nose');

const noseLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Nose Shape Detector',
      operatingSystem: 'Any',
      applicationCategory: 'BrowserApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Live, in-browser nose structure detector using MediaPipe FaceLandmarker.',
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

export default function NoseShapePage() {
  return (
    <>
      <NoseTool />

      <section className="steps" id="steps">
        <div className="wrap">
          <h2>How nose shape detection works</h2>
          <div className="steprow">
            <div className="stepcard">
              <div className="stepnum">01</div>
              <h3 className="t">Enable camera</h3>
              <div className="d">Tap once and allow webcam access in your browser.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">02</div>
              <h3 className="t">Hold still 1 second</h3>
              <div className="d">Face the camera straight on, eyes open, for a single moment.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">03</div>
              <h3 className="t">See your structure</h3>
              <div className="d">Get your nose width/length type and contour tip instantly.</div>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(noseLd) }} />
    </>
  );
}
