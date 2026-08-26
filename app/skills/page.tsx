"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";
import { ProgressiveBlur } from "@/registry/magicui/progressive-blur";
import { content } from "@/lib/content";

// same entrance the work page heading uses
const FADE_UP = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function SkillsPage() {
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const pb = useTransform(scrollYProgress, [0.2, 1], ["40px", "300px"]);
  return (
    <main className="flex flex-1 flex-col items-center justify-start bg-background text-foreground">
      <motion.div
        className="relative flex w-full flex-1 flex-col items-center justify-start px-6 pt-16"
        style={{ paddingBottom: pb }}
      >
        <div className="flex w-full max-w-[540px] flex-col gap-[25px]">
          {/* Heading — same hero greeting treatment as the work page */}
          <motion.p
            className="text-[24px] font-medium leading-none text-foreground"
            style={{ fontFamily: "var(--font-overused-grotesk)" }}
            initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <TextScramble text="Tech Stack" />
            <motion.span
              className="mt-2 block font-mono text-[12px] font-light tracking-[-0.3px] text-neutral-500 dark:text-neutral-400 sm:ml-3 sm:mt-0 sm:inline-block"
              variants={FADE_UP}
              initial={reduce ? false : "hidden"}
              animate="visible"
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
            >
              Which I use? See below
            </motion.span>
          </motion.p>

          {/* Stack list — numbered rows with icon pills */}
          <motion.div
            variants={FADE_UP}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.6 }}
          >
            {content.skills.map((group, i) => (
              <div
                key={group.name}
                className={`grid grid-cols-1 gap-2 py-4 sm:grid-cols-[140px_1fr] ${
                  i < content.skills.length - 1
                    ? "border-b border-neutral-200/70 dark:border-neutral-800"
                    : ""
                }`}
              >
                <p className="flex items-baseline gap-2 text-[14px] leading-6">
                  <span className="font-mono text-neutral-400 dark:text-neutral-500">
                    {group.index}
                  </span>
                  <span className="text-black dark:text-white">{group.name}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item.name}
                      className="flex h-6 items-center gap-[5px] rounded-full bg-neutral-100 px-2 dark:bg-neutral-900/80"
                    >
                      <img
                        src={`/skills/${item.icon}.svg`}
                        alt=""
                        draggable={false}
                        className="size-[14px]"
                      />
                      <span className="font-mono text-[12px] leading-4 text-neutral-800 dark:text-neutral-100">
                        {item.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      {/* progressive blur at the bottom — same treatment as the work page */}
      <ProgressiveBlur
        position="bottom"
        height="180px"
        className="fixed"
        blurLevels={[0.5, 1, 2, 4, 8, 16, 24, 32]}
      />
    </main>
  );
}
