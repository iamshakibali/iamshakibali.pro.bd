"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

// Contribution graph "fly-in" view. Clicking the graph lifts it off the page
// toward the viewer while everything else blurs away, then tilts it into an
// isometric 3D view where each day rises as a column by its activity level.
// Click anywhere / Esc reverses the whole sequence back onto the page.

type Cell = { count: number; label: string };

// exactly 2x the page graph (10px cells, 3px gaps), so scaled back down the
// 3D grid lands tile-for-tile on the page grid with no jump
const C = 20; // 3D cell size (px)
const G = 6; // gap
const P = C + G;
const LIFT = 13; // column height per activity level (px)

// mirrors ContributionGraph's GitHub quartile bands
const LEVEL_BG = [
  "bg-neutral-200 dark:bg-[#181818]",
  "bg-neutral-300 dark:bg-[#333]",
  "bg-neutral-400 dark:bg-[#666]",
  "bg-neutral-500 dark:bg-[#adadad]",
  "bg-neutral-900 dark:bg-white",
];

function level(count: number) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 14) return 3;
  return 4;
}

type Col = { cell: Cell; w: number; d: number; lv: number };

// rounded-square tile, repeated across the sheet as a mask
const TILE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${P}' height='${P}'%3E%3Crect width='${C}' height='${C}' rx='4'/%3E%3C/svg%3E")`;
const EASE = "cubic-bezier(.22,1,.36,1)";

/**
 * Active days as 3D columns. Faces are sized once at full height and only
 * their transforms animate (scale / translateZ), so rising and falling stays
 * on the compositor with no layout work per frame. Memoized so phase
 * captions or hover never re-render the columns.
 */
const Columns = memo(function Columns({
  cells,
  raised,
  reduce,
  onHover,
}: {
  cells: Col[];
  raised: boolean;
  reduce: boolean;
  onHover: (cell: Cell | null) => void;
}) {
  return (
    <>
      {cells.map(({ cell, w, d, lv }) => {
        const full = lv * LIFT;
        const k = raised ? 1 : 0;
        // columns rise in a wave from the oldest week to the newest
        const delay = raised && !reduce ? 0.25 + w * 0.012 + d * 0.01 : 0;
        const transition = reduce ? "none" : `transform 0.55s ${EASE} ${delay}s`;
        return (
          <div
            key={`${w}-${d}`}
            className="absolute [transform-style:preserve-3d]"
            style={{ left: w * P, top: d * P, width: C, height: C }}
          >
            {/* front face: stands up from the bottom edge */}
            <div
              className={`absolute left-0 top-full origin-top ${LEVEL_BG[lv]}`}
              style={{
                width: C,
                height: full,
                backgroundImage: "linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4))",
                transform: `rotateX(90deg) scaleY(${k})`,
                transition,
              }}
            />
            {/* left face */}
            <div
              className={`absolute right-full top-0 origin-right ${LEVEL_BG[lv]}`}
              style={{
                width: full,
                height: C,
                backgroundImage: "linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))",
                transform: `rotateY(90deg) scaleX(${k})`,
                transition,
              }}
            />
            {/* top face (sits a hair above the tile sheet to avoid z-fighting) */}
            <div
              className={`absolute inset-0 rounded-[4px] hover:outline hover:outline-2 hover:outline-foreground ${LEVEL_BG[lv]}`}
              style={{ transform: `translateZ(${full * k + 0.5}px)`, transition }}
              onPointerEnter={() => onHover(cell)}
              onPointerLeave={() => onHover(null)}
            />
          </div>
        );
      })}
    </>
  );
});

// zoom = fly to centre, flat · tilt = isometric with columns up ·
// back = columns sink, flatten and fly home to the page, all in one move
type Phase = "start" | "zoom" | "tilt" | "back";

export function Contribution3D({
  weeks,
  total,
  origin,
  onClosed,
}: {
  weeks: Cell[][];
  total: number;
  /** the on-page grid the view flies out of and back into */
  origin: HTMLElement;
  onClosed: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("start");

  const W = weeks.length * P - G;
  const H = 7 * P - G;

  // geometry: where the page grid sits (relative to the viewport centre) and
  // how big the close-up is
  const [geo, setGeo] = useState(() => measure());
  function measure() {
    // anchor on the cell block's top-left corner. Its box stretches to the
    // column width (wider than the tiles), so its width/centre can't be used;
    // the page tiles are exactly half the 3D tiles, so the scale is fixed.
    const r = (origin.querySelector<HTMLElement>("[data-graph-cells]") ?? origin).getBoundingClientRect();
    // the overlay spans the layout viewport (excludes the reserved scrollbar
    // gutter), so centre against clientWidth, not innerWidth
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const s0 = 0.5;
    return {
      dx: r.left + (W * s0) / 2 - vw / 2,
      dy: r.top + (H * s0) / 2 - vh / 2,
      s0,
      s1: Math.min(1.25, (vw * 0.9) / W),
    };
  }

  // kick off the fly-in; every later step starts when the previous animation
  // actually finishes (onAnimationComplete), so no step is cut off midway
  useEffect(() => {
    const t = window.setTimeout(() => setPhase("zoom"), 20);
    return () => window.clearTimeout(t);
  }, []);

  const onStepDone = () => {
    if (phase === "zoom") setPhase("tilt");
    else if (phase === "back") onClosed();
  };

  // one continuous move home: columns sink, the grid flattens and flies back
  // onto the page together — no stop-start between steps
  const close = () => {
    if (phase === "back") return;
    setGeo(measure());
    setPhase("back");
  };

  // Esc closes; lock page scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const home = { x: geo.dx, y: geo.dy, scale: geo.s0, rotateX: 0, rotateZ: 0 };
  const target =
    phase === "start" || phase === "back"
      ? home
      : phase === "tilt"
        ? { x: 0, y: 24, scale: geo.s1 * 0.92, rotateX: 56, rotateZ: -32 }
        : { x: 0, y: 0, scale: geo.s1, rotateX: 0, rotateZ: 0 };
  const raised = phase === "tilt";
  const dur = reduce ? 0 : 1;

  // only active days get a 3D column; empty days are the flat tile sheet
  const active = useMemo(
    () =>
      weeks.flatMap((week, w) =>
        week
          .map((cell, d) => (cell && cell.count > 0 ? { cell, w, d, lv: level(cell.count) } : null))
          .filter(Boolean),
      ) as Col[],
    [weeks],
  );

  const captionRef = useRef<HTMLSpanElement>(null);
  const showHover = useCallback(
    (cell: Cell | null) => {
      if (!captionRef.current) return;
      captionRef.current.textContent = cell
        ? `${cell.count} ${cell.count === 1 ? "contribution" : "contributions"} on ${cell.label}`
        : `${total} contributions in the last year`;
    },
    [total],
  );

  return createPortal(
    <div className="fixed inset-0 z-[100]" onClick={close} role="dialog" aria-label="Contributions in 3D">
      {/* the page fades away as the graph comes forward (a plain fade — a
          full-screen backdrop blur repaints every frame and stutters) */}
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "back" ? 0 : 1 }}
        // fades out in step with the fly-home, so the page returns as it lands
        transition={{ duration: (phase === "back" ? 0.8 : 0.5) * dur + 0.001, ease: phase === "back" ? [0.4, 0, 0.2, 1] : "easeOut" }}
      />

      <div className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={{ width: W, height: H, willChange: "transform" }}
          initial={home}
          animate={target}
          onAnimationComplete={onStepDone}
          transition={{
            duration: (phase === "tilt" ? 0.8 : phase === "back" ? 0.85 : 0.7) * dur + 0.001,
            // fly-home eases in and out so it settles softly onto the page
            ease: phase === "back" ? [0.65, 0, 0.35, 1] : [0.22, 1, 0.36, 1],
          }}
        >
          {/* every day as one flat tile sheet: a single masked element
              instead of hundreds of divs */}
          <div
            className={`absolute inset-0 ${LEVEL_BG[0]}`}
            style={{ maskImage: TILE_MASK, WebkitMaskImage: TILE_MASK, maskSize: `${P}px ${P}px`, WebkitMaskSize: `${P}px ${P}px` }}
          />
          <Columns cells={active} raised={raised} reduce={reduce} onHover={showHover} />
        </motion.div>
      </div>

      {/* caption */}
      <motion.p
        className="pointer-events-none absolute inset-x-0 bottom-24 text-center font-mono text-[11px] text-neutral-500 dark:text-neutral-400"
        initial={{ opacity: 0, y: 8 }}
        animate={phase === "tilt" ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4 * dur + 0.001, delay: phase === "tilt" ? 0.5 * dur : 0 }}
      >
        <span ref={captionRef}>{`${total} contributions in the last year`}</span>
        <span className="mt-1 block opacity-60">click anywhere to go back</span>
      </motion.p>
    </div>,
    document.body,
  );
}
