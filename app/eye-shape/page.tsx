import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { TOOLS } from '@/lib/tools';
import EyeTool from '@/components/EyeTool';

export const metadata: Metadata = {
  title: 'Eye Shape Detector Online Camera — Live & Free',
  description:
    'Open your camera and detect your eye shape, canthal tilt and setting in real time. 478 landmarks, 100% in-browser, no photo upload, no sign-up.',
  alternates: { canonical: '/eye-shape' },
  openGraph: {
    title: 'Eye Shape Detector Online Camera — Live & Free',
    description: SITE.description,
    url: `${SITE.url}/eye-shape`,
  },
};

const FAQ = [
  {
    q: 'How does the eye shape detector work?',
    a: 'It uses Google\'s MediaPipe FaceLandmarker to map 478 facial landmarks in your browser, then reads each eye\'s height-to-width ratio and canthal tilt (the angle of your inner vs outer corner).',
  },
  {
    q: 'Is my photo private?',
    a: 'Yes. Everything runs locally in your browser. Your camera feed and any uploaded photo never leave your device — no server, no account.',
  },
  {
    q: 'What eye shapes can it detect?',
    a: 'Almond, Round, Upturned and Downturned. Hooded and monolid depend on the eyelid crease, which a flat 2D photo cannot read reliably, so we don\'t guess them.',
  },
  {
    q: 'Can my eye shape change?',
    a: 'The structure — shape and tilt — is stable. Makeup changes the look, not the underlying shape.',
  },
];

const moreTools = TOOLS.filter((t) => t.available && t.slug !== 'eye');

const eyeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Eye Shape Detector',
      operatingSystem: 'Any',
      applicationCategory: 'BrowserApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: 'Live, in-browser eye shape detector using MediaPipe FaceLandmarker.',
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

export default function EyeShapePage() {
  return (
    <>
      <EyeTool />

      <section className="steps" id="steps">
        <div className="wrap">
          <h2>How eye shape detection works</h2>
          <div className="steprow">
            <div className="stepcard">
              <div className="stepnum">01</div>
              <h3 className="t">Enable camera</h3>
              <div className="d">Tap once and allow webcam access in your browser.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">02</div>
              <h3 className="t">Hold still 1 second</h3>
              <div className="d">Keep your face in frame, eyes open, for a single moment.</div>
            </div>
            <div className="stepcard">
              <div className="stepnum">03</div>
              <h3 className="t">See your shape</h3>
              <div className="d">Get your eye shape, tilt and makeup tip instantly.</div>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eyeLd) }} />
    </>
  );
}
