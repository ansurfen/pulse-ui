import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { radius, spacing, usePulseLegacyColors, usePulseTheme } from "@pulse-ui/core";

export type BubbleCardPlacement = "top" | "bottom" | "left" | "right";

export interface BubbleCardProps extends PropsWithChildren {
  placement?: BubbleCardPlacement;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  arrowSize?: number;
}

export function BubbleCard({
  placement = "bottom",
  children,
  style,
  contentStyle,
  arrowSize = 14
}: BubbleCardProps) {
  const colors = usePulseLegacyColors();
  const theme = usePulseTheme();
  return (
    <View style={[styles.wrap, getWrapPlacementStyle(placement, arrowSize)]}>
      <View style={[styles.arrowWrap, getArrowWrapStyle(placement, arrowSize)]}>
        <View style={[styles.arrowDiamond, theme.shadows.md, { width: arrowSize, height: arrowSize, backgroundColor: colors.surface, borderColor: colors.border }]} />
      </View>
      <View style={[styles.card, theme.shadows.md, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

function getWrapPlacementStyle(placement: BubbleCardPlacement, arrowSize: number): ViewStyle {
  const offset = Math.round(arrowSize * 0.6);

  switch (placement) {
    case "top":
      return { paddingTop: offset };
    case "left":
      return { paddingLeft: offset };
    case "right":
      return { paddingRight: offset };
    case "bottom":
    default:
      return { paddingBottom: offset };
  }
}

function getArrowWrapStyle(placement: BubbleCardPlacement, arrowSize: number): ViewStyle {
  const overlap = Math.round(arrowSize * 0.32);

  switch (placement) {
    case "top":
      return {
        width: arrowSize,
        height: arrowSize,
        top: 0,
        left: 34,
        marginTop: overlap
      };
    case "left":
      return {
        width: arrowSize,
        height: arrowSize,
        left: 0,
        top: 26,
        marginLeft: overlap
      };
    case "right":
      return {
        width: arrowSize,
        height: arrowSize,
        right: 0,
        top: 26,
        marginRight: overlap
      };
    case "bottom":
    default:
      return {
        width: arrowSize,
        height: arrowSize,
        bottom: 0,
        left: 34,
        marginBottom: overlap
      };
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignSelf: "flex-start"
  },
  card: {
    minWidth: 110,
    borderRadius: radius.lg,
    borderWidth: 2,
    zIndex: 2
  },
  content: {
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  arrowWrap: {
    position: "absolute",
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center"
  },
  arrowDiamond: {
    borderWidth: 2,
    borderRadius: 2,
    transform: [{ rotate: "45deg" }]
  }
});
