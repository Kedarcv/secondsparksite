/* Lift the MiKi device mockups out of their gradient backdrop.
 *
 * The shots ship on a saturated orange→pink→purple gradient, which fights the
 * site's near-black ground and breaks the "no gradient banners" rule of the
 * design system. The phone itself is dark metal over a near-black screen, so a
 * flood fill of "saturated AND bright" pixels inward FROM THE IMAGE BORDER
 * removes only backdrop connected to the edge — coloured pixels inside the
 * screen (flags, battery, arrows, avatars) are never reached.
 *
 * Run:  node scripts/extract-mockups.mjs
 * In:   ./Images/*.png        Out: ./public/screens/<slug>.webp + <slug>@2x.webp
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = new URL('../Images/', import.meta.url).pathname;
const OUT = new URL('../public/screens/', import.meta.url).pathname;

const S_MIN = 0.35; // backdrop sits at .78-.98; brushed-metal frame at ~.23
const V_MIN = 45;   // anything darker is halo, and reads as black on our ground
const PAD = 6;

/* Redaction boxes, in SOURCE image coordinates (1920x1440).
   Two things are taken out before anything is published:
     · personal names and the one real email address in the mockups
     · fee schedules and savings comparisons — pricing MiKi has not committed to
   Each box may set its own blur `sigma`; the default scales with box height.
   Remove a box to publish that part of the mockup verbatim. */
const SHOTS = [
  {
    file: '832shots_so.png',
    slug: 'wallet-home',
    redact: [{ left: 676, top: 514, width: 131, height: 40 }], // "Michael"
  },
  { file: '790shots_so.png', slug: 'quick-actions' },
  {
    file: '114shots_so.png',
    slug: 'send-money',
    // whole cost breakdown: amounts, "MiKi fee (1.5%, max $20)", savings note
    redact: [{ left: 758, top: 862, width: 462, height: 268 }],
  },
  { file: '219shots_so.png', slug: 'bureau-de-change' },
  {
    file: '512shots_so.png',
    slug: 'your-cards',
    redact: [{ left: 594, top: 1061, width: 282, height: 38 }], // cardholder name
  },
  {
    file: '288shots_so.png',
    slug: 'activity',
    redact: [{ left: 692, top: 849, width: 318, height: 42 }], // recipient name
  },
  {
    file: '462shots_so.png',
    slug: 'get-paid',
    redact: [{ left: 780, top: 1022, width: 460, height: 115 }], // MiKi Pay fee card
  },
  {
    file: '866shots_so.png',
    slug: 'insights',
    redact: [
      { left: 737, top: 657, width: 148, height: 72 },  // "$1.50 fees paid"
      { left: 768, top: 828, width: 434, height: 115 }, // savings + 6.4% comparison
    ],
  },
  {
    file: '377shots_so.png',
    slug: 'profile',
    redact: [{ left: 800, top: 415, width: 255, height: 88 }], // name + real email
  },
];

async function sourceBuffer(shot) {
  const path = SRC + shot.file;
  if (!shot.redact) return sharp(path).removeAlpha().png().toBuffer();

  const patches = await Promise.all(
    shot.redact.map(async (r) => {
      // scale the blur to the box so small labels smear as thoroughly as
      // large cards, without turning big areas into flat grey
      const sigma = r.sigma ?? Math.min(25, Math.max(8, r.height / 5));
      return {
        input: await sharp(path)
          .extract({ left: r.left, top: r.top, width: r.width, height: r.height })
          .blur(sigma)
          .png()
          .toBuffer(),
        left: r.left,
        top: r.top,
      };
    })
  );
  return sharp(path).removeAlpha().composite(patches).png().toBuffer();
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};

  for (const shot of SHOTS) {
    const src = await sourceBuffer(shot);
    const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    const N = W * H;

    // 1. classify backdrop by saturation + value
    const isBg = new Uint8Array(N);
    for (let i = 0, p = 0; i < N; i++, p += C) {
      const r = data[p], g = data[p + 1], b = data[p + 2];
      const v = r > g ? (r > b ? r : b) : g > b ? g : b;
      const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
      if (v > V_MIN && (v - mn) / v > S_MIN) isBg[i] = 1;
    }

    // 2. flood fill inward from the border, through backdrop only
    const seen = new Uint8Array(N);
    const stack = new Int32Array(N);
    let sp = 0;
    const push = (i) => {
      if (!seen[i] && isBg[i]) { seen[i] = 1; stack[sp++] = i; }
    };
    for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
    for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
    while (sp > 0) {
      const i = stack[--sp];
      const x = i % W, y = (i / W) | 0;
      if (x > 0) push(i - 1);
      if (x < W - 1) push(i + 1);
      if (y > 0) push(i - W);
      if (y < H - 1) push(i + W);
    }

    // 3. alpha = whatever the fill never reached, plus content bounds
    const alpha = Buffer.alloc(N);
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let i = 0; i < N; i++) {
      if (seen[i]) continue;
      alpha[i] = 255;
      const x = i % W, y = (i / W) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (maxX < 0) throw new Error(`${shot.slug}: nothing survived the mask`);

    // soften the cut so the silhouette is not aliased. toColourspace('b-w')
    // keeps it single-channel — blur() otherwise promotes it to sRGB.
    const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
      .blur(0.7)
      .toColourspace('b-w')
      .raw()
      .toBuffer();

    // 4. interleave RGBA by hand. sharp's joinChannel does not reliably
    //    promote the joined plane to a real alpha channel here.
    const rgba = Buffer.alloc(N * 4);
    for (let i = 0, s = 0, d = 0; i < N; i++, s += C, d += 4) {
      rgba[d] = data[s];
      rgba[d + 1] = data[s + 1];
      rgba[d + 2] = data[s + 2];
      rgba[d + 3] = soft[i];
    }

    const left = Math.max(0, minX - PAD);
    const top = Math.max(0, minY - PAD);
    const cropW = Math.min(W - left, maxX - minX + 1 + PAD * 2);
    const cropH = Math.min(H - top, maxY - minY + 1 + PAD * 2);

    const cut = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
      .extract({ left, top, width: cropW, height: cropH })
      .png()
      .toBuffer();

    let line = `${shot.slug.padEnd(18)} ${W}x${H} → crop ${cropW}x${cropH}`;
    for (const [suffix, w] of [['', 640], ['@2x', 1280]]) {
      const out = await sharp(cut)
        .resize({ width: Math.min(w, cropW), withoutEnlargement: true })
        .webp({ quality: 82, alphaQuality: 90, effort: 6 })
        .toFile(`${OUT}${shot.slug}${suffix}.webp`);
      line += ` → ${out.width}x${out.height} ${(out.size / 1024).toFixed(0)}KB`;
      if (!suffix) manifest[shot.slug] = { w: out.width, h: out.height };
    }
    console.log(line);
  }

  // Intrinsic sizes for the <img> tags, so the layout never shifts on load.
  const target = new URL('../lib/miki-shots.json', import.meta.url).pathname;
  await writeFile(target, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nwrote lib/miki-shots.json (${Object.keys(manifest).length} shots)`);
}

run().catch((e) => { console.error(e); process.exit(1); });
