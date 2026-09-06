import Link from 'next/link';
import PortalHero from '@/components/PortalHero';
import Statement from '@/components/Statement';
import Deck from '@/components/Deck';
import Close from '@/components/Close';
import { DIVISIONS, ROSTER, DIVISION_TABLE, SITE } from '@/lib/content';

export const metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <PortalHero />

      <Statement
        num="01"
        label="Who we are"
        foot="Second Spark Intelligence is an engineering company building infrastructure that does not exist here yet — diagnostics for the energy storage pouring into the country, a rail for money that still takes days to move, and the software and models underneath both."
      >
        Zimbabwe imports the world&rsquo;s used batteries and inherits the world&rsquo;s payment
        friction. We build the systems that make both <em>measurable</em>.
      </Statement>

      {/* ---- Divisions: copy on the left, throwable deck on the right ---- */}
      <section className="section">
        <div className="shell deck-grid">
          <div className="deck-copy reveal">
            <p className="label">Divisions</p>
            <h2>Three problems worth solving properly.</h2>
            <p className="lede">
              They look unrelated. They are not. Each one is a piece of missing
              infrastructure, each one runs on measurement the market currently
              does without, and all three are built by the same team.
            </p>
            <div className="deck-actions">
              <Link className="btn" href="/battery-passport/">
                Battery Passport
              </Link>
              <Link className="btn" href="/miki/">
                MiKi <span className="arw">→</span>
              </Link>
            </div>
          </div>

          <div className="reveal reveal-d2">
            <Deck items={DIVISIONS} />
          </div>
        </div>
      </section>

      {/* ---- Roster ---- */}
      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">Capabilities</p>
            <h2>What we actually do.</h2>
          </div>

          <div className="roster">
            {ROSTER.map((r, i) => (
              <Link className="roster-row reveal" key={r.name} href={r.href}>
                <p className={`label ${i % 2 ? 'label-teal' : 'label-amber'}`}>{r.label}</p>
                <h3>{r.name}</h3>
                <span className="count">{r.count}</span>
                <p className="sub">{r.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Status table ---- */}
      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">At a glance</p>
            <h2>Where each division stands.</h2>
          </div>

          <div className="reveal reveal-d1">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Division</th>
                  <th scope="col">Focus</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reach</th>
                </tr>
              </thead>
              <tbody>
                {DIVISION_TABLE.map((row) => (
                  <tr key={row.division}>
                    <td data-h="Division">{row.division}</td>
                    <td data-h="Focus">{row.focus}</td>
                    <td data-h="Status" className={`st ${row.statusTone === 'teal' ? 'st-teal' : ''}`}>
                      {row.status}
                    </td>
                    <td data-h="Reach">{row.reach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Close
        title="Tell us what you are building."
        fine={`Three divisions, one engineering team. Write to ${SITE.email} or use the form — we answer every message ourselves.`}
      />
    </>
  );
}
