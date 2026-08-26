"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "hasSeenWelcome";
const LoaderContext = createContext(false);

export function useLoaderDone() {
  return useContext(LoaderContext);
}

function InlineScript() {
  const html = `(function(){try{var v=sessionStorage.getItem("${STORAGE_KEY}");if(v)document.documentElement.setAttribute("data-loader","seen")}catch(e){}})()`;
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function LoaderGate({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  useLayoutEffect(() => {
    try {
      const v = sessionStorage.getItem(STORAGE_KEY);
      if (v && !done) setDone(true);
    } catch {}
  }, [done]);

  useEffect(() => {
    if (done) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = "";
    };
  }, [done]);

  const markDone = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setDone(true);
  };

  return (
    <>
      <InlineScript />
      <LoaderContext.Provider value={done}>{children}</LoaderContext.Provider>
      {/* expose markDone via context if needed — WelcomeLoader calls it */}
      <span hidden data-loader-done={done ? "1" : "0"} ref={() => {}} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(globalThis as any).__loaderMarkDone = markDone}
    </>
  );
}
