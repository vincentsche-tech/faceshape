import './globals.css';
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

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

const NAV = [
  { href: '/', label: 'Detector' },
  { href: '/#detect', label: 'Camera' },
  { href: '/face-shapes/oval', label: '7 Shapes' },
  { href: '/vs', label: 'Compare' },
  { href: '/#faq', label: 'FAQ' },
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
        <footer>
          <div className="wrap">
            <span>© 2026 {SITE.name}</span>
            <span>
              <a href="/face-shapes/oval">7 Shapes</a> · <a href="/vs">Compare</a> ·{' '}
              <a href="/#faq">FAQ</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
