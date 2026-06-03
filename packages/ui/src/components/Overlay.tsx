import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, spacing } from "@pulse-ui/core";

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
  backdropColor = "rgba(24, 32, 51, 0.28)",
  contentStyle,
  cardStyle,
  centered = true
}: OverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={[styles.root, { backgroundColor: backdropColor }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdropPress ? onRequestClose : undefined}
        />
        <View
          pointerEvents="box-none"
          style={[styles.contentLayer, centered && styles.contentLayerCentered]}
        >
          <View pointerEvents="auto" style={[styles.card, cardStyle, contentStyle]}>
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
    backgroundColor: colors.surface,
    padding: spacing.xl
  }
});
