import type { ReactNode } from "react";
import { content } from "@/lib/content";

// inline Phosphor glyphs so the icon inherits currentColor and dim→full hover
// actually works (an <img> SVG can't be tinted by the pill's text color).
type Glyph = { viewBox: string; node: ReactNode };
const GLYPHS: Record<string, Glyph> = {
  CV: {
    viewBox: "0 0 256 256",
    node: <path d="M210.78,39.25l-130.25-23A16,16,0,0,0,62,29.23l-29.75,169a16,16,0,0,0,13,18.53l130.25,23a16,16,0,0,0,18.54-13l29.75-169A16,16,0,0,0,210.78,39.25ZM135.5,131.56a8,8,0,0,1-7.87,6.61,8.27,8.27,0,0,1-1.4-.12l-41.5-7.33A8,8,0,0,1,87.52,115L129,122.29A8,8,0,0,1,135.5,131.56Zm47-24.18a8,8,0,0,1-7.86,6.61,7.55,7.55,0,0,1-1.41-.13l-83-14.65a8,8,0,0,1,2.79-15.76l83,14.66A8,8,0,0,1,182.53,107.38Zm5.55-31.52a8,8,0,0,1-7.87,6.61,8.36,8.36,0,0,1-1.4-.12l-83-14.66a8,8,0,1,1,2.78-15.75l83,14.65A8,8,0,0,1,188.08,75.86Z" />,
  },
  Behance: {
    viewBox: "0 0 256 256",
    node: <path d="M92,120H64V96H92a12,12,0,0,1,0,24Zm4,16H64v32H96a16,16,0,0,0,0-32Zm80-16a24,24,0,0,0-22.62,16h45.24A24,24,0,0,0,176,120Zm64-64V200a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V56A16,16,0,0,1,32,40H224A16,16,0,0,1,240,56ZM144,88a8,8,0,0,0,8,8h48a8,8,0,0,0,0-16H152A8,8,0,0,0,144,88Zm-16,64a32,32,0,0,0-14.13-26.53A28,28,0,0,0,92,80H56a8,8,0,0,0-8,8v88a8,8,0,0,0,8,8H96A32,32,0,0,0,128,152Zm88-8a40,40,0,1,0-13.54,30,8,8,0,0,0-10.59-12,24,24,0,0,1-38.49-10H208A8,8,0,0,0,216,144Z" />,
  },
  Dribbble: {
    viewBox: "0 0 256 256",
    node: <path d="M93.27,36.86a4,4,0,0,1,.82-7.19,103.94,103.94,0,0,1,88.66,9.95,4,4,0,0,1,1,5.87,153.32,153.32,0,0,1-41.89,37A169.43,169.43,0,0,0,93.27,36.86ZM127.58,90a153,153,0,0,0-56-46.91,3.94,3.94,0,0,0-4,.33,104.41,104.41,0,0,0-38.34,52,4,4,0,0,0,3,5.16A152.34,152.34,0,0,0,64,104,151,151,0,0,0,127.58,90Zm103.8,26.69A103.81,103.81,0,0,0,202.19,55.2a4,4,0,0,0-6,.34,169.15,169.15,0,0,1-45.69,40.4,167.73,167.73,0,0,1,13.55,29.9A167.64,167.64,0,0,1,208,120,169.35,169.35,0,0,1,227,121.07,4,4,0,0,0,231.38,116.72Zm-62.91,24.5a167.7,167.7,0,0,1,4.45,38.47,168,168,0,0,1-4.11,36.85A4,4,0,0,0,174.5,221a104.25,104.25,0,0,0,56.57-79.25,4,4,0,0,0-3.49-4.49,152.44,152.44,0,0,0-59.11,4Zm-19.64-10.45a151.76,151.76,0,0,0-12.39-27.21A167,167,0,0,1,64,120a168.4,168.4,0,0,1-34.88-3.65,4,4,0,0,0-4.81,3.56q-.31,4-.32,8.09a103.72,103.72,0,0,0,33,75.91,4,4,0,0,0,6.15-.92A169,169,0,0,1,148.83,130.77ZM75.69,213.25a4,4,0,0,0,1.52,5.48,103.88,103.88,0,0,0,68.85,11.69,3.93,3.93,0,0,0,3.06-2.65,152.6,152.6,0,0,0,7.8-48.08,151.3,151.3,0,0,0-3.74-33.46A152.94,152.94,0,0,0,75.69,213.25Z" />,
  },
  Medium: {
    viewBox: "0 0 256 256",
    node: <path d="M136,128A64,64,0,1,1,72,64,64.07,64.07,0,0,1,136,128Zm48-64c-5.68,0-16.4,2.76-24.32,21.25C154.73,96.8,152,112,152,128s2.73,31.2,7.68,42.75C167.6,189.24,178.32,192,184,192s16.4-2.76,24.32-21.25C213.27,159.2,216,144,216,128s-2.73-31.2-7.68-42.75C200.4,66.76,189.68,64,184,64Zm56,0a8,8,0,0,0-8,8V184a8,8,0,0,0,16,0V72A8,8,0,0,0,240,64Z" />,
  },
  YouTube: {
    viewBox: "0 0 256 256",
    node: <path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z" />,
  },
};

// pill matching the site's own button style (motion/button pill variant:
// #e5e5e5 on light / #2a2a2a on dark), no drop shadow. The icon starts dim
// and fills to full color on hover via group-hover.
function LinkPill({ href, label, glyph }: { href: string; label: string; glyph: Glyph }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-auto shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#e5e5e5] px-[10px] py-[3px] text-[13px] leading-[18px] text-[#171717] transition-colors duration-300 hover:bg-[#d9d9d9] dark:bg-[#2a2a2a] dark:text-zinc-100 dark:hover:bg-[#333]"
    >
      <svg
        viewBox={glyph.viewBox}
        aria-hidden
        className="size-[12px] text-neutral-400 transition-colors duration-300 group-hover:text-[#171717] dark:text-neutral-500 dark:group-hover:text-zinc-100"
      >
        <g fill="currentColor">{glyph.node}</g>
      </svg>
      <span>{label}</span>
    </a>
  );
}

export function LinksLine() {
  // pill row is its own source: CV + the four brand links. Kept separate from
  // content.socials (which now drives the footer icons = Claude & ChatGPT).
  const pills: { label: string; url: string }[] = [
    { label: "Behance", url: "https://behance.net/iamshakibali" },
    { label: "Dribbble", url: "https://dribbble.com/iamshakibali" },
    { label: "Medium", url: "https://medium.com/@iamshakibali" },
    { label: "YouTube", url: "https://youtube.com/@iamshakibali" },
  ];
  return (
    <section className="w-full">
      <p className="text-[14px] leading-5 text-neutral-500 dark:text-neutral-400">
        You can check these{" "}
        <span className="font-medium text-foreground">links</span> if you wish to.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <LinkPill href={content.resumeUrl} label="CV" glyph={GLYPHS["CV"]} />
        {pills.map((s) => (
          <LinkPill key={s.label} href={s.url} label={s.label} glyph={GLYPHS[s.label]} />
        ))}
      </div>
    </section>
  );
}