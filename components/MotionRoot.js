'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* Entry reveals fire once and never un-reveal.
   All of it is scoped to the .motion class, which is only present when the
   reader has not asked for reduced motion — so the reduced-motion and no-JS
   renders are already the finished page.

   Anything already on screen is revealed in a synchronous pass rather than
   waiting on the observer: content must never be left invisible because a
   callback was throttled, deferred, or never scheduled in a background tab. */
export default function MotionRoot() {
  const path = usePathname();

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion')) return;

    const pending = new Set(document.querySelectorAll('.reveal:not(.is-in)'));
    if (!pending.size) return;

    const show = (el) => {
      el.classList.add('is-in');
      pending.delete(el);
    };

    // Anything at or above the fold: reveal now. The transition still plays,
    // because the hidden state has already been painted from CSS.
    const sweep = () => {
      const h = window.innerHeight || 0;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.92 && r.bottom > 0) show(el);
      });
    };

    sweep();

    if (!('IntersectionObserver' in window)) {
      pending.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    pending.forEach((el) => io.observe(el));

    // Coming back to a backgrounded tab, catch anything the observer missed.
    const onVisible = () => document.visibilityState === 'visible' && sweep();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [path]);

  return null;
}
