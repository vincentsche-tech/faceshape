import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import LiveDetector from '@/components/LiveDetector';

export const metadata: Metadata = {
  title: { absolute: 'Face Shape Detector Online Camera — Real-Time & Free' },
  description: SITE.description,
  alternates: { canonical: '/' },
};

const FAQ = [
  {
    q: 'Is the online camera detector free?',
    a: 'Yes — completely free, with no account required.',
  },
  {
    q: 'Does my photo get uploaded?',
    a: 'No. Everything runs locally in your browser; nothing is sent to a server.',
  },
  {
    q: 'How accurate is the live camera?',
    a: 'It uses the same 468-point model as photo upload, with live averaging for steadier reads.',
  },
  {
    q: 'Camera or upload — which is more accurate?',
    a: 'They are equally accurate. Camera is faster and better for trying angles.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. It runs in any modern mobile browser with camera access.',
  },
];

const SHAPES = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond', 'triangle'];

const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Face Shape Detector Online Camera',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'live camera',
    'real-time face detection',
    '468 facial landmarks',
    'no upload',
    'browser local processing',
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Face Shape Detector Online Camera',
      item: SITE.url + '/',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <LiveDetector />

      {/* 3. Why live */}
      <section className="whylive">
        <div className="wrap">
          <h2>Why live camera beats upload</h2>
          <div className="diffrow">
            <div className="diffcard">
              <div className="t">Instant feedback</div>
              <div className="d">
                See your shape the moment the camera opens — no waiting, no upload.
              </div>
            </div>
            <div className="diffcard">
              <div className="t">Try angles live</div>
              <div className="d">Turn your head and watch the readout respond in real time.</div>
            </div>
            <div className="diffcard">
              <div className="t">No photo hunt</div>
              <div className="d">Skip scrolling your album for the one good selfie.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Steps */}
      <section className="steps" id="steps">
        <div className="wrap">
          <h2>How it works in 3 steps</h2>
          <div className="steprow">
            <div className="stepcard">
              <div className="t">1 · Enable camera</div>
              <div className="d">Tap once and allow webcam access in your browser.</div>
            </div>
            <div className="stepcard">
              <div className="t">2 · Hold still 1 second</div>
              <div className="d">Keep your face in frame for a single moment.</div>
            </div>
            <div className="stepcard">
              <div className="t">3 · See your shape</div>
              <div className="d">Get your shape, confidence and style tips instantly.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Shapes */}
      <section className="shapes" id="shapes">
        <div className="wrap">
          <h2>All 7 face shapes</h2>
          <div className="shapegrid">
            {SHAPES.map((s) => (
              <a key={s} href={`/face-shapes/${s}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Camera vs upload */}
      <section className="cvu">
        <div className="wrap">
          <h2>Camera vs upload: which is more accurate?</h2>
          <div className="qa">
            <div className="q">Is live camera as accurate as uploading a photo?</div>
            <div className="a">
              Yes. Both run the same 468-point MediaPipe model — live just reads frames continuously
              instead of one still.
            </div>
          </div>
          <div className="qa">
            <div className="q">Does my photo ever leave my device?</div>
            <div className="a">
              No. Detection runs 100% in your browser; nothing is uploaded or stored.
            </div>
          </div>
          <div className="qa">
            <div className="q">Which one should I use?</div>
            <div className="a">
              Camera is fastest and best for trying angles live; upload works if your webcam is
              unavailable.
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust */}
      <section className="trust">
        <div className="wrap">
          <h2>Why this is the best online-camera face shape detector</h2>
          <div className="trustbar">
            <div className="t">Free and unlimited — no credits, no paywall, no sign-up.</div>
          </div>
          <div className="trustbar">
            <div className="t">Real-time, not a snapshot — watch results update as you move.</div>
          </div>
          <div className="trustbar">
            <div className="t">
              Runs locally in your browser — your camera feed never leaves the device.
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
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

      {/* 10. Closing CTA */}
      <section className="closing">
        <div className="wrap">
          <div>
            <h2>Open your camera and see your shape now</h2>
            <p>Free, no upload, no sign-up. Runs entirely in your browser.</p>
          </div>
          <a className="btn" href="/#detect">
            Open Camera &amp; Detect
          </a>
        </div>
      </section>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
