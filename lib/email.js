import { Resend } from 'resend';

/* Server-only. Anything in here runs in a serverless function, never in the
   browser — the API key must never reach client code. */

let client;
export function resendClient() {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* A name or subject line ends up inside an email HEADER (Subject:, From:,
   Reply-To:). A newline in user input there is a classic header-injection
   vector — CRLF in a "name" field can forge extra headers (a Bcc:, a second
   From:) that were never part of the form. Every value that reaches a header
   is passed through this first, not just the ones that look dangerous today. */
export function sanitizeHeaderValue(s, max = 200) {
  return String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(s) {
  return typeof s === 'string' && s.length <= 254 && EMAIL_RE.test(s);
}

const SHELL = (title, bodyHtml) => `<!doctype html>
<html>
  <body style="margin:0;padding:32px 20px;background:#0A0C0E;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#EDE7DC;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;">
      <tr><td style="padding-bottom:20px;">
        <span style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#E8913C;font-weight:600;">
          Second Spark Intelligence
        </span>
      </td></tr>
      <tr><td style="background:#101317;border:1px solid rgba(237,231,220,.13);border-radius:6px;padding:28px;">
        <h1 style="margin:0 0 16px;font-size:19px;line-height:1.3;color:#EDE7DC;">${title}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding-top:18px;font-size:11px;color:#6C7378;">
        Second Spark Intelligence · Zimbabwe
      </td></tr>
    </table>
  </body>
</html>`;

const row = (label, value) => `
  <tr>
    <td style="padding:6px 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6C7378;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0 6px 16px;font-size:14px;color:#EDE7DC;">${value}</td>
  </tr>`;

export function inquiryEmailHtml({ name, email, topic, message }) {
  const msg = escapeHtml(message).replace(/\n/g, '<br>');
  return SHELL('New enquiry from the site', `
    <table role="presentation" width="100%" style="margin-bottom:18px;">
      ${row('Name', escapeHtml(name))}
      ${row('Email', escapeHtml(email))}
      ${row('Topic', escapeHtml(topic))}
    </table>
    <div style="font-size:14px;line-height:1.65;padding-top:14px;border-top:1px solid rgba(237,231,220,.13);">${msg}</div>
  `);
}

export function acknowledgementEmailHtml({ name }) {
  return SHELL('We have your message', `
    <p style="font-size:14px;line-height:1.65;margin:0 0 12px;">
      Hi ${escapeHtml(name)},
    </p>
    <p style="font-size:14px;line-height:1.65;margin:0;color:#9EA5A8;">
      Thanks for writing in. We read every message ourselves and will come back
      to you shortly. If it is urgent, just reply to this email.
    </p>
  `);
}

export function inboundForwardHtml({ from, subject, text, html }) {
  const body = html
    ? html
    : `<div style="font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(text || '(no content)')}</div>`;
  return SHELL('Email received at your domain', `
    <table role="presentation" width="100%" style="margin-bottom:18px;">
      ${row('From', escapeHtml(from))}
      ${row('Subject', escapeHtml(subject || '(no subject)'))}
    </table>
    <div style="padding-top:14px;border-top:1px solid rgba(237,231,220,.13);">${body}</div>
  `);
}

export function alertEmailHtml({ type, to, subject }) {
  return SHELL(`Delivery issue: ${escapeHtml(type)}`, `
    <table role="presentation" width="100%">
      ${row('Event', escapeHtml(type))}
      ${row('To', escapeHtml(Array.isArray(to) ? to.join(', ') : to))}
      ${row('Subject', escapeHtml(subject || '(no subject)'))}
    </table>
  `);
}
