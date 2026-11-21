"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

// Where the fill tip sits in the viewport while reading (0 = top, 1 = bottom).
const READ_LINE = 0.6;

// Scroll-driven path down the left edge of the home column: a dashed track
// that starts empty at its first point and fills down to the reader's eye
// line as the page scrolls, with a dot riding the fill tip.
// Parent must be `relative`. Any sibling marked `data-flight-stop` gets a
// station circle at its top, which lights up (and blinks) once the tip
// passes it.
export function FlightPath({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // fill fraction = how far the eye line has travelled down the path. Near
  // the page bottom the eye line slides to the viewport bottom so the path
  // can finish even when the page can't scroll its end up to the eye line.
  const fill = useMotionValue(0);
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    if (box.height <= 0) return;
    // measured from the window directly: while the welcome gate locks
    // scrolling, a derived progress can read as "fully scrolled" and fill
    // the whole path on first load
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pageP = max > 0 ? window.scrollY / max : 0;
    const end = window.scrollY > 0 ? Math.min(Math.max((pageP - 0.9) / 0.1, 0), 1) : 0;
    // at the top of the page the eye line sits at the viewport top, so the
    // path starts empty at its first point; it moves down with the scroll
    // until it reaches the reading line, then rides there
    const read = Math.min(window.scrollY, window.innerHeight * READ_LINE);
    const line = read + (window.innerHeight - read) * end;
    fill.set(Math.min(Math.max((line - box.top) / box.height, 0), 1));
  };
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    // content height changes (welcome gate lifting, images, videos) move the
    // path without a scroll event — recompute then too
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const smooth = useSpring(fill, { stiffness: 260, damping: 34, mass: 0.4 });
  const p = reduce ? fill : smooth;
  const top = useTransform(p, (v) => `${v * 100}%`);

  const [stops, setStops] = useState<number[]>([]); // fractions 0–1 down the path
  const [passed, setPassed] = useState(0);

  // measure each stop's position along the path; re-measure on any resize
  useEffect(() => {
    const path = ref.current;
    const parent = path?.parentElement;
    if (!path || !parent) return;
    const measure = () => {
      const box = path.getBoundingClientRect();
      if (box.height <= 0) return;
      const els = parent.querySelectorAll<HTMLElement>("[data-flight-stop]");
      // +10px lines the circle up with the section's first line of text
      setStops(
        Array.from(els, (el) => (el.getBoundingClientRect().top + 10 - box.top) / box.height).filter(
          (f) => f > 0 && f < 1,
        ),
      );
    };
    measure();
    // sections slide up 14px on entrance — measure again once they've settled
    const t = window.setTimeout(measure, 1200);
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [visible]);

  useMotionValueEvent(p, "change", (v) => {
    const n = stops.filter((f) => v >= f).length;
    if (n !== passed) setPassed(n);
  });

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-[-14px] top-2 w-px sm:left-[-28px]"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: visible ? 0.5 : 0 }}
    >
      {/* dashed track */}
      <span className="absolute inset-y-0 left-0 border-l border-dashed border-neutral-300 dark:border-neutral-700" />
      {/* filled path */}
      <motion.span
        className="absolute inset-y-0 left-[-0.5px] w-px origin-top bg-foreground"
        style={{ scaleY: p }}
      />
      {/* departure + destination dots */}
      <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-foreground" />
      <span className="absolute -bottom-[3px] -left-[3px] size-[7px] rounded-full border border-neutral-300 bg-background dark:border-neutral-700" />
      {/* station circles: ring with a centre dot, darken once passed */}
      {stops.map((f, i) => {
        const on = i < passed;
        return (
          <span
            key={i}
            className={`absolute left-0 flex size-[11px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background transition-colors duration-300 ${
              on ? "border-foreground" : "border-neutral-300 dark:border-neutral-700"
            }`}
            style={{ top: `${f * 100}%` }}
          >
            {/* blink as the tracker arrives: the dot flashes twice and a ring
                ripples out. Keyed on `on`, so it replays each time it's reached */}
            <motion.span
              key={on ? "on" : "off"}
              className={`size-[5px] rounded-full transition-colors duration-300 ${
                on ? "bg-foreground" : "bg-neutral-300 dark:bg-neutral-700"
              }`}
              animate={on && !reduce ? { opacity: [1, 0.15, 1, 0.15, 1] } : { opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {on && !reduce && (
              <motion.span
                className="absolute inset-[-1px] rounded-full border border-foreground"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", repeat: 1 }}
              />
            )}
          </span>
        );
      })}
      {/* tip dot riding the end of the fill */}
      <motion.span
        className="absolute left-0 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-[3px] ring-background"
        style={{ top }}
      />
    </motion.div>
  );
}
