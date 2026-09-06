'use client';

import { useEffect, useRef } from 'react';
import CellField from './CellField';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (x) => x * x * (3 - 2 * x);

export default function PortalHero() {
  const secRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const duoRef = useRef(null);
  const panelL = useRef(null);
  const panelR = useRef(null);
  const dotA = useRef(null);
  const dotB = useRef(null);
  const wordRef = useRef(null);
  const sp1 = useRef(null);
  const sp2 = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    // The portal is a motion device. Without motion the markup already renders open.
    if (!document.documentElement.classList.contains('motion')) return;

    const sec = secRef.current;
    const stage = stageRef.current;
    if (!sec || !stage) return;

    let w1 = 0;
    let w2 = 0;
    let raf = 0;

    const measure = () => {
      w1 = sp1.current ? sp1.current.offsetWidth : 0;
      w2 = sp2.current ? sp2.current.offsetWidth : 0;
    };

    const draw = () => {
      raf = 0;
      const total = sec.offsetHeight - stage.offsetHeight;
      if (total <= 0) return;
      const p = clamp(-sec.getBoundingClientRect().top / total, 0, 1);

      // --- the portal opening -------------------------------------------
      const open = smooth(clamp(p / 0.62, 0, 1));
      // panels travel past their own width so they clear the frame entirely
      panelL.current.style.transform = `translate3d(${(-106 * open).toFixed(3)}%,0,0)`;
      panelR.current.style.transform = `translate3d(${(106 * open).toFixed(3)}%,0,0)`;

      // Settles all the way back to 1 so the whole photograph is in frame at
      // full open — browser chrome included.
      const imgP = clamp(p / 0.72, 0, 1);
      imgRef.current.style.transform = `scale(${(1.17 - 0.17 * smooth(imgP)).toFixed(4)})`;

      // duotone rises to a low opacity
      duoRef.current.style.opacity = (0.3 * clamp(p / 0.75, 0, 1)).toFixed(3);

      // two accent dots travel out to opposite corners of the field
      const d = smooth(clamp(p / 0.66, 0, 1));
      const fade = 1 - clamp((p - 0.6) / 0.3, 0, 1);
      dotA.current.style.transform = `translate3d(${(-40 * d).toFixed(2)}vw,${(-31 * d).toFixed(2)}vh,0)`;
      dotA.current.style.opacity = fade.toFixed(3);
      dotB.current.style.transform = `translate3d(${(40 * d).toFixed(2)}vw,${(31 * d).toFixed(2)}vh,0)`;
      dotB.current.style.opacity = fade.toFixed(3);

      // --- the portal title ---------------------------------------------
      // grow AND tighten at once, while the halves travel to opposite edges
      const t = smooth(p);
      wordRef.current.style.transform = `scale(${(1 + 0.3 * t).toFixed(4)})`;
      wordRef.current.style.letterSpacing = `${(-0.012 - 0.05 * t).toFixed(4)}em`;
      sp1.current.style.transform = `translate3d(${(-w1 * 0.5 * t).toFixed(2)}px,0,0)`;
      sp2.current.style.transform = `translate3d(${(w2 * 0.5 * t).toFixed(2)}px,0,0)`;

      const s = clamp(p / 0.34, 0, 1);
      subRef.current.style.opacity = (1 - s).toFixed(3);
      subRef.current.style.transform = `translate3d(0,${(s * 16).toFixed(2)}px,0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // fonts land after first paint and change the span widths
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="portal" ref={secRef} aria-label="Second Spark Intelligence">
      <div className="portal-stage" ref={stageRef}>
        <div className="portal-img" ref={imgRef}>
          <CellField id="hero" />
        </div>
        <div className="portal-duo" ref={duoRef} />
        <div className="portal-veil" />

        <div className="portal-panel l" ref={panelL} />
        <div className="portal-panel r" ref={panelR} />

        <i className="portal-dot a" ref={dotA} />
        <i className="portal-dot b" ref={dotB} />

        <div className="portal-title">
          <h1 className="portal-word" ref={wordRef}>
            <span ref={sp1}>SECOND</span>
            <span ref={sp2}>SPARK</span>
          </h1>
          <p className="portal-sub" ref={subRef}>
            Infrastructure for what comes next
          </p>
        </div>

        <div className="portal-meta tl">
          Second Spark
          <br />
          Intelligence
        </div>
        <div className="portal-meta tr">
          Energy <span className="tick">·</span> Payments
          <br />
          Intelligence
        </div>
        <div className="portal-meta bl">
          Three divisions
          <br />
          One engineering team
        </div>
        <div className="portal-meta br">
          Scroll to open <span className="tick">↓</span>
        </div>
      </div>
    </section>
  );
}
