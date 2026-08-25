"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { WelcomeLoader } from "@/components/WelcomeLoader";
import { WelcomeDoneContext } from "@/components/WelcomeDoneContext";

// module scope: survives client-side route changes but resets on a real page
// load — the loader plays once per load, not again when the dock navigates
// back to Home (which remounts this gate and otherwise reads as a refresh)
let playedThisLoad = false;

export function WelcomeGate({ children }: { children: React.ReactNode }) {
  // intentional: the welcome loader plays on every page load
  const [show, setShow] = useState(!playedThisLoad);

  useEffect(() => {
    if (!show) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleComplete = () => {
    playedThisLoad = true;
    setShow(false);
  };

  return (
    <WelcomeDoneContext.Provider value={!show}>
      <AnimatePresence>
        {show && <WelcomeLoader key="welcome" onComplete={handleComplete} />}
      </AnimatePresence>
      <div className={show ? "invisible" : undefined}>{children}</div>
      {show && (
        <style dangerouslySetInnerHTML={{ __html: `html{overflow:hidden}` }} />
      )}
    </WelcomeDoneContext.Provider>
  );
}
