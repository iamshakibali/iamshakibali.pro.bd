"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";
import { ProgressiveBlur } from "@/registry/magicui/progressive-blur";

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function PlaygroundPage() {
  const reduce = useReducedMotion() ?? false;
  return (
    <main className="flex flex-1 flex-col items-center bg-background text-foreground">
      <div className="flex w-full max-w-[540px] flex-col items-start px-6 pt-16">
        <motion.p
          className="text-[24px] font-medium leading-none text-foreground"
          style={{ fontFamily: "var(--font-overused-grotesk)" }}
          initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <TextScramble text="Craft" />
          <motion.span
            className="mt-2 block font-mono text-[12px] font-light tracking-[-0.3px] text-neutral-500 dark:text-neutral-400 sm:ml-3 sm:mt-0 sm:inline-block"
            variants={FADE_UP}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
          >
            Experiments &amp; playground projects
          </motion.span>
        </motion.p>
      </div>

      {/* bento grid — empty cards, dashed neutral border, filled later.
          Fits the site's standard 540px column: 2 columns stacking to 1 below
          sm, so the wide Figma layout composes within the container. */}
      <div className="mt-10 w-full max-w-[540px] px-6 pb-36">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr]">
          {cards.map((c, i) => {
            const Span = c.span ?? "span 1";
            return (
              <motion.div
                key={i}
                className={`relative overflow-hidden rounded-2xl ${Span}`}
                variants={FADE_UP}
                initial={reduce ? false : "hidden"}
                animate="visible"
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 + i * 0.08 }}
              >
                <video
                  src={c.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  draggable={false}
                  className="block w-full opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100"
                  style={{ aspectRatio: c.aspect }}
                  // the page is prerendered, so the video can finish loading
                  // before hydration attaches listeners — check readyState on
                  // mount too, otherwise a missed event leaves it invisible
                  ref={(el) => {
                    if (el && el.readyState >= 2) el.dataset.ready = "true";
                  }}
                  onLoadedData={(e) => {
                    e.currentTarget.dataset.ready = "true";
                  }}
                />
                {c.href ? (
                <div className="absolute bottom-4 right-4">
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open live site"
                    className="group flex size-10 items-center justify-center rounded-full bg-white/80 text-black shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-[transform,background-color] duration-300 ease-out hover:scale-105 hover:bg-white active:scale-95"
                  >
                    <svg viewBox="0 0 256 256" className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden fill="none" stroke="currentColor" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="64" y1="192" x2="192" y2="64" />
                      <polyline points="88 64 192 64 192 168" />
                    </svg>
                  </a>
                </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* progressive blur at the bottom, matching home/work pages */}
      <ProgressiveBlur
        position="bottom"
        height="180px"
        className="fixed"
        blurLevels={[0.5, 1, 2, 4, 8, 16, 24, 32]}
      />
    </main>
  );
}

// aspect = the video's own width / height, so the card reserves its space
// before the video loads instead of collapsing and jumping
const cards: { span?: string; src: string; href?: string; aspect: string }[] = [
  { span: "col-span-2", src: "/craft-hero.mp4", href: "https://resumio-two.vercel.app/", aspect: "960 / 526" },
  { span: "col-span-2", src: "/craft-fitness-app.mp4", href: "https://interview-crack-pearl.vercel.app/", aspect: "1906 / 1038" },
  { span: "col-span-2", src: "/craft-globalbank.mp4", href: "https://globalbank-bento.vercel.app/", aspect: "1920 / 1050" },
];