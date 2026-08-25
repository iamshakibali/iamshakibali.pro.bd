export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";
export const SPRING_PRESS = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 0.5,
};
export const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 360,
  damping: 32,
  mass: 0.6,
};
