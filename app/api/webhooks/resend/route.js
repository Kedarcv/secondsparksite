import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import {
  resendClient,
  inboundForwardHtml,
  alertEmailHtml,
} from '@/lib/email';

export const runtime = 'nodejs';

// Lifecycle events worth an immediate alert — a bounce or spam complaint
// usually means a customer never actually got a reply.
const ALERT_EVENTS = new Set([
  'email.bounced',
  'email.complained',
  'email.failed',
  'email.delivery_delayed',
]);

export async function POST(request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed. Without a secret there is nothing to verify a signature
    // against, and this endpoint would otherwise accept anyone's POST body
    // as if Resend had sent it — including a forged "email.received" that
    // gets relayed straight into a real inbox.
    console.error('resend webhook: RESEND_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  // Signature verification needs the exact bytes Resend signed — parsing to
  // JSON and re-serializing first would very likely change whitespace and
  // break it, so the raw text is read before anything else touches it.
  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id') ?? '',
    'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
    'svix-signature': request.headers.get('svix-signature') ?? '',
  };

  // svix@2.3.0's verify() authenticates the payload — it throws on a bad
  // signature — but its return value is not the parsed event: internally it
  // calls the base verifier with jsonParse:false and the wrapper itself has
  // no return statement, so a SUCCESSFUL call yields `undefined`, not the
  // payload. Verify only for the throw/no-throw; parse the same raw string
  // ourselves once it is confirmed authentic.
  let event;
  try {
    new Webhook(secret).verify(payload, headers);
    event = JSON.parse(payload);
  } catch (err) {
    console.error('resend webhook: signature verification failed', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM;

  try {
    if (event.type === 'email.received') {
      await handleInbound(event, contactTo, contactFrom);
    } else if (ALERT_EVENTS.has(event.type) && contactTo && contactFrom) {
      const { to, subject } = event.data ?? {};
      await resendClient().emails.send({
        from: contactFrom,
        to: contactTo,
        subject: `[Alert] ${event.type}`,
        html: alertEmailHtml({ type: event.type, to, subject }),
      });
    }
    // Every other event type (sent, delivered, opened, clicked, domain.*,
    // contact.*) is acknowledged without action — nothing downstream
    // consumes them yet. Add a case above if that changes.
  } catch (err) {
    // The event was genuinely from Resend and is done being useful to us —
    // a bug in our own follow-up send should not make Resend think delivery
    // failed and retry the same event again.
    console.error(`resend webhook: error handling ${event?.type ?? '(unknown)'}`, err);
  }

  return NextResponse.json({ ok: true });
}

async function handleInbound(event, contactTo, contactFrom) {
  if (!contactTo || !contactFrom) {
    console.error('resend webhook: CONTACT_TO / CONTACT_FROM not configured, dropping inbound email');
    return;
  }

  // The webhook payload for email.received carries metadata only (from, to,
  // subject, the email's id) — the body and any attachments are fetched
  // separately by id. Needs an API key with receiving access, not a
  // sending-only key.
  const emailId = event.data?.email_id;
  if (!emailId) return;

  const full = await resendClient().emails.receiving.get(emailId);
  const from = full?.from ?? event.data?.from ?? 'unknown sender';
  const subject = full?.subject ?? event.data?.subject ?? '';

  await resendClient().emails.send({
    from: contactFrom,
    to: contactTo,
    replyTo: from,
    subject: `[Inbound] ${subject || '(no subject)'}`,
    html: inboundForwardHtml({ from, subject, text: full?.text, html: full?.html }),
  });
}
