"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { CoordinateProvider, useCoordinates } from "@/components/Hero/CoordinateTracker";
import { GitHubHoverCard } from "@/components/Hero/GitHubHoverCard";
import { XHoverCard } from "@/components/Hero/XHoverCard";
import { LinkedInHoverCard } from "@/components/Hero/LinkedInHoverCard";
import { HeaderBar } from "@/components/Hero/HeaderBar";
import { LogoBadge } from "@/components/Hero/LogoBadge";
import { WelcomeGate } from "@/components/WelcomeGate";
import { useWelcomeDone } from "@/components/WelcomeDoneContext";
import { Button, ButtonLink } from "@/components/motion/button";
import { ActionSwapCascadeText, ActionSwapIcon } from "@/components/motion/action-swap";
import { TextScramble } from "@/components/motion/text-scramble";

const GH_CARD_W = 290;
const GH_CARD_HALF = GH_CARD_W / 2;

const FADE_UP = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function HeroContent() {
  const { handleMouseMove } = useCoordinates();
  const welcomeDone = useWelcomeDone();
  const [pillHovered, setPillHovered] = useState<"x" | "gh" | "li" | null>(null);
  const [pillOffset, setPillOffset] = useState(0);
  const [pillCardY, setPillCardY] = useState(0);
  const [mailCopied, setMailCopied] = useState(false);
  const [logoHovered, setLogoHovered] = useState<string | null>(null);
  // motion.p leaves inline filter:blur(0px) after FADE_UP, so blur text via inner spans, not the <p>
  const blurCls = `transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`;
  const reduce = useReducedMotion() ?? false;
  const ghWrapperRef = useRef<HTMLDivElement>(null);
  const xWrapperRef = useRef<HTMLDivElement>(null);
  const liWrapperRef = useRef<HTMLDivElement>(null);
  const pillRowRef = useRef<HTMLDivElement>(null);
  const sigRef = useRef<SVGSVGElement>(null);

  // magnetic ink: the resting signature leans toward a nearby cursor (max ~3px
  // drift + ~1.2deg tilt) and settles back with a soft spring when it leaves
  const sigMagX = useMotionValue(0);
  const sigMagY = useMotionValue(0);
  const sigMagR = useMotionValue(0);
  const sigSpringX = useSpring(sigMagX, { stiffness: 150, damping: 20, mass: 0.5 });
  const sigSpringY = useSpring(sigMagY, { stiffness: 150, damping: 20, mass: 0.5 });
  const sigSpringR = useSpring(sigMagR, { stiffness: 150, damping: 20, mass: 0.5 });

  const handleSigMagnetic = (e: React.MouseEvent) => {
    const el = sigRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const RADIUS = 240;
    if (dist > RADIUS || dist === 0) {
      sigMagX.set(0);
      sigMagY.set(0);
      sigMagR.set(0);
      return;
    }
    const pull = 1 - dist / RADIUS;
    sigMagX.set((dx / dist) * 3 * pull);
    sigMagY.set((dy / dist) * 3 * pull);
    sigMagR.set((dx / RADIUS) * 1.2);
  };

  // one shared card morphs between the three pills: x/y are relative to the pill
  // row and clamp to the viewport, so switching buttons glides instead of jumping
  const pillWrapperRefs = { x: xWrapperRef, gh: ghWrapperRef, li: liWrapperRef };
  const getPillOffset = (e: React.MouseEvent) => {
    if (!pillRowRef.current) return 0;
    const r = pillRowRef.current.getBoundingClientRect();
    const clamped = Math.min(Math.max(e.clientX, GH_CARD_HALF + 12), document.documentElement.clientWidth - GH_CARD_HALF - 12);
    return clamped - r.left - GH_CARD_HALF;
  };
  const hoverPill = (target: "x" | "gh" | "li", e: React.MouseEvent) => {
    setPillOffset(getPillOffset(e));
    const wrapper = pillWrapperRefs[target].current;
    if (wrapper && pillRowRef.current) {
      setPillCardY(wrapper.getBoundingClientRect().bottom - pillRowRef.current.getBoundingClientRect().top + 12);
    }
    setPillHovered(target);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-background text-foreground"
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleSigMagnetic(e);
      }}
    >
      <HeaderBar />

      <div className="flex flex-1 flex-col items-center justify-start px-6 pb-20 pt-16">
        <div className="flex w-full max-w-[540px] flex-col items-start text-left">
        <motion.svg
          viewBox="0 0 1920 1080"
          id="hero-signature"
          ref={sigRef}
          className="-ml-4 mb-6 h-24 w-auto shrink-0 self-start text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Shakib signature"
          style={{ x: sigSpringX, y: sigSpringY, rotate: sigSpringR }}
          initial={reduce ? false : { opacity: 0 }}
          animate={welcomeDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0 }}
        >
          <g>
            <path
              fill="currentColor"
              d="m487.12 596.43c26.68-8.9 44.24-13.75 65.81-14.08 13.08-0.2 23.57 2.25 39.95 3.98 2.62-0.04 4.55-1.38 4.52-2.69-0.06-4.57-11.25-10.3-48.53-10.38-41.16 0.64-72.3 16.14-76.24 16.21-46.68-17.59-47.35-18.89-164.72-41.29-102.94-20-163.88-29.52-164.55-73.31 0.63-44.46 89.93-147.17 184.98-215.29 93.8-65.51 189.94-104.23 263.16-105.35 60.13-0.92 81.37 19.66 81.81 49.07 0.65 42.47-41.58 101.97-73.04 140.36-27.62 31.8-40.51 43.77-57.44 48.61-22.77 6.23-23.44 6.24-24.66 12.16l-0.58 4.58c0.14 9.14 6.8 16.24 15.94 16.1 28.76-0.44 152.15-139.63 150.91-220.67-0.56-37.26-27.73-60.37-89.82-59.42-26.14 0.4-56.8 5.45-87.39 13.75-128.89 36.62-287.25 154.11-358.11 265.01-13.42 21.12-19.68 38.88-19.45 53.91 0.8 52.94 81.43 66.74 152.21 79.38 129.19 24.18 170.56 37.93 170.6 39.9 0 0.65-12.3 7.38-25.93 14.11-141.51 66.24-254.62 193.48-253.47 268.65 0.54 35.28 21.72 52.62 61.65 55.28 38.55-0.6 102.21-27.06 148.77-61.11 85.33-62.76 153.17-157.28 152.4-207.61-1.17-34.63-24.97-52.57-48.78-69.86zm34.4 69.42c0.99 64.06-105.28 168.97-159.65 205.1-27.15 19.37-82.94 48.34-124.75 48.98-30.08 0.46-51.25-16.22-51.65-43-0.92-59.49 89.8-154.35 140.88-192.4 38.11-28.69 117.84-73.72 138.69-78.6l1.94-0.68c12.41-0.19 45.54 28.06 52.36 46.26 1.37 4.55 2.1 9.11 2.18 14.34z"
            />
            <path
              fill="currentColor"
              d="m1297.52 669.36c6.11-0.1 11.01-6.27 10.94-11.27-0.07-4.44-4-7.16-9.54-7.07-5.01 0.08-12.72 2.97-12.65 7.97 0.07 4.43 5.71 10.45 11.25 10.37z"
            />
            <path
              fill="currentColor"
              d="m1789.94 730.99c-0.35-0.73-1.01-0.96-1.76-1.09-1.75-0.29-3.39-0.34-5.01-0.54q-2.48-0.34-4.96-0.71l-3.82-0.54c-5.09-0.73-9.46-1.28-9.46-1.28-111.09-14.74-169.58-3.51-196.61 5.9-0.02-0.14-0.12-0.2-0.12-0.36-0.02-1.66 1.05-3.9 1.56-6.13 2.63-10.03 4.14-20.59 4-30.02-1.48-23.84-11.16-39.25-27.84-42.31l-12.22-0.92c-54.38 0.83-97.28 61.98-128.28 102.95 10.64-28.47 47.58-118.92 70.4-149.8 9.33-6.79 84.21-81.75 122.65-145.05 8.12-13.44 37.32-62.71 36.95-86.56-0.14-9.44-4.07-13.27-12.4-13.13-2.77 0.03-5.54 0.63-8.28 2.33-38.49 23.36-120.02 172.21-123.28 177.26-12.37 25.15-28.62 50.92-36.39 51.05-7.78 0.11-16.54 6.91-16.98 14.68 0.12 8.32 6.25 9.9 6.38 17.67 0.05 3.33-1 7.79-3.68 13.92-9.39 22.29-25.25 57.63-37.84 88.03-1.76 0.93-3.88 2.29-6.27 4.21-26.31 21.49-96 72.49-135.95 73.11-11.09-0.38-16.17-5.31-16.33-16.4-0.17-11.64 5.14-27.27 11.57-41.24 9.13-20.12 18.47-25.8 18.31-35.79-0.07-4.44-2.32-7.73-5.66-7.69q-3.31 0.05-6.61 3.44c-3.53 3.64-8.79 12.24-13.78 23.08-47.31 17.73-151.84 37.27-197.18 45.62l-0.55 0.01c-1.67 0.03-2.79-1.06-2.82-2.72-0.04-2.23 1.05-4.46 3.78-6.73 25.17-23.69 124.66-123.43 148.51-123.79q2.49-0.04 3.34 1.61c3.41 4.93 6.77 6.55 9.54 6.51 3.89-0.07 6.59-4.53 6.52-9.52-0.1-6.11-3.51-11.61-16.27-11.42-35.49 1.09-122.81 97.88-149.63 122.71 34.27-82.1 92.34-203.96 139.49-277.93 0 0 16.5-9.69 27.35-25.4 4.89-7.29 8.64-16.78 8.53-23.43-0.07-4.99-2.36-8.85-8.46-8.75-8.33 0.12-14.3 9.64-24.62 23.68-26.04 38.69-52.51 86.26-87.43 161.16-20.76 44.99-41.14 91.26-58.7 132.73-0.62 0.58-1.26 1.2-1.97 1.93-10.93 11.27-51.02 38.52-71.95 48.83-13.76 7.43-24.8 10.93-33.11 11.05-14.43 0.22-21.3-13.55-21.51-27.42-0.27-16.64 16.02-40.75 15.86-50.74-0.6-3.32-1.19-5.53-3.41-5.5l-2.77 0.6c-7.21 0.12-11.53-28.68-35.39-28.32q-7.5 0.12-18.23 5.28c-16.75 7.8-42.65 34.51-58.83 58.12-23.91 23.04-57.09 47.57-89.39 49.03-22.74 0.34-25.92-26.24-26.37-55.65l0.13-27.19c-0.41-27.74-2.99-51.01-21.85-50.72-35.46 3.87-77.7 71.66-105.4 110.93l-0.02-0.55c-0.12-8.89 53.79-147.88 69-169.2 58.62-85.26 81.26-128.88 113.23-179.86 20.63-30.29 42.18-72.8 42.57-82.23-0.11-7.22-7.48-18.75-12.48-18.68-5.56 0.09-16.5 10.25-28.45 26.51-25.55 35.36-94.51 171.26-124.64 232.2-7.02 13.43-90.56 211.16-90.23 233.35 0.15 8.32 4.07 11.03 8.51 10.96 3.32-0.04 7.18-1.77 9.36-4.02 10.38-11.82 90.46-144 117.11-144.4 9.98-0.15 10.82 17.59 11.15 40.34l0.13 7.21c0.6 39.95 3.45 80.4 41.16 79.83 19.5-0.3 48.64-13.11 73.31-33.33-0.95 2.92-1.56 5.6-1.52 7.82 0.1 7.77 6.85 13.77 15.74 13.63 28.85-0.44 88.53-52.41 94.08-52.49l0.57 0.54c0.01 0.56-5.37 12.29-5.14 26.72 0.25 16.64 7.77 35.94 32.72 35.56 10.01-0.15 23.26-3.68 39.78-11.7 20.61-10.51 46.29-28.98 61.67-42.8-17.58 42-31.74 77.91-39.68 100.73-6.38 17.86-11.15 32.91-11.07 37.91 0.06 3.33 1.73 4.41 3.95 4.37 3.89-0.05 7.71-4 8.17-10.11 0.55-1.12 8.47-27.32 13.79-41.83 2.11-7.25 9.5-31.78 17.05-45.75 2.7-5.6 5.42-8.97 12.59-10.74 20.46-5.06 158.29-31.86 197.83-48.73-6.3 15.05-11.57 33.18-11.33 48.65 0.3 19.97 9.31 27.6 28.72 28.4 37.23-0.57 107.07-52.39 135.14-74.02-6.06 15.09-10.89 28.18-13.04 36.65l-0.5 3.9c0.09 5.54 3.45 7.16 6.22 7.11 3.89-0.05 7.73-2.88 11.53-7.95 26.68-32.6 82.64-111.69 131.46-112.44 19.98 0.81 26.8 10.69 27.12 31.22 0.18 12.21-2.96 24.46-5.59 33.38-2.12 6.68-4.34 6.72-15.37 11.89-59.53 26.44-107.42 52.14-136.06 101.97-6.5 10.65-10.73 24.02-10.55 35.67 0.25 16.64 10.45 29.81 28.19 29.54 33.84-0.52 86.29-54.59 121.35-120.6 9.72-18.47 18.83-38.59 19.93-39.72 1.6-3.91 2.69-5.03 8.21-7.33 15.42-7.46 56.92-15.31 81.33-15.69l9.45 0.42c5.61-0.09 7.15-0.62 7.74-1.47q2.01 0 4.02 0.01 3.46 0.04 6.92 0.11 3.58 0.08 7.15 0.2 3.69 0.13 7.38 0.29 3.8 0.17 7.61 0.39 3.92 0.22 7.85 0.49 4.04 0.27 8.08 0.59 4.17 0.32 8.33 0.69 4.29 0.39 8.58 0.81 4.41 0.45 8.82 0.93 4.54 0.5 9.08 1.05 4.66 0.56 9.32 1.17 4.8 0.63 9.59 1.3 2.44 0.35 4.89 0.7c1.29 0.19 2.59 0.3 3.85 0.65 0.6 0.17 1.16 0.47 1.74 0.69q0.88 0.33 1.78 0.58c0.8 0.22 1.63 0.28 2.47 0.3 0.56 0.01 1.14-0.02 1.68-0.18q0.3-0.09 0.53-0.24c1.26-0.8 1.23-2.81 0.64-4.01zm-203.34-319.65c4.89-7.29 28.8-39.84 38.23-39.99 3.91 0.49 5.05 2.7 5.12 7.7 0.3 19.96-28.87 71.47-33.74 79.87-39.58 60.53-106.3 125.37-110.19 125.42-0.11-6.66 76.1-139.88 100.58-173zm-930.38 166.28c-0.04-2.22 3.16-11.16 10.71-26.25 38.16-81.05 53.75-113.47 91.13-173.42 16.81-26.35 23.33-34.76 27.2-34.82 1.69 0.53 1.12-0.02 1.7 1.64 0.29 18.3-89.48 172.84-100.86 190.22-17.88 29.12-27.66 43.14-29.88 43.17zm192.72 190.71c-15.95 9.14-24.21 12.6-28.1 12.65-3.32 0.06-3.34-0.5-3.37-2.72-0.09-6.66 15.1-29.09 31.47-46.55 21.32-20.85 24.59-25.89 40.08-27.8 12.77-0.19 20.82 19.11 20.84 19.66-0.5 3.89-38.89 33.33-60.92 44.76zm695.79-11.18c-18.26 40.23-63.19 114.16-102.86 133.08-8.26 4.02-15.45 5.8-20.99 5.89-11.09 0.16-16.76-6.97-16.92-17.51-0.12-7.77 2.51-17.24 7.34-27.86 29.06-59.27 111.76-94.94 130.55-99.11 2.22-0.03 3.36 1.62 3.4 3.28z"
            />
            </g>
        </motion.svg>

        <p className="text-[22px] font-medium leading-none text-foreground" style={{ fontFamily: "var(--font-overused-grotesk)" }}>
          <TextScramble text="Hi, I'm Shakib, Product Design Engineer." active={welcomeDone} />
        </p>

        <motion.p
          variants={FADE_UP}
          initial={reduce ? false : "hidden"}
          animate={welcomeDone ? "visible" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400"
        >
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>Based in Bangladesh, working globally. I started with design, but my curiosity about how things work pulled me toward code.</span>
        </motion.p>

        <motion.p
          variants={FADE_UP}
          initial={reduce ? false : "hidden"}
          animate={welcomeDone ? "visible" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          className="mt-6 max-w-[540px] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400"
        >
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>Currently, I&apos;m a Design Engineer at{" "}</span>
          <LogoBadge id="vivetica" label="Vivetica" src="/badges/company-logo.svg" href="https://viveticacapital.ch" videoSrc="/badges/vivetica.mp4" width={290} imgClassName="dark:invert" active={logoHovered === "vivetica"} dimmed={logoHovered !== null && logoHovered !== "vivetica"} onHoverChange={setLogoHovered}>
            <span className="inline-flex h-[21px] items-center justify-center rounded-full bg-[#f2f2f2] px-[10px] align-middle dark:bg-neutral-800">
              <img src="/badges/company-logo.svg" alt="Vivetica" draggable={false} className="h-[13px] w-[74px] dark:invert" />
            </span>
          </LogoBadge>{" "}
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>, building design frameworks and systems.</span>
        </motion.p>

        <motion.p
          variants={FADE_UP}
          initial={reduce ? false : "hidden"}
          animate={welcomeDone ? "visible" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.19 }}
          className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400 md:whitespace-nowrap"
        >
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>Previously, I worked a Sr Product Designer at{" "}</span>
          <LogoBadge id="orbix" label="Orbix Studio" src="/badges/orbix.png" href="https://www.orbix.studio/" videoSrc="/badges/orbix.mp4" width={290} active={logoHovered === "orbix"} dimmed={logoHovered !== null && logoHovered !== "orbix"} onHoverChange={setLogoHovered}>
            <span className="whitespace-nowrap">
              <span className="mx-[1px] inline-block size-[21px] align-middle">
                <img src="/badges/orbix.png" alt="Orbix Studio" draggable={false} className="size-full rounded-full object-cover" />
              </span>{" "}
              <span className="font-medium text-black dark:text-white">Orbix Studio</span>
            </span>
          </LogoBadge>{" "}
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>&amp;{" "}</span>
          <LogoBadge id="screens" label="ScreensDesign" src="/badges/screens.png" href="https://screensdesign.com" videoSrc="/badges/screens.mp4" width={290} active={logoHovered === "screens"} dimmed={logoHovered !== null && logoHovered !== "screens"} onHoverChange={setLogoHovered}>
            <span className="whitespace-nowrap">
              <span className="mx-[1px] inline-block size-[21px] align-middle">
                <img src="/badges/screens.png" alt="ScreensDesign" draggable={false} className="size-full rounded-full object-cover" />
              </span>{" "}
              <span className="font-medium text-black dark:text-white">ScreensDesign</span>
            </span>
          </LogoBadge>
        </motion.p>

        <motion.p
          variants={FADE_UP}
          initial={reduce ? false : "hidden"}
          animate={welcomeDone ? "visible" : "hidden"}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.26 }}
          className="max-w-[540px] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400"
        >
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>Outside of work, I build and open-source apps like{" "}</span>
          <LogoBadge id="pintop" label="Pintop" src="/badges/pintop.png" href="https://github.com/iamshakibali/pin-top" popup={false} active={logoHovered === "pintop"} dimmed={logoHovered !== null && logoHovered !== "pintop"} onHoverChange={setLogoHovered}>
            <span className="whitespace-nowrap">
              <span className="mx-[1px] inline-block h-[21px] w-[21px] align-middle">
                <img src="/badges/pintop.png" alt="Pintop" draggable={false} className="size-full object-contain" />
              </span>{" "}
              <span className="font-medium text-black dark:text-white">Pintop</span>
            </span>
          </LogoBadge>
          <span className={`transition-[filter] duration-300 ${logoHovered ? "blur-[8px]" : ""}`}>, and love contributing to open-source projects.</span>
        </motion.p>

        <div ref={pillRowRef} className="relative mt-8">
        <motion.div
          layout
          className="flex flex-wrap gap-1"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={welcomeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + (welcomeDone ? 0 : 0.4) }}
        >
          <motion.div layout transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}>
            <Button
              variant="pill"
              size="pill"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText("shakibaliuix@proton.me");
                } catch {}
                setMailCopied(true);
                setTimeout(() => setMailCopied(false), 1400);
              }}
            >
              <span className="flex items-center self-center pr-[6px]">
              <span className="flex size-[13px] shrink-0 items-center justify-center text-[#171717] dark:text-white">
                  <ActionSwapIcon value={mailCopied ? "tick" : "copy"}>
                    {mailCopied ? (
                      <svg
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-full"
                      >
                        <path
                        d="M1.5 4.5L3.6 6.6L7.5 2.1"
                        stroke="currentColor"
                        strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-full"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    )}
                  </ActionSwapIcon>
                </span>
              </span>
              <ActionSwapCascadeText value={mailCopied ? "Copied!" : "shakibaliuix@proton.me"} />
            </Button>
          </motion.div>
          <motion.div
            layout="position"
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as any}
            ref={xWrapperRef as any}
            className="relative inline-flex"
            onMouseEnter={(e) => hoverPill("x", e)}
            onMouseMove={(e) => setPillOffset(getPillOffset(e))}
            onMouseLeave={() => setPillHovered(null)}
          >
            <ButtonLink
              variant="pill"
              size="pill"
              href="https://x.com/iamshakibali"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
              <span className="flex pl-[6px]">
                <span className="size-[15px] shrink-0 text-[#171717] dark:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-full"
                  >
                    <path d="M7 7h10v10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </ButtonLink>
          </motion.div>
          <motion.div
            layout="position"
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as any}
            ref={ghWrapperRef as any}
            className="relative inline-flex"
            onMouseEnter={(e) => hoverPill("gh", e)}
            onMouseMove={(e) => setPillOffset(getPillOffset(e))}
            onMouseLeave={() => setPillHovered(null)}
          >
            <ButtonLink
              variant="pill"
              size="pill"
              href="https://github.com/iamshakibali"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="flex pl-[6px]">
                <span className="size-[15px] shrink-0 text-[#171717] dark:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-full"
                  >
                    <path d="M7 7h10v10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </ButtonLink>
          </motion.div>
          <motion.div
            layout="position"
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as any}
            ref={liWrapperRef as any}
            className="relative inline-flex"
            onMouseEnter={(e) => hoverPill("li", e)}
            onMouseMove={(e) => setPillOffset(getPillOffset(e))}
            onMouseLeave={() => setPillHovered(null)}
          >
            <ButtonLink
              variant="pill"
              size="pill"
              href="https://linkedin.com/in/iamshakibali"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
              <span className="flex pl-[6px]">
                <span className="size-[15px] shrink-0 text-[#171717] dark:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-full"
                  >
                    <path d="M7 7h10v10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </ButtonLink>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {pillHovered && (
            <motion.div
              initial={{ opacity: 0, y: pillCardY + 16, filter: "blur(12px)", x: pillOffset }}
              animate={{ opacity: 1, y: pillCardY, filter: "blur(0px)", x: pillOffset }}
              exit={{ opacity: 0, y: pillCardY + 10, filter: "blur(10px)" }}
              transition={{
                opacity: { duration: 0.2, ease: "easeOut" },
                y: { duration: 0.2, ease: "easeOut" },
                filter: { duration: 0.24, ease: "easeOut" },
                x: { type: "tween", duration: 0.16, ease: "easeOut" },
              }}
              className="pointer-events-none absolute left-0 top-0 z-20"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={pillHovered}
                  initial={pillHovered === "x" ? { opacity: 0, filter: "blur(6px)" } : false}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={pillHovered === "x" ? { opacity: 0, filter: "blur(6px)" } : { opacity: 0, filter: "blur(0px)" }}
                  transition={pillHovered === "x" ? { duration: 0.16, ease: "easeOut" } : { duration: 0 }}
                >
                  {pillHovered === "x" ? <XHoverCard /> : pillHovered === "gh" ? <GitHubHoverCard /> : <LinkedInHoverCard />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <CoordinateProvider>
      <WelcomeGate>
        <HeroContent />
      </WelcomeGate>
    </CoordinateProvider>
  );
}
