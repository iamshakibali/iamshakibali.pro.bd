"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SPRING_LAYOUT } from "@/lib/ease";
import { content } from "@/lib/content";

// one shared pill glides between rows (dock pattern) instead of each row
// flashing its own background — seamless when the cursor moves up/down
const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function ArchiveSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="w-full" onMouseLeave={() => setHovered(null)}>
      <h2 className="text-[13px] leading-[19.5px] text-neutral-500 dark:text-neutral-400">
        Fun Experiment
      </h2>

      <div
        className={`mt-[14px] border-t border-dashed transition-colors duration-500 ${EASE} ${
          hovered === content.archive[0]?.name ? "border-transparent" : "border-neutral-200 dark:border-neutral-800"
        }`}
      >
        {content.archive.map((item, i) => {
          // the line between two rows belongs to the row above; hide it when
          // either neighbor is hovered so the pill floats on a clean gap
          const lineHidden = hovered === item.name || hovered === content.archive[i + 1]?.name;
          return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(item.name)}
            className={`group relative grid grid-cols-[55px_1fr] items-center border-b border-dashed py-[7px] pr-[10.5px] transition-colors duration-500 ${EASE} ${
              lineHidden ? "border-transparent" : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <AnimatePresence>
              {hovered === item.name && (
                <motion.span
                  layoutId="archive-hover-pill"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  className="absolute inset-0 -z-10 rounded-lg bg-neutral-200/70 dark:bg-neutral-800/60"
                />
              )}
            </AnimatePresence>
            <span className="pl-[10.5px] text-[13px] leading-[19.5px] text-neutral-500 dark:text-neutral-400">
              {item.year}
            </span>
            <span className="flex min-w-0 items-center gap-[7px]">
              <span className="shrink-0 text-[14px] font-medium leading-[19.5px] text-black dark:text-white">
                {item.name}
              </span>
              {/* descriptions dim with age, per design; hover lifts them to full */}
              <span
                className={`truncate font-mono text-[13px] leading-[19.5px] text-neutral-500 opacity-(--row-o) transition-opacity duration-500 group-hover:opacity-100 dark:text-neutral-400 ${EASE}`}
                style={{ "--row-o": 1 - i * 0.1 } as CSSProperties}
              >
                {item.description}
              </span>
              <span className={`ml-auto size-[12.25px] shrink-0 text-black opacity-50 transition-all duration-500 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:opacity-100 dark:text-white ${EASE}`}>
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
          </a>
          );
        })}
      </div>
    </section>
  );
}
