"use client";

import { NumberTicker } from "@/components/motion/number";

const GAP = 3;
const COLS = 24;
// hero-sized cells — fills the 290px card's 258px content width (16px padding)
const CELL = (290 - 32 - (COLS - 1) * GAP) / COLS;

// same level palette as the hero graph (components/ContributionGraph.tsx)
const LEVEL_BG = [
  "bg-neutral-200 dark:bg-[#181818]",
  "bg-neutral-300 dark:bg-[#333]",
  "bg-neutral-400 dark:bg-[#666]",
  "bg-neutral-500 dark:bg-[#adadad]",
  "bg-neutral-900 dark:bg-white",
];

// hero palette; density weighted to visible levels 1–2 so the grid reads as a
// textured field (level 0 is invisible on the zinc-900 card in dark mode)
const GRID: string[] = [
  "1 0 1 2 1 0 2 1 0 1 2 1 0 2 1 0 3 1 0 2 1 0 1 2",
  "2 1 0 1 2 1 3 0 2 1 0 2 1 0 1 2 4 0 1 2 1 0 2 1",
  "1 2 1 0 1 2 0 1 2 3 1 0 2 1 0 1 4 2 0 1 2 1 0 1",
  "0 1 2 1 3 0 1 2 1 0 2 1 3 0 1 2 4 1 0 2 1 3 0 2",
  "1 0 1 2 0 1 2 1 0 3 1 2 0 1 2 1 3 0 2 1 0 1 2 0",
  "2 1 3 0 1 2 1 0 2 1 0 1 2 3 0 1 4 2 1 0 1 2 0 1",
  "0 2 1 0 2 1 0 1 1 2 1 0 1 0 2 1 0 1 2 1 0 2 1 0",
];

export function GitHubHoverCard() {
  return (
    <div className="flex h-[106px] w-full flex-col items-start">
      <div className="flex w-full items-center justify-between">
        <span className="size-[20px] shrink-0 text-[#525252] dark:text-white">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full"
          >
            <path
              d="M10 1.25C5.16797 1.25 1.25 5.26953 1.25 10.2227C1.25 14.1875 3.75781 17.5469 7.23437 18.7344C7.28906 18.7461 7.33594 18.75 7.38281 18.75C7.70703 18.75 7.83203 18.5117 7.83203 18.3047C7.83203 18.0898 7.82422 17.5273 7.82031 16.7773C7.49219 16.8516 7.19922 16.8828 6.9375 16.8828C5.25391 16.8828 4.87109 15.5742 4.87109 15.5742C4.47266 14.5391 3.89844 14.2617 3.89844 14.2617C3.13672 13.7266 3.89453 13.7109 3.95312 13.7109H3.95703C4.83594 13.7891 5.29688 14.6406 5.29688 14.6406C5.73438 15.4062 6.32031 15.6211 6.84375 15.6211C7.25391 15.6211 7.625 15.4883 7.84375 15.3867C7.92188 14.8086 8.14844 14.4141 8.39844 14.1875C6.45703 13.9609 4.41406 13.1914 4.41406 9.75391C4.41406 8.77344 4.75391 7.97266 5.3125 7.34766C5.22266 7.12109 4.92187 6.20703 5.39844 4.97266C5.39844 4.97266 5.46094 4.95313 5.59375 4.95313C5.91016 4.95313 6.625 5.07422 7.80469 5.89453C8.50391 5.69531 9.25 5.59766 9.99609 5.59375C10.7383 5.59766 11.4883 5.69531 12.1875 5.89453C13.3672 5.07422 14.082 4.95313 14.3984 4.95313C14.5313 4.95313 14.5938 4.97266 14.5938 4.97266C15.0703 6.20703 14.7695 7.12109 14.6797 7.34766C15.2383 7.97656 15.5781 8.77734 15.5781 9.75391C15.5781 13.1992 13.5313 13.957 11.582 14.1797C11.8945 14.457 12.1758 15.0039 12.1758 15.8398C12.1758 17.0391 12.1641 18.0078 12.1641 18.3008C12.1641 18.5117 12.2852 18.75 12.6094 18.75C12.6562 18.75 12.7109 18.7461 12.7656 18.7344C16.2461 17.5469 18.75 14.1836 18.75 10.2227C18.75 5.26953 14.832 1.25 10 1.25Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <p className="text-[12.8px] leading-[19.2px] tracking-[-0.256px] whitespace-nowrap">
          <span className="font-semibold text-[#262626] dark:text-zinc-100"><NumberTicker value={250} suffix="+" className="align-middle" /></span>
          <span className="font-normal text-[#737373] dark:text-zinc-400"> contributions in 2026</span>
        </p>
      </div>
      <div
        className="grid w-full pt-3"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: GAP }}
      >
        {GRID.flatMap((row, ri) =>
          row.split(/\s+/).filter(Boolean).map((level, i) => (
            <div
              key={`${ri}-${i}`}
              className={`rounded-[2px] ${LEVEL_BG[Number(level)]}`}
              style={{ width: CELL, height: CELL }}
            />
          )),
        )}
      </div>
    </div>
  );
}
