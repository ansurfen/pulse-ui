import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";
import { useSettingsBorder } from "./settingsTokens";

export interface SettingsRowProps extends PropsWithChildren {
  label: string;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  showDivider?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function SettingsRow({
  label,
  trailing,
  onPress,
  disabled = false,
  showDivider = true,
  style,
  labelStyle,
  children
}: SettingsRowProps) {
  const colors = usePulseLegacyColors();
  const settingsBorder = useSettingsBorder();
  const content = (
    <>
      <Text style={[styles.label, { color: colors.text }, labelStyle]} numberOfLines={2}>
        {label}
      </Text>
      <View style={styles.trailing}>{trailing ?? children}</View>
    </>
  );

  return (
    <View
      style={[
        styles.rowShell,
        { backgroundColor: colors.surface },
        showDivider && { borderBottomWidth: settingsBorder.width, borderBottomColor: settingsBorder.dividerColor },
        style
      ]}
    >
      {onPress ? (
        <Pressable
          disabled={disabled}
          onPress={onPress}
          style={({ pressed }) => [
            styles.row,
            pressed && !disabled && styles.rowPressed,
            disabled && styles.rowDisabled
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={[styles.row, disabled && styles.rowDisabled]}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rowShell: {
    width: "100%"
  },
  row: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg
  },
  rowPressed: {
    opacity: 0.92
  },
  rowDisabled: {
    opacity: 0.5
  },
  label: {
    flex: 1,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  trailing: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
