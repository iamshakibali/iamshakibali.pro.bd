"use client";

import { content } from "@/lib/content";
import { Infinity as InfinityIcon } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { TextScramble } from "@/components/motion/text-scramble";
import { ProgressiveBlur } from "@/registry/magicui/progressive-blur";

// same entrance the hero description uses
const FADE_UP = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function CodeGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="64 88 16 128 64 168" />
      <polyline points="192 88 240 128 192 168" />
      <line x1="160" y1="40" x2="96" y2="216" />
    </svg>
  );
}

function PenGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="184" y1="72" x2="32" y2="224" />
      <path d="M146.34,189.66a8,8,0,0,1-5.65,2.34H64V115.31a8,8,0,0,1,2.34-5.65L136.4,40.4a56,56,0,0,1,79.2,79.2Z" />
      <line x1="112" y1="64.52" x2="112" y2="144" />
      <line x1="136" y1="120" x2="215.2" y2="120" />
    </svg>
  );
}

const ENTRY_ICONS = {
  code: CodeGlyph,
  pen: PenGlyph,
};

// [[label|url]] inside a highlight renders as a slightly darker, clearly
// clickable link; everything else stays plain dim text
function renderHighlight(h: string) {
  return h.split(/(\[\[[^\]]+\]\])/g).map((part, i) => {
    const match = part.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    if (!match) return <span key={i}>{part}</span>;
    return (
      <a
        key={i}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-neutral-700 transition-colors hover:text-foreground dark:text-neutral-300 dark:hover:text-white"
      >
        {match[1]}
      </a>
    );
  });
}

export default function WorkPage() {
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
            className="mt-2 block font-mono text-[12px] font-light tracking-[-0.3px] text-neutral-500 dark:text-neutral-400 sm:ml-3 sm:mt-0 sm:inline-block"
            variants={FADE_UP}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.5 }}
          >
            Where I&apos;ve worked &amp; what I&apos;ve built
          </motion.span>
        </motion.p>

        {content.experience.map((job) => {
          const Icon = ENTRY_ICONS[job.icon];
          return (
          <section key={job.company} className="w-full">
            {/* Company row */}
            <motion.div
              className="flex items-center gap-3"
              variants={FADE_UP}
              initial={reduce ? false : "hidden"}
              animate="visible"
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            >
              <a
                href={job.url || undefined}
                target={job.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="shrink-0"
              >
                {job.logo.length > 0 ? (
                  <img src={job.logo} alt="" width={24} height={24} draggable={false} className={`size-6 rounded-full transition-opacity hover:opacity-70 ${job.logoInvert ? "dark:invert" : ""}`} />
                ) : (
                  <span className="flex size-6 items-center justify-center rounded-full bg-neutral-100 font-mono text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                    {job.company.charAt(0)}
                  </span>
                )}
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
                  {job.locationNote && <span className="ml-1.5">{job.locationNote}</span>}
                  {job.end === null && (
                    <span aria-hidden className="relative ml-2.5 inline-block size-2.5">
                      <span className="absolute -inset-1 animate-ping rounded-full bg-foreground/10 motion-reduce:hidden" />
                      <span className="absolute -inset-1 rounded-full bg-foreground/10" />
                      <span className="absolute inset-[2px] rounded-full bg-foreground" />
                    </span>
                  )}
                </span>
              </div>
            </motion.div>

            {/* Timeline rail + entry — tile left-aligns with the company logo,
                rail runs the tile's center, ends at the tag row with a curl */}
            <div className="relative mt-4">
              {/* rail ends exactly where the curl's arc begins (bottom offset
                  + radius), otherwise the line overshoots and forks the arc */}
              <motion.span
                aria-hidden
                className="absolute left-3 top-0 h-[calc(100%-26px)] w-px bg-neutral-300 dark:bg-neutral-700"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
              />
              <motion.span
                aria-hidden
                className="absolute bottom-[18px] left-3 size-4 rounded-bl-[8px] border-b border-l border-neutral-300 dark:border-neutral-700"
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
                      <Icon className="size-4 text-neutral-500" aria-hidden="true" />
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
                  {job.duration && (
                    <>
                      <span aria-hidden className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                      <span>{job.duration}</span>
                    </>
                  )}
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
                      <span className="whitespace-pre-line">{renderHighlight(h)}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                {job.tags.length > 0 && (
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
                )}
              </div>
            </div>
          </section>
          );
        })}
        </div>
      </motion.div>
{/* progressive blur at the bottom — exact mask values from magicui */}
<ProgressiveBlur
 position="bottom"
 height="180px"
 className="fixed"
 blurLevels={[0.5, 1, 2, 4, 8, 16, 24, 32]}
 />
    </main>
  );
}
