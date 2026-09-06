/* ---------------------------------------------------------------------------
   Site-wide copy and constants.
   Change anything here and it updates everywhere it is used.
   --------------------------------------------------------------------------- */

import SHOT_SIZES from './miki-shots.json';
import BRAND_SIZES from './brand-assets.json';

export const SITE = {
  name: 'Second Spark Intelligence',
  legal: 'Second Spark Intelligence',
  // Used for canonical URLs, Open Graph tags and the sitemap.
  url: 'https://secondspark.co.zw',
  email: 'michaelmlungisin@gmail.com',
  place: 'Zimbabwe',
  year: 2026,
  tagline: 'Infrastructure for what comes next',
  description:
    'Second Spark Intelligence is a Zimbabwean engineering company working across three divisions: cell-level lithium battery testing and certification, the MiKi payment wallet, and software development and applied AI consultancy.',
};

/* The three cards in the home-page deck. */
export const DIVISIONS = [
  {
    code: 'SSI · 01',
    tag: 'Energy',
    index: 'Division One',
    title: 'Battery Passport',
    href: '/battery-passport/',
    cta: 'Inside the passport',
    blurb:
      'Every imported lithium pack is a black box. We open it at cell level, score what is actually left in it, and issue a record that travels with the battery for the rest of its life.',
    points: [
      'Cell-level capacity and impedance testing',
      'A graded passport a buyer can verify',
      'Live state-of-health alerts before failure',
    ],
  },
  {
    code: 'SSI · 02',
    tag: 'Payments',
    index: 'Division Two',
    title: 'MiKi',
    href: '/miki/',
    cta: 'What MiKi will offer',
    blurb:
      'Zimbabwe has no payment gateway. MiKi is the wallet we are building — one balance that works at home and across 195+ countries, in near real time.',
    points: [
      'Fund instantly from any Visa card',
      'Send to any MiKi wallet or Visa card',
      'Near real-time settlement, not days',
    ],
  },
  {
    code: 'SSI · 03',
    tag: 'Intelligence',
    index: 'Division Three',
    title: 'Studio',
    href: '/studio/',
    cta: 'How we work',
    blurb:
      'Software development and applied AI consultancy. The team that built the two businesses above is the team that builds for yours.',
    points: [
      'Mobile, web and platform engineering',
      'Predictive modelling and applied ML',
      'Data pipelines and AI integration',
    ],
  },
];

/* Hairline roster. Each count is the number of items actually listed on the
   linked page — keep them in step if you edit either side. */
export const ROSTER = [
  {
    label: 'Diagnostics',
    name: 'Cell-Level Testing & Grading',
    count: '06',
    href: '/battery-passport/',
    sub: 'Capacity, impedance, balance, efficiency, thermal behaviour and cycle history — measured per cell, not per pack.',
  },
  {
    label: 'Certification',
    name: 'The Second Spark Passport',
    count: '04',
    href: '/battery-passport/',
    sub: 'Four grade bands, one verifiable record. What the battery is worth, stated plainly, and carried with it when it changes hands.',
  },
  {
    label: 'Monitoring',
    name: 'Predictive Fleet Health',
    count: '03',
    href: '/battery-passport/',
    sub: 'Data from every test feeds models that forecast decline in service, so maintenance is scheduled instead of discovered.',
  },
  {
    label: 'Recovery',
    name: 'Second Life & Recycling',
    count: '03',
    href: '/battery-passport/',
    sub: 'Failing packs are triaged at cell level and rebuilt, re-graded, or routed to recyclers rather than condemned whole.',
  },
  {
    label: 'Payments',
    name: 'MiKi Wallet Infrastructure',
    count: '05',
    href: '/miki/',
    sub: 'One unified wallet — instant card funding, near real-time settlement, local and cross-border in one place.',
  },
  {
    label: 'Engineering',
    name: 'Software, Product & Applied AI',
    count: '08',
    href: '/studio/',
    sub: 'Mobile and web platforms, backend and cloud, systems integration, forecasting models, data pipelines and AI features.',
  },
];

/* Home-page divisions table. */
export const DIVISION_TABLE = [
  {
    division: 'Battery Passport',
    focus: 'Cell-level testing, grading, certification and monitoring',
    status: 'Operating',
    reach: 'Zimbabwe',
  },
  {
    division: 'MiKi',
    focus: 'One unified wallet for local and cross-border payments',
    status: 'Launching soon',
    statusTone: 'teal',
    reach: 'Zimbabwe + 195 countries',
  },
  {
    division: 'Studio',
    focus: 'Software development and applied AI consultancy',
    status: 'Operating',
    reach: 'Remote and on-site',
  },
];

/* ---------------------------------------------------------------------------
   MiKi app screens.

   Sources live in /Images. `node scripts/extract-mockups.mjs` lifts each device
   off its gradient backdrop, writes public/screens/<slug>.webp (+ @2x) and
   regenerates lib/miki-shots.json with the intrinsic sizes used below.

   To drop a screen from the site, delete its entry here — the file staying in
   public/screens is harmless. To add one, add it to SHOTS in the script, re-run,
   then add an entry here.
   --------------------------------------------------------------------------- */

const SHOT_COPY = [
  {
    slug: 'wallet-home',
    label: 'Wallet',
    title: 'One balance, four ways to move it',
    caption:
      'Send, top up, pay a business, request money or exchange — the whole wallet from one screen.',
  },
  {
    slug: 'send-money',
    label: 'Send',
    title: 'See the cost before you send',
    caption:
      'Choose a destination, name the recipient, and the total is spelled out before anything moves.',
  },
  {
    slug: 'bureau-de-change',
    label: 'Exchange',
    title: 'What it is worth, where it lands',
    caption:
      'Check an amount against another currency at the reference rate before committing to a transfer.',
  },
  {
    slug: 'your-cards',
    label: 'Cards',
    title: 'The card you already carry',
    caption:
      'Link a Visa card once. Funding pulls straight from it — no agent, no branch, no new plastic.',
  },
  {
    slug: 'activity',
    label: 'Activity',
    title: 'Every movement, searchable',
    caption:
      'Money in and money out in one ledger, filterable and searchable by name, reference or country.',
  },
  {
    slug: 'insights',
    label: 'Insights',
    title: 'What it cost, and what it would have',
    caption:
      'Volume, fees and averages over time — measured against what the same transfers cost elsewhere.',
  },
  {
    slug: 'get-paid',
    label: 'Business',
    title: 'Take payment by handle',
    caption:
      'Switch on a business account and customers pay you in-app by @handle, QR or NFC tag.',
  },
  {
    slug: 'quick-actions',
    label: 'Actions',
    title: 'Everything one tap away',
    caption:
      'Add money, request it, manage cards, set up a business account or open the full history.',
  },
  {
    slug: 'profile',
    label: 'Profile',
    title: 'Identity, cards, appearance',
    caption:
      'Verification status, linked cards and app settings in one place — including Ask MiKi.',
  },
];

export const MIKI_SHOTS = SHOT_COPY.map((shot) => {
  const size = SHOT_SIZES[shot.slug];
  if (!size) {
    throw new Error(
      `MIKI_SHOTS: no size for "${shot.slug}" — re-run scripts/extract-mockups.mjs`
    );
  }
  return {
    ...shot,
    src: `/screens/${shot.slug}.webp`,
    src2x: `/screens/${shot.slug}@2x.webp`,
    width: size.w,
    height: size.h,
  };
});

/* The screen used as the hero device on the MiKi page. */
export const MIKI_HERO_SHOT = MIKI_SHOTS[0];

/* ---------------------------------------------------------------------------
   Brand assets. Sources in Images/brand/, processed by
   `node scripts/extract-brand.mjs` (white dropped; the logo's dark half
   recoloured to the bone ink so it reads on our ground).
   --------------------------------------------------------------------------- */

export const LOGO = {
  src: '/brand/logo.webp',
  src2x: '/brand/logo@2x.webp',
  width: BRAND_SIZES.logo.w,
  height: BRAND_SIZES.logo.h,
  alt: 'Second Spark Intelligence',
};

export const DEVICE = {
  src: '/brand/device.webp',
  src2x: '/brand/device@2x.webp',
  width: BRAND_SIZES.device.w,
  height: BRAND_SIZES.device.h,
  alt:
    'The Second Spark monitor fitted to a pack, reading 12.1 volts, 318 mAH capacity, power, energy, internal resistance, state of charge and running time.',
};

/* What the fitted monitor reads back, live. Taken from the device itself — keep
   this list in step with what the hardware actually reports. */
export const DEVICE_READOUTS = [
  { k: 'Voltage', v: 'Pack terminal voltage, live' },
  { k: 'Current', v: 'Draw and charge rate in real time' },
  { k: 'Power', v: 'Instantaneous load on the pack' },
  { k: 'Energy', v: 'Cumulative watt-hours in and out' },
  { k: 'Capacity', v: 'Charge counted through the pack' },
  { k: 'Internal resistance', v: 'The earliest signal of ageing' },
  { k: 'State of charge', v: 'Where the pack sits right now' },
  { k: 'Running time', v: 'How long it has been under load' },
];
