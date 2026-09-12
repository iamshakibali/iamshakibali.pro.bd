"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";
import { ProgressiveBlur } from "@/registry/magicui/progressive-blur";

const FADE_UP = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
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
      <div className="mt-10 w-full max-w-[540px] px-6 pb-24">
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
                    src="/craft-hero.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    draggable={false}
                    className="w-full"
                  />
                {/* overlay gradient + text */}
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.05)_65%,transparent_90%)] pb-4 pl-5 pt-28 pointer-events-none">
                  <a
                    href="https://resumio-two.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto group relative flex items-center gap-[5px] text-white"
                  >
                    <span className="relative text-sm font-medium">
                      Live View
                      <span className="absolute -bottom-[2px] left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </span>
                    <svg viewBox="0 0 256 256" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="64" y1="192" x2="192" y2="64" />
                      <polyline points="88 64 192 64 192 168" />
                    </svg>
                  </a>
                </div>
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

const cards: { span?: string }[] = [
  { span: "col-span-2" },
];