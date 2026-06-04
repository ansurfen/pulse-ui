import { ReactNode, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";
import { Drawer, type DrawerPlacement } from "../Drawer";
import { Overlay } from "../Overlay";
import { SettingsRow } from "./SettingsRow";

export type SettingsOverlayPresentation = "overlay" | "drawer-top" | "drawer-bottom";

export interface SettingsOverlayRowProps {
  label: string;
  value?: string;
  detail?: string;
  showDivider?: boolean;
  disabled?: boolean;
  rowStyle?: ViewStyle;
  presentation?: SettingsOverlayPresentation;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  dismissOnBackdropPress?: boolean;
  onRequestClose?: () => void;
  overlay: ReactNode | ((helpers: { close: () => void }) => ReactNode);
  overlayCardStyle?: ViewStyle;
  drawerPanelStyle?: ViewStyle;
}

export function SettingsOverlayRow({
  label,
  value,
  detail,
  showDivider = true,
  disabled = false,
  rowStyle,
  visible,
  defaultVisible = false,
  onVisibleChange,
  dismissOnBackdropPress = true,
  onRequestClose,
  presentation = "overlay",
  overlay,
  overlayCardStyle,
  drawerPanelStyle
}: SettingsOverlayRowProps) {
  const colors = usePulseLegacyColors();
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isControlled = typeof visible === "boolean";
  const isVisible = isControlled ? visible : internalVisible;

  const setVisible = (next: boolean) => {
    if (!isControlled) {
      setInternalVisible(next);
    }
    onVisibleChange?.(next);
  };

  const close = () => {
    setVisible(false);
    onRequestClose?.();
  };

  const open = () => {
    if (disabled) {
      return;
    }
    setVisible(true);
  };

  const resolvedOverlay = typeof overlay === "function" ? overlay({ close }) : overlay;
  const drawerPlacement: DrawerPlacement | null =
    presentation === "drawer-top" ? "top" : presentation === "drawer-bottom" ? "bottom" : null;

  return (
    <>
      <SettingsRow
        label={label}
        showDivider={showDivider}
        disabled={disabled}
        style={rowStyle}
        onPress={open}
        trailing={
          <View style={styles.trailing}>
            {value ? <Text style={[styles.value, { color: colors.textMuted }]}>{value}</Text> : null}
            {detail ? <Text style={[styles.detail, { color: colors.primary }]}>{detail}</Text> : null}
            <Text style={[styles.chevron, { color: "#AFAFAF" }]}>›</Text>
          </View>
        }
      />
      {drawerPlacement ? (
        <Drawer
          visible={isVisible}
          placement={drawerPlacement}
          dismissOnBackdropPress={dismissOnBackdropPress}
          onRequestClose={close}
          panelStyle={drawerPanelStyle}
        >
          {resolvedOverlay}
        </Drawer>
      ) : (
        <Overlay
          visible={isVisible}
          dismissOnBackdropPress={dismissOnBackdropPress}
          onRequestClose={close}
          cardStyle={overlayCardStyle}
        >
          {resolvedOverlay}
        </Overlay>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  value: {
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  detail: {
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  chevron: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "700"
  }
});
