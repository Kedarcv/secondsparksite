import Link from 'next/link';
import Close from '@/components/Close';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="shell page-hero-in">
          <p className="label crumb">
            404 <span>/</span> Second Spark Intelligence
          </p>
          <h1>This page does not exist.</h1>
          <p className="lede">
            The link is wrong, or the page has moved. Everything we do lives behind one of the four
            below.
          </p>
          <div className="deck-actions" style={{ marginTop: 34 }}>
            <Link className="btn" href="/">Home</Link>
            <Link className="btn" href="/battery-passport/">Battery Passport</Link>
            <Link className="btn" href="/miki/">MiKi</Link>
            <Link className="btn" href="/studio/">Studio</Link>
          </div>
        </div>
      </section>
      <Close />
    </>
  );
}
