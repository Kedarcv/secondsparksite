import { NextResponse } from 'next/server';
import {
  resendClient,
  isValidEmail,
  sanitizeHeaderValue,
  inquiryEmailHtml,
  acknowledgementEmailHtml,
} from '@/lib/email';

export const runtime = 'nodejs';

const TOPICS = new Set([
  'Battery Passport — testing & certification',
  'Battery Passport — fleet monitoring',
  'MiKi — join the launch list',
  'MiKi — business enquiry',
  'Studio — software project',
  'Studio — AI consultancy',
  'Something else',
]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const topicRaw = typeof body.topic === 'string' ? body.topic.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  // Hidden field a real visitor never fills in and never sees — bots that
  // blindly fill every input in a form give themselves away here.
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  // Timestamp captured client-side when the form mounted. A submission
  // milliseconds after the page loaded is a script, not someone typing.
  const startedAt = Number(body.startedAt) || 0;

  if (!name || name.length > 100) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!TOPICS.has(topicRaw)) {
    return NextResponse.json({ error: 'Please choose a topic.' }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: 'Please enter a message (under 5000 characters).' }, { status: 400 });
  }

  // Spam signal, not a real submission — pretend success so the sender's
  // script gets no signal that anything was detected, and skip sending mail.
  if (honeypot || Date.now() - startedAt < 1500) {
    return NextResponse.json({ ok: true });
  }

  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM;
  if (!contactTo || !contactFrom) {
    console.error('contact route: CONTACT_TO / CONTACT_FROM not configured');
    return NextResponse.json({ error: 'This form is not set up yet — please email us directly.' }, { status: 503 });
  }

  const safeName = sanitizeHeaderValue(name, 100);
  const safeTopic = sanitizeHeaderValue(topicRaw, 100);
  const resend = resendClient();

  try {
    // Business notification — reply-to the customer, so hitting "reply"
    // reaches them directly with no dependency on a real inbox existing
    // at the From domain.
    const { error: notifyErr } = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject: `[Second Spark] ${safeTopic} — ${safeName}`,
      html: inquiryEmailHtml({ name, email, topic: topicRaw, message }),
    });
    if (notifyErr) throw notifyErr;

    // Customer acknowledgement — reply-to CONTACT_TO, so a reply from the
    // customer reaches the real monitored inbox even if info@ has no mailbox.
    const { error: ackErr } = await resend.emails.send({
      from: contactFrom,
      to: email,
      replyTo: contactTo,
      subject: 'We have your message — Second Spark Intelligence',
      html: acknowledgementEmailHtml({ name }),
    });
    if (ackErr) console.error('contact route: acknowledgement send failed', ackErr);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('contact route: send failed', err);
    return NextResponse.json(
      { error: 'Something went wrong sending your message. Please email us directly.' },
      { status: 502 }
    );
  }
}
