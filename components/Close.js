import Link from 'next/link';
import { SITE } from '@/lib/content';

/* next/link intercepts clicks for client-side routing, which is wrong for
   mailto: and any other non-internal href — those go out as a plain anchor. */
function Action({ href, className, children }) {
  const internal = href.startsWith('/');
  if (internal) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

export default function Close({
  title = 'Tell us what you are building.',
  fine = 'Three divisions, one engineering team, based in Zimbabwe and working wherever the problem is.',
  primary = { href: '/contact/', label: 'Start a conversation' },
  secondary = { href: `mailto:${SITE.email}`, label: 'Email us' },
}) {
  return (
    <footer className="close">
      <div className="shell">
        <p className="label reveal">Next</p>
        <h2 className="reveal reveal-d1" style={{ marginTop: 18 }}>
          {title}
        </h2>
        <p className="close-fine reveal reveal-d2">{fine}</p>

        <div className="close-actions reveal reveal-d3">
          <Action className="btn" href={secondary.href}>
            {secondary.label}
          </Action>
          <Action className="btn btn-solid" href={primary.href}>
            {primary.label} <span className="arw">→</span>
          </Action>
        </div>

        <div className="foot-strip">
          <span className="label">
            © {SITE.year} {SITE.legal}
          </span>
          <nav className="label" style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }} aria-label="Footer">
            <Link href="/battery-passport/">Battery Passport</Link>
            <Link href="/miki/">MiKi</Link>
            <Link href="/studio/">Studio</Link>
            <Link href="/contact/">Contact</Link>
          </nav>
          <span className="label">{SITE.place}</span>
        </div>
      </div>

      <p className="foot-mark" aria-hidden="true">
        SECOND SPARK
      </p>
    </footer>
  );
}
