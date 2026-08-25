"use client";

import { createContext, useContext } from "react";

// undefined outside the home page's WelcomeGate (e.g. the dock in the root
// layout), so consumers can tell "no loader here" from "loader playing"
export const WelcomeDoneContext = createContext<boolean | undefined>(undefined);

export function useWelcomeDone() {
  return useContext(WelcomeDoneContext);
}
