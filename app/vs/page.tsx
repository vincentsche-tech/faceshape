import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { ShieldIcon, UserIcon, CpuIcon, LockIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: {
    absolute: 'FaceShape AI vs Other Face Shape Detectors — Live, Private & Free',
  },
  description:
    'Compare FaceShape AI with other face shape detectors. See why a real-time, in-browser, no-upload detector beats photo-based tools — and which alternatives people consider.',
  alternates: { canonical: '/vs' },
  openGraph: {
    title: 'FaceShape AI vs Other Face Shape Detectors',
    description:
      'Real-time, in-browser, no-upload face shape detection — compared with photo-based detectors.',
    url: `${SITE.url}/vs`,
  },
  twitter: {
    title: 'FaceShape AI vs Other Face Shape Detectors',
    description: 'Real-time, in-browser, no-upload face shape detection.',
  },
};

const ROWS = [
  { feat: 'Live camera, real-time readout', us: 'Yes — instant, updates as you move', them: 'Photo only — no live preview' },
  { feat: 'Privacy — no image leaves your device', us: 'Yes — 100% in-browser', them: 'Usually requires uploading the photo' },
  { feat: 'Free & no sign-up', us: 'Yes', them: 'Varies by tool' },
  { feat: 'Landmark precision (468 pts)', us: 'Yes', them: 'Varies by tool' },
  { feat: 'No app install (browser-native)', us: 'Yes — any modern browser', them: 'App download or upload flow' },
  { feat: 'Mobile-friendly', us: 'Yes', them: 'Varies by tool' },
  { feat: 'Instant result (no wait)', us: 'Yes', them: 'Wait for upload + processing' },
];

const SCORE = [
  { label: 'Real-time detection', us: 10, them: 7 },
  { label: 'Privacy (no upload)', us: 10, them: 5 },
  { label: 'Free & no sign-up', us: 10, them: 7 },
  { label: 'Landmark precision', us: 9, them: 8 },
  { label: 'No app / browser-native', us: 10, them: 6 },
  { label: 'Mobile experience', us: 9, them: 8 },
];

const ALTERNATIVES = [
  {
    name: 'faceshapedetector.app',
    note: 'A web-based face shape detector that many people search for by name. Like most detectors it works from a photo.',
  },
  {
    name: 'Hiface',
    note: 'A mobile app for face shape analysis and styling suggestions, oriented toward an installed-app experience.',
  },
];

const FAQ = [
  {
    q: 'Is FaceShape AI free?',
    a: 'Yes — completely free, with no account or sign-up required.',
  },
  {
    q: 'Does FaceShape AI upload my photo?',
    a: 'No. Detection runs entirely in your browser; nothing is uploaded or stored on a server.',
  },
  {
    q: 'How is it different from photo-based detectors?',
    a: 'FaceShape AI can read your shape live from the camera in real time, with no upload — most alternatives analyze a photo you send.',
  },
  {
    q: 'Do I need to install an app?',
    a: 'No. It runs in any modern browser on desktop or mobile; there is nothing to download.',
  },
];

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
    { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE.url}/vs` },
  ],
};

export default function VsPage() {
  return (
    <>
      <section className="vshero">
        <div className="wrap">
          <h1>FaceShape AI vs other face shape detectors</h1>
          <p className="sub">
            Most face shape tools ask you to upload a photo. FaceShape AI reads your shape live,
            in your browser, with nothing leaving your device. Here is the honest side-by-side.
          </p>

          <table className="cmptable">
            <thead>
              <tr>
                <th>Capability</th>
                <th className="best">FaceShape AI</th>
                <th>Photo-based detectors</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.feat}>
                  <td>{r.feat}</td>
                  <td className="best yes">{r.us}</td>
                  <td className="no">{r.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="featsec">
        <div className="wrap">
          <h2>Our assessment, scored</h2>
          <div className="scorecard">
            {SCORE.map((s) => (
              <div className="scard" key={s.label}>
                <div className="sclabel">{s.label}</div>
                <div className="scbar">
                  <span className="scus" style={{ width: `${(s.us / 10) * 100}%` }} />
                  <span className="scthem" style={{ width: `${(s.them / 10) * 100}%` }} />
                </div>
                <div className="scval">
                  <b>{s.us}</b> / {s.them}
                </div>
              </div>
            ))}
          </div>
          <p className="scnote">
            Scores are our own assessment of the live, in-browser approach vs the average
            photo-upload detector. Your mileage may vary by tool.
          </p>
        </div>
      </section>

      <section className="hairsec">
        <div className="wrap">
          <h2>Why FaceShape AI is different</h2>
          <div className="vsdiff">
            <div className="vscol">
              <h3>{ShieldIcon} Real-time, not a snapshot</h3>
              <p>
                Open the camera and your shape appears instantly, updating as you turn your head.
                No waiting on an upload, no guessing which angle to pick.
              </p>
            </div>
            <div className="vscol">
              <h3>{LockIcon} Private by design</h3>
              <p>
                Everything runs locally in your browser. Your camera feed and photos never leave the
                device — there is nothing to upload and nothing to store.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glasssec">
        <div className="wrap">
          <h2>Other tools people compare</h2>
          <div className="altlist">
            {ALTERNATIVES.map((a) => (
              <div className="altitem" key={a.name}>
                <div className="altname">{a.name}</div>
                <div className="altnote">{a.note}</div>
              </div>
            ))}
          </div>
          <p className="scnote">
            These are independent products. If you want a live, no-upload, browser-native
            experience, FaceShape AI is built exactly for that.
          </p>
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

      <section className="closing">
        <div className="wrap">
          <div>
            <h2>Try the live, private detector</h2>
            <p>Free, no upload, no sign-up. Runs entirely in your browser.</p>
            <div className="privnote">
              <span className="trustbadge primary">{UserIcon}468 Landmarks</span>
              <span className="trustbadge primary">{CpuIcon}Local Processing</span>
            </div>
          </div>
          <a className="btn" href="/">
            Open Camera &amp; Detect
          </a>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
