'use client';

import { useState } from 'react';
import { SITE } from '@/lib/content';

/* ---------------------------------------------------------------------------
   The site is statically exported, so there is no server to receive a POST.
   Out of the box the form composes the message in the visitor's own mail client
   — nothing is sent anywhere until they press send there.

   To collect submissions directly instead, put a form endpoint below (Formspree,
   Web3Forms, Getform, a cPanel PHP handler, anything that accepts a POST) and
   the form will use it automatically.
   --------------------------------------------------------------------------- */
const ENDPOINT = '';

const SUBJECTS = [
  'Battery Passport — testing & certification',
  'Battery Passport — fleet monitoring',
  'MiKi — join the launch list',
  'MiKi — business enquiry',
  'Studio — software project',
  'Studio — AI consultancy',
  'Something else',
];

export default function ContactForm() {
  const [state, setState] = useState('idle'); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const name = (d.get('name') || '').toString().trim();
    const email = (d.get('email') || '').toString().trim();
    const topic = (d.get('topic') || '').toString();
    const message = (d.get('message') || '').toString().trim();

    if (ENDPOINT) {
      setState('sending');
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: d,
        });
        if (!res.ok) throw new Error('bad status');
        form.reset();
        setState('sent');
      } catch {
        setState('error');
      }
      return;
    }

    const body = `${message}\n\n—\n${name}\n${email}`;
    window.location.href =
      `mailto:${SITE.email}` +
      `?subject=${encodeURIComponent(topic || 'Enquiry')}` +
      `&body=${encodeURIComponent(body)}`;
    setState('sent');
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="field">
        <span>Your name</span>
        <input name="name" type="text" required autoComplete="name" placeholder="Full name" />
      </label>

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
      </label>

      <label className="field">
        <span>What is this about</span>
        <select name="topic" defaultValue={SUBJECTS[0]}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How many packs, what you are building, or what you need to know."
        />
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <button className="btn btn-solid" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'} <span className="arw">→</span>
        </button>
        <p className="form-note" role="status" aria-live="polite" style={{ margin: 0 }}>
          {state === 'sent' && !ENDPOINT && 'Your email app should be open with the message ready — press send there.'}
          {state === 'sent' && ENDPOINT && 'Thank you — we have it, and we will come back to you.'}
          {state === 'error' && `Something went wrong. Please email ${SITE.email} directly.`}
          {(state === 'idle' || state === 'sending') &&
            (ENDPOINT ? 'We answer every message ourselves.' : 'This opens your email app with the message ready to send.')}
        </p>
      </div>
    </form>
  );
}
