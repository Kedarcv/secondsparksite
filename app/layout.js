import { Syne, Sora } from 'next/font/google';
import Nav from '@/components/Nav';
import MotionRoot from '@/components/MotionRoot';
import { SITE } from '@/lib/content';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'battery passport',
    'lithium battery testing Zimbabwe',
    'state of health',
    'battery second life',
    'MiKi',
    'payment wallet Zimbabwe',
    'software development Zimbabwe',
    'AI consultancy',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    locale: 'en_ZW',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0A0C0E',
  colorScheme: 'dark',
};

// Runs during parse, before the hero paints, so the portal is already closed on
// first frame for readers who want motion — and stays open for those who do not.
const MOTION_PROBE = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${sora.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: MOTION_PROBE }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <MotionRoot />
      </body>
    </html>
  );
}
