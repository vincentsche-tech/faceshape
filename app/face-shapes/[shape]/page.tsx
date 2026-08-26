import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { FACE_SHAPES, FACE_SHAPE_ORDER, getFaceShape } from '@/lib/faceShapes';
import { ShieldIcon, UserIcon, CpuIcon, LockIcon } from '@/components/icons';

type Params = { shape: string };

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
              <span className="trustbadge">{UserIcon}468 Landmarks</span>
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
        <div className="wrap">
          <h2>What defines {art} {d.name} face shape</h2>
          <div className="ratio">{d.ratio}</div>
          <ul className="featlist">
            {d.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
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
          <div className="glassgrid">
            {d.glasses.map((g) => (
              <div className="glassitem" key={g}>
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
