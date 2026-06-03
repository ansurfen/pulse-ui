import { ReactNode, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, spacing, shadows } from "@pulse-ui/core";

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
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const [triggerLayout, setTriggerLayout] = useState({ width: 0, height: 0 });
  const [bubbleLayout, setBubbleLayout] = useState({ width: 0, height: 0 });
  const isControlled = typeof visible === "boolean";
  const isVisible = isControlled ? visible : internalVisible;

  const setVisible = (next: boolean) => {
    if (!isControlled) {
      setInternalVisible(next);
    }
    onVisibleChange?.(next);
  };

  const bubblePositionStyle = useMemo(
    () => getBubblePositionStyle(placement, offset, arrowSize, triggerLayout, bubbleLayout),
    [placement, offset, arrowSize, triggerLayout, bubbleLayout]
  );
  const arrowPositionStyle = useMemo(
    () => getArrowPositionStyle(placement, arrowSize, bubbleLayout),
    [placement, arrowSize, bubbleLayout]
  );

  const handleTriggerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTriggerLayout({ width, height });
  };

  const handleBubbleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBubbleLayout({ width, height });
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onHoverIn={openOnHover ? () => setVisible(true) : undefined}
      onHoverOut={openOnHover ? () => setVisible(false) : undefined}
    >
      <Pressable
        onPress={openOnPress ? () => setVisible(!isVisible) : undefined}
        onLayout={handleTriggerLayout}
        style={styles.triggerWrap}
      >
        {trigger}
      </Pressable>

      {isVisible ? (
        <View
          pointerEvents="box-none"
          style={[styles.bubbleLayer, bubblePositionStyle]}
        >
          <View style={[styles.arrow, arrowPositionStyle, { width: arrowSize, height: arrowSize }]} />
          <Pressable
            onLayout={handleBubbleLayout}
            onPress={dismissOnContentPress ? () => setVisible(false) : undefined}
            onHoverIn={openOnHover ? () => setVisible(true) : undefined}
            onHoverOut={openOnHover ? () => setVisible(false) : undefined}
            style={[styles.bubble, bubbleStyle]}
          >
            <View style={[styles.content, contentStyle]}>{children}</View>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

function getBubblePositionStyle(
  placement: BubblePopoverPlacement,
  offset: number,
  arrowSize: number,
  triggerLayout: { width: number; height: number },
  bubbleLayout: { width: number; height: number }
): ViewStyle {
  const distance = offset + arrowSize / 2;
  const centeredLeft = (triggerLayout.width - bubbleLayout.width) / 2;
  const centeredTop = (triggerLayout.height - bubbleLayout.height) / 2;

  switch (placement) {
    case "top":
      return {
        bottom: "100%",
        left: centeredLeft,
        marginBottom: distance
      };
    case "left":
      return {
        left: -(bubbleLayout.width + distance),
        top: centeredTop
      };
    case "right":
      return {
        left: "100%",
        top: centeredTop,
        marginLeft: distance
      };
    case "bottom":
    default:
      return {
        top: "100%",
        left: centeredLeft,
        marginTop: distance
      };
  }
}

function getArrowPositionStyle(
  placement: BubblePopoverPlacement,
  arrowSize: number,
  bubbleLayout: { width: number; height: number }
): ViewStyle {
  const half = arrowSize / 2;
  const centerX = bubbleLayout.width / 2 - half;
  const centerY = bubbleLayout.height / 2 - half;

  switch (placement) {
    case "top":
      return {
        bottom: -half,
        left: Math.max(18, centerX),
        transform: [{ rotate: "45deg" }]
      };
    case "left":
      return {
        right: -half,
        top: Math.max(18, centerY),
        transform: [{ rotate: "45deg" }]
      };
    case "right":
      return {
        left: -half,
        top: Math.max(18, centerY),
        transform: [{ rotate: "45deg" }]
      };
    case "bottom":
    default:
      return {
        top: -half,
        left: Math.max(18, centerX),
        transform: [{ rotate: "45deg" }]
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
  bubble: {
    minWidth: 110,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    ...shadows.md
  },
  content: {
    overflow: "hidden",
    borderRadius: radius.lg
  },
  arrow: {
    position: "absolute",
    backgroundColor: colors.surface,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "#D9D9D9",
    zIndex: 1
  }
});
