import type { ReactNode } from "react";
import { content } from "@/lib/content";

// snapshot of the build at time of writing — refresh on big deploys
const BUILD = "8951cdd";
const BUILD_DATE = "2026-08-26";

// brand glyphs inlined so the icons inherit the anchor's text color
// (<img> would pin currentColor to black); all four are
// user-pasted Phosphor stroke glyphs (256 viewBox, stroke attrs on <g>)
type SocialGlyph = { viewBox: string; node: ReactNode };
const SOCIAL_ICONS: Record<string, SocialGlyph> = {
  Behance: {
    viewBox: "0 0 256 256",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M119.83,56A52,52,0,0,0,76,32a51.92,51.92,0,0,0-3.49,44.7A49.28,49.28,0,0,0,64,104v8a48,48,0,0,0,48,48h48a48,48,0,0,0,48-48v-8a49.28,49.28,0,0,0-8.51-27.3A51.92,51.92,0,0,0,196,32a52,52,0,0,0-43.83,24Z" />
        <path d="M104,232V192a32,32,0,0,1,32-32h0a32,32,0,0,1,32,32v40" />
        <path d="M104,208H72a32,32,0,0,1-32-32A32,32,0,0,0,8,144" />
      </g>
    ),
  },
  Dribbble: {
    viewBox: "0 0 256 256",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <polygon points="48 40 96 40 208 216 160 216 48 40" />
        <line x1="113.88" y1="143.53" x2="48" y2="216" />
        <line x1="208" y1="40" x2="142.12" y2="112.47" />
      </g>
    ),
  },
  Medium: {
    viewBox: "0 0 256 256",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="128" r="96" />
        <path d="M168,88H152a24,24,0,0,0-24,24V224" />
        <line x1="96" y1="144" x2="160" y2="144" />
      </g>
    ),
  },
  YouTube: {
    viewBox: "0 0 256 256",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <polygon points="160 128 112 96 112 160 160 128" />
        <path d="M24,128c0,29.91,3.07,47.45,5.41,56.47A16,16,0,0,0,39,195.42C72.52,208.35,128,208,128,208s55.48.35,89-12.58a16,16,0,0,0,9.63-10.95c2.34-9,5.41-26.56,5.41-56.47s-3.07-47.45-5.41-56.47a16,16,0,0,0-9.63-11C183.48,47.65,128,48,128,48s-55.48-.35-89,12.58a16,16,0,0,0-9.63,11C27.07,80.54,24,98.09,24,128Z" />
      </g>
    ),
  },
  Claude: {
    viewBox: "0 0 24 24",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path d="m12.5 12.5l1-9.5m-1 9.5l6-7.5m-6 7.5l8.5-2m-8.5 2L21 14m-8.5-1.5l7 6m-7-6L17 20m-4.5-7.5l-1 8.5m1-8.5L7 20m5.5-7.5L5 17m7.5-4.5L3 12m9.5.5l-8-6m8 6L7.5 3" />
      </g>
    ),
  },
  ChatGPT: {
    viewBox: "0 0 256 256",
    node: (
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M104,141.86V77.19L148.5,51.5a48,48,0,0,1,66.4,64.08" />
        <path d="M128,155.71,72,123.38V72a48,48,0,0,1,88.69-25.47" />
        <path d="M152,141.86,96,174.19,51.5,148.5A48,48,0,0,1,73.79,59" />
        <path d="M152,114.14v64.67L107.5,204.5a48,48,0,0,1-66.4-64.08" />
        <path d="M128,100.29l56,32.33V184a48,48,0,0,1-88.69,25.47" />
        <path d="M104,114.14l56-32.33,44.5,25.69a48,48,0,0,1-22.29,89.55" />
      </g>
    ),
  },
};

const STACK = ["next@16.3.1", "react@19.2.8", "tailwindcss@4"];
const LIBRARIES = ["motion@13.1.0", "three@0.185.1", "@phosphor-icons/react"];

function Term({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase leading-[16px] tracking-[0.5px] text-neutral-500 dark:text-neutral-400">
      {children}
    </span>
  );
}

function Value({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "font-mono text-[14px] leading-[20px] text-foreground";
  if (!href) return <span className={cls}>{children}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} underline decoration-foreground/40 underline-offset-2`}
    >
      {children}
    </a>
  );
}

// each cell draws its own right/bottom dashed edge; the grid container draws
// top/left — every hairline renders exactly once, at any column span
const CELL =
  "flex flex-col gap-1 border-b border-r border-dashed border-neutral-200 bg-background px-4 py-3 dark:border-neutral-800";

function StackList({ term, items, className = "" }: { term: string; items: string[]; className?: string }) {
  return (
    <div className={`${CELL} ${className}`}>
      <Term>{term}</Term>
      <div className="flex flex-col gap-[2px]">
        {items.map((item) => (
          <Value key={item}>{item}</Value>
        ))}
      </div>
    </div>
  );
}

export function ColophonSection() {
  return (
    <section className="w-full">
      <div className="flex items-baseline justify-between gap-4 text-[14px] leading-[20px]">
        <span className="font-mono font-medium text-foreground">iamshakibali.pro.bd</span>
        <span className="text-right text-[10px] text-neutral-500 dark:text-neutral-400">Product Design Engineer.</span>
      </div>

      {/* dashed hairline grid: container draws top/left, each cell its own
          right/bottom edge — every line renders once, at any column span */}
      <div className="mt-[14px] grid grid-cols-2 overflow-hidden rounded-lg border-t border-l border-dashed border-neutral-200 lg:grid-cols-4 dark:border-neutral-800">
        <div className={CELL}>
          <Term>Crafted by</Term>
          <Value href="https://x.com/iamshakibali">@iamshakibali</Value>
        </div>
        <div className={CELL}>
          <Term>Build</Term>
          <Value>{BUILD}</Value>
        </div>
        <div className={CELL}>
          <Term>Date</Term>
          <Value>{BUILD_DATE}</Value>
        </div>
        <div className={CELL}>
          <Term>Registry</Term>
          <Value>1 item</Value>
        </div>
        <div className={CELL}>
          <Term>Deployed on</Term>
          <Value>GitHub Pages</Value>
        </div>
        <div className={CELL}>
          <Term>Source code</Term>
          <Value href="https://github.com/iamshakibali">GitHub</Value>
        </div>
        <div className={CELL}>
          <Term>Domain</Term>
          <Value>iamshakibali</Value>
        </div>
        <div className={CELL}>
          <Term>Typeface</Term>
          <Value>Geist</Value>
        </div>
        <StackList term="Stack" items={STACK} className="col-span-2 lg:col-span-2" />
        <StackList term="Libraries" items={LIBRARIES} className="col-span-2 lg:col-span-2" />
      </div>

      {/* bottom bar: credit block left, socials right (inline glyphs) */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-col gap-[2px] font-mono text-[13px] leading-[18px] text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            Designed &amp; Made with
            <svg viewBox="0 0 256 256" className="size-3" aria-hidden>
              <path
                d="M128,224S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32a54,54,0,0,1,54,54C232,168,128,224,128,224Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
          </span>
          <span className="text-xs">© 2026 Shakib. All rights reserved.</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {content.socials
            .filter((s) => s.label !== "YouTube")
            .map((s, i, list) => {
              const glyph = SOCIAL_ICONS[s.label];
              return (
                <span key={s.label} className="flex items-center gap-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="size-4 text-neutral-500 transition-colors duration-300 hover:text-foreground dark:text-neutral-400"
                  >
                    <svg viewBox={glyph.viewBox} className="size-full" aria-hidden>
                      {glyph.node}
                    </svg>
                  </a>
                  {i < list.length - 1 && (
                    <span aria-hidden className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                  )}
                </span>
              );
            })}
        </div>
      </div>
    </section>
  );
}
