'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const LIFT = 92;
const THROW_MS = 470;

export default function Deck({ items }) {
  const deckRef = useRef(null);
  const els = useRef([]);
  const orderRef = useRef(items.map((_, i) => i));
  const drag = useRef({ on: false, x: 0, y: 0, dx: 0, id: null });
  const busy = useRef(false);
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false); // true once the stack is under our control

  const base = (d) =>
    `translate3d(${d * 15}px, ${-d * 11}px, 0) scale(${(1 - d * 0.05).toFixed(3)}) rotate(${(d * 2.4).toFixed(2)}deg)`;

  const applyStack = useCallback(
    (animate, snapIdx = -1) => {
      const total = items.length;
      orderRef.current.forEach((cardIdx, depth) => {
        const el = els.current[cardIdx];
        if (!el) return;
        const snap = cardIdx === snapIdx;
        el.style.transition = animate && !snap
          ? 'transform .52s cubic-bezier(.22,1,.36,1), opacity .3s'
          : 'none';
        el.style.transform = base(depth);
        el.style.opacity = '1';
        el.style.zIndex = String(total - depth);
        el.style.pointerEvents = depth === 0 ? 'auto' : 'none';
        // keep buried cards out of the tab order without hiding them from the page
        if ('inert' in el) el.inert = depth !== 0;
      });
    },
    [items.length]
  );

  const throwTop = useCallback(
    (dir) => {
      if (busy.current) return;
      const deck = deckRef.current;
      if (!deck) return;
      busy.current = true;

      const idx = orderRef.current[0];
      const el = els.current[idx];
      const w = deck.offsetWidth;

      el.style.transition = `transform ${THROW_MS}ms cubic-bezier(.32,0,.24,1), opacity ${THROW_MS}ms`;
      el.style.transform = `translate3d(${dir * w * 1.18}px, ${-LIFT}px, 0) rotate(${dir * 26}deg) scale(1.03)`;
      el.style.opacity = '0';

      window.setTimeout(() => {
        orderRef.current = [...orderRef.current.slice(1), idx];
        applyStack(true, idx); // thrown card snaps to the back, the rest ride up
        setActive(orderRef.current[0]);
        requestAnimationFrame(() => {
          busy.current = false;
        });
      }, THROW_MS);
    },
    [applyStack]
  );

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion')) return;
    setLive(true);
    applyStack(false);
    const onResize = () => applyStack(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyStack]);

  const onPointerDown = (e) => {
    if (!live || busy.current) return;
    if (!e.isPrimary) return; // ignore secondary touches and stray pointers
    if (e.pointerType === 'mouse' && e.button !== 0) return; // left button only
    if (e.target.closest('a')) return; // let the card's link be a link
    const el = els.current[orderRef.current[0]];
    if (!el) return;
    drag.current = { on: true, x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId };
    el.style.transition = 'none';
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!drag.current.on) return;
    const el = els.current[orderRef.current[0]];
    if (!el) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current.dx = dx;
    el.style.transform = `translate3d(${dx}px, ${dy * 0.34}px, 0) rotate(${(dx * 0.045).toFixed(2)}deg) scale(1.015)`;
  };

  const endDrag = (e) => {
    if (!drag.current.on) return;
    const el = els.current[orderRef.current[0]];
    const dx = drag.current.dx;
    drag.current.on = false;
    try {
      if (el && drag.current.id != null) el.releasePointerCapture(drag.current.id);
    } catch {}
    const w = deckRef.current ? deckRef.current.offsetWidth : 1;
    if (Math.abs(dx) > w * 0.1) throwTop(dx < 0 ? -1 : 1);
    else applyStack(true);
  };

  const onKeyDown = (e) => {
    if (!live) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      throwTop(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      throwTop(1);
    }
  };

  return (
    <div className="deck-wrap">
      <div
        className="deck"
        ref={deckRef}
        tabIndex={live ? 0 : -1}
        role={live ? 'group' : undefined}
        aria-roledescription={live ? 'card deck' : undefined}
        aria-label={live ? 'Divisions — press the left or right arrow key to flip through' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        {items.map((it, i) => (
          <article
            className="deck-card"
            key={it.code}
            ref={(el) => {
              els.current[i] = el;
            }}
          >
            <div>
              <div className="deck-card-top">
                <span className="label kicker">{it.code}</span>
                <span className="label">{it.tag}</span>
              </div>
              <h3 style={{ marginTop: 'clamp(28px,4vw,54px)' }}>{it.title}</h3>
              <p>{it.blurb}</p>
              <ul>
                {it.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
            <div className="deck-card-foot">
              <Link className="go" href={it.href}>
                {it.cta} →
              </Link>
              <span className="label">{it.index}</span>
            </div>
          </article>
        ))}
      </div>

      {live && (
        <div className="deck-hint">
          <span className="label">Drag, throw, or use ← →</span>
          <span className="deck-dots" aria-hidden="true">
            {items.map((it, i) => (
              <i key={it.code} data-on={i === active ? 'true' : 'false'} />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
