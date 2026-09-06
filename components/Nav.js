'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOGO } from '@/lib/content';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/battery-passport/', label: 'Battery Passport' },
  { href: '/miki/', label: 'MiKi' },
  { href: '/studio/', label: 'Studio' },
  { href: '/contact/', label: 'Contact' },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isOn = (href) => path === href || path === href.slice(0, -1);

  return (
    <>
      <header className="nav">
        <nav className="nav-in" aria-label="Primary">
          <Link className="nav-mark" href="/" aria-label="Second Spark Intelligence — home">
            <img
              src={LOGO.src}
              srcSet={`${LOGO.src} 1x, ${LOGO.src2x} 2x`}
              width={LOGO.width}
              height={LOGO.height}
              alt={LOGO.alt}
            />
          </Link>

          <div className="nav-links">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} data-active={isOn(l.href) ? 'true' : 'false'}>
                {l.label}
              </Link>
            ))}
          </div>

          <Link className="btn nav-cta" href="/contact/">
            Get in touch
          </Link>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </header>

      <div className="nav-drawer" id="nav-drawer" data-open={open ? 'true' : 'false'}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} tabIndex={open ? 0 : -1}>
            {l.label}
          </Link>
        ))}
        <Link className="btn" href="/contact/" tabIndex={open ? 0 : -1}>
          Start a conversation
        </Link>
      </div>
    </>
  );
}
