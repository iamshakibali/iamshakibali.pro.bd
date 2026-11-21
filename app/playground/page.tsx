"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";
import { ProgressiveBlur } from "@/registry/magicui/progressive-blur";
import { CraftVideoCard } from "@/components/CraftVideoCard";
import { craftItems } from "@/lib/craft";

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
          {craftItems.map((c, i) => {
            const Span = "col-span-2";
            return (
              <motion.div
                key={i}
                className={`relative overflow-hidden rounded-2xl ${Span}`}
                variants={FADE_UP}
                initial={reduce ? false : "hidden"}
                animate="visible"
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 + i * 0.08 }}
              >
                <CraftVideoCard src={c.src} href={c.href} aspect={c.aspect} />
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
