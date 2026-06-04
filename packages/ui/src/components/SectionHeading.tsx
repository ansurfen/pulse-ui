import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export type SectionHeadingVariant = "centered" | "title";

export interface SectionHeadingProps {
  children: string;
  variant?: SectionHeadingVariant;
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  lineColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SectionHeading({
  children,
  variant = "centered",
  color,
  fontSize = typography.body,
  fontWeight = "700",
  lineColor,
  style,
  textStyle
}: SectionHeadingProps) {
  const colors = usePulseLegacyColors();
  const labelStyle: TextStyle = {
    color: color ?? colors.text,
    fontSize,
    fontWeight,
    ...textStyle
  };

  if (variant === "title") {
    return (
      <View style={[styles.titleRoot, style]}>
        <Text style={[styles.titleLabel, labelStyle]}>{children}</Text>
        <View style={[styles.titleLine, { backgroundColor: lineColor ?? colors.border }]} />
      </View>
    );
  }

  return (
    <View style={[styles.centeredRoot, style]}>
      <View style={[styles.centeredLine, { backgroundColor: lineColor ?? colors.border }]} />
      <Text style={[styles.centeredLabel, labelStyle]}>{children}</Text>
      <View style={[styles.centeredLine, { backgroundColor: lineColor ?? colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredRoot: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  centeredLine: {
    flex: 1,
    height: 1
  },
  centeredLabel: {
    flexShrink: 0
  },
  titleRoot: {
    width: "100%",
    gap: spacing.sm
  },
  titleLabel: {},
  titleLine: {
    width: "100%",
    height: 1
  }
});
