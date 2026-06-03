import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors, spacing, typography } from "@pulse-ui/core";

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
  const content = (
    <>
      <Text style={[styles.label, labelStyle]} numberOfLines={2}>
        {label}
      </Text>
      <View style={styles.trailing}>{trailing ?? children}</View>
    </>
  );

  return (
    <View style={[styles.rowShell, showDivider && styles.rowDivider, style]}>
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
    width: "100%",
    backgroundColor: colors.surface
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8"
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
    color: "#4B4B4B",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  trailing: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
