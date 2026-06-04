import { ReactNode, useMemo, useState } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { radius, usePulseLegacyColors, usePulseTheme } from "@pulse-ui/core";

export type BubblePopoverPlacement = "top" | "bottom" | "left" | "right";

export interface BubblePopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: BubblePopoverPlacement;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  openOnHover?: boolean;
  openOnPress?: boolean;
  dismissOnContentPress?: boolean;
  style?: StyleProp<ViewStyle>;
  bubbleStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  arrowSize?: number;
  offset?: number;
}

export function BubblePopover({
  trigger,
  children,
  placement = "bottom",
  visible,
  defaultVisible = false,
  onVisibleChange,
  openOnHover = false,
  openOnPress = true,
  dismissOnContentPress = false,
  style,
  bubbleStyle,
  contentStyle,
  arrowSize = 12,
  offset = 10
}: BubblePopoverProps) {
  const colors = usePulseLegacyColors();
  const theme = usePulseTheme();
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isControlled = typeof visible === "boolean";
  const isVisible = isControlled ? visible : internalVisible;

  const setVisible = (next: boolean) => {
    if (!isControlled) {
      setInternalVisible(next);
    }
    onVisibleChange?.(next);
  };

  const bubblePositionStyle = useMemo(
    () => getBubblePositionStyle(placement, offset, arrowSize),
    [placement, offset, arrowSize]
  );
  const arrowVisualStyle = useMemo(() => getArrowVisualStyle(placement), [placement]);
  const arrowPositionStyle = useMemo(
    () => getArrowPositionStyle(placement, arrowSize),
    [placement, arrowSize]
  );

  return (
    <Pressable
      style={[styles.container, style]}
      onHoverIn={openOnHover ? () => setVisible(true) : undefined}
      onHoverOut={openOnHover ? () => setVisible(false) : undefined}
    >
      <Pressable
        onPress={openOnPress ? () => setVisible(!isVisible) : undefined}
        style={styles.triggerWrap}
      >
        {trigger}
      </Pressable>

      {isVisible ? (
        <View pointerEvents="box-none" style={[styles.bubbleLayer, bubblePositionStyle]}>
          <View style={styles.bubbleCluster}>
            <View
              style={[
                styles.arrow,
                arrowVisualStyle,
                arrowPositionStyle,
                {
                  width: arrowSize,
                  height: arrowSize,
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }
              ]}
            />
            <Pressable
              onPress={dismissOnContentPress ? () => setVisible(false) : undefined}
              onHoverIn={openOnHover ? () => setVisible(true) : undefined}
              onHoverOut={openOnHover ? () => setVisible(false) : undefined}
              style={[styles.bubble, theme.shadows.md, { backgroundColor: colors.surface, borderColor: colors.border }, bubbleStyle]}
            >
              <View style={[styles.content, contentStyle]}>{children}</View>
            </Pressable>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

function getBubblePositionStyle(
  placement: BubblePopoverPlacement,
  offset: number,
  arrowSize: number
): ViewStyle {
  const distance = offset + arrowSize / 2;

  switch (placement) {
    case "top":
      return {
        bottom: "100%",
        left: 0,
        right: 0,
        marginBottom: distance,
        alignItems: "center"
      };
    case "left":
      return {
        right: "100%",
        top: 0,
        bottom: 0,
        marginRight: distance,
        justifyContent: "center",
        alignItems: "flex-end"
      };
    case "right":
      return {
        left: "100%",
        top: 0,
        bottom: 0,
        marginLeft: distance,
        justifyContent: "center",
        alignItems: "flex-start"
      };
    case "bottom":
    default:
      return {
        top: "100%",
        left: 0,
        right: 0,
        marginTop: distance,
        alignItems: "center"
      };
  }
}

function getArrowVisualStyle(placement: BubblePopoverPlacement): ViewStyle {
  switch (placement) {
    case "top":
      // Point down toward trigger.
      return {
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        transform: [{ rotate: "45deg" }]
      };
    case "left":
      // Point right toward trigger.
      return {
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        transform: [{ rotate: "45deg" }]
      };
    case "right":
      // Point left toward trigger.
      return {
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        transform: [{ rotate: "45deg" }]
      };
    case "bottom":
    default:
      // Point up toward trigger.
      return {
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        transform: [{ rotate: "45deg" }]
      };
  }
}

function getArrowPositionStyle(
  placement: BubblePopoverPlacement,
  arrowSize: number
): ViewStyle {
  const half = arrowSize / 2;

  switch (placement) {
    case "top":
      return {
        bottom: -half,
        left: "50%",
        marginLeft: -half
      };
    case "left":
      return {
        right: -half,
        top: "50%",
        marginTop: -half
      };
    case "right":
      return {
        left: -half,
        top: "50%",
        marginTop: -half
      };
    case "bottom":
    default:
      return {
        top: -half,
        left: "50%",
        marginLeft: -half
      };
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start"
  },
  triggerWrap: {
    alignSelf: "flex-start"
  },
  bubbleLayer: {
    position: "absolute",
    zIndex: 40
  },
  bubbleCluster: {
    position: "relative",
    alignSelf: "center"
  },
  bubble: {
    minWidth: 110,
    borderRadius: radius.lg,
    borderWidth: 2
  },
  content: {
    overflow: "hidden",
    borderRadius: radius.lg
  },
  arrow: {
    position: "absolute",
    zIndex: 2
  }
});
