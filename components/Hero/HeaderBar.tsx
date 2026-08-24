"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { EmojiReaction } from "@/components/motion/emoji-reaction";
import { Tooltip } from "@/components/motion/tooltip";
import { useCoordinates } from "@/components/Hero/CoordinateTracker";

const CARD_W = 200;
const CARD_HALF = CARD_W / 2;
const HORIZ_PAD = 12;

export function HeaderBar() {
  const { coords } = useCoordinates();
  const [logoHovered, setLogoHovered] = useState(false);
  const [pointerOffset, setPointerOffset] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  function handlePointerMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!logoRef.current) return;
    const logoRect = logoRef.current.getBoundingClientRect();
    const minCenterX = CARD_HALF + HORIZ_PAD;
    const maxCenterX = window.innerWidth - CARD_HALF - HORIZ_PAD;
    const clampedCenterX = Math.min(Math.max(e.clientX, minCenterX), maxCenterX);
    setPointerOffset(clampedCenterX - logoRect.left - CARD_HALF);
  }

  function handleEnter(e: React.MouseEvent<HTMLDivElement>) {
    if (!logoRef.current) return;
    const logoRect = logoRef.current.getBoundingClientRect();
    const cardCenterX = e.clientX;
    const minCenterX = CARD_HALF + HORIZ_PAD;
    const maxCenterX = window.innerWidth - CARD_HALF - HORIZ_PAD;
    const clampedCenterX = Math.min(Math.max(cardCenterX, minCenterX), maxCenterX);
    setPointerOffset(clampedCenterX - logoRect.left - CARD_HALF);
    setLogoHovered(true);
  }

  return (
    <motion.header
      className="flex w-full items-center justify-between px-6 py-4 md:px-10"
      initial={reduce ? false : { opacity: 0, y: -10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Left: Emoji reaction + Logo with avatar hover */}
      <motion.div
        className="flex items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
      >
        <Tooltip content="Add reaction" side="bottom">
          <span className="inline-flex">
            <EmojiReaction size="sm" align="left" />
          </span>
        </Tooltip>
        <div
          ref={logoRef}
          className="relative flex h-8 items-center"
          onMouseEnter={handleEnter}
          onMouseMove={handlePointerMove}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <a
            href="/"
            className="relative z-10 text-sm font-medium tracking-tight"
          >
            iamshakibali
          </a>
          <AnimatePresence>
            {logoHovered && (
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(12px)", x: pointerOffset }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  x: pointerOffset,
                }}
                exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeOut" },
                  y: { duration: 0.2, ease: "easeOut" },
                  filter: { duration: 0.24, ease: "easeOut" },
                  x: { type: "spring", stiffness: 600, damping: 32 },
                }}
                className="pointer-events-none absolute left-0 top-full z-20 mt-[-2px]"
              >
                <div className="h-[203px] w-[200px] shrink-0 overflow-hidden rounded-2xl border-8 border-white shadow-[0px_53px_79px_rgba(0,0,0,0.1)] dark:border-neutral-800">
                  <img
                    src="/avatar.gif"
                    alt="Shakib Ali"
                    width={200}
                    height={203}
                    className="h-full w-full rounded-xl object-cover"
                    draggable={false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right: Timer + Coordinates + Theme toggle */}
      <motion.div
        className="flex h-8 items-center gap-5"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.16 }}
      >
        <div className="hidden items-center gap-3 font-mono text-[10px] text-neutral-400 md:flex">
          <span suppressHydrationWarning>{time ?? "00:00:00"}</span>
          <span className="opacity-30">—</span>
          <span>
            X:{String(coords.x).padStart(4, "\u00A0")} - Y:
            {String(coords.y).padStart(4, "\u00A0")}
          </span>
        </div>
        <Tooltip content="Change theme" side="bottom">
          <ThemeToggle
            variant="circle-blur"
            start="top-right"
            className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-foreground dark:hover:bg-white/10"
            iconClassName="size-4"
          />
        </Tooltip>
      </motion.div>
    </motion.header>
  );
}
