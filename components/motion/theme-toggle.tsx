"use client";
// beui.dev/components/motion/theme-toggle

import { Lightbulb, LightbulbOff, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ThemeVariant = "rectangle" | "circle" | "circle-blur" | "blinds";

export type RectStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "bottom-up";

export interface ThemeToggleProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
  /** Animation variant. Default: "rectangle". */
  variant?: ThemeVariant;
  /** Origin direction for the reveal. Default: "bottom-up". */
  start?: RectStart;
  iconClassName?: string;
}

const VT_STYLE_ID = "beui-theme-toggle-vt";

// View transitions animate in CSS, not motion springs, so easing here is
// either EASE_OUT_CSS or a keyword. The circle variants keep the Material
// standard curve because their reveal expands symmetrically rather than
// decelerating. Durations differ per variant to match native OS mode switches.
const VT_CSS = `
html[data-beui-vt="rect"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-beui-vt="rect"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-rect-reveal 400ms ease-out;
}
html[data-beui-vt="circle"]::view-transition-old(root),
html[data-beui-vt="circle-blur"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-beui-vt="circle"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-circle-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-beui-vt="circle-blur"]::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: beui-circle-blur-reveal 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
html[data-beui-vt="blinds"]::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal;
}
/* Slats: a masked band widens inside every 72px tile, so the new theme opens
   across the page like a shutter. The band edge has to be a registered custom
   property — mask-image itself is not animatable, but it re-resolves every
   frame the property ticks. mask-size fixes the tile at 72px rather than
   letting a repeating gradient's last stop define it, which is what keeps the
   20px soft edge from dragging the tile wider than the slat and leaving a
   feathered gap that never closes; it also means both ends land clean, fully
   transparent at -20px and fully opaque at 72px. Falling back to no mask
   (unregistered property, so the var is invalid) reveals the page in one
   step. */
@property --beui-vt-slat {
  syntax: "<length>";
  inherits: false;
  initial-value: 72px;
}
html[data-beui-vt="blinds"]::view-transition-new(root) {
  mix-blend-mode: normal;
  mask-image: linear-gradient(
    90deg,
    #000 0 var(--beui-vt-slat),
    transparent calc(var(--beui-vt-slat) + 20px)
  );
  mask-size: 72px 100%;
  mask-repeat: repeat;
  animation: beui-blinds-reveal 700ms ${EASE_OUT_CSS};
}
@keyframes beui-rect-reveal {
  from { clip-path: var(--beui-vt-from, inset(100% 0 0 0)); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes beui-circle-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); }
}
@keyframes beui-circle-blur-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); filter: blur(8px); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); filter: blur(0px); }
}
@keyframes beui-blinds-reveal {
  from { --beui-vt-slat: -20px; }
  to   { --beui-vt-slat: 72px; }
}
`;

const RECT_FROM: Record<RectStart, string> = {
  "top-left":    "inset(0 100% 100% 0)",
  "top-right":   "inset(0 0 100% 100%)",
  "bottom-left": "inset(100% 100% 0 0)",
  "bottom-right":"inset(100% 0 0 100%)",
  center:        "inset(50% 50% 50% 50%)",
  "bottom-up":   "inset(100% 0 0 0)",
};

const CIRCLE_ORIGIN: Record<RectStart, string> = {
  "top-left":    "0% 0%",
  "top-right":   "100% 0%",
  "bottom-left": "0% 100%",
  "bottom-right":"100% 100%",
  center:        "50% 50%",
  "bottom-up":   "50% 100%",
};

export function useThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
}: { variant?: ThemeVariant; start?: RectStart } = {}) {
  const { setTheme, resolvedTheme } = useTheme();
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);
  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";

    if (reduce || !("startViewTransition" in document)) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;

    if (variant === "rectangle") {
      root.style.setProperty("--beui-vt-from", RECT_FROM[start]);
      root.dataset.beuiVt = "rect";
    } else if (variant === "blinds") {
      // Slats sweep the whole viewport; there is no origin point to set.
      root.dataset.beuiVt = "blinds";
    } else {
      root.style.setProperty("--beui-vt-origin", CIRCLE_ORIGIN[start]);
      root.dataset.beuiVt = variant;
    }

    const vt = (
      document as Document & {
        startViewTransition(cb: () => void): { finished: Promise<void> };
      }
    ).startViewTransition(() => setTheme(next));

    vt.finished.finally(() => {
      delete root.dataset.beuiVt;
    });
  };

  return { isDark, mounted, toggle };
}

export function ThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant, start });

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={cn("flex items-center justify-center", className)}
      {...rest}
    >
      {mounted ? (
        <ActionSwapIcon
          value={isDark ? "dark" : "light"}
          animation="blur"
          className={iconClassName}
        >
          {isDark ? (
            <Sun className={iconClassName} />
          ) : (
            <Moon className={iconClassName} />
          )}
        </ActionSwapIcon>
      ) : (
        <span className={iconClassName} aria-hidden="true" />
      )}
    </button>
  );
}

// ── Pull-cord rope physics ───────────────────────────────────────────────
// Verlet rope: a chain of points hanging from the bulb, pulled down by
// gravity and held together by soft (springy) distance constraints, ending in
// a heavier knob. Soft constraints let the cord stretch a little when tugged
// and snap back, so it behaves like an elastic cord rather than a stiff stick.
const CORD = 40; // resting cord length (px) below the bulb
const SEGMENTS = 12;
const SEG = CORD / SEGMENTS;
const GRAVITY = 0.32; // px / frame²
const DAMPING = 0.985; // velocity kept per frame (air drag)
const STIFFNESS = 0.55; // per-iteration constraint correction: <1 = springy
const ITERATIONS = 6;
const KNOB_INV_MASS = 0.3; // knob is ~3x heavier than a rope point
const MAX_REACH = 160; // how far the knob can be dragged from the anchor (px)
const PULL_THRESHOLD = 16; // pull this far below rest, then let go → toggle
const WIND = 0.012; // faint idle sway so it reads as hanging

type Pt = { x: number; y: number; px: number; py: number };

/**
 * Light bulb with a pull cord hanging under it. Grab the knob and drag it
 * anywhere; the cord follows with rope physics. Pull it down and let go to
 * switch theme, like a pull-chain lamp. Clicking the bulb (or Enter/Space on
 * it), or tapping the knob, toggles too.
 */
export function LampToggle({
  variant = "rectangle",
  start = "bottom-up",
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant, start });
  const reduce = useReducedMotion() ?? false;
  const bulbY = useMotionValue(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPolylineElement>(null);
  const knobRef = useRef<SVGGElement>(null);
  const toggleRef = useRef(toggle);
  useEffect(() => {
    toggleRef.current = toggle;
  });
  // pointer target while dragging (anchor-relative), null when released
  const drag = useRef<{ x: number; y: number; moved: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const pts: Pt[] = Array.from({ length: SEGMENTS + 1 }, (_, i) => ({
      x: 0, y: i * SEG, px: 0, py: i * SEG,
    }));
    const knob = pts[SEGMENTS];
    let raf = 0;
    let t = 0;

    const step = () => {
      t += 1;
      const wind = WIND * Math.sin(t * 0.035) + WIND * 0.5 * Math.sin(t * 0.091);
      // integrate (anchor stays put; knob is pinned to the pointer while held)
      for (let i = 1; i <= SEGMENTS; i++) {
        const p = pts[i];
        if (i === SEGMENTS && drag.current) {
          p.px = p.x;
          p.py = p.y;
          // follow the pointer quickly but not rigidly, so fast flicks carry
          // through into the release velocity
          p.x += (drag.current.x - p.x) * 0.6;
          p.y += (drag.current.y - p.y) * 0.6;
          continue;
        }
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + wind;
        p.y += vy + GRAVITY;
      }
      // soft distance constraints, weighted by inverse mass
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 0; i < SEGMENTS; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const wa = i === 0 ? 0 : 1;
          const wb = i + 1 === SEGMENTS ? (drag.current ? 0 : KNOB_INV_MASS) : 1;
          const w = wa + wb;
          if (w === 0) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = ((d - SEG) / d) * STIFFNESS;
          a.x += dx * diff * (wa / w);
          a.y += dy * diff * (wa / w);
          b.x -= dx * diff * (wb / w);
          b.y -= dy * diff * (wb / w);
        }
      }
      // draw straight to the DOM — no React renders per frame
      lineRef.current?.setAttribute("points", pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "));
      const prev = pts[SEGMENTS - 1];
      const ang = (Math.atan2(knob.y - prev.y, knob.x - prev.x) * 180) / Math.PI - 90;
      knobRef.current?.setAttribute("transform", `translate(${knob.x.toFixed(2)} ${knob.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
      bulbY.set(Math.min(Math.max((knob.y - CORD) / 12, 0), 2.5));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // pointer handling lives here so it shares the knob's live position
    const toLocal = (e: PointerEvent) => {
      const r = svgRef.current!.getBoundingClientRect();
      let x = e.clientX - r.left;
      let y = e.clientY - r.top;
      const d = Math.hypot(x, y);
      if (d > MAX_REACH) {
        x = (x / d) * MAX_REACH;
        y = (y / d) * MAX_REACH;
      }
      return { x, y };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      const { x, y } = toLocal(e);
      drag.current.moved += Math.hypot(x - drag.current.x, y - drag.current.y);
      drag.current.x = x;
      drag.current.y = y;
    };
    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setGrabbing(false);
      // a tap toggles; a real pull toggles only if it ended below the threshold
      if (d.moved < 3 || knob.y - CORD >= PULL_THRESHOLD) toggleRef.current();
    };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      drag.current = { x: knob.x, y: knob.y, moved: 0 };
      setGrabbing(true);
      onMove(e);
    };
    const knobEl = knobRef.current;
    knobEl?.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(raf);
      knobEl?.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [reduce, bulbY]);

  return (
    <span className={cn("relative inline-flex", grabbing && "[&_*]:!cursor-grabbing")}>
      <button
        type="button"
        aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
        className={cn("flex items-center justify-center", className)}
        {...rest}
      >
        <motion.span style={{ y: bulbY }} className="flex">
          {mounted ? (
            <ActionSwapIcon value={isDark ? "dark" : "light"} animation="blur" className={iconClassName}>
              {isDark ? <LightbulbOff className={iconClassName} /> : <Lightbulb className={iconClassName} />}
            </ActionSwapIcon>
          ) : (
            <span className={iconClassName} aria-hidden="true" />
          )}
        </motion.span>
      </button>

      {/* cord + knob, hanging from the bulb's base; drawn by the rope sim */}
      <svg
        ref={svgRef}
        aria-hidden
        width={1}
        height={1}
        className="pointer-events-none absolute left-1/2 top-[calc(100%-6px)] overflow-visible"
      >
        <polyline
          ref={lineRef}
          points={`0,0 0,${CORD}`}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-neutral-300 dark:stroke-neutral-600"
        />
        <g
          ref={knobRef}
          transform={`translate(0 ${CORD})`}
          className="pointer-events-auto cursor-grab touch-none"
          onClick={reduce ? toggle : undefined}
        >
          {/* generous invisible hit area around the small knob */}
          <circle r={11} cy={5} fill="transparent" />
          <rect x={-4} y={0} width={8} height={12} rx={4} className="fill-neutral-400 dark:fill-neutral-500" />
        </g>
      </svg>
    </span>
  );
}
