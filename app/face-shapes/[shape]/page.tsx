import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { FACE_SHAPES, FACE_SHAPE_ORDER, getFaceShape } from '@/lib/faceShapes';
import { ShieldIcon, UserIcon, CpuIcon, LockIcon } from '@/components/icons';

type Params = { shape: string };

// 镜框形状图鉴 —— 让 glasses 段里的 "round / cat-eye / aviator" 等词一眼可辨。
const FRAMES = [
  { name: 'Round', svg: <circle cx="22" cy="20" r="15" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
  { name: 'Square', svg: <rect x="9" y="7" width="26" height="26" rx="4" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
  { name: 'Rectangle', svg: <rect x="5" y="11" width="34" height="18" rx="3" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
  { name: 'Oval', svg: <ellipse cx="22" cy="20" rx="17" ry="13" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
  { name: 'Cat-eye', svg: <path d="M7 25 Q9 9 22 12 Q35 9 37 25 Q22 31 7 25 Z" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
  { name: 'Aviator', svg: <path d="M8 14 Q22 9 36 14 Q37 28 22 30 Q7 28 8 14 Z" fill="none" stroke="#6D5DFC" strokeWidth="2" /> },
];

export function generateStaticParams() {
  return FACE_SHAPE_ORDER.map((shape) => ({ shape }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { shape } = await params;
  const d = getFaceShape(shape);
  if (!d) return {};
  return {
    title: d.title,
    description: d.desc,
    alternates: { canonical: `/face-shapes/${d.slug}` },
    openGraph: { title: d.title, description: d.desc, url: `${SITE.url}/face-shapes/${d.slug}` },
    twitter: { title: d.title, description: d.desc },
  };
}

export default async function FaceShapePage({ params }: { params: Promise<Params> }) {
  const { shape } = await params;
  const d = getFaceShape(shape);
  if (!d) notFound();
  const art = d.name[0].match(/[AEIOU]/i) ? 'an' : 'a';

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faqs.map((f) => ({
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
      {
        '@type': 'ListItem',
        position: 3,
        name: `${d.name} Face Shape`,
        item: `${SITE.url}/face-shapes/${d.slug}`,
      },
    ],
  };

  return (
    <>
      <section className="shapehero">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="shapeleft">
            <h1>{d.h1}</h1>
            <p className="subhead">{d.sub}</p>
            <div className="ctarow">
              <a className="btn-primary" href="/">
                Check yours live
              </a>
              <a className="btn-secondary" href="#hair">
                Hairstyles &amp; glasses
              </a>
            </div>
            <div className="trustrow">
              <span className="trustbadge primary">
                {ShieldIcon}100% Private &amp; Secure
              </span>
              <span className="trustbadge">{UserIcon}478 Landmarks</span>
              <span className="trustbadge">{CpuIcon}Local Processing</span>
              <span className="trustbadge">{LockIcon}Photo Never Leaves Device</span>
            </div>
          </div>
          <div className="shapefigure">
            <svg viewBox="0 0 200 240" className="facesvg" aria-hidden="true">
              <path
                d={d.svg}
                fill="none"
                stroke="#6D5DFC"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="featsec">
        <div className="wrap featwrap">
          <div className="feattext">
            <h2>What defines {art} {d.name} face shape</h2>
            <div className="ratio">{d.ratio}</div>
            <ul className="featlist">
              {d.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="measurefig" aria-label="The four measurements used to identify a face shape">
            <div className="mf-face">
              <svg viewBox="0 0 200 240" aria-hidden="true">
                <path d={d.svg} fill="#F0EEFF" stroke="#6D5DFC" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="46" y1="62" x2="154" y2="62" className="ml-for" />
                <line x1="46" y1="56" x2="46" y2="68" className="ml-for" />
                <line x1="154" y1="56" x2="154" y2="68" className="ml-for" />
                <line x1="32" y1="120" x2="168" y2="120" className="ml-che" />
                <line x1="32" y1="114" x2="32" y2="126" className="ml-che" />
                <line x1="168" y1="114" x2="168" y2="126" className="ml-che" />
                <line x1="58" y1="186" x2="142" y2="186" className="ml-jaw" />
                <line x1="58" y1="180" x2="58" y2="192" className="ml-jaw" />
                <line x1="142" y1="180" x2="142" y2="192" className="ml-jaw" />
                <line x1="100" y1="22" x2="100" y2="224" className="ml-len" />
                <line x1="94" y1="22" x2="106" y2="22" className="ml-len" />
                <line x1="94" y1="224" x2="106" y2="224" className="ml-len" />
              </svg>
            </div>
            <div className="mf-legend">
              <div className="mf-row">
                <span className="mf-dot for" />
                <div>
                  <b>Forehead width</b>
                  <br />
                  Compare it to the jaw and cheeks.
                </div>
              </div>
              <div className="mf-row">
                <span className="mf-dot che" />
                <div>
                  <b>Cheekbones</b>
                  <br />
                  Often the widest point of the face.
                </div>
              </div>
              <div className="mf-row">
                <span className="mf-dot jaw" />
                <div>
                  <b>Jaw width</b>
                  <br />
                  Across the jawline, just above the chin.
                </div>
              </div>
              <div className="mf-row">
                <span className="mf-dot len" />
                <div>
                  <b>Face length</b>
                  <br />
                  Chin to hairline, the vertical span.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hairsec" id="hair">
        <div className="wrap">
          <h2>Best hairstyles for {art} {d.name} face</h2>
          <div className="hairsub">Long-tail picks that flatter your bone structure.</div>
          <div className="hairgrid">
            <div className="haircol">
              <h3>For men</h3>
              {d.hairMen.map((h) => (
                <div className="hairitem" key={h}>
                  {h}
                </div>
              ))}
            </div>
            <div className="haircol">
              <h3>For women</h3>
              {d.hairWomen.map((h) => (
                <div className="hairitem" key={h}>
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glasssec">
        <div className="wrap">
          <h2>Best glasses for {art} {d.name} face</h2>
          <div className="glasssub">The frame shapes below — tap the names to see what each looks like:</div>
          <div className="framegloss">
            {FRAMES.map((f) => (
              <div className="framechip" key={f.name}>
                <svg viewBox="0 0 44 40" aria-hidden="true">
                  {f.svg}
                </svg>
                <span>{f.name}</span>
              </div>
            ))}
          </div>
          <div className="glassgrid">
            {d.glasses.map((g) => (
              <div className={`glassitem ${/^avoid/i.test(g) ? 'avoid' : 'good'}`} key={g}>
                {g}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shapes" id="shapes">
        <div className="wrap">
          <h2>All 7 face shapes</h2>
          <div className="shapegrid">
            {FACE_SHAPE_ORDER.map((k) => (
              <a
                key={k}
                href={`/face-shapes/${k}`}
                className={k === d.slug ? 'cur' : ''}
              >
                {FACE_SHAPES[k].name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="wrap">
          <h2>Frequently asked questions</h2>
          {d.faqs.map((f) => (
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
            <h2>Not sure which shape you are?</h2>
            <p>Check yours with the live camera detector — free, private, no upload.</p>
            <div className="privnote">
              <span className="trustbadge primary">{ShieldIcon}100% Private</span>
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
