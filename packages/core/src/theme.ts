import { PropsWithChildren, createContext, createElement, useContext } from "react";
import { radius, spacing, typography } from "./tokens";

export type PulseThemeMode = "light" | "dark";
export type PulseThemeBrandName = "pulse" | "voyika";

export interface PulseThemeColors {
  background: {
    page: string;
    surface: string;
    surfaceAlt: string;
    subtle: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    disabled: string;
    link: string;
  };
  border: {
    default: string;
    strong: string;
    focus: string;
    subtle: string;
  };
  brand: {
    primary: string;
    primarySoft: string;
    secondary: string;
    secondarySoft: string;
    secondaryDeep: string;
  };
  feedback: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  game: {
    heart: string;
    coin: string;
    xp: string;
    streak: string;
  };
  input: {
    background: string;
    border: string;
    focusedBorder: string;
    placeholder: string;
    text: string;
    caret: string;
    clear: string;
    suffix: string;
  };
  overlay: {
    scrim: string;
  };
  shadow: string;
}

export interface PulseThemeBrand {
  name: PulseThemeBrandName;
  label: string;
  colors: {
    primary: string;
    primarySoft: string;
    secondary: string;
    secondarySoft: string;
    secondaryDeep: string;
    heart: string;
    coin: string;
    xp: string;
    streak: string;
  };
}

export interface PulseThemeModeTokens {
  mode: PulseThemeMode;
  colors: {
    background: PulseThemeColors["background"];
    text: PulseThemeColors["text"];
    border: PulseThemeColors["border"];
    input: Omit<PulseThemeColors["input"], "focusedBorder" | "caret" | "suffix">;
    overlay: PulseThemeColors["overlay"];
    shadow: string;
  };
}

export interface PulseLegacyColors {
  primary: string;
  primarySoft: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  inputBackground: string;
  inputBorder: string;
  inputBorderFocused: string;
  inputPlaceholder: string;
  inputText: string;
  inputCaret: string;
  inputClear: string;
  inputSuffix: string;
  text: string;
  textMuted: string;
  heart: string;
  coin: string;
  xp: string;
  streak: string;
  shadow: string;
}

export interface PulseTheme {
  name: string;
  brandName: PulseThemeBrandName;
  brandLabel: string;
  mode: PulseThemeMode;
  colors: PulseThemeColors;
  legacyColors: PulseLegacyColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: ReturnType<typeof createShadows>;
}

function createLegacyColors(colors: PulseThemeColors): PulseLegacyColors {
  return {
    primary: colors.brand.primary,
    primarySoft: colors.brand.primarySoft,
    secondary: colors.brand.secondaryDeep,
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    danger: colors.feedback.danger,
    background: colors.background.page,
    surface: colors.background.surface,
    surfaceAlt: colors.background.surfaceAlt,
    border: colors.border.default,
    inputBackground: colors.input.background,
    inputBorder: colors.input.border,
    inputBorderFocused: colors.input.focusedBorder,
    inputPlaceholder: colors.input.placeholder,
    inputText: colors.input.text,
    inputCaret: colors.input.caret,
    inputClear: colors.input.clear,
    inputSuffix: colors.input.suffix,
    text: colors.text.primary,
    textMuted: colors.text.muted,
    heart: colors.game.heart,
    coin: colors.game.coin,
    xp: colors.game.xp,
    streak: colors.game.streak,
    shadow: colors.shadow
  };
}

function createShadows(shadowColor: string) {
  return {
    sm: {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3
    },
    md: {
      shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 6
    }
  } as const;
}

export const pulseThemeBrands: Record<PulseThemeBrandName, PulseThemeBrand> = {
  pulse: {
    name: "pulse",
    label: "Pulse",
    colors: {
      primary: "#7DDB00",
      primarySoft: "#F0FFD4",
      secondary: "#22AFFF",
      secondarySoft: "#D9F3FF",
      secondaryDeep: "#1F3B63",
      heart: "#FF5D73",
      coin: "#FFCA45",
      xp: "#7DDB00",
      streak: "#FF8B3D"
    }
  },
  voyika: {
    name: "voyika",
    label: "Voyika",
    colors: {
      primary: "#6FD100",
      primarySoft: "#F2FFE0",
      secondary: "#1FA7F2",
      secondarySoft: "#DDF3FF",
      secondaryDeep: "#20344A",
      heart: "#FF607A",
      coin: "#FFC84D",
      xp: "#6FD100",
      streak: "#FF8F3F"
    }
  }
} as const;

export const pulseThemeModes: Record<PulseThemeMode, PulseThemeModeTokens> = {
  light: {
    mode: "light",
    colors: {
      background: {
        page: "#F7F7F2",
        surface: "#FFFFFF",
        surfaceAlt: "#FBFFF3",
        subtle: "#F3F8E7"
      },
      text: {
        primary: "#373737",
        secondary: "#5A616B",
        muted: "#8D8D8D",
        inverse: "#FFFFFF",
        disabled: "#B8B8B8",
        link: "#22AFFF"
      },
      border: {
        default: "#E8E8E1",
        strong: "#D9D9D2",
        focus: "#22AFFF",
        subtle: "#EEF0E7"
      },
      input: {
        background: "#FFFFFF",
        border: "#E8E8E1",
        placeholder: "#AFAFAF",
        text: "#4B4B4B",
        clear: "#C4C4C4"
      },
      overlay: {
        scrim: "rgba(24, 32, 51, 0.28)"
      },
      shadow: "rgba(24, 32, 51, 0.14)"
    }
  },
  dark: {
    mode: "dark",
    colors: {
      background: {
        page: "#11161D",
        surface: "#18212B",
        surfaceAlt: "#1E2A35",
        subtle: "#24313D"
      },
      text: {
        primary: "#F5F7FA",
        secondary: "#CBD5E1",
        muted: "#92A2B3",
        inverse: "#FFFFFF",
        disabled: "#6E7E91",
        link: "#4BC0FF"
      },
      border: {
        default: "#2C3A49",
        strong: "#445569",
        focus: "#4BC0FF",
        subtle: "#22303D"
      },
      input: {
        background: "#0F1720",
        border: "#2C3A49",
        placeholder: "#708194",
        text: "#F5F7FA",
        clear: "#405162"
      },
      overlay: {
        scrim: "rgba(3, 8, 14, 0.62)"
      },
      shadow: "rgba(0, 0, 0, 0.4)"
    }
  }
} as const;

export function createPulseTheme(
  brandName: PulseThemeBrandName = "pulse",
  mode: PulseThemeMode = "light"
): PulseTheme {
  const brand = pulseThemeBrands[brandName];
  const modeTokens = pulseThemeModes[mode];

  const colors: PulseThemeColors = {
    background: modeTokens.colors.background,
    text: {
      ...modeTokens.colors.text,
      link: brand.colors.secondary
    },
    border: {
      ...modeTokens.colors.border,
      focus: brand.colors.secondary
    },
    brand: {
      primary: brand.colors.primary,
      primarySoft: mode === "dark" ? `${brand.colors.primary}22` : brand.colors.primarySoft,
      secondary: brand.colors.secondary,
      secondarySoft: mode === "dark" ? `${brand.colors.secondary}22` : brand.colors.secondarySoft,
      secondaryDeep: brand.colors.secondaryDeep
    },
    feedback: {
      success: brand.colors.primary,
      warning: "#FFB648",
      danger: brand.name === "voyika" ? "#FF607A" : "#FF5D73",
      info: brand.colors.secondary
    },
    game: {
      heart: brand.colors.heart,
      coin: brand.colors.coin,
      xp: brand.colors.xp,
      streak: brand.colors.streak
    },
    input: {
      ...modeTokens.colors.input,
      focusedBorder: brand.colors.secondary,
      caret: brand.colors.secondary,
      suffix: mode === "dark" ? "#7ED5FF" : "#84D8FF"
    },
    overlay: modeTokens.colors.overlay,
    shadow: modeTokens.colors.shadow
  };

  return {
    name: `${brand.name}-${mode}`,
    brandName: brand.name,
    brandLabel: brand.label,
    mode,
    colors,
    legacyColors: createLegacyColors(colors),
    spacing,
    radius,
    typography,
    shadows: createShadows(colors.shadow)
  };
}

export const pulseTheme = createPulseTheme("pulse", "light");

const PulseThemeContext = createContext<PulseTheme>(pulseTheme);

export interface PulseThemeProviderProps extends PropsWithChildren {
  theme?: PulseTheme;
}

export function PulseThemeProvider({
  theme = pulseTheme,
  children
}: PulseThemeProviderProps) {
  return createElement(PulseThemeContext.Provider, { value: theme }, children);
}

export function usePulseTheme() {
  return useContext(PulseThemeContext);
}

export function usePulseLegacyColors() {
  return usePulseTheme().legacyColors;
}
