import { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonTone = "elevated" | "flat";
export type ButtonContentAlign = "center" | "left";

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  contentAlign?: ButtonContentAlign;
}

const variantMap: Record<ButtonVariant, { backgroundColor: string; textColor: string }> = {
  primary: { backgroundColor: "#2BA6E6", textColor: colors.surface },
  secondary: { backgroundColor: "#1D2B53", textColor: colors.surface },
  danger: { backgroundColor: "#FF5D73", textColor: colors.surface }
};

function hexToRgb(input: string) {
  const hex = input.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixColor(base: string, target: string, amount: number) {
  const a = hexToRgb(base);
  const b = hexToRgb(target);

  return rgbToHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount);
}

function getButtonColors({
  tone,
  backgroundColor,
  textColor,
  borderColor,
  hoverBackgroundColor,
  hoverTextColor,
  hoverBorderColor,
  hovered
}: {
  tone: ButtonTone;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  hovered: boolean;
}) {
  if (tone === "flat") {
    return {
      backgroundColor: hovered ? hoverBackgroundColor ?? "#E5E5E5" : backgroundColor,
      textColor: hovered ? hoverTextColor ?? textColor : textColor,
      borderColor: hovered ? hoverBorderColor ?? "#C8C8C8" : borderColor
    };
  }

  return {
    backgroundColor,
    textColor,
    borderColor
  };
}

export function Button({
  label,
  variant = "primary",
  tone = "elevated",
  loading = false,
  disabled = false,
  onPress,
  style,
  backgroundColor,
  textColor,
  borderColor,
  hoverBackgroundColor,
  hoverTextColor,
  hoverBorderColor,
  prefix,
  suffix,
  contentAlign = "center"
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = variantMap[variant];
  const defaultBackgroundColor = tone === "flat" ? backgroundColor ?? colors.surface : backgroundColor ?? palette.backgroundColor;
  const defaultTextColor = tone === "flat" ? textColor ?? "#1CB0F6" : textColor ?? palette.textColor;
  const defaultBorderColor = tone === "flat" ? borderColor ?? "#D9D9D9" : borderColor ?? mixColor(defaultBackgroundColor, "#000000", 0.16);

  return (
    <Pressable disabled={isDisabled} onPress={onPress} style={({ pressed }) => [styles.shell, tone === "flat" && styles.flatShell, style, pressed && styles.pressedShell, isDisabled && styles.disabled]}>
      {({ pressed, hovered }) => {
        const resolved = getButtonColors({
          tone,
          backgroundColor: defaultBackgroundColor,
          textColor: defaultTextColor,
          borderColor: defaultBorderColor,
          hoverBackgroundColor,
          hoverTextColor,
          hoverBorderColor,
          hovered
        });
        const topColor = mixColor(resolved.backgroundColor, "#FFFFFF", 0.1);
        const bottomColor = mixColor(resolved.backgroundColor, "#000000", tone === "flat" ? 0.08 : 0.22);
        const glossColor = mixColor(resolved.backgroundColor, "#FFFFFF", tone === "flat" ? 0.12 : 0.24);

        return (
          <>
            <View style={[styles.depth, tone === "flat" ? styles.flatDepth : null, { backgroundColor: bottomColor, borderColor: resolved.borderColor }]} />
            <LinearGradient
              colors={tone === "flat" ? [resolved.backgroundColor, resolved.backgroundColor] : [topColor, resolved.backgroundColor]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.button, tone === "flat" && styles.flatButton, { borderColor: resolved.borderColor }, pressed && tone === "flat" && styles.flatPressedButton]}
            >
              <View style={[styles.gloss, tone === "flat" && styles.flatGloss, { backgroundColor: glossColor }]} />
              {loading ? (
                <ActivityIndicator color={resolved.textColor} />
              ) : (
                <View style={[styles.content, contentAlign === "left" ? styles.contentLeft : styles.contentCenter]}>
                  {prefix ? <View style={styles.affix}>{prefix}</View> : null}
                  <Text style={[styles.label, { color: resolved.textColor }]}>{label}</Text>
                  {suffix ? <View style={styles.affix}>{suffix}</View> : null}
                </View>
              )}
            </LinearGradient>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 58,
    borderRadius: radius.pill,
    position: "relative"
  },
  depth: {
    ...StyleSheet.absoluteFillObject,
    top: 4,
    borderRadius: radius.pill
  },
  button: {
    minHeight: 54,
    borderRadius: radius.pill,
    paddingHorizontal: spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1
  },
  gloss: {
    position: "absolute",
    top: 6,
    left: 14,
    right: 14,
    height: 10,
    borderRadius: radius.pill,
    opacity: 0.55
  },
  label: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  contentCenter: {
    justifyContent: "center"
  },
  contentLeft: {
    justifyContent: "flex-start"
  },
  affix: {
    alignItems: "center",
    justifyContent: "center"
  },
  flatShell: {
    minHeight: 52
  },
  flatDepth: {
    top: 3,
    borderWidth: 1
  },
  flatButton: {
    minHeight: 50
  },
  flatGloss: {
    opacity: 0.18,
    top: 4,
    height: 8
  },
  flatPressedButton: {
    transform: [{ translateY: 1 }]
  },
  pressedShell: {
    transform: [{ translateY: 2 }, { scale: 0.995 }]
  },
  disabled: {
    opacity: 0.65
  }
});
