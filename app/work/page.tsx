"use client";

import { content } from "@/lib/content";
import { Infinity as InfinityIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";

// same entrance the hero description uses
const FADE_UP = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function WorkPage() {
  const reduce = useReducedMotion() ?? false;
  return (
    <main className="flex flex-1 flex-col items-center justify-start bg-background text-foreground">
      <div className="flex w-full flex-1 flex-col items-center justify-start px-6 pb-20 pt-16">
        <div className="flex w-full max-w-[540px] flex-col gap-[25px]">
        {/* Heading — hero greeting treatment, bumped a size; fades up + unblurs
            on mount, so it plays when arriving via the dock */}
        <motion.p
          className="text-[24px] font-medium leading-none text-foreground"
          style={{ fontFamily: "var(--font-overused-grotesk)" }}
          initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <TextScramble text="Experience" />
          <motion.span
            className="ml-3 inline-block font-mono text-[12px] font-light tracking-[-0.3px] text-neutral-500 dark:text-neutral-400"
            variants={FADE_UP}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
          >
            Where I&apos;ve worked &amp; what I&apos;ve built
          </motion.span>
        </motion.p>

        {content.experience.map((job) => (
          <section key={job.company} className="w-full">
            {/* Company row */}
            <motion.div
              className="flex items-center gap-3"
              variants={FADE_UP}
              initial={reduce ? false : "hidden"}
              animate="visible"
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img src={job.logo} alt="" width={24} height={24} draggable={false} className="size-6 transition-opacity hover:opacity-70 dark:invert" />
              </a>
              <div className="relative h-6 min-w-0 flex-1">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-0 top-0 whitespace-nowrap text-[20px] leading-6 transition-opacity hover:opacity-70"
                  style={{ fontFamily: "var(--font-overused-grotesk)" }}
                >
                  {job.company}
                </a>
                <span className="absolute right-0 top-1 hidden items-center whitespace-nowrap text-sm text-neutral-500 sm:flex dark:text-neutral-400">
                  {job.location}
                  <span className="ml-1.5">{job.locationNote}</span>
                  <span aria-hidden className="relative ml-2.5 inline-block size-2.5">
                    <span className="absolute -inset-1 animate-ping rounded-full bg-foreground/10 motion-reduce:hidden" />
                    <span className="absolute -inset-1 rounded-full bg-foreground/10" />
                    <span className="absolute inset-[2px] rounded-full bg-foreground" />
                  </span>
                </span>
              </div>
            </motion.div>

            {/* Timeline rail + entry — tile left-aligns with the company logo,
                rail runs the tile's center, ends at the tag row with a curl */}
            <div className="relative mt-4">
              <motion.span
                aria-hidden
                className="absolute left-3 top-0 h-[calc(100%-18px)] w-px bg-neutral-300 dark:bg-neutral-700"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
              />
              <motion.span
                aria-hidden
                className="absolute bottom-[18px] left-3 size-4 rounded-bl-[4px] border-b border-l border-neutral-300 dark:border-neutral-700"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
              />
              <div>
                {/* Role row */}
                <motion.div
                  className="flex items-start justify-between gap-3"
                  variants={FADE_UP}
                  initial={reduce ? false : "hidden"}
                  animate="visible"
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="relative flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 shadow-[0_0_0_1px_#ffffff,0_0_0_2px_rgba(228,228,231,0.5)] dark:bg-neutral-900 dark:shadow-[0_0_0_1px_#0a0a0a,0_0_0_2px_rgba(255,255,255,0.08)]">
                      <svg
                        viewBox="0 0 256 256"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={16}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4 text-neutral-500"
                        aria-hidden="true"
                      >
                        <polyline points="64 88 16 128 64 168" />
                        <polyline points="192 88 240 128 192 168" />
                        <line x1="160" y1="40" x2="96" y2="216" />
                      </svg>
                    </span>
                    <p className="text-base font-medium leading-6 text-foreground">{job.role}</p>
                  </div>
                </motion.div>

                {/* Meta line */}
                <motion.div
                  className="ml-9 mt-1 flex items-center gap-2 text-sm leading-5 text-neutral-500 dark:text-neutral-400"
                  variants={FADE_UP}
                  initial={reduce ? false : "hidden"}
                  animate="visible"
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.29 }}
                >
                  <span>{job.type}</span>
                  <span aria-hidden className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                  <span>{job.start}</span>
                  <span aria-hidden className="font-mono">—</span>
                  {job.end ? (
                    <span>{job.end}</span>
                  ) : (
                    <InfinityIcon className="size-[18px]" strokeWidth={1.333} />
                  )}
                  <span aria-hidden className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                  <span>{job.duration}</span>
                </motion.div>

                {/* Bullets */}
                <ul className="ml-[27px] mt-3 space-y-[7.5px]">
                  {job.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      className="flex items-start gap-1.5 text-[15px] leading-6 text-neutral-500 dark:text-neutral-400"
                      variants={FADE_UP}
                      initial={reduce ? false : "hidden"}
                      animate="visible"
                      transition={{ duration: 0.45, ease: "easeOut", delay: 0.36 + i * 0.07 }}
                    >
                      <span aria-hidden className="flex w-[15px] shrink-0 justify-end text-[rgba(9,9,11,0.25)] dark:text-white/25">•</span>
                      <span className="whitespace-pre-line">{h}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                <motion.div
                  className="ml-9 mt-3 flex flex-wrap gap-1.5 pb-2"
                  variants={FADE_UP}
                  initial={reduce ? false : "hidden"}
                  animate="visible"
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.36 + job.highlights.length * 0.07 + 0.05 }}
                >
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-1.5 py-0.5 font-mono text-xs leading-4 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
        ))}
        </div>
      </div>
    </main>
  );
}
