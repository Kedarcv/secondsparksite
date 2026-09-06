import PageHero from '@/components/PageHero';
import AppGallery from '@/components/AppGallery';
import Close from '@/components/Close';
import { MIKI_SHOTS, MIKI_HERO_SHOT } from '@/lib/content';

export const metadata = {
  title: 'MiKi',
  description:
    'MiKi is one unified wallet for Zimbabwe — fund it instantly from any Visa card, send to any wallet or Visa card at home or across 195+ countries, and have it settle in near real time. Launching soon.',
  alternates: { canonical: '/miki/' },
};

const WALLS = [
  {
    idx: '01',
    h: 'No payment gateway',
    p: 'Stripe, Flutterwave and PayPal do not operate here. Setting up an online store or simply receiving money from abroad means routing around the problem rather than solving it, and most people end up depending on remittances by default.',
  },
  {
    idx: '02',
    h: 'Transfers cost too much',
    p: 'With no cheaper option available, cross-border transfers carry heavy fees — because for a long time the agent networks have been the only real route into the country.',
  },
  {
    idx: '03',
    h: 'Money arrives before it settles',
    p: 'Even where card rails already reach, domestic USD and ZiG transactions can take up to five business days to formally settle. The transaction has happened, the balance looks received, and the money is still in limbo.',
  },
];

const STATS = [
  {
    n: '15.1%',
    tone: '',
    p: 'of Zimbabwe’s total foreign-currency receipts in 2025 came from remittances, up from 14% the year before.',
    cite: 'Reserve Bank of Zimbabwe',
  },
  {
    n: '~6.4%',
    tone: 'teal',
    p: 'average cost of sending money into the region, against a 1% global target that nobody has reached.',
    cite: 'World Bank RPW, 2024',
  },
  {
    n: '5 days',
    tone: '',
    p: 'how long a domestic transaction can take to formally settle today, even once the customer sees it as received.',
    cite: 'Second Spark analysis',
  },
];

const OFFERS = [
  {
    idx: '01',
    h: 'One wallet, any country',
    p: 'A single MiKi balance that behaves the same whether you are in Harare or abroad. Not a domestic wallet with an international add-on bolted onto it — one account, one balance, everywhere.',
  },
  {
    idx: '02',
    h: 'Instant funding from any Visa card',
    p: 'Top up straight from a Visa card and have the balance available immediately, without an agent, a branch visit or a cash-in point.',
  },
  {
    idx: '03',
    h: 'Send to any wallet or Visa card',
    p: 'Pay another MiKi user, or push funds directly to a Visa card in Zimbabwe or in any of the 195+ countries the network reaches. Same flow either way.',
  },
  {
    idx: '04',
    h: 'Near real-time settlement',
    p: 'Money that is received is money you can use. Settlement runs in near real time instead of trailing days behind the transaction.',
  },
  {
    idx: '05',
    h: 'Cash out on demand',
    p: 'Move value back out to a linked card whenever you want it, and keep card and wallet balances in sync automatically.',
  },
];

const FLOW = [
  { h: 'Open a MiKi account', p: 'Sign up once. The account is yours wherever you are, not tied to the country you opened it in.' },
  { h: 'Link a Visa card', p: 'Attach the card you already carry. No new plastic to wait for and no branch appointment.' },
  { h: 'Fund the wallet instantly', p: 'Pull value from the linked card into the wallet and have it usable straight away.' },
  { h: 'Send anywhere', p: 'To another MiKi wallet, or out to any Visa card — domestically or across the network’s 195+ countries.' },
  { h: 'Cash out or auto-sync', p: 'Withdraw to a card on demand, or let wallet and card balances stay reconciled in the background.' },
];


export default function MiKi() {
  return (
    <>
      <PageHero
        fieldId="mk"
        division="Division 02"
        title="MiKi"
        lede="One wallet for Zimbabwe. Fund it from a card in seconds, send to any wallet or Visa card at home or across 195+ countries, and have it settle in near real time rather than five days later."
        meta="Launching Soon"
        aside={
          <img
            src={MIKI_HERO_SHOT.src}
            srcSet={`${MIKI_HERO_SHOT.src} 1x, ${MIKI_HERO_SHOT.src2x} 2x`}
            width={MIKI_HERO_SHOT.width}
            height={MIKI_HERO_SHOT.height}
            alt="The MiKi wallet home screen, showing an account balance with send, top up and pay actions."
            fetchPriority="high"
          />
        }
      />

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">Why it needs to exist</p>
            <h2>Three walls between Zimbabweans and their own money.</h2>
          </div>
          <div className="grid-3">
            {WALLS.map((c, i) => (
              <div className={`cell reveal reveal-d${i}`} key={c.h}>
                <span className="idx">{c.idx}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>

          <div className="stats reveal reveal-d2" style={{ marginTop: 'clamp(48px,6vw,84px)' }}>
            {STATS.map((s) => (
              <div key={s.cite}>
                <p className={`n ${s.tone}`}>{s.n}</p>
                <p>{s.p}</p>
                <cite>{s.cite}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">The shift</p>
            <h2>How money moves, and how it will.</h2>
          </div>
          <div className="rails reveal reveal-d1">
            <div className="now">
              <p className="label">Today</p>
              <h3>Hops, agents and waiting</h3>
              <ul>
                <li><b>Multiple intermediaries</b> between sender and recipient</li>
                <li><b>Fees stack</b> at each hop in the chain</li>
                <li><b>Cash-out at an agent</b>, in person, during opening hours</li>
                <li><b>Days of settlement</b> after the money already looks received</li>
                <li><b>Separate products</b> for domestic and international</li>
              </ul>
            </div>
            <div className="next">
              <p className="label label-amber">With MiKi</p>
              <h3>One rail, both directions</h3>
              <ul>
                <li><b>Card to wallet directly</b>, with no agent in the middle</li>
                <li><b>One transaction</b> instead of a chain of them</li>
                <li><b>Cash out on demand</b>, from the phone in your hand</li>
                <li><b>Near real-time settlement</b> on the same rail</li>
                <li><b>One wallet</b> for local and cross-border alike</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-amber">What MiKi will offer — 05</p>
            <h2>Built around what people actually do with money.</h2>
          </div>
          <div className="grid-3">
            {OFFERS.map((c, i) => (
              <div className={`cell reveal reveal-d${i % 3}`} key={c.h}>
                <span className="idx">{c.idx}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- App screens ---- */}
      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label">Inside the app</p>
            <h2>What it looks like.</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              A walk through the wallet, screen by screen — from the balance you open
              on to the business account you can switch on.
            </p>
          </div>
        </div>
        <div className="reveal reveal-d1">
          <AppGallery shots={MIKI_SHOTS} />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head reveal">
            <p className="label label-teal">The flow</p>
            <h2>Five steps, start to finish.</h2>
          </div>
          <div className="steps">
            {FLOW.map((s) => (
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

      <Close
        title="Want MiKi when it launches?"
        fine="Leave your details and we will come back to you the moment there is something to use."
        primary={{ href: '/contact/', label: 'Join the list' }}
        secondary={{ href: '/battery-passport/', label: 'See Battery Passport' }}
      />
    </>
  );
}
