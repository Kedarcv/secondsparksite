# Second Spark Intelligence

Marketing site for Second Spark Intelligence — three divisions: **Battery Passport**
(cell-level lithium testing, grading and monitoring), **MiKi** (payment rail on Visa
Direct), and **Studio** (software development and applied AI consultancy).

Next.js 16, hosted on Vercel. Marketing pages are statically generated at
build time; the contact form and the Resend webhook run as serverless
functions under `/api/`. (Earlier revisions of this project were a pure static
export — see the note at the top of `next.config.mjs` for why that changed.)

---

## Run it locally

```bash
npm install && npm run dev
```

Opens on <http://localhost:3210>.

## Deploying

```bash
npm run deploy
```

runs `vercel deploy --prod`. The domain is registered with Vercel, so DNS is
already theirs and there's no nameserver change to make — this is the primary
and only fully-working deploy path now, because the contact form and webhook
need a real server request to run on.

The first run asks a few setup questions — link to an existing project or
create one, scope, and directory (accept the default, `./`). After that it's
one command. `npm run deploy:preview` gives a preview URL that doesn't touch
production. To deploy on every push instead, connect the repo in the Vercel
dashboard — it detects Next.js on its own.

**Attaching the domain.** Project → Settings → Domains → add
`secondspark.co.zw`. Since the domain is registered in the same account, Vercel
wires the DNS and issues the certificate itself. Add `www.secondspark.co.zw`
too and pick which one redirects to the other.

`vercel.json` carries the security and caching headers, including
`Cache-Control: no-store` on `/api/*` so a dynamic response is never cached.

Once deployed, set the environment variables from **§ Email** below in Project
Settings, then see that section for the webhook setup, which needs the live URL
to exist first.

> **One caveat on plan.** Vercel's free Hobby tier prohibits commercial use, and
> this is a company site; Pro is $20/month. Buying the domain there doesn't
> change that.

### Static hosting is no longer a complete option

`.htaccess` (Apache/cPanel) and `_headers` (Cloudflare Pages) still ship in
`public/` from when this was a pure static export, and the marketing pages
themselves would still work fine as static files. But `npm run build` no
longer produces an `out/` directory at all — it produces a server build — so
there is nothing left to upload to either of those hosts, and neither can run
the `/api/*` routes regardless. The contact form would need a different
backend (Formspree, a PHP handler, a Cloudflare Worker) to work under either.

If that trade-off is ever worth making again: restore `output: 'export'` in
`next.config.mjs`, delete `app/api/contact/` and `app/api/webhooks/resend/`
(a static export can't contain them), and restore the `mailto:` fallback in
`ContactForm.js` from git history.

### A note on caching

`_next/` output is content-hashed, so a change produces a new filename and it's
cached for a year. `brand/` and `screens/` are **not** hashed — the extract
scripts reuse filenames — so those revalidate weekly instead, and `/api/*`
responses are never cached at all.

App screens live at `/screens/`, deliberately not `/miki/`, so asset paths never
collide with the `/miki/` page route.

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

## Email

The contact form posts to a real backend — [`app/api/contact/route.js`](app/api/contact/route.js)
— which sends through [Resend](https://resend.com). This is why the site is no
longer a static export: sending mail, and verifying a webhook's signature, both
need a server request to run on. See the note at the top of `next.config.mjs`.

### What each piece does

| | |
|---|---|
| [`app/api/contact/route.js`](app/api/contact/route.js) | The form's endpoint. Validates input, then sends two emails: the enquiry to your team, and an acknowledgement back to the sender. |
| [`app/api/webhooks/resend/route.js`](app/api/webhooks/resend/route.js) | Verifies Resend's webhook signature, then handles two kinds of event: a bounce/complaint/failure raises an internal alert; an inbound `email.received` fetches the full message and forwards it into `CONTACT_TO`. |
| [`lib/email.js`](lib/email.js) | Shared HTML templates and the two sanitizers every user-supplied value passes through before it reaches an email — see **Security** below. |

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local` for local dev, and set the
same keys in Vercel → Project Settings → Environment Variables for production
(a redeploy is needed to pick up a change there).

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | From the Resend dashboard → API Keys. Needs **full access**, not sending-only — the inbound-forward path calls `emails.receiving.get`, which a sending-only key can't do. |
| `RESEND_WEBHOOK_SECRET` | The signing secret Resend gives you when you create the webhook (see below). Leave blank until then — the webhook route refuses every request with a 503 while it's unset, rather than accepting unverified ones. |
| `CONTACT_TO` | The real inbox that enquiries, delivery alerts, and forwarded inbound mail land in. Must be an address you actually check. |
| `CONTACT_FROM` | The outbound `From` address, e.g. `Second Spark Intelligence <info@secondspark.online>`. Its domain must be **verified in Resend** (Domains → Add Domain → add the SPF/DKIM/DMARC records it gives you) or every send fails until it is. |

### Setting up the webhook

The signing secret doesn't exist until the webhook does, so this is necessarily
a two-step, deploy-then-configure process:

1. Deploy once (`npm run deploy`, or push to the connected repo) so a live HTTPS
   URL exists.
2. In the Resend dashboard → Webhooks → Add Webhook, point it at
   `https://<your-domain>/api/webhooks/resend/` — **with the trailing slash**.
   `next.config.mjs` sets `trailingSlash: true`, so the bare path 308-redirects
   to it; Resend's webhook sender is not guaranteed to follow that redirect
   with the POST body intact, so register the exact final URL rather than
   relying on it to.
3. Select events: at minimum `email.bounced`, `email.complained`,
   `email.failed`, `email.delivery_delayed`. Add `email.received` too if you
   set up inbound receiving (next section).
4. Copy the signing secret it shows you into `RESEND_WEBHOOK_SECRET`, in both
   `.env.local` and Vercel's environment variables, then redeploy.

### Receiving email at your own domain (optional)

Resend can also receive mail sent directly to your domain and forward it to
this webhook as an `email.received` event — useful if you want
`hello@secondspark.online` to work as a real address without paying for a
mailbox provider.

This needs one DNS change **you make yourself** — an MX record — which is
worth doing carefully:

- Resend's dashboard (Domains → your domain → Receiving) gives you the exact
  record to add.
- **Put it on a subdomain** (e.g. `inbound.secondspark.online`), not the apex,
  if the domain already has real mail flowing through it anywhere. An MX
  record at the apex routes *everything* addressed to that domain to Resend —
  it would take over your existing mail, not sit alongside it.
- The record must be the **lowest-priority** MX record for whichever name it's
  on, or Resend never sees the mail.

The webhook payload for `email.received` carries metadata only — the actual
body is fetched separately by `email_id`, which the route already does.
Everything that arrives gets relayed into `CONTACT_TO`, so nothing needs a real
mailbox to exist at the receiving address.

### Anti-spam

The form has no CAPTCHA — instead, a hidden field real visitors never see or
tab into (a bot that blindly fills every input gives itself away by filling
it), plus a rejection of anything submitted within 1.5 seconds of the page
loading. Both cases return the same `{"ok": true}` a real success would, so a
spam script gets no signal that anything was detected. Neither costs a
dependency or a paid service; if spam becomes a real problem, add Vercel's
Turnstile or similar in front of it.

### Security

- **Header injection.** Every value that reaches an email header — a name,
  a subject line — passes through `sanitizeHeaderValue()` first, which strips
  `\r`/`\n`. Without that, a `name` field containing a newline could forge
  extra headers (an extra `Bcc:`, a second `From:`) that were never part of
  the form.
- **HTML injection.** Anything interpolated into an email body passes through
  `escapeHtml()` first.
- **The webhook fails closed.** With no `RESEND_WEBHOOK_SECRET` set, the route
  returns 503 rather than accepting unverified requests — the alternative
  would let anyone POST a forged `email.received` event and have its content
  relayed straight into `CONTACT_TO`.
- **Signature verification uses the raw body.** `svix` needs the exact bytes
  Resend signed; `request.text()` is read before anything parses it, since
  reserializing JSON can change whitespace and silently break verification.
- **A quirk worth knowing if you touch this code:** `svix@2.3.0`'s
  `Webhook.verify()` throws correctly on an invalid signature, but on a valid
  one its return value is `undefined` — not the parsed event, despite several
  of its own examples implying otherwise. The route verifies purely for the
  throw/no-throw, then parses the same already-verified string itself. Tested
  directly: a real signed payload, a corrupted signature, a payload altered
  after signing, and a missing signature header all produce the correct
  200/200/401/401.
- **Rotate the API key** pasted in during setup — a key that has passed through
  a chat conversation shouldn't be treated as still private. Resend dashboard →
  API Keys → regenerate, then update it in both `.env.local` and Vercel.

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
