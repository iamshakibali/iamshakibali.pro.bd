"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useInView } from "motion/react";

// A cute blob buddy driven by a small physics sim. He drops in from above the
// viewport under gravity, tumbling, clips the "click me" note and glances off
// it, falls on down onto the craft cards (element marked data-guy-ground),
// bounces with energy loss — jelly body stretching with speed and squashing by
// impact — rolls upright, shakes off the dizziness, waves hi, then runs off
// the right edge of the screen.

const G = 2600; // gravity, px/s²
const RESTITUTION = 0.36; // bounce energy kept
const REST_SPEED = 150; // below this impact speed he stops bouncing
const JELLY_K = 420; // jelly spring stiffness
const JELLY_C = 10; // jelly damping
const SQUASH_PER_SPEED = 0.0015; // squash impulse per px/s of impact
const STRETCH_PER_SPEED = 0.00009; // stretch while falling, per px/s
const RIGHT_K = 140; // righting torque stiffness
const RIGHT_C = 13; // righting damping
const DIZZY_IMPACT = 900; // impact speed that makes him dizzy
const GLANCE_KICK = 170; // sideways speed he picks up glancing off the note
const RUN_SPEED = 520; // px/s when he runs away

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function FallingGuy({ play, className = "" }: { play: boolean; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });

  // body transforms the sim writes every frame
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rot = useMotionValue(0);
  const sx = useMotionValue(1);
  const sy = useMotionValue(1);
  const armL = useMotionValue(0);
  const armR = useMotionValue(0);
  const bubble = useMotionValue(0); // 0 hidden → 1 shown

  const armLRef = useRef<SVGLineElement>(null);
  const armRRef = useRef<SVGLineElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const dizzyRef = useRef<SVGGElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);

  const played = useRef(false);
  const gone = useRef(false);
  const busy = useRef(false);
  const raf = useRef(0);

  // arms are plain SVG lines rotated about their shoulder point
  useEffect(() => {
    const setL = (a: number) => armLRef.current?.setAttribute("transform", `rotate(${a} 8 22)`);
    const setR = (a: number) => armRRef.current?.setAttribute("transform", `rotate(${a} 36 22)`);
    const u1 = armL.on("change", setL);
    const u2 = armR.on("change", setR);
    return () => {
      u1();
      u2();
    };
  }, [armL, armR]);

  const setDizzy = (on: boolean) => {
    eyesRef.current?.setAttribute("opacity", on ? "0" : "1");
    dizzyRef.current?.setAttribute("opacity", on ? "1" : "0");
  };

  // one cartoon smoke puff at (px, py) relative to his starting spot: swells,
  // drifts up and back, and fades. Lives in a static layer so it stays where
  // it was puffed out while he runs on.
  const puff = (px: number, py: number, size: number, drift: number, rise = 18) => {
    const layer = smokeRef.current;
    if (!layer) return;
    const el = document.createElement("span");
    el.className = "absolute rounded-full bg-neutral-300 dark:bg-neutral-600";
    el.style.cssText += `width:${size}px;height:${size}px;left:${px - size / 2}px;top:${py - size / 2}px;`;
    layer.appendChild(el);
    const a = el.animate(
      [
        { opacity: 0.85, transform: "translate(0,0) scale(0.4)" },
        { opacity: 0.6, transform: `translate(${drift * 0.5}px,${-rise / 3}px) scale(1.1)`, offset: 0.4 },
        { opacity: 0, transform: `translate(${drift}px,${-rise}px) scale(1.6)` },
      ],
      { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.3,1)" },
    );
    a.onfinish = () => el.remove();
  };

  // landing dust: a cloud kicked out sideways along the ground from his feet,
  // bigger and wider the harder he hits. (fx, fy) = his feet.
  const puffDust = (strength: number, fx: number, fy: number) => {
    const n = Math.min(1, strength / 1400);
    const count = 4 + Math.round(n * 8);
    for (let i = 0; i < count; i++) {
      const dir = i % 2 ? 1 : -1;
      puff(
        fx + dir * (2 + Math.random() * 8),
        fy - 3 - Math.random() * 4,
        6 + Math.random() * (6 + 14 * n),
        dir * (18 + Math.random() * 34) * (0.5 + n),
        4 + Math.random() * 10 * (0.5 + n),
      );
    }
  };

  /** Run the sim from a starting state until he's fully settled. */
  // grounds: surfaces (y offsets) he meets in order. Every one but the last
  // is a glancing hit: he bounces off sideways and keeps falling past it.
  const simulate = (start: { y: number; vy: number; rot: number; w: number; vx?: number; grounds?: number[] }) =>
    new Promise<number>((resolve) => {
      const grounds = start.grounds ?? [0];
      let gi = 0;
      let px = x.get();
      let vx = start.vx ?? 0;
      let py = start.y;
      let vy = start.vy;
      let r = start.rot;
      let w = start.w;
      let s = 0; // jelly deformation (+ stretch, − squash)
      let vs = 0;
      let grounded = false;
      let firstImpact = 0;
      let t = 0;
      let last = performance.now();

      const step = (now: number) => {
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        t += dt;

        // motion + bounces
        if (!grounded) {
          vy += G * dt;
          py += vy * dt;
          px += vx * dt;
          const floor = grounds[gi];
          if (py >= floor && vy > 0 && gi < grounds.length - 1) {
            // glancing hit: squash, bounce up a little, get knocked sideways,
            // spin faster, and drop past this surface
            const impact = vy;
            py = floor;
            vs -= impact * SQUASH_PER_SPEED * 0.7;
            vy = -impact * 0.3;
            vx += GLANCE_KICK;
            w += 420;
            puffDust(impact * 0.6, px + 22, py + 40);
            gi++;
          } else if (py >= floor && vy > 0) {
            const impact = vy;
            py = floor;
            vx *= 0.5; // ground friction
            vs -= impact * SQUASH_PER_SPEED; // squash by impact force
            w *= 0.35; // ground friction bleeds the spin
            if (!firstImpact) firstImpact = impact;
            puffDust(impact, px + 22, py + 40);
            if (impact < REST_SPEED) {
              vy = 0;
              grounded = true;
            } else {
              vy = -impact * RESTITUTION;
            }
          }
        }

        if (grounded) vx *= 1 - Math.min(1, dt * 8);
        px += grounded ? vx * dt : 0;

        // spin freely until the final surface; then a righting torque rolls
        // him to the nearest upright angle
        if (!firstImpact) r += w * dt;
        else {
          const target = Math.round(r / 360) * 360;
          w += (-(r - target) * RIGHT_K - w * RIGHT_C) * dt;
          r += w * dt;
        }

        // jelly body: stretched by fall speed, springs back after squashes
        const stretch = !grounded && vy > 0 ? Math.min(vy * STRETCH_PER_SPEED, 0.22) : 0;
        vs += (-(s - stretch) * JELLY_K - vs * JELLY_C) * dt;
        s = Math.max(-0.55, Math.min(0.4, s + vs * dt));

        // arms flail in the air, relax on the ground
        if (!grounded) {
          armL.set(55 + 30 * Math.sin(t * 24));
          armR.set(-(55 + 30 * Math.sin(t * 24 + 1.3)));
        } else {
          armL.set(armL.get() * (1 - Math.min(1, dt * 10)));
          armR.set(armR.get() * (1 - Math.min(1, dt * 10)));
        }

        x.set(px);
        y.set(py);
        rot.set(r);
        sy.set(1 + s);
        sx.set(1 - s * 0.75);

        const settled =
          grounded && Math.abs(r - Math.round(r / 360) * 360) < 0.5 && Math.abs(w) < 4 && Math.abs(s) < 0.004 && Math.abs(vs) < 0.04;
        if (settled) {
          rot.set(Math.round(r / 360) * 360);
          sx.set(1);
          sy.set(1);
          resolve(firstImpact);
          return;
        }
        raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    });

  const wave = async () => {
    if (busy.current || gone.current) return;
    busy.current = true;
    animate(bubble, 1, { type: "spring", stiffness: 500, damping: 22 });
    await animate(armR, [-120, -85, -120, -85, -120, -85, -120], { duration: 1.3, ease: "easeInOut" });
    await animate(armR, 0, { type: "spring", stiffness: 260, damping: 14 });
    await sleep(900);
    await animate(bubble, 0, { duration: 0.25 });
    busy.current = false;
  };

  // dash off the right edge of the screen: lean forward, bob, pump the arms
  const runAway = async () => {
    if (!rootRef.current) return;
    busy.current = true;
    const dist = window.innerWidth - rootRef.current.getBoundingClientRect().left + 80;
    const dur = dist / RUN_SPEED;
    const floor = y.get();
    await animate(rot, 14, { duration: 0.18 }); // lean in
    // take-off "poof": a burst of smoke where he stood
    const fx = 22 + x.get();
    const fy = 40 + floor;
    for (let i = 0; i < 6; i++) {
      puff(fx - 6 - Math.random() * 14, fy - 4 - Math.random() * 14, 12 + Math.random() * 12, -20 - Math.random() * 25);
    }
    // smoke trail kicked up behind his feet while he runs
    const trail = window.setInterval(() => {
      puff(x.get() + 6, y.get() + 36 - Math.random() * 6, 7 + Math.random() * 8, -14 - Math.random() * 16);
    }, 55);
    const steps = Math.max(2, Math.round(dur / 0.16));
    animate(y, Array.from({ length: steps * 2 + 1 }, (_, i) => (i % 2 ? floor - 7 : floor)), { duration: dur, ease: "linear" });
    animate(armL, Array.from({ length: steps * 2 + 1 }, (_, i) => (i % 2 ? 60 : -30)), { duration: dur, ease: "linear" });
    animate(armR, Array.from({ length: steps * 2 + 1 }, (_, i) => (i % 2 ? 30 : -60)), { duration: dur, ease: "linear" });
    await animate(x, x.get() + dist, { duration: dur, ease: [0.5, 0, 1, 1] });
    window.clearInterval(trail);
    await sleep(1000); // let the last puffs fade
    gone.current = true;
    rootRef.current.style.opacity = "0";
    rootRef.current.style.pointerEvents = "none";
  };

  // the drop-in
  useEffect(() => {
    if (!play || !inView || played.current || !rootRef.current) return;
    played.current = true;
    rootRef.current.style.opacity = "1";
    if (reduce) {
      void wave();
      return;
    }
    const run = async () => {
      busy.current = true;
      const box = rootRef.current!.getBoundingClientRect();
      // second landing: the top of the craft cards below, if they're there
      const floorEl = document.querySelector<HTMLElement>("[data-guy-ground]");
      const below = floorEl ? floorEl.getBoundingClientRect().top - box.bottom : 0;
      const grounds = below > 40 ? [0, below] : [0];
      const impact = await simulate({ y: -(box.top + 90), vy: 0, rot: -30, w: 560, grounds });
      if (impact > DIZZY_IMPACT) {
        setDizzy(true);
        await sleep(700);
        setDizzy(false);
      }
      busy.current = false;
      await wave();
      await runAway();
    };
    void run();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, inView, reduce]);

  // idle blinking
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    void (async () => {
      while (alive) {
        await sleep(2600 + Math.random() * 2200);
        const g = eyesRef.current;
        if (!alive || !played.current || !g) continue;
        g.setAttribute("transform", "translate(0 18) scale(1 0.1) translate(0 -18)");
        await sleep(110);
        g.removeAttribute("transform");
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduce]);

  // click: hop into a flip and land again
  const hop = async () => {
    if (!played.current || busy.current || gone.current || reduce) return;
    busy.current = true;
    const dir = Math.random() < 0.5 ? -1 : 1;
    // crouch, then spring up
    await animate(sy, 0.75, { duration: 0.1 });
    sx.set(1.2);
    const floor = y.get();
    const impact = await simulate({ y: floor, vy: -820, rot: rot.get(), w: dir * 720, grounds: [floor] });
    if (impact > DIZZY_IMPACT) {
      setDizzy(true);
      await sleep(500);
      setDizzy(false);
    }
    busy.current = false;
  };

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`cursor-pointer select-none opacity-0 ${className}`}
      onPointerEnter={() => played.current && void wave()}
      onClick={hop}
    >
      {/* smoke layer: static, so puffs hang where they were made */}
      <div ref={smokeRef} className="pointer-events-none absolute left-0 top-0" />
      <motion.div className="relative" style={{ x, y }}>
      {/* speech bubble */}
      <motion.div
        className="pointer-events-none absolute -top-6 left-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] text-background"
        style={{ x: "-20%", opacity: bubble, scale: bubble, originX: 0.2, originY: 1 }}
      >
        hi! 👋
        <span className="absolute -bottom-1 left-3 size-2 rotate-45 bg-foreground" />
      </motion.div>


      {/* spin about his centre; jelly scale from his feet */}
      <motion.div style={{ rotate: rot }}>
        <motion.svg
          className="block text-foreground"
          width={44}
          height={40}
          viewBox="0 0 44 40"
          style={{ scaleX: sx, scaleY: sy, originX: 0.5, originY: 1 }}
        >
          <line ref={armLRef} x1={8} y1={22} x2={3} y2={27} stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
          <line ref={armRRef} x1={36} y1={22} x2={41} y2={27} stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />
          <ellipse cx={16} cy={36.5} rx={4} ry={2.5} fill="currentColor" />
          <ellipse cx={28} cy={36.5} rx={4} ry={2.5} fill="currentColor" />
          <path d="M22 5c9 0 15 7 15 16s-6 14-15 14S7 30 7 21 13 5 22 5z" fill="currentColor" />
          <g ref={eyesRef}>
            <circle cx={17.5} cy={18} r={2.3} className="fill-background" />
            <circle cx={26.5} cy={18} r={2.3} className="fill-background" />
            <circle cx={18.2} cy={17.3} r={0.8} fill="currentColor" />
            <circle cx={27.2} cy={17.3} r={0.8} fill="currentColor" />
          </g>
          <g ref={dizzyRef} opacity={0} stroke="var(--background)" strokeWidth={1.4} strokeLinecap="round">
            <path d="M15.8 16.3l3.4 3.4M19.2 16.3l-3.4 3.4" />
            <path d="M24.8 16.3l3.4 3.4M28.2 16.3l-3.4 3.4" />
          </g>
          <path d="M19 23.5q3 2.6 6 0" fill="none" stroke="var(--background)" strokeWidth={1.5} strokeLinecap="round" />
          <ellipse cx={13.5} cy={22.5} rx={2.2} ry={1.3} fill="#fb7185" opacity={0.55} />
          <ellipse cx={30.5} cy={22.5} rx={2.2} ry={1.3} fill="#fb7185" opacity={0.55} />
        </motion.svg>
      </motion.div>
      </motion.div>
    </div>
  );
}
