import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { radius, spacing, usePulseTheme } from "@pulse-ui/core";

export interface OverlayProps {
  visible: boolean;
  children: ReactNode;
  onRequestClose?: () => void;
  dismissOnBackdropPress?: boolean;
  backdropColor?: string;
  contentStyle?: ViewStyle;
  cardStyle?: ViewStyle;
  centered?: boolean;
}

export function Overlay({
  visible,
  children,
  onRequestClose,
  dismissOnBackdropPress = true,
  backdropColor,
  contentStyle,
  cardStyle,
  centered = true
}: OverlayProps) {
  const theme = usePulseTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={[styles.root, { backgroundColor: backdropColor ?? theme.colors.overlay.scrim }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdropPress ? onRequestClose : undefined}
        />
        <View
          pointerEvents="box-none"
          style={[styles.contentLayer, centered && styles.contentLayerCentered]}
        >
          <View pointerEvents="auto" style={[styles.card, { backgroundColor: theme.colors.background.surface }, cardStyle, contentStyle]}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  contentLayer: {
    ...StyleSheet.absoluteFillObject
  },
  contentLayerCentered: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: radius.lg,
    padding: spacing.xl
  }
});
