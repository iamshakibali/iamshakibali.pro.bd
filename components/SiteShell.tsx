"use client";

import { CoordinateProvider, useCoordinates } from "@/components/Hero/CoordinateTracker";
import { HeaderBar } from "@/components/Hero/HeaderBar";

function Shell({ children }: { children: React.ReactNode }) {
  const { handleMouseMove } = useCoordinates();
  return (
    <div className="flex min-h-screen flex-col" onMouseMove={handleMouseMove}>
      <HeaderBar />
      {children}
    </div>
  );
}

// Permanent chrome (header) + cursor tracking live above every page; only
// {children} swaps on navigation, so the header never remounts or replays.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CoordinateProvider>
      <Shell>{children}</Shell>
    </CoordinateProvider>
  );
}
