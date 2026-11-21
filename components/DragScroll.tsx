"use client";

import { useRef, type ReactNode } from "react";

/**
 * Horizontal scroller you can also drag with the mouse. Touch and trackpads
 * keep native scrolling; a mouse drag pans the strip with a little momentum
 * on release, then lets CSS scroll-snap settle it on the nearest card.
 * A drag never counts as a click, so links inside aren't triggered by it.
 */
export function DragScroll({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; lastX: number; lastT: number; v: number; moved: boolean } | null>(null);
  const raf = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    drag.current = { x: e.clientX, left: el.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      // snap fights manual scrolling — switch it off while dragging
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    el.scrollLeft = d.left - dx;
    const dt = Math.max(e.timeStamp - d.lastT, 1);
    d.v = (e.clientX - d.lastX) / dt; // px per ms
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };

  const end = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    drag.current = null;
    if (!d || !el || !d.moved) return;
    el.style.cursor = "";
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    // swallow the click that follows a drag so a card's link doesn't fire
    const block = (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.addEventListener("click", block, { capture: true, once: true });
    window.setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0);

    // glide with the release velocity, then hand back to scroll-snap
    let v = d.v * 16; // px per frame
    const glide = () => {
      v *= 0.92;
      el.scrollLeft -= v;
      if (Math.abs(v) > 0.5) {
        raf.current = requestAnimationFrame(glide);
        return;
      }
      // ease onto the nearest card, then restore snap (restoring it straight
      // away would jump there instantly)
      const box = el.getBoundingClientRect();
      let target = el.scrollLeft;
      let best = Infinity;
      for (const child of Array.from(el.children)) {
        const left = el.scrollLeft + child.getBoundingClientRect().left - box.left;
        if (Math.abs(left - el.scrollLeft) < best) {
          best = Math.abs(left - el.scrollLeft);
          target = left;
        }
      }
      el.scrollTo({ left: target, behavior: "smooth" });
      window.setTimeout(() => {
        if (!drag.current) el.style.scrollSnapType = "";
      }, 450);
    };
    raf.current = requestAnimationFrame(glide);
  };

  return (
    <div
      ref={ref}
      className={`cursor-grab select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
