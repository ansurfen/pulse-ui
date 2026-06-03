import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors, spacing, typography } from "@pulse-ui/core";

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
  color = "#4B4B4B",
  fontSize = typography.body,
  fontWeight = "700",
  lineColor = "#E5E5E5",
  style,
  textStyle
}: SectionHeadingProps) {
  const labelStyle: TextStyle = {
    color,
    fontSize,
    fontWeight,
    ...textStyle
  };

  if (variant === "title") {
    return (
      <View style={[styles.titleRoot, style]}>
        <Text style={[styles.titleLabel, labelStyle]}>{children}</Text>
        <View style={[styles.titleLine, { backgroundColor: lineColor }]} />
      </View>
    );
  }

  return (
    <View style={[styles.centeredRoot, style]}>
      <View style={[styles.centeredLine, { backgroundColor: lineColor }]} />
      <Text style={[styles.centeredLabel, labelStyle]}>{children}</Text>
      <View style={[styles.centeredLine, { backgroundColor: lineColor }]} />
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
  titleLabel: {
    color: colors.text
  },
  titleLine: {
    width: "100%",
    height: 1
  }
});
