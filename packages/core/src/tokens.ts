export const colors = {
  primary: "#5B7CFF",
  primarySoft: "#DCE4FF",
  secondary: "#1D2B53",
  success: "#2CC58A",
  warning: "#FFB648",
  danger: "#FF5D73",
  background: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF3FF",
  border: "#D8E2F2",
  inputBackground: "#F7F7F7",
  inputBorder: "#E8E8E8",
  inputBorderFocused: "#84D8FF",
  inputPlaceholder: "#AFAFAF",
  inputText: "#4B4B4B",
  inputCaret: "#1CB0F6",
  inputClear: "#C4C4C4",
  inputSuffix: "#84D8FF",
  text: "#182033",
  textMuted: "#667089",
  heart: "#FF5D73",
  coin: "#FFCA45",
  xp: "#6EDE8A",
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

