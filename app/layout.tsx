import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE } from '@/lib/site';
import ScrollDepth from '@/components/ScrollDepth';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Face Shape Detector Online Camera — Real-Time & Free',
    template: '%s · FaceShape AI',
  },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Face Shape Detector Online Camera — Real-Time & Free',
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Face Shape Detector Online Camera — Real-Time & Free',
    description: SITE.description,
  },
};

const siteLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: 'en-US',
      datePublished: '2026-08-26',
      dateModified: '2026-08-26',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
  ],
};

const NAV = [
  { href: '/', label: 'Face Shape' },
  { href: '/eye-shape', label: 'Eye Shape' },
  { href: '/nose-shape', label: 'Nose Shape' },
  { href: '/color-analysis', label: 'Color' },
  { href: '/body-shape', label: 'Body Shape' },
  { href: '/tools', label: 'All Tools' },
  { href: '/blog', label: 'Blog' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}',{send_page_view:true});`}
        </Script>
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <nav className="nav">
          <div className="wrap">
            <div className="logo">{SITE.name}</div>
            <div className="navlinks">
              {NAV.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            </div>
            <a className="navcta" href="/#detect">
              Open Camera
            </a>
          </div>
        </nav>
        <main id="main">{children}</main>
        <ScrollDepth />
        <footer>
          <div className="wrap">
            <span>© 2026 {SITE.name}</span>
            <span>
              <a href="/tools">All Tools</a> · <a href="/face-shapes/oval">7 Shapes</a> · <a href="/vs">Compare</a> ·{' '}
              <a href="/blog">Blog</a> · <a href="/#faq">FAQ</a>
            </span>
          </div>
          <div className="wrap fmeta">
            <span>Last reviewed Aug 2026</span>
            <span>
              Built with Google MediaPipe FaceLandmarker &mdash; 478 landmarks, 100% client-side
            </span>
            <a href="/#steps">How it works</a>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />
      </body>
    </html>
  );
}
