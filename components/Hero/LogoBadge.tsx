"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const CARD_W = 200; // default card width — override per badge with the `width` prop

// TEMP: hover popup disabled for review — flip to true to re-enable
const POPUP_ENABLED = true;

export function LogoBadge({
  id,
  label,
  src,
  href,
  videoSrc,
  width,
  popup = true,
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
  videoSrc?: string;
  width?: number;
  popup?: boolean;
  active: boolean;
  dimmed: boolean;
  onHoverChange: (id: string | null) => void;
  className?: string;
  imgClassName?: string;
  children: React.ReactNode;
}) {
  const cardW = width ?? CARD_W;
  const cardHalf = cardW / 2;
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  // popup lives in a body portal (a <div> may not nest inside the bio <p>);
  // pos is viewport coords — y anchors 12px above the badge, card is translateY(-100%)
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => setMounted(true), []);

  // start playback only once the open animation (longest: 240ms filter) has finished
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    if (!active) {
      v.pause();
      v.currentTime = 0;
      return;
    }
    const t = setTimeout(() => v.play().catch(() => {}), 240);
    return () => clearTimeout(t);
  }, [active, videoSrc]);

  const getPos = (e: React.MouseEvent) => {
    const r = wrapperRef.current?.getBoundingClientRect();
    if (!r) return;
    const clamped = Math.min(Math.max(e.clientX, cardHalf + 12), document.documentElement.clientWidth - cardHalf - 12);
    setPos({ x: clamped - cardHalf, y: r.top - 12 });
  };

  // keep the fixed popup glued to the badge while scrolling/resizing with it open
  useEffect(() => {
    if (!active) return;
    const reanchor = () => {
      const r = wrapperRef.current?.getBoundingClientRect();
      if (r) setPos((p) => ({ ...p, y: r.top - 12 }));
    };
    window.addEventListener("scroll", reanchor, { passive: true });
    window.addEventListener("resize", reanchor);
    return () => {
      window.removeEventListener("scroll", reanchor);
      window.removeEventListener("resize", reanchor);
    };
  }, [active]);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        ref={wrapperRef}
        className={`relative cursor-pointer transition-[filter] duration-300 ${dimmed ? "blur-[8px]" : ""} ${className}`}
        onMouseEnter={(e) => { if (!popup) return; getPos(e); onHoverChange(id); }}
        onMouseMove={getPos}
        onMouseLeave={() => { if (!popup) return; onHoverChange(null); }}
      >
        {children}
      </a>
      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed left-0 z-20"
            style={{ top: pos.y, transform: "translateY(-100%)" }}
          >
            <AnimatePresence>
              {POPUP_ENABLED && popup && active && (
                <motion.div
                  initial={{ opacity: 0, y: 16, filter: "blur(12px)", x: pos.x }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", x: pos.x }}
                  exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  transition={{
                    opacity: { duration: 0.2, ease: "easeOut" },
                    y: { duration: 0.2, ease: "easeOut" },
                    filter: { duration: 0.24, ease: "easeOut" },
                    x: { type: "tween", duration: 0.16, ease: "easeOut" },
                  }}
                  style={{ width: cardW }}
                >
                  <div className={`w-full overflow-hidden rounded-[5px] bg-white shadow-[0px_53px_79px_rgba(0,0,0,0.25)] dark:bg-zinc-900 ${videoSrc ? "" : "h-[118px]"}`}>
                    {videoSrc && (
                      <video ref={videoRef} src={videoSrc} loop muted playsInline draggable={false} className="block w-full" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
}
