'use client';

import { useRef, useState } from 'react';
import { SITE } from '@/lib/content';

/* Posts to /api/contact — a real Resend-backed endpoint (see
   app/api/contact/route.js), not a mailto: link. That route sends the
   enquiry to the team and an acknowledgement back to the sender. */

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
  const [errorMsg, setErrorMsg] = useState('');
  // When this form mounted — the API route rejects a submission that arrives
  // within 1.5s of it, since that is a script filling the form, not a person.
  const startedAt = useRef(Date.now());

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);

    setState('sending');
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.get('name'),
          email: d.get('email'),
          topic: d.get('topic'),
          message: d.get('message'),
          company: d.get('company'), // honeypot — left blank by real visitors
          startedAt: startedAt.current,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      form.reset();
      setState('sent');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
      setState('error');
    }
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

      {/* Honeypot: real visitors never see or fill this. Off-screen rather than
          display:none, out of the tab order, and unlabelled — a script that
          blindly fills every field gives itself away here. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <button className="btn btn-solid" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'} <span className="arw">→</span>
        </button>
        <p className="form-note" role="status" aria-live="polite" style={{ margin: 0 }}>
          {state === 'sent' && 'Thank you — we have it, and we will come back to you.'}
          {state === 'error' && `${errorMsg} You can also email ${SITE.email} directly.`}
          {(state === 'idle' || state === 'sending') && 'We answer every message ourselves.'}
        </p>
      </div>
    </form>
  );
}
