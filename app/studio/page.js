import PageHero from '@/components/PageHero';
import Close from '@/components/Close';

export const metadata = {
  title: 'Software & AI Studio',
  description:
    'Software development and applied AI consultancy from Second Spark Intelligence. Mobile and web platforms, backend and cloud infrastructure, predictive modelling, data pipelines and AI integration.',
  alternates: { canonical: '/studio/' },
};

const ENGINEERING = [
  { h: 'Mobile applications', p: 'Cross-platform iOS and Android products, from first prototype through store release and the versions after it.' },
  { h: 'Web platforms & dashboards', p: 'Customer-facing products and the internal tools behind them — reporting, operations consoles, admin systems.' },
  { h: 'Backend, APIs & cloud', p: 'Services, data stores, authentication and the infrastructure to run them, sized for what you actually have rather than what a deck imagined.' },
  { h: 'Systems integration', p: 'Making software that was never designed to talk to each other do exactly that — payment networks, hardware, third-party APIs, legacy systems.' },
];

const AI = [
  { h: 'Predictive modelling', p: 'Forecasting from your own operational data. The state-of-health models behind our battery work are the same discipline applied to a different domain.' },
  { h: 'Data pipelines & instrumentation', p: 'Most AI problems are data problems first. We build the collection, cleaning and storage layer before anything is trained on it.' },
  { h: 'AI feature integration', p: 'Language models and ML put into real products — assistants, extraction, classification, search — with the evaluation to know whether they are working.' },
  { h: 'Strategy & technical review', p: 'Where AI genuinely helps, where it does not, what it will cost to run, and an honest read on someone else’s technical claims.' },
];

const PROCESS = [
  { h: 'Scope', p: 'We start with the problem rather than the technology, and say plainly if the thing you asked for is not the thing you need. Fixed, written scope before anyone writes code.' },
  { h: 'Prototype', p: 'Something running early — narrow, real, and usable enough to argue with. Decisions get cheaper the sooner they meet reality.' },
  { h: 'Build', p: 'Short cycles, working software at the end of each one, and nothing kept behind a curtain until a launch date.' },
  { h: 'Hand over or operate', p: 'Documented and handed to your team, or run and maintained by ours. Either way you own the code.' },
];

const BUILT = [
  { p: 'MiKi', w: 'Consumer payment wallet for local and cross-border transfers', s: 'Mobile app, backend services, payment integration' },
  { p: 'Battery Passport', w: 'Cell-level diagnostics and certification platform', s: 'Test tooling, data pipeline, state-of-health modelling' },
  { p: 'Fleet monitoring', w: 'Continuous battery health tracking and alerting', s: 'Telemetry ingest, predictive models, reporting' },
];

export default function Studio() {
  return (
    <>
      <PageHero
        fieldId="st"
        division="Division 03"
        title="Software & AI"
        lede="Product engineering and applied AI consultancy. The same team that built a payment rail and a battery diagnostics platform is available to build whatever you are working on."
        meta="Mobile · Web · Backend & cloud · Applied ML · AI integration"
      />

      <section className="section">
        <div className="shell grid-2">
          <div className="reveal">
            <p className="label">Position</p>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', marginTop: 16 }}>
              We build for ourselves first.
            </h2>
          </div>
          <div className="reveal reveal-d1">
            <p className="lede">
              Two of our three divisions are products we designed, built and now run. That is an
              unusual thing for a consultancy to be able to say, and it changes how we work: we have
              had to live with our own architecture decisions, our own estimates and our own
              shortcuts.
            </p>
            <p className="lede" style={{ marginTop: 20 }}>
              So we tend to be blunt about scope, conservative about complexity, and specific about
              what a thing will cost to keep running once it exists.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-amber">Engineering — 04</p>
            <h2>Software development.</h2>
          </div>
          <div className="grid-2">
            {ENGINEERING.map((c, i) => (
              <div className={`cell reveal reveal-d${i % 2}`} key={c.h}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
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
            <p className="label label-teal">Intelligence — 04</p>
            <h2>AI consultancy.</h2>
          </div>
          <div className="grid-2">
            {AI.map((c, i) => (
              <div className={`cell reveal reveal-d${i % 2}`} key={c.h}>
                <span className="idx">{String(i + 5).padStart(2, '0')}</span>
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
            <p className="label">How we work</p>
            <h2>Four stages, no surprises.</h2>
          </div>
          <div className="steps">
            {PROCESS.map((s) => (
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
            <p className="label">In-house work</p>
            <h2>What we have built for ourselves.</h2>
          </div>
          <div className="reveal reveal-d1">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">What it is</th>
                  <th scope="col">Our scope</th>
                </tr>
              </thead>
              <tbody>
                {BUILT.map((r) => (
                  <tr key={r.p}>
                    <td data-h="Product">{r.p}</td>
                    <td data-h="What">{r.w}</td>
                    <td data-h="Scope">{r.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Close
        title="Bring us the awkward one."
        fine="Greenfield builds, rescues, integrations, and the AI question you have not been able to get a straight answer on."
        primary={{ href: '/contact/', label: 'Scope a project' }}
        secondary={{ href: '/', label: 'Back to overview' }}
      />
    </>
  );
}
