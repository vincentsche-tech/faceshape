import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { FACE_SHAPES, FACE_SHAPE_ORDER, getFaceShape } from '@/lib/faceShapes';
import { ShieldIcon, UserIcon, CpuIcon, LockIcon } from '@/components/icons';

type Params = { pair: string };

// 生成全部无序脸型对（a 在 FACE_SHAPE_ORDER 中先于 b），避免重复与自比。
function allPairs(): string[] {
  const out: string[] = [];
  for (let i = 0; i < FACE_SHAPE_ORDER.length; i++) {
    for (let j = i + 1; j < FACE_SHAPE_ORDER.length; j++) {
      out.push(`${FACE_SHAPE_ORDER[i]}-vs-${FACE_SHAPE_ORDER[j]}`);
    }
  }
  return out;
}

// 任意两脸型 → 规范 slug（按 FACE_SHAPE_ORDER 顺序，保证与 generateStaticParams 一致）。
function pairSlug(x: string, y: string): string {
  const ix = FACE_SHAPE_ORDER.indexOf(x);
  const iy = FACE_SHAPE_ORDER.indexOf(y);
  return ix <= iy ? `${x}-vs-${y}` : `${y}-vs-${x}`;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return allPairs().map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pair } = await params;
  const [a, b] = pair.split('-vs-');
  const A = getFaceShape(a);
  const B = getFaceShape(b);
  if (!A || !B) return {};
  const title = `${A.name} vs ${B.name} Face Shape — How to Tell Them Apart`;
  const desc = `Compare the ${A.name} and ${B.name} face shapes side by side: length-to-width, jaw and forehead, flattering hairstyles and glasses. See which one is yours.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/face-shapes/compare/${pair}` },
    openGraph: { title, description: desc, url: `${SITE.url}/face-shapes/compare/${pair}` },
    twitter: { title, description: desc },
  };
}

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { pair } = await params;
  const [a, b] = pair.split('-vs-');
  const A = getFaceShape(a);
  const B = getFaceShape(b);
  if (!A || !B || a === b) notFound();

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I tell a ${A.name} face from a ${B.name} face?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Start with proportions. ${A.name} faces: ${A.ratio} ${B.name} faces: ${B.ratio} Then check the jawline and forehead — ${A.name} is ${A.shortDef} while ${B.name} is ${B.shortDef} The live camera detector names your shape in seconds so you don't have to guess.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which is more common, ${A.name} or ${B.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Both are common, and many people sit between shapes. The reliable way to know is to measure your face length, forehead, cheekbones and jaw, or use the live detector — self-assessment by eye alone often misreads.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I have features of both ${A.name} and ${B.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Face shapes are a spectrum, and it's normal to share traits. If you're unsure, follow the advice for the shape your measurements lean toward, and use the detector for a confident read.`,
        },
      },
    ],
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Face Shape Detector',
        item: SITE.url + '/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${A.name} vs ${B.name}`,
        item: `${SITE.url}/face-shapes/compare/${pair}`,
      },
    ],
  };

  const otherPairs = FACE_SHAPE_ORDER.filter((k) => k !== a && k !== b);

  return (
    <>
      <section className="shapehero">
        <div className="blob pink" />
        <div className="blob yellow" />
        <div className="wrap">
          <div className="shapeleft">
            <h1>{A.name} vs {B.name} Face Shape</h1>
            <p className="subhead">
              Not sure which one is yours? Here&apos;s the honest side-by-side — proportions,
              jaw and forehead, and the cuts and frames that flatter each.
            </p>
            <div className="ctarow">
              <a className="btn-primary" href="/">
                Check yours live
              </a>
              <a className="btn-secondary" href="#diff">
                Key differences
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
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', flex: '1 1 280px' }}>
            <div className="shapefigure" style={{ flex: '1 1 200px', maxWidth: 240 }}>
              <svg viewBox="0 0 200 240" className="facesvg" aria-hidden="true">
                <path d={A.svg} fill="none" stroke="#6D5DFC" strokeWidth="3" strokeLinejoin="round" />
              </svg>
              <div style={{ textAlign: 'center', fontWeight: 700, marginTop: 8 }}>{A.name}</div>
            </div>
            <div className="shapefigure" style={{ flex: '1 1 200px', maxWidth: 240 }}>
              <svg viewBox="0 0 200 240" className="facesvg" aria-hidden="true">
                <path d={B.svg} fill="none" stroke="#6D5DFC" strokeWidth="3" strokeLinejoin="round" />
              </svg>
              <div style={{ textAlign: 'center', fontWeight: 700, marginTop: 8 }}>{B.name}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="featsec">
        <div className="wrap featwrap">
          <div className="feattext">
            <h2>At a glance</h2>
            <table className="cmptable">
              <thead>
                <tr>
                  <th>Trait</th>
                  <th className="best">{A.name}</th>
                  <th>{B.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Overall shape</td>
                  <td className="best yes">{A.shortDef}</td>
                  <td className="no">{B.shortDef}</td>
                </tr>
                <tr>
                  <td>Length-to-width</td>
                  <td className="best yes">{A.ratio}</td>
                  <td className="no">{B.ratio}</td>
                </tr>
                <tr>
                  <td>Standout features</td>
                  <td className="best yes">
                    <ul className="featlist">
                      {A.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="no">
                    <ul className="featlist">
                      {B.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hairsec" id="diff">
        <div className="wrap">
          <h2>Key differences at a glance</h2>
          <div className="hairsub">Where {A.name} and {B.name} actually diverge.</div>
          <ul className="featlist" style={{ columns: 2, columnGap: 32 }}>
            <li>
              <b>{A.name}:</b> {A.shortDef}
            </li>
            <li>
              <b>{B.name}:</b> {B.shortDef}
            </li>
            <li>
              <b>{A.name} length-to-width:</b> {A.ratio}
            </li>
            <li>
              <b>{B.name} length-to-width:</b> {B.ratio}
            </li>
          </ul>
          <p style={{ marginTop: 16 }}>
            The fastest tell is the jawline and forehead. {A.name} faces {A.shortDef} {B.name}{' '}
            faces {B.shortDef} If you&apos;re still torn, the live detector reads your bone structure
            from the camera in real time — no measuring tape required.
          </p>
        </div>
      </section>

      <section className="glasssec">
        <div className="wrap">
          <h2>Hairstyles &amp; glasses for each</h2>
          <div className="glassgrid">
            <div className="glassitem good">
              <b>{A.name} — hairstyles</b>
              <span style={{ display: 'block', marginTop: 6 }}>
                Men: {A.hairMen[0]} Women: {A.hairWomen[0]} See the full list on the{' '}
                <a href={`/face-shapes/${A.slug}#hair`}>{
                  A.name
                } face shape page</a>.
              </span>
            </div>
            <div className="glassitem good">
              <b>{B.name} — hairstyles</b>
              <span style={{ display: 'block', marginTop: 6 }}>
                Men: {B.hairMen[0]} Women: {B.hairWomen[0]} See the full list on the{' '}
                <a href={`/face-shapes/${B.slug}#hair`}>{
                  B.name
                } face shape page</a>.
              </span>
            </div>
            <div className="glassitem good">
              <b>{A.name} — glasses</b>
              <span style={{ display: 'block', marginTop: 6 }}>{A.glasses.join(' ')}</span>
            </div>
            <div className="glassitem good">
              <b>{B.name} — glasses</b>
              <span style={{ display: 'block', marginTop: 6 }}>{B.glasses.join(' ')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="comparesec">
        <div className="wrap">
          <h2>Compare {A.name} or {B.name} to the others</h2>
          <div className="compsub">See how each stacks up against the remaining shapes.</div>
          <div className="comparegrid">
            {otherPairs.map((k) => {
              const o = FACE_SHAPES[k];
              return (
                <a className="comparecard" key={k} href={`/face-shapes/compare/${pairSlug(a, k)}`}>
                  <svg viewBox="0 0 200 240" className="cmpfig" aria-hidden="true">
                    <path d={o.svg} fill="none" stroke="#6D5DFC" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                  <div className="cmpname">{o.name}</div>
                  <div className="cmpdef">{o.shortDef}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="wrap">
          <h2>Frequently asked questions</h2>
          <div className="fitem">
            <div className="q">How do I tell a {A.name} face from a {B.name} face?</div>
            <div className="a">
              Start with proportions. {A.name} faces: {A.ratio} {B.name} faces: {B.ratio} Then check
              the jawline and forehead — {A.name} is {A.shortDef} while {B.name} is {B.shortDef} The
              live camera detector names your shape in seconds so you don&apos;t have to guess.
            </div>
          </div>
          <div className="fitem">
            <div className="q">Which is more common, {A.name} or {B.name}?</div>
            <div className="a">
              Both are common, and many people sit between shapes. The reliable way to know is to
              measure your face length, forehead, cheekbones and jaw, or use the live detector —
              self-assessment by eye alone often misreads.
            </div>
          </div>
          <div className="fitem">
            <div className="q">Can I have features of both {A.name} and {B.name}?</div>
            <div className="a">
              Yes. Face shapes are a spectrum, and it&apos;s normal to share traits. If you&apos;re
              unsure, follow the advice for the shape your measurements lean toward, and use the
              detector for a confident read.
            </div>
          </div>
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
