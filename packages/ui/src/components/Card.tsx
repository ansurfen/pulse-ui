import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, shadows, spacing, typography } from "@pulse-ui/core";

export type CardTone = "flat" | "elevated";

export type CardProps = PropsWithChildren<{
  title?: string;
  header?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padded?: boolean;
  tone?: CardTone;
  backgroundColor?: string;
  borderColor?: string;
}>;

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

function CardFrame({
  tone,
  backgroundColor,
  borderColor,
  style,
  children
}: {
  tone: CardTone;
  backgroundColor: string;
  borderColor: string;
  style?: ViewStyle;
  children: ReactNode;
}) {
  if (tone === "flat") {
    return (
      <View style={[styles.card, shadows.md, { backgroundColor, borderColor }, style]}>
        {children}
      </View>
    );
  }

  const depthBackground = mixColor("#E5E5E5", "#000000", 0.08);
  const depthBorder = mixColor("#E5E5E5", "#000000", 0.16);

  return (
    <View style={[styles.elevatedShell, style]}>
      <View style={[styles.elevatedDepth, { backgroundColor: depthBackground, borderColor: depthBorder }]} />
      <View style={[styles.elevatedFace, { backgroundColor, borderColor }]}>{children}</View>
    </View>
  );
}

export function Card({
  title,
  header,
  footer,
  children,
  style,
  contentStyle,
  padded = true,
  tone = "flat",
  backgroundColor,
  borderColor
}: CardProps) {
  const resolvedBackground = backgroundColor ?? colors.surface;
  const resolvedBorder =
    borderColor ?? (tone === "elevated" ? mixColor(resolvedBackground, "#000000", 0.12) : "#E1E1E1");
  const hasHeader = Boolean(title || header);
  const hasFooter = Boolean(footer);

  return (
    <CardFrame
      backgroundColor={resolvedBackground}
      borderColor={resolvedBorder}
      style={style}
      tone={tone}
    >
      {hasHeader ? (
        <View style={[styles.header, { backgroundColor: resolvedBackground }]}>
          {header ?? <Text style={styles.title}>{title}</Text>}
        </View>
      ) : null}

      {hasHeader && children ? <View style={styles.divider} /> : null}

      <View
        style={[
          styles.content,
          { backgroundColor: resolvedBackground },
          padded && styles.contentPadded,
          contentStyle
        ]}
      >
        {children}
      </View>

      {hasFooter ? <View style={styles.divider} /> : null}
      {hasFooter ? <View style={[styles.footer, { backgroundColor: resolvedBackground }]}>{footer}</View> : null}
    </CardFrame>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: "hidden"
  },
  elevatedShell: {
    position: "relative",
    borderRadius: radius.lg,
    paddingBottom: 4,
    alignSelf: "flex-start"
  },
  elevatedDepth: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 4,
    bottom: 0,
    borderRadius: radius.lg,
    borderWidth: 2
  },
  elevatedFace: {
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: "hidden"
  },
  header: {
    minHeight: 72,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  title: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "800"
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5"
  },
  content: {},
  contentPadded: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  }
});
