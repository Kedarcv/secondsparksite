'use client';

import { useEffect, useRef } from 'react';
import CellField from './CellField';

export default function Statement({ num, label, children, foot }) {
  const secRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion')) return;
    const sec = secRef.current;
    const orb = orbRef.current;
    if (!sec || !orb) return;

    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      // -1 (below the fold) → 1 (above it)
      const p = 1 - (r.top + r.height / 2) / (window.innerHeight / 2 + r.height / 2);
      orb.style.transform = `translate3d(0, ${(p * -66).toFixed(2)}px, 0) rotate(${(p * 26).toFixed(2)}deg)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="statement" ref={secRef}>
      <div className="statement-orb" ref={orbRef} aria-hidden="true">
        <CellField id="orb" />
      </div>
      <div className="shell statement-in">
        <p className="statement-num reveal" aria-hidden="true">
          {num}
        </p>
        <p className="label reveal reveal-d1">{label}</p>
        <h2 className="statement-copy reveal reveal-d2" style={{ marginTop: 18 }}>
          {children}
        </h2>
        {foot && <p className="statement-foot reveal reveal-d3">{foot}</p>}
      </div>
    </section>
  );
}
