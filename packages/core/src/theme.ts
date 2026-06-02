import { tokens } from "./tokens";

export const pulseTheme = {
  name: "pulse-default",
  tokens
} as const;

export type PulseTheme = typeof pulseTheme;

