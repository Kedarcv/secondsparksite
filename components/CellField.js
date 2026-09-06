/* Cell-level health map — the portal's reveal image.
 *
 * A pack is not one battery, it is a few hundred cells, and its life is set by
 * the weakest of them. This draws that: every cell in the array with its
 * measured capacity, healthy ones in amber, drifting ones in teal, spent ones
 * reduced to a dim stub. Degradation clusters the way it really does — around
 * a hot zone — so the field reads as a diagnosis rather than a pattern.
 *
 * Authored rather than shot, so the amber and teal in the image and the amber
 * and teal in the interface are the same two values. Deterministic maths only
 * (no Math.random), and every attribute is emitted as a fixed-precision string,
 * because Math.sin differs in its last bits between Node and the browser and
 * that alone is enough to break hydration.
 */

const W = 1920;
const H = 1440;
const COLS = 22;
const ROWS = 13;
const CW = 72;
const CH = 90;
const GX = 13;
const GY = 15;
const MX = (W - (COLS * CW + (COLS - 1) * GX)) / 2;
const MY = (H - (ROWS * CH + (ROWS - 1) * GY)) / 2;

const AMBER = '#E8913C';
const TEAL = '#4E9AA3';
const BONE = '#EDE7DC';

const f = (v, d = 1) => v.toFixed(d);

// deterministic hash-noise in [0,1)
const n = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// a soft circular penalty — degradation pools around thermal hot spots
const pool = (c, r, cc, rr, radius, depth) => {
  const d = Math.hypot(c - cc, r - rr) / radius;
  return depth * Math.exp(-d * d);
};

const CELLS = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;
    /* Health has to vary SMOOTHLY across the array, or the bands scatter into a
       checkerboard and the field reads as a pattern instead of a diagnosis.
       Two thermal pools, a gentle undulation, and only a whisper of per-cell
       jitter — so grades form contiguous regions the way they really do. */
    const soh = Math.max(
      0.12,
      Math.min(
        1,
        0.98 -
          pool(c, r, 15.6, 8.4, 5.0, 0.7) -  // main hot zone, lower right
          pool(c, r, 3.6, 2.2, 3.2, 0.3) +   // a second, milder one
          Math.sin(c * 0.52) * Math.cos(r * 0.41) * 0.045 -
          n(i) * 0.03
      )
    );

    let fill;
    let op;
    if (soh >= 0.8) {
      // the healthy majority — amber, brighter the stronger the cell
      fill = AMBER;
      op = 0.42 + (soh - 0.8) * 2.6;
    } else if (soh >= 0.6) {
      // drifting, at the edge of the hot zone
      fill = TEAL;
      op = 0.34 + (soh - 0.6) * 1.5;
    } else {
      // spent — reduced to a stub
      fill = BONE;
      op = 0.09;
    }

    const x = MX + c * (CW + GX);
    const y = MY + r * (CH + GY);
    const inner = CH - 16;
    const bh = Math.max(3, inner * soh);

    CELLS.push({
      x: f(x),
      y: f(y),
      bx: f(x + 11),
      by: f(y + 8 + (inner - bh)),
      bw: CW - 22,
      bh: f(bh),
      fill,
      op: f(Math.min(op, 0.95), 3),
      flagged: soh < 0.65,
      tx: f(x + CW - 13),
      ty: f(y + 12),
    });
  }
}

export default function CellField({ id = 'cf', className = '' }) {
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
          <stop offset="55%" stopColor="#10151A" />
          <stop offset="100%" stopColor="#0A0C0E" />
        </linearGradient>

        <radialGradient id={u('lift')} cx="0.5" cy="0.48" r="0.62">
          <stop offset="0%" stopColor="#E8913C" stopOpacity="0.13" />
          <stop offset="60%" stopColor="#E8913C" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#E8913C" stopOpacity="0" />
        </radialGradient>

        <filter id={u('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${u('bg')})`} />
      <rect width={W} height={H} fill={`url(#${u('lift')})`} />

      {/* the array */}
      <g>
        {CELLS.map((c, i) => (
          <rect
            key={`o${i}`}
            x={c.x}
            y={c.y}
            width={CW}
            height={CH}
            rx="7"
            fill="none"
            stroke={BONE}
            strokeOpacity="0.13"
          />
        ))}
        {CELLS.map((c, i) => (
          <rect
            key={`b${i}`}
            x={c.bx}
            y={c.by}
            width={c.bw}
            height={c.bh}
            rx="3"
            fill={c.fill}
            opacity={c.op}
          />
        ))}
        {/* cells that fail the threshold get a mark, the way a report flags them */}
        {CELLS.filter((c) => c.flagged).map((c, i) => (
          <circle key={`f${i}`} cx={c.tx} cy={c.ty} r="2.6" fill={AMBER} opacity="0.75" />
        ))}
      </g>

      {/* measurement rules */}
      <g stroke={BONE} strokeOpacity="0.05">
        <line x1="0" y1={f(MY - 22)} x2={W} y2={f(MY - 22)} />
        <line x1="0" y1={f(H - MY + 22)} x2={W} y2={f(H - MY + 22)} />
      </g>

      <rect
        width={W}
        height={H}
        filter={`url(#${u('grain')})`}
        opacity="0.13"
        style={{ mixBlendMode: 'overlay' }}
      />
    </svg>
  );
}
