# Second Spark Intelligence

Marketing site for Second Spark Intelligence — three divisions: **Battery Passport**
(cell-level lithium testing, grading and monitoring), **MiKi** (payment rail on Visa
Direct), and **Studio** (software development and applied AI consultancy).

Next.js 16, statically exported. No server, no database, no build-time API calls —
the output is plain HTML/CSS/JS you can drop onto any host.

---

## Run it locally

```bash
npm install && npm run dev
```

Opens on <http://localhost:3210>.

## Deploying

```bash
npm run build
```

writes a complete static site to **`out/`** — plain HTML, CSS, JS and images, no
server, no database, nothing to run. Three host configs ship, and each host
ignores the others', so one build works everywhere:

| File | Read by | Exported? |
|---|---|---|
| `vercel.json` | Vercel | no — read from the repo at build time |
| `_headers` | Cloudflare Pages | yes |
| `.htaccess` | Apache / cPanel | yes |

### Vercel — the current setup

The domain is registered with Vercel, so DNS is already theirs and there is no
nameserver change to make. This is the shortest path.

```bash
npx vercel login
npm run deploy
```

`deploy` runs `vercel deploy --prod`. The first run asks a few setup questions —
link to an existing project or create one, scope, and directory (accept the
default, `./`). After that it is one command. Use `npm run deploy:preview` for a
preview URL that does not touch production.

To deploy on every push instead, connect the repo in the Vercel dashboard. Vercel
detects Next.js on its own; because `next.config.mjs` sets `output: 'export'` it
serves the static build rather than running a server.

**Attaching the domain.** Project → Settings → Domains → add `secondspark.co.zw`.
Since the domain is registered in the same account, Vercel wires the DNS and
issues the certificate itself. Add `www.secondspark.co.zw` too and pick which one
redirects to the other.

`vercel.json` carries the security and caching headers — Vercel reads neither
`.htaccess` nor `_headers`, so without it the export would be served with default
caching.

> **One caveat on plan.** Vercel's free Hobby tier prohibits commercial use, and
> this is a company site; Pro is $20/month. Buying the domain there does not
> change that. If you would rather not pay, the domain can still point at
> Cloudflare Pages — you would just manage DNS records from the Vercel dashboard.
> Everything for that path is already in place.

### Cloudflare Pages

Free with unlimited bandwidth, and already configured.

```bash
npx wrangler login
npm run deploy:cloudflare
```

Pointing the Vercel-registered domain at it means either moving the nameservers
to Cloudflare (needed for an apex domain, because Pages has no fixed IPs and
apex CNAMEs require Cloudflare's CNAME flattening), or using `www` with a CNAME
to `<project>.pages.dev` from Vercel's DNS panel.

### Apache / cPanel

Upload the **contents** of `out/` into `public_html`. `.htaccess` is a hidden
file — enable "Show Hidden Files" in cPanel File Manager or it will not upload.

### A note on caching

`_next/` output is content-hashed, so a change produces a new filename and it is
cached for a year. `brand/` and `screens/` are **not** hashed — the extract
scripts reuse filenames — so those revalidate weekly instead. Replacing the logo
or a screenshot then reaches visitors within days rather than being pinned in
their browsers for a year. All three host configs encode this.

App screens live at `/screens/`, deliberately not `/miki/`, so asset paths never
collide with the `/miki/` page route. That collision made the cache rules
ambiguous on every host.

## Where the content lives

Copy is deliberately kept out of the markup so it can be edited without touching
layout code.

| What | File |
|---|---|
| Company name, email, domain, tagline | [`lib/content.js`](lib/content.js) |
| Home deck cards, capability roster, division table | [`lib/content.js`](lib/content.js) |
| Battery Passport page | [`app/battery-passport/page.js`](app/battery-passport/page.js) |
| MiKi page | [`app/miki/page.js`](app/miki/page.js) |
| Studio page | [`app/studio/page.js`](app/studio/page.js) |
| Contact page | [`app/contact/page.js`](app/contact/page.js) |
| MiKi app screen captions | [`lib/content.js`](lib/content.js) (`SHOT_COPY`) |
| All styling and design tokens | [`app/globals.css`](app/globals.css) |

**Keep the roster counts honest.** `ROSTER` in `lib/content.js` shows a count next
to each capability (`06`, `04`, `03`…). Each one is the number of items actually
listed on the page it links to. If you add or remove an item, update the count.

## The contact form

The site is static, so there is nothing server-side to receive a POST. Out of the
box the form opens the visitor's own mail client with the message composed —
nothing is transmitted anywhere until they press send there.

To collect submissions properly, set `ENDPOINT` at the top of
[`components/ContactForm.js`](components/ContactForm.js) to any endpoint that
accepts a form POST (Formspree, Web3Forms, Getform, or your own PHP handler on
cPanel). The form switches to `fetch` automatically and shows success/error states.

## Design system

Dark label style. All tokens are CSS custom properties at the top of `globals.css`.

| | |
|---|---|
| Ground / secondary | `#0A0C0E` / `#101317` |
| Ink / secondary / muted | `#EDE7DC` / `#9EA5A8` / `#6C7378` |
| Amber accent | `#E8913C` |
| Teal accent | `#2E6B72` (`#4E9AA3` when used on small type, for contrast) |
| Hairline | `rgba(237,231,220,.13)` |
| Display / text face | Syne 600–800 / Sora 400–600 |

Accents stay on type, dots and rules — never as filled areas. The only drop shadow
in the system is on the deck cards.

### The hero image

There is no photograph. Two components draw the imagery as inline SVG, both
deterministic (no `Math.random`) and both emitting every attribute as a
fixed-precision string — `Math.sin` differs in its last bits between Node and the
browser, and that alone is enough to break hydration.

[`components/CellField.js`](components/CellField.js) is what the portal opens
onto, and the circular crop that drifts through the statement fold below it. It
draws a pack's worth of cells — 286 of them — each shaded by measured state of
health: amber for the healthy majority, teal where cells are drifting, a dim stub
where one is spent, and a small amber mark on every cell that fails the
threshold. Health varies **smoothly** across the array, pooled around two thermal
hot spots, so the grades form contiguous regions and the field reads as a
diagnosis rather than a pattern. That is the Battery Passport, drawn.

It is an all-over field by design. The portal covers the centre with the wordmark
and reveals it last, and the image is cropped hard on narrow screens — neither
hurts a field the way it would hurt a scene.

[`components/HeroField.js`](components/HeroField.js) is the quieter abstract wash
behind the four sub-page heroes.

Both use the same amber and teal as the interface, so the page and the image
agree by construction. To swap in a photograph later, replace `<CellField />`
inside `PortalHero` and `Statement` with an `<img>`, and pull the two accent
values out of that image.

## Motion, and what happens without it

An inline script in [`app/layout.js`](app/layout.js) adds a `motion` class to
`<html>` during parse — before first paint — unless the reader has
`prefers-reduced-motion: reduce` set.

**Everything animated is scoped to that class**, so the reduced-motion and no-JS
renders are the finished page, not a broken one:

| | With motion | Without |
|---|---|---|
| Hero portal | starts closed, opens on scroll over 250vh | already open, section collapses to 100vh |
| Division deck | physical throwable stack | plain vertical list of all three cards |
| Section reveals | fade and rise on entry | visible |

All portal motion is bound to scroll **position**, so it plays in reverse on the
way back up. Reveals fire once and never un-reveal; anything already on screen is
revealed synchronously rather than waiting on the observer, so content is never
left invisible by a throttled callback.

The card deck is usable without a mouse: it is focusable, takes ← and → to flip,
and sets `touch-action: pan-y` so vertical scrolling still works on a phone.
Buried cards are `inert`, so their links stay out of the tab order.

## Images

Source images live in `Images/` and are **not** deployed. Two scripts turn them
into web assets in `public/`, which is what ships.

### MiKi app screens

```bash
node scripts/extract-mockups.mjs
```

The nine mockups ship on a saturated orange→pink→purple gradient, which fights
the near-black ground and breaks the "no gradient banners" rule of the design
system. The script lifts each device off its backdrop by flood-filling
"saturated and bright" pixels inward *from the image border* — so colour inside
the screen (flags, battery, arrows, avatars) is never touched — then writes
`public/screens/<slug>.webp` and `<slug>@2x.webp`, plus `lib/miki-shots.json` with
the intrinsic sizes the `<img>` tags need to avoid layout shift.

All nine come to about 380KB total.

**Seven shots carry redactions.** The `redact` boxes in
`scripts/extract-mockups.mjs` are given in source coordinates (1920x1440) and
blur two classes of content before anything is published:

| Shot | Redacted |
|---|---|
| Wallet home | the greeting name |
| Send money | the whole cost breakdown, including the fee line and savings note |
| Your cards | the cardholder name |
| Activity | the recipient name |
| Get paid | the MiKi Pay fee card |
| Insights | the fees-paid figure and the savings/comparison card |
| Profile | the name and a real personal email address |

Names are blurred because the mockups use real ones. Fee figures are blurred
because they are pricing MiKi has not committed to publicly — the schedules were
legible in the source files. Blur strength scales with box height, or set
`sigma` on a box to override. Delete a box to publish that part verbatim.

Two things are deliberately **not** redacted, since both read as obvious
placeholder data rather than disclosure: the example business name and handle on
the Get paid screen, and the `••1111` test card number.

To add or remove a screen: add it to `SHOTS` in the script, re-run, then add a
matching entry to `SHOT_COPY` in `lib/content.js`. The two are checked against
each other at build time, so a mismatch fails loudly rather than silently.

### Brand assets

```bash
node scripts/extract-brand.mjs
```

Expects three files in `Images/brand/`: `logo.png`, `device.png` and
`hero.png`. Output lands in `public/brand/`, with sizes recorded in
`lib/brand-assets.json`.

`hero.png` is the photograph the portal opens onto, and the circular crop that
drifts through the statement fold below it. It needs no cutting out — just
resizing and an encode — so it is handled by the script's `plain` mode.

It is placed with `object-fit: cover` and settles to scale 1 at full open, so
the whole mockup including its browser chrome is in frame on any desktop
viewport; only outer margin is lost. On a narrow portrait screen a landscape
image cannot fill a tall frame without cropping, so mobile shows the centre of
the shot — the monitor, close up.

The other two are shot on white, which cannot sit on the site's ground.

The two need different treatment, and the script does each separately:

- **Logo** — per-pixel coverage against the white. This is what keeps the
  counters inside *e*, *o*, *a* and *p* transparent; a flood fill would never
  reach them and they would fill in solid. The dark half of the wordmark
  ("Second", "Intelligence") is recoloured to the bone ink, since black is
  invisible on `#0A0C0E`.
- **Device** — flood fill from the border. Per-pixel coverage would fade the
  light grey LCD bezel almost to nothing, so the backdrop and its soft shadow
  are filled inward instead, stopping at the product's edge.

**The logo's orange is normalised.** The supplied mark is `#FD8B00`, a hotter
orange than the site's `--amber` `#E8913C`. Two near-identical oranges beside
each other read as a mistake, so the logo is remapped to the site value. To keep
the brand orange exactly as supplied, change the `AMBER` constant at the top of
`scripts/extract-brand.mjs` to `[0xfd, 0x8b, 0x00]` and re-run.

The logo is used in the nav bar. The oversized `SECOND SPARK` on the home page
stays typographic — it scales, tightens its tracking and splits in half on
scroll, which an image cannot do.
