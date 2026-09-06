/* Discharge Field — the hero "photograph".
   Authored rather than shot, so the amber and teal on the page and the amber and
   teal in the image are literally the same two values. Deterministic maths only
   (no Math.random) so server and client markup match. */

const W = 1600;
const H = 900;
const CX = 620;
const CY = 415;

// deterministic hash-noise in [0,1)
const n = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* Every attribute below is emitted as a fixed-precision STRING.
   Math.sin/exp differ in their last bits between V8-on-Node and the browser's
   libm, which is enough to make the server and client markup disagree and blow
   up hydration. Rounding to a string makes both sides byte-identical. */
const f = (v, d = 2) => v.toFixed(d);

// Bar field: an energy/discharge profile. Envelope peaks left-of-centre, decays out.
const BARS = Array.from({ length: 104 }, (_, i) => {
  const t = i / 103;
  const env = Math.exp(-Math.pow((t - 0.36) * 2.35, 2));
  const ripple = 0.55 + 0.45 * Math.sin(t * 26 + 1.2);
  const h = 16 + env * 330 * (0.42 + 0.58 * n(i)) * ripple;
  return {
    x: f(40 + t * (W - 80)),
    y: f(H - 90 - h),
    h: f(h),
    o: f(0.06 + env * 0.3 * n(i + 90), 3),
    oA: f(Math.min(0.06 + env * 0.3 * n(i + 90) + 0.32, 0.85), 3),
    accent: n(i + 400) > 0.9,
  };
});

// Concentric arcs radiating from the core
const ARCS = Array.from({ length: 11 }, (_, i) => ({
  r: 128 + i * 82,
  o: f(Math.max(0.085 - i * 0.0055, 0.012), 4),
}));

// Sparse particulate
const DOTS = Array.from({ length: 46 }, (_, i) => ({
  x: f(n(i + 7) * W),
  y: f(n(i + 51) * H),
  r: f(0.7 + n(i + 103) * 1.9),
  o: f(0.08 + n(i + 205) * 0.3, 3),
  teal: n(i + 311) > 0.72,
}));

// A settling waveform across the middle
const WAVE = Array.from({ length: 130 }, (_, i) => {
  const t = i / 129;
  const decay = Math.exp(-t * 2.1);
  const y = CY + 130 + Math.sin(t * 34) * 74 * decay + Math.sin(t * 9.3) * 16;
  return `${f(t * W, 1)},${f(y, 1)}`;
}).join(' ');

export default function HeroField({ id = 'hf', className = '' }) {
  const u = (s) => `${id}-${s}`;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={u('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A0C0E" />
          <stop offset="52%" stopColor="#12161A" />
          <stop offset="100%" stopColor="#0A0C0E" />
        </linearGradient>

        <radialGradient id={u('amb')}>
          <stop offset="0%" stopColor="#E8913C" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#E8913C" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#E8913C" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={u('tl')}>
          <stop offset="0%" stopColor="#2E6B72" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#2E6B72" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={u('bar')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#EDE7DC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EDE7DC" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={u('barA')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E8913C" stopOpacity="1" />
          <stop offset="100%" stopColor="#E8913C" stopOpacity="0" />
        </linearGradient>

        <filter id={u('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" seed="11" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${u('bg')})`} />

      {/* light */}
      <ellipse cx={CX} cy={CY} rx="720" ry="560" fill={`url(#${u('amb')})`} />
      <ellipse cx="1290" cy="720" rx="520" ry="430" fill={`url(#${u('tl')})`} />

      {/* measurement grid */}
      <g stroke="#EDE7DC" strokeOpacity="0.035" strokeWidth="1">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2={H} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 80} x2={W} y2={i * 80} />
        ))}
      </g>

      {/* radiating arcs */}
      <g fill="none">
        {ARCS.map((a, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={a.r}
            stroke="#EDE7DC"
            strokeOpacity={a.o}
            strokeWidth="1"
          />
        ))}
        <circle cx={CX} cy={CY} r="292" stroke="#E8913C" strokeOpacity="0.34" strokeWidth="1.2"
          strokeDasharray="3 13" />
        <circle cx={CX} cy={CY} r="538" stroke="#2E6B72" strokeOpacity="0.46" strokeWidth="1.2" />
        <circle cx={CX} cy={CY} r="700" stroke="#E8913C" strokeOpacity="0.12" strokeWidth="1"
          strokeDasharray="1 9" />
      </g>

      {/* core */}
      <circle cx={CX} cy={CY} r="4.5" fill="#E8913C" />
      <circle cx={CX} cy={CY} r="15" fill="none" stroke="#E8913C" strokeOpacity="0.45" strokeWidth="1" />

      {/* discharge profile */}
      <g>
        {BARS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width="4"
            height={b.h}
            rx="2"
            fill={b.accent ? `url(#${u('barA')})` : `url(#${u('bar')})`}
            opacity={b.accent ? b.oA : b.o}
          />
        ))}
      </g>
      <line x1="40" y1={H - 90} x2={W - 40} y2={H - 90} stroke="#EDE7DC" strokeOpacity="0.14" />

      {/* settling waveform */}
      <polyline points={WAVE} fill="none" stroke="#2E6B72" strokeOpacity="0.75" strokeWidth="1.4" />

      {/* particulate */}
      <g>
        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.teal ? '#2E6B72' : '#EDE7DC'}
            opacity={d.o}
          />
        ))}
      </g>

      {/* film grain */}
      <rect
        width={W}
        height={H}
        filter={`url(#${u('grain')})`}
        opacity="0.16"
        style={{ mixBlendMode: 'overlay' }}
      />
    </svg>
  );
}
