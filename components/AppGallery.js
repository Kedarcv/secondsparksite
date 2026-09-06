'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* A horizontal rail of app screens.
   Native scroll-snap does all the work, so with no JS it is still a scrollable,
   swipeable, fully readable strip. The arrows and the counter are progressive
   extras that only appear once JS confirms it can drive them. */
export default function AppGallery({ shots }) {
  const railRef = useRef(null);
  const [live, setLive] = useState(false);
  const [index, setIndex] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });

  // an item's scroll offset, measured from the rail's snap origin
  const offsetOf = (rail, el) =>
    el.offsetLeft - rail.offsetLeft - (parseFloat(getComputedStyle(rail).paddingLeft) || 0);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.children);
    if (!items.length) return;

    const x = rail.scrollLeft;
    let best = 0;
    let bestD = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(offsetOf(rail, el) - x);
      if (d < bestD) { bestD = d; best = i; }
    });
    setIndex(best);
    setEnds({
      start: x <= 2,
      end: x >= rail.scrollWidth - rail.clientWidth - 2,
    });
  }, []);

  useEffect(() => {
    setLive(true);
    const rail = railRef.current;
    if (!rail) return;
    sync();

    /* A vertical wheel over a scroller that only overflows horizontally gets
       remapped to horizontal by the browser, which traps the page: put the
       cursor on the rail and the page stops scrolling. Hand clearly-vertical
       intent back to the page; horizontal trackpad swipes still drive the rail. */
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, behavior: 'instant' });
    };

    rail.addEventListener('scroll', sync, { passive: true });
    rail.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', sync);
    return () => {
      rail.removeEventListener('scroll', sync);
      rail.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const go = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.children);
    const next = Math.min(Math.max(index + dir, 0), items.length - 1);
    const target = items[next];
    if (!target) return;
    rail.scrollTo({
      left: offsetOf(rail, target),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  return (
    <div className="gallery">
      <ul
        className="gallery-rail"
        ref={railRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="MiKi app screens — scroll, or use the left and right arrow keys"
      >
        {shots.map((shot, i) => (
          <li className="gallery-item" key={shot.slug}>
            <div className="gallery-shot">
              <img
                src={shot.src}
                srcSet={`${shot.src} 1x, ${shot.src2x} 2x`}
                width={shot.width}
                height={shot.height}
                alt={`MiKi app — ${shot.title}`}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
            <div className="gallery-copy">
              <p className="label label-amber">
                {String(i + 1).padStart(2, '0')} — {shot.label}
              </p>
              <h3>{shot.title}</h3>
              <p>{shot.caption}</p>
            </div>
          </li>
        ))}
      </ul>

      {live && (
        <div className="gallery-bar">
          <span className="label">
            {String(index + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
            <span aria-hidden="true"> · drag, scroll or use ← →</span>
          </span>
          <span className="gallery-nav">
            <button
              type="button"
              className="btn gallery-arrow"
              onClick={() => go(-1)}
              disabled={ends.start}
              aria-label="Previous screen"
            >
              ←
            </button>
            <button
              type="button"
              className="btn gallery-arrow"
              onClick={() => go(1)}
              disabled={ends.end}
              aria-label="Next screen"
            >
              →
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
