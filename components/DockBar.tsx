"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, type SVGProps } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Dock, DockItem } from "@/components/motion/dock";
import { WelcomeDoneContext } from "@/components/WelcomeDoneContext";

// Phosphor icons (Shakib's picks) for the dock. Stroke weight 16 on a 256
// viewBox is proportionally identical to the lucide icons' 1.5 on 24, so line
// weights match; duotone shades use fill="currentColor" to theme in dark mode.
function PhosphorGlyph({ strokeWidth: _strokeWidth, children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function HomeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <PhosphorGlyph {...props}>
      <path
        d="M133.66,34.34a8,8,0,0,0-11.32,0L40,116.69V216h64V152h48v64h64V116.69Z"
        fill="currentColor"
        stroke="none"
        opacity="0.2"
      />
      <line x1="16" y1="216" x2="240" y2="216" />
      <polyline points="152 216 152 152 104 152 104 216" />
      <line x1="40" y1="116.69" x2="40" y2="216" />
      <line x1="216" y1="216" x2="216" y2="116.69" />
      <path d="M24,132.69l98.34-98.35a8,8,0,0,1,11.32,0L232,132.69" />
    </PhosphorGlyph>
  );
}

function WorkGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <PhosphorGlyph {...props}>
      <path
        d="M128,160,40,113.07h0v53.22a8,8,0,0,0,2,5.31c11.3,12.59,38.9,36.4,86,36.4s74.68-23.81,86-36.4a8,8,0,0,0,2-5.31V113.07Z"
        fill="currentColor"
        stroke="none"
        opacity="0.2"
      />
      <polygon points="8 96 128 32 248 96 128 160 8 96" />
      <polyline points="128 96 184 125.87 184 240" />
      <path d="M216,113.07v53.22a8,8,0,0,1-2,5.31c-11.3,12.59-38.9,36.4-86,36.4s-74.68-23.81-86-36.4a8,8,0,0,1-2-5.31V113.07" />
    </PhosphorGlyph>
  );
}

function PlaygroundGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <PhosphorGlyph {...props}>
      <path
        d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z"
        fill="currentColor"
        stroke="none"
        opacity="0.2"
      />
      <path d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z" />
      <line x1="176" y1="16" x2="176" y2="64" />
      <line x1="224" y1="72" x2="224" y2="104" />
      <line x1="152" y1="40" x2="200" y2="40" />
      <line x1="208" y1="88" x2="240" y2="88" />
    </PhosphorGlyph>
  );
}

function SkillsGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <PhosphorGlyph {...props}>
      <polygon
        points="160 16 144 96 208 120 96 240 112 160 48 136 160 16"
        fill="currentColor"
        stroke="none"
        opacity="0.2"
      />
      <polygon points="160 16 144 96 208 120 96 240 112 160 48 136 160 16" />
    </PhosphorGlyph>
  );
}

const NAV = [
  { label: "Home", href: "/", Icon: HomeGlyph },
  { label: "Work", href: "/work", Icon: WorkGlyph },
  { label: "Playground", href: "/playground", Icon: PlaygroundGlyph },
  { label: "Skills", href: "/skills", Icon: SkillsGlyph },
];

export function DockBar() {
  const pathname = usePathname();
  // undefined outside the home page's WelcomeGate → don't wait for the loader
  const welcomeDone = useContext(WelcomeDoneContext);
  const reduce = useReducedMotion() ?? false;
  const shown = welcomeDone !== false;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center"
      initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={
        shown
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 14, filter: "blur(6px)" }
      }
      transition={{ duration: 0.45, ease: "easeOut", delay: welcomeDone === undefined ? 0 : 0.7 }}
    >
      <div className="pointer-events-auto">
        {/* border-0: site is fill-only; light skin per Shakib's .container export
            (white pill + 44/72.5 drop shadow), dark keeps the #2a2a2a surface */}
        <Dock
          size={49}
          className="rounded-full border-0 bg-white px-4 shadow-[0_44px_72.5px_rgba(0,0,0,0.15)] dark:bg-[#1d1d1d]"
        >
          {NAV.map(({ label, href, Icon }) => {
            const active = pathname === href;
            return (
              <DockItem key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex size-full flex-col items-center justify-center gap-[3px] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
                  <span className="whitespace-nowrap text-[10px] leading-none">{label}</span>
                </Link>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </motion.div>
  );
}
