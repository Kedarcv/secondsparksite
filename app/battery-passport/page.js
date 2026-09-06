import PageHero from '@/components/PageHero';
import Close from '@/components/Close';
import { DEVICE, DEVICE_READOUTS } from '@/lib/content';

export const metadata = {
  title: 'Battery Passport',
  description:
    'Cell-level testing, grading and continuous monitoring for the lithium batteries entering Zimbabwe. We measure what is actually left in a pack, issue a verifiable passport, and predict decline before it becomes failure.',
  alternates: { canonical: '/battery-passport/' },
};

const PROBLEM = [
  {
    idx: '01',
    h: 'Imports arrive unlabelled',
    p: 'Second-hand lithium packs enter the country re-cased, re-badged and stripped of history. The nameplate capacity printed on the side stopped being true years ago, and nothing on the pack tells you by how much.',
  },
  {
    idx: '02',
    h: 'The buyer carries all the risk',
    p: 'There is no practical way to tell a pack at ninety percent health from one at forty at the point of sale. Price becomes guesswork, warranties become unwritable, and trust in the whole market erodes.',
  },
  {
    idx: '03',
    h: 'Good cells get scrapped',
    p: 'Packs are condemned whole when a handful of cells have failed. Recoverable capacity goes into the e-waste stream alongside the genuinely dead — expensive for the owner and avoidable for everyone.',
  },
];

const STEPS = [
  {
    h: 'Intake and identification',
    p: 'The pack is logged, opened and mapped: chemistry, configuration, cell count, module layout, and whatever history the battery management system still holds. Every pack gets a permanent identifier at this point.',
  },
  {
    h: 'Cell-level testing',
    p: 'We test each cell individually rather than reading the pack as one unit. A pack-level reading hides the weak cells that will actually determine its life — a single failing cell caps the whole string, and only cell-level work finds it.',
  },
  {
    h: 'Scoring and grading',
    p: 'Measurements resolve into a state-of-health figure and a grade band, with the weakest cells and their effect on usable capacity called out separately. You get the number and the reasoning behind it.',
  },
  {
    h: 'The passport is issued',
    p: 'Packs that meet the standard earn a Second Spark passport: a verifiable record of what was measured, when, by whom, and what grade it earned. It stays with the battery when it is sold on.',
  },
  {
    h: 'Continuous monitoring',
    p: 'The passport keeps updating in service. Live state-of-health tracking means the owner is told a pack is drifting while there is still time to act, instead of finding out when it fails.',
  },
];

const MEASURES = [
  { h: 'Usable capacity', p: 'Actual amp-hours delivered per cell under controlled discharge, against the rated figure.' },
  { h: 'Internal resistance', p: 'Impedance per cell — the earliest reliable signal of ageing, and often visible long before capacity drops.' },
  { h: 'Voltage spread', p: 'Cell-to-cell divergence and how well the pack holds balance across a full charge cycle.' },
  { h: 'Round-trip efficiency', p: 'How much of the energy put into the pack comes back out, and where the rest is being lost.' },
  { h: 'Thermal behaviour', p: 'Temperature response under load and during charge, including cells that run hot relative to their neighbours.' },
  { h: 'Cycle history', p: 'Recorded cycles where the BMS retains them, plus an estimated age derived from the measured degradation curve.' },
];

const BANDS = [
  {
    g: 'A',
    r: '90% and above',
    p: 'Effectively as-new. Cell spread tight, no thermal outliers. Suitable for demanding duty cycles and full-price resale.',
  },
  {
    g: 'B',
    r: '75 – 89%',
    p: 'Strong remaining service life with normal, even degradation. The bulk of well-kept imported stock lands here.',
  },
  {
    g: 'C',
    r: '60 – 74%',
    p: 'Serviceable, priced accordingly, and best matched to lower-demand duty — backup, light cycling, stationary storage.',
  },
  {
    g: 'R',
    r: 'Below 60%',
    p: 'Not passported for resale. Routed instead into recovery: cell-level triage, rebuild where it is worth it, certified recycling where it is not.',
  },
];

const MONITOR = [
  {
    idx: '01',
    h: 'Live state of health',
    p: 'Capacity, resistance and balance tracked over time rather than captured once, so the curve — not a single reading — tells you where the pack is going.',
  },
  {
    idx: '02',
    h: 'Alerts before failure',
    p: 'Every pack we test feeds the models. As the dataset grows, so does our ability to say when a specific pack will need attention — and to tell its owner in advance rather than after.',
  },
  {
    idx: '03',
    h: 'Fleet reporting',
    p: 'For operators running many packs, one view across all of them: grades, trends, packs approaching a threshold, and what to schedule next.',
  },
];

const RECOVERY = [
  {
    idx: '01',
    h: 'Cell-level triage',
    p: 'We find the specific cells dragging a pack down instead of writing off the whole assembly. Usually it is a small minority of them.',
  },
  {
    idx: '02',
    h: 'Rebuild and re-grade',
    p: 'Weak cells are replaced or rematched, the pack is rebalanced, retested, and issued a fresh passport at its new grade.',
  },
  {
    idx: '03',
    h: 'Certified recycling',
    p: 'What genuinely cannot be recovered goes to recyclers with a record of what it contained, so the material is recovered properly instead of ending up in general waste.',
  },
];

const AUDIENCE = [
  {
    who: 'Importers & retailers',
    get: 'Graded stock with a passport buyers can check',
    why: 'Sell on evidence instead of assurance, and price each pack for what it is',
  },
  {
    who: 'Solar & backup installers',
    get: 'Verified capacity before the pack goes on a wall',
    why: 'Size systems on real numbers and stop inheriting other people\u2019s failures',
  },
  {
    who: 'Fleet & telecom operators',
    get: 'Continuous monitoring across every pack in service',
    why: 'Replace on schedule rather than after an outage',
  },
  {
    who: 'Recyclers',
    get: 'Triage that separates recoverable from genuinely spent',
    why: 'Keep working capacity in service and recover the rest cleanly',
  },
];

export default function BatteryPassport() {
  return (
    <>
      <PageHero
        fieldId="bp"
        division="Division 01"
        title="Battery Passport"
        lede="Zimbabwe is absorbing an enormous volume of imported lithium storage, and almost none of it arrives with an honest account of what is left inside. We test at cell level, grade what we find, and give the battery a record that travels with it."
        meta="Cell-level testing · Grading · Certification · Continuous monitoring"
      />

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">The problem</p>
            <h2>A market trading blind.</h2>
          </div>
          <div className="grid-3">
            {PROBLEM.map((c, i) => (
              <div className={`cell reveal reveal-d${i}`} key={c.h}>
                <span className="idx">{c.idx}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">How it works</p>
            <h2>From unknown pack to verified record.</h2>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step reveal" key={s.h}>
                <div>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-teal">What we measure — 06</p>
            <h2>Six readings, taken per cell.</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              A pack-level test tells you what the weakest cell allows. Testing every cell tells you
              which cell that is, how far behind it has fallen, and whether the pack is worth
              recovering.
            </p>
          </div>
          <div className="grid-3">
            {MEASURES.map((m, i) => (
              <div className={`cell reveal reveal-d${i % 3}`} key={m.h}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-amber">The passport — 04 grades</p>
            <h2>One number, and the reasoning behind it.</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              State of health is expressed as a percentage of original rated capacity and resolved
              into one of four bands. The passport carries the grade, the underlying measurements,
              the test date and the pack identifier — so a buyer can check it rather than take it on
              faith.
            </p>
          </div>
          <div className="bands">
            {BANDS.map((b) => (
              <div className="band reveal" key={b.g}>
                <span className="g" style={{ color: b.g === 'R' ? 'var(--muted)' : 'var(--amber)' }}>
                  {b.g}
                </span>
                <span className="r">{b.r}</span>
                <p>{b.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- The fitted monitor ---- */}
      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-teal">The monitor</p>
            <h2>We leave hardware on the pack.</h2>
          </div>

          <div className="device-split">
            <div className="device-shot reveal">
              <img
                src={DEVICE.src}
                srcSet={`${DEVICE.src} 1x, ${DEVICE.src2x} 2x`}
                width={DEVICE.width}
                height={DEVICE.height}
                alt={DEVICE.alt}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="reveal reveal-d1">
              <p className="lede" style={{ marginBottom: 30 }}>
                Testing tells you what a pack is worth on the day it is tested. The
                monitor we fit tells you what it is doing every day after — reading the
                pack in service and feeding the same measurements back into the models
                that set its grade.
              </p>
              <dl className="readouts">
                {DEVICE_READOUTS.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-teal">Monitoring — 03</p>
            <h2>The passport keeps working after the sale.</h2>
          </div>
          <div className="grid-3">
            {MONITOR.map((c, i) => (
              <div className={`cell reveal reveal-d${i}`} key={c.h}>
                <span className="idx">{c.idx}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-amber">Recovery — 03</p>
            <h2>A failing pack is not a dead pack.</h2>
          </div>
          <div className="grid-3">
            {RECOVERY.map((c, i) => (
              <div className={`cell reveal reveal-d${i}`} key={c.h}>
                <span className="idx">{c.idx}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">Who it is for</p>
            <h2>Anyone holding a pack they cannot see inside.</h2>
          </div>
          <div className="reveal reveal-d1">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Segment</th>
                  <th scope="col">What they get</th>
                  <th scope="col">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {AUDIENCE.map((a) => (
                  <tr key={a.who}>
                    <td data-h="Segment">{a.who}</td>
                    <td data-h="Gets">{a.get}</td>
                    <td data-h="Why">{a.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Close
        title="Send us a pack. We will tell you what is in it."
        fine="Testing, grading and passporting for importers, installers, fleet operators and recyclers across Zimbabwe."
        primary={{ href: '/contact/', label: 'Book a test' }}
        secondary={{ href: '/miki/', label: 'See MiKi' }}
      />
    </>
  );
}
