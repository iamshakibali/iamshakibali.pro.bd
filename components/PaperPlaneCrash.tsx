"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// After the blob buddy runs off (or straight away when he isn't shown), a
// paper plane flies in from off the left edge of the screen, straight
// across into this spot on the flight path, then explodes: a flash, a shock ring,
// paper shards flung out under gravity, and a puff of smoke. Plays once.
// Mount it absolutely at the impact point (its box is 0×0).

const FLIGHT_MS = 2400;
const G = 900; // px/s² on the shards

export function PaperPlaneCrash({ play, delay = 700, className = "" }: { play: boolean; delay?: number; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!play || reduce || done.current) return;
    let raf = 0;
    let timer = 0;
    const launch = () => {
      if (done.current) return;
      done.current = true;
      timer = window.setTimeout(fire, delay);
    };
    const fire = () => {
      const root = rootRef.current;
      const plane = planeRef.current;
      if (!root || !plane) return;
      const r = root.getBoundingClientRect();
      // start just off the left edge of the screen, a touch higher than the
      // impact point, and fly almost straight across into it
      const p0 = { x: -(r.left + 80), y: -24 };
      const p1 = { x: p0.x * 0.5, y: -16 }; // nearly straight: only a slight dip
      const p2 = { x: 0, y: 0 };
      const at = (t: number) => ({
        x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
        y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
      });
      const start = performance.now();
      plane.style.opacity = "1";

      const fly = (now: number) => {
        const u = Math.min((now - start) / FLIGHT_MS, 1);
        const t = u * (0.75 + 0.25 * u); // steady glide, only a slight speed-up at the end
        const p = at(t);
        const q = at(Math.min(t + 0.01, 1));
        // a little flutter perpendicular to the flight line
        const ang = Math.atan2(q.y - p.y, q.x - p.x);
        const wob = Math.sin(u * 12) * 2.5 * (1 - u); // light flutter, still a straight line
        const x = p.x - Math.sin(ang) * wob;
        const y = p.y + Math.cos(ang) * wob;
        // +37°: the drawing's nose points up-right, not straight along 0°
        const deg = (ang * 180) / Math.PI + 37 + Math.sin(u * 12) * 3 * (1 - u);
        plane.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${deg}deg)`;
        if (u < 1) raf = requestAnimationFrame(fly);
        else {
          plane.style.opacity = "0";
          explode(root, ang);
        }
      };
      raf = requestAnimationFrame(fly);
    };

    // the plane is the second act: if the blob buddy is on screen (desktop),
    // wait until he has run off; otherwise (phones, blob hidden) go now
    const blob = document.querySelector<HTMLElement>("[data-blob]");
    const blobShown = !!blob && blob.offsetParent !== null;
    if (blobShown) window.addEventListener("blob-gone", launch, { once: true });
    else launch();
    return () => {
      window.removeEventListener("blob-gone", launch);
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [play, reduce, delay]);

  return (
    <div ref={rootRef} aria-hidden className={`pointer-events-none absolute size-0 ${className}`}>
      <div ref={planeRef} className="absolute left-0 top-0 text-foreground opacity-0 will-change-transform">
        {/* paper plane, nose toward the top-right corner (−37°) */}
        <svg width={26} height={20} viewBox="0 0 26 20" fill="none">
          <path d="M1 9.5 25 1 15 19l-3.2-6.6z" fill="currentColor" />
          <path d="M11.8 12.4 25 1 6.5 11z" className="fill-neutral-400 dark:fill-neutral-500" />
          <path d="M11.8 12.4 13 17.5 15 19z" className="fill-neutral-500 dark:fill-neutral-400" />
        </svg>
      </div>
    </div>
  );
}

/** Flash + ring + paper shards + smoke, all built on the fly and removed after. */
function explode(root: HTMLElement, heading: number) {
  const add = (cls: string, css: string) => {
    const el = document.createElement("span");
    el.className = `absolute rounded-full ${cls}`;
    el.style.cssText = css;
    root.appendChild(el);
    return el;
  };
  const cleanup = (el: HTMLElement, a: Animation) => (a.onfinish = () => el.remove());

  // flash
  const flash = add("bg-foreground", "width:28px;height:28px;left:-14px;top:-14px;");
  cleanup(flash, flash.animate(
    [{ transform: "scale(0.2)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0 }],
    { duration: 280, easing: "cubic-bezier(.2,.8,.3,1)" },
  ));

  // shock ring
  const ring = add("border-2 border-foreground", "width:40px;height:40px;left:-20px;top:-20px;");
  cleanup(ring, ring.animate(
    [{ transform: "scale(0.1)", opacity: 0.8 }, { transform: "scale(2.4)", opacity: 0, borderWidth: "0.5px" }],
    { duration: 520, easing: "cubic-bezier(.1,.7,.3,1)" },
  ));

  // paper shards: flung out (biased along the plane's heading), tumble, fall
  for (let i = 0; i < 14; i++) {
    const a = heading + Math.PI + (Math.random() - 0.5) * Math.PI * 1.6 + (i % 2 ? Math.PI : 0) * 0.5;
    const speed = 160 + Math.random() * 260;
    const vx = Math.cos(a) * speed;
    const vy = Math.sin(a) * speed - 140;
    const w = 4 + Math.random() * 6;
    const h = 3 + Math.random() * 5;
    const spin = (Math.random() - 0.5) * 1080;
    const shard = document.createElement("span");
    shard.className = `absolute ${i % 3 ? "bg-neutral-400 dark:bg-neutral-500" : "bg-foreground"}`;
    shard.style.cssText = `width:${w}px;height:${h}px;left:${-w / 2}px;top:${-h / 2}px;clip-path:polygon(0 0,100% 30%,40% 100%);`;
    root.appendChild(shard);
    const T = 0.9 + Math.random() * 0.5;
    const frames = Array.from({ length: 9 }, (_, k) => {
      const t = (k / 8) * T;
      return {
        transform: `translate(${vx * t}px, ${vy * t + 0.5 * G * t * t}px) rotate(${spin * (k / 8)}deg)`,
        opacity: k < 6 ? 1 : 1 - (k - 5) / 3,
      };
    });
    cleanup(shard, shard.animate(frames, { duration: T * 1000, easing: "linear" }));
  }

  // smoke puffs
  for (let i = 0; i < 9; i++) {
    const size = 10 + Math.random() * 16;
    const ox = (Math.random() - 0.5) * 18;
    const oy = (Math.random() - 0.5) * 14;
    const puff = add("bg-neutral-300 dark:bg-neutral-600", `width:${size}px;height:${size}px;left:${ox - size / 2}px;top:${oy - size / 2}px;`);
    const dx = (Math.random() - 0.5) * 40;
    cleanup(puff, puff.animate(
      [
        { transform: "scale(0.3)", opacity: 0.9 },
        { transform: `translate(${dx * 0.5}px,-8px) scale(1.2)`, opacity: 0.6, offset: 0.35 },
        { transform: `translate(${dx}px,-26px) scale(1.8)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, delay: 60 + i * 25, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" },
    ));
  }
}
