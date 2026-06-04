export const colors = {
  primary: "#7DDB00",
  primarySoft: "#F0FFD4",
  secondary: "#1F3B63",
  success: "#7DDB00",
  warning: "#FFB648",
  danger: "#FF5D73",
  background: "#F7F7F2",
  surface: "#FFFFFF",
  surfaceAlt: "#FBFFF3",
  border: "#E8E8E1",
  inputBackground: "#FFFFFF",
  inputBorder: "#E8E8E1",
  inputBorderFocused: "#22AFFF",
  inputPlaceholder: "#AFAFAF",
  inputText: "#4B4B4B",
  inputCaret: "#22AFFF",
  inputClear: "#C4C4C4",
  inputSuffix: "#84D8FF",
  text: "#373737",
  textMuted: "#8D8D8D",
  heart: "#FF5D73",
  coin: "#FFCA45",
  xp: "#7DDB00",
  streak: "#FF8B3D",
  shadow: "rgba(24, 32, 51, 0.14)"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999
} as const;

export const typography = {
  caption: 12,
  body: 14,
  bodyLg: 16,
  title: 20,
  hero: 28
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6
  }
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadows
} as const;

export type PulseTokens = typeof tokens;
