"use client";

import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  position?: "top" | "bottom" | "both";
  height?: string;
  blurLevels?: number[];
  className?: string;
}

/**
 * ProgressiveBlur — layered backdrop-filter blurs with mask gradients
 * that create a smooth fade-out at the edge of a scrollable container.
 * From magicui.design.
 */
export function ProgressiveBlur({
  position = "bottom",
  height = "30%",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  className,
}: ProgressiveBlurProps) {
  const middle = blurLevels.slice(1, -1);

  const getMaskGradient = (i: number) => {
    const start = (i + 1) * 12.5;
    const mid = (i + 2) * 12.5;
    const end = (i + 3) * 12.5;
    if (position === "bottom") {
      return `linear-gradient(to bottom, transparent ${start}%, black ${mid}%, black ${end}%, transparent ${end + 12.5}%)`;
    }
    if (position === "top") {
      return `linear-gradient(to top, transparent ${start}%, black ${mid}%, black ${end}%, transparent ${end + 12.5}%)`;
    }
    return `linear-gradient(transparent 0%, black 5%, black 95%, transparent 100%)`;
  };

  const firstMask = () => {
    if (position === "bottom") return `linear-gradient(to bottom, transparent 0%, black 12.5%, black 25%, transparent 37.5%)`;
    if (position === "top") return `linear-gradient(to top, transparent 0%, black 12.5%, black 25%, transparent 37.5%)`;
    return `linear-gradient(transparent 0%, black 5%, black 95%, transparent 100%)`;
  };

  const lastMask = () => {
    if (position === "bottom") return `linear-gradient(to bottom, transparent 87.5%, black 100%)`;
    if (position === "top") return `linear-gradient(to top, transparent 87.5%, black 100%)`;
    return `linear-gradient(transparent 0%, black 5%, black 95%, transparent 100%)`;
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10",
        position === "top" ? "top-0" : position === "bottom" ? "bottom-0" : "inset-y-0",
        className,
      )}
      style={{ height: position === "both" ? "100%" : height }}
    >
      {/* First layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: firstMask(),
          WebkitMaskImage: firstMask(),
        }}
      />
      {/* Middle layers */}
      {middle.map((blur, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            zIndex: i + 2,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: getMaskGradient(i),
            WebkitMaskImage: getMaskGradient(i),
          }}
        />
      ))}
      {/* Last layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage: lastMask(),
          WebkitMaskImage: lastMask(),
        }}
      />
    </div>
  );
}