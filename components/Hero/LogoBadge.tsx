"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CARD_W = 290;
const CARD_HALF = CARD_W / 2;

// TEMP: hover popup disabled per user — flip to true to re-enable
const POPUP_ENABLED = false;

export function LogoBadge({
  id,
  label,
  src,
  href,
  active,
  dimmed,
  onHoverChange,
  className = "",
  imgClassName = "",
  children,
}: {
  id: string;
  label: string;
  src: string;
  href: string;
  active: boolean;
  dimmed: boolean;
  onHoverChange: (id: string | null) => void;
  className?: string;
  imgClassName?: string;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState(0);

  const getOffset = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return 0;
    const r = wrapperRef.current.getBoundingClientRect();
    const clamped = Math.min(Math.max(e.clientX, CARD_HALF + 12), document.documentElement.clientWidth - CARD_HALF - 12);
    return clamped - r.left - CARD_HALF;
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={wrapperRef}
      className={`relative cursor-pointer transition-[filter] duration-300 ${dimmed ? "blur-[8px]" : ""} ${className}`}
      onMouseEnter={(e) => { setOffset(getOffset(e)); onHoverChange(id); }}
      onMouseMove={(e) => setOffset(getOffset(e))}
      onMouseLeave={() => onHoverChange(null)}
    >
      {children}
      <AnimatePresence>
        {POPUP_ENABLED && active && (
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(12px)", x: offset }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", x: offset }}
            exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            transition={{
              opacity: { duration: 0.2, ease: "easeOut" },
              y: { duration: 0.2, ease: "easeOut" },
              filter: { duration: 0.24, ease: "easeOut" },
              x: { type: "tween", duration: 0.16, ease: "easeOut" },
            }}
            className="pointer-events-none absolute bottom-full left-0 z-20 mb-3 w-[290px]"
          >
            <div className="flex h-[118px] w-full items-center gap-3 rounded-[10px] bg-white px-4 shadow-[0px_53px_79px_rgba(0,0,0,0.25)] dark:bg-zinc-900">
              <img src={src} alt="" draggable={false} className={`h-8 w-8 shrink-0 object-contain ${imgClassName}`} />
              <div>
                <p className="text-[13px] font-semibold text-[#262626] dark:text-zinc-100">{label}</p>
                <p className="text-[12px] text-[#737373] dark:text-zinc-400">More coming soon</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
}
