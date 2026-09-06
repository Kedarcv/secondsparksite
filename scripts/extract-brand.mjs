/* Prepare the brand assets for a near-black site.
 *
 * Both source files are shot on white, which cannot go on our ground as-is.
 * This lifts the white out and, for the logo, recolours the black half of the
 * wordmark to our bone ink so it is legible on dark.
 *
 * Drop the files in first:
 *   Images/brand/logo.png     the Second Spark Intelligence logo
 *   Images/brand/device.png   the SSI telemetry monitor
 *
 * Run:  node scripts/extract-brand.mjs
 * Out:  public/brand/<name>.webp  +  <name>@2x.webp
 */
import sharp from 'sharp';
import { mkdir, access, writeFile } from 'node:fs/promises';

const SRC = new URL('../Images/brand/', import.meta.url).pathname;
const OUT = new URL('../public/brand/', import.meta.url).pathname;

const BONE = [0xed, 0xe7, 0xdc]; // --ink

/* The logo's own orange is #FD8B00 — a hotter, purer orange than the site's
   --amber. Two near-identical oranges sitting next to each other read as a
   mistake, so the mark is normalised to the site value. Swap the constant to
   [0xfd, 0x8b, 0x00] to keep the brand orange exactly as supplied. */
const AMBER = [0xe8, 0x91, 0x3c]; // --amber

const JOBS = [
  {
    file: 'logo.png',
    slug: 'logo',
    // Two-tone wordmark: recolour the dark half to bone, normalise the orange
    // to our amber. Keeps the mark legible and on-palette against #0A0C0E.
    mode: 'duotone',
    widths: [420, 840],
  },
  // The portal reveal is drawn in code now — see components/CellField.js.
  // To go back to a photograph, restore a job here with mode: 'plain'.
  {
    file: 'device.png',
    slug: 'device',
    // Product photograph: keep its own colour, drop the white studio sweep and
    // its soft shadow. Per-pixel coverage would fade the light LCD bezel to
    // nothing, so the backdrop is flood-filled from the border instead.
    mode: 'photo',
    bgV: 205,
    bgS: 0.12,
    widths: [560, 1120],
  },
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};
  let done = 0;

  for (const job of JOBS) {
    const path = SRC + job.file;
    if (!(await exists(path))) {
      console.log(`skip  ${job.file} — not found in Images/brand/`);
      continue;
    }

    if (job.mode === 'plain') {
      const meta = await sharp(path).metadata();
      let line = `${job.slug.padEnd(8)} ${meta.width}x${meta.height}`;
      for (const [n, w] of job.widths.entries()) {
        const out = await sharp(path)
          .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
          .webp({ quality: 78, effort: 6 })
          .toFile(`${OUT}${job.slug}${n ? '@2x' : ''}.webp`);
        line += ` → ${out.width}x${out.height} ${(out.size / 1024).toFixed(0)}KB`;
        if (!n) manifest[job.slug] = { w: out.width, h: out.height };
      }
      console.log(line);
      done++;
      continue;
    }

    const { data, info } = await sharp(path)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    const N = W * H;
    const rgbaHue = new Uint8Array(N);

    const alpha = new Float32Array(N);

    if (job.mode === 'duotone') {
      /* Per-pixel coverage against the white sweep. This is what keeps the
         counters inside e, o, a and p transparent — a flood fill from the
         border would never reach them and they would fill in solid. */
      for (let i = 0, s = 0; i < N; i++, s += C) {
        const r = data[s], g = data[s + 1], b = data[s + 2];
        const mx = r > g ? (r > b ? r : b) : g > b ? g : b;
        const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
        alpha[i] = clamp01(1 - mn / 255);
        // remember the hue decision in the top bit of the colour we write later
        rgbaHue[i] = mx === 0 ? 0 : (mx - mn) / mx > 0.25 ? 1 : 0;
      }
    } else {
      /* Flood fill the white backdrop inward from the border. Anything the
         fill never reaches is the product, including its light grey bezel. */
      const isBg = new Uint8Array(N);
      for (let i = 0, s = 0; i < N; i++, s += C) {
        const r = data[s], g = data[s + 1], b = data[s + 2];
        const mx = r > g ? (r > b ? r : b) : g > b ? g : b;
        const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
        const sat = mx === 0 ? 0 : (mx - mn) / mx;
        if (mx > job.bgV && sat < job.bgS) isBg[i] = 1;
      }
      const seen = new Uint8Array(N);
      const stack = new Int32Array(N);
      let sp = 0;
      const push = (i) => { if (!seen[i] && isBg[i]) { seen[i] = 1; stack[sp++] = i; } };
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
      for (let i = 0; i < N; i++) alpha[i] = seen[i] ? 0 : 1;
    }

    const rgba = Buffer.alloc(N * 4);
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let i = 0, s = 0, d = 0; i < N; i++, s += C, d += 4) {
      const a = alpha[i];
      if (job.mode === 'duotone') {
        const [cr, cg, cb] = rgbaHue[i] ? AMBER : BONE;
        rgba[d] = cr; rgba[d + 1] = cg; rgba[d + 2] = cb;
      } else {
        rgba[d] = data[s]; rgba[d + 1] = data[s + 1]; rgba[d + 2] = data[s + 2];
      }
      rgba[d + 3] = Math.round(a * 255);
      if (a > 0.06) {
        const x = i % W, y = (i / W) | 0;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) throw new Error(`${job.slug}: everything was treated as background`);

    const pad = 4;
    const left = Math.max(0, minX - pad);
    const top = Math.max(0, minY - pad);
    const cropW = Math.min(W - left, maxX - minX + 1 + pad * 2);
    const cropH = Math.min(H - top, maxY - minY + 1 + pad * 2);

    let full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
    if (job.mode === 'photo') {
      // the flood fill produces a hard binary edge — feather it
      const soft = await sharp(Buffer.from(alpha.map((a) => Math.round(a * 255))), {
        raw: { width: W, height: H, channels: 1 },
      }).blur(0.7).toColourspace('b-w').raw().toBuffer();
      for (let i = 0; i < N; i++) rgba[i * 4 + 3] = soft[i];
      full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
    }

    const cut = await full
      .extract({ left, top, width: cropW, height: cropH })
      .png()
      .toBuffer();

    let line = `${job.slug.padEnd(8)} ${W}x${H} → crop ${cropW}x${cropH}`;
    for (const [n, w] of job.widths.entries()) {
      const out = await sharp(cut)
        .resize({ width: Math.min(w, cropW), withoutEnlargement: true })
        .webp({ quality: 88, alphaQuality: 100, effort: 6 })
        .toFile(`${OUT}${job.slug}${n ? '@2x' : ''}.webp`);
      line += ` → ${out.width}x${out.height} ${(out.size / 1024).toFixed(0)}KB`;
      if (!n) manifest[job.slug] = { w: out.width, h: out.height };
    }
    console.log(line);
    done++;
  }

  if (done) {
    const target = new URL('../lib/brand-assets.json', import.meta.url).pathname;
    await writeFile(target, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`\nwrote lib/brand-assets.json (${Object.keys(manifest).length} assets)`);
  }

  if (!done) {
    console.log('\nNothing to do. Save the two images into Images/brand/ first:');
    console.log('  Images/brand/logo.png');
    console.log('  Images/brand/device.png');
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
