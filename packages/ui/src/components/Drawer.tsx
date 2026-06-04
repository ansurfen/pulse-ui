import { ReactNode, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { radius, spacing, usePulseTheme } from "@pulse-ui/core";

export type DrawerPlacement = "top" | "bottom";

export interface DrawerProps {
  visible: boolean;
  children: ReactNode;
  placement?: DrawerPlacement;
  onRequestClose?: () => void;
  dismissOnBackdropPress?: boolean;
  backdropColor?: string;
  panelStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  maxHeightRatio?: number;
}

export function Drawer({
  visible,
  children,
  placement = "bottom",
  onRequestClose,
  dismissOnBackdropPress = true,
  backdropColor = "rgba(24, 32, 51, 0.28)",
  panelStyle,
  contentStyle,
  maxHeightRatio = 0.85
}: DrawerProps) {
  const theme = usePulseTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [panelHeight, setPanelHeight] = useState(0);
  const progress = useSharedValue(0);
  const maxPanelHeight = windowHeight * maxHeightRatio;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.cubic)
      });
      return;
    }

    if (!mounted) {
      return;
    }

    progress.value = withTiming(
      0,
      {
        duration: 240,
        easing: Easing.in(Easing.cubic)
      },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      }
    );
  }, [visible, mounted, progress]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value
  }));

  const panelAnimatedStyle = useAnimatedStyle(() => {
    const distance = panelHeight > 0 ? panelHeight : maxPanelHeight;
    const hiddenOffset = placement === "bottom" ? distance : -distance;

    return {
      transform: [
        {
          translateY: hiddenOffset * (1 - progress.value)
        }
      ]
    };
  });

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { backgroundColor: backdropColor ?? theme.colors.overlay.scrim }, backdropAnimatedStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdropPress ? onRequestClose : undefined}
          />
        </Animated.View>
        <View
          pointerEvents="box-none"
          style={[styles.panelLayer, placement === "bottom" ? styles.panelLayerBottom : styles.panelLayerTop]}
        >
          <Animated.View
            onLayout={(event) => {
              const nextHeight = event.nativeEvent.layout.height;
              if (nextHeight > 0 && nextHeight !== panelHeight) {
                setPanelHeight(nextHeight);
              }
            }}
            style={[
              styles.panel,
              { backgroundColor: theme.colors.background.surface },
              placement === "bottom" ? styles.panelBottom : styles.panelTop,
              { maxHeight: maxPanelHeight },
              panelAnimatedStyle,
              panelStyle
            ]}
          >
            <View style={[styles.content, contentStyle]}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  panelLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end"
  },
  panelLayerBottom: {
    justifyContent: "flex-end"
  },
  panelLayerTop: {
    justifyContent: "flex-start"
  },
  panel: {
    width: "100%",
    overflow: "hidden"
  },
  panelBottom: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg
  },
  panelTop: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg
  },
  content: {
    padding: spacing.xl
  }
});
