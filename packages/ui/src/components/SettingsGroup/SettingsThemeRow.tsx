import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { spacing, typography } from "@pulse-ui/core";
import { Drawer, type DrawerPlacement } from "../Drawer";
import { SettingsRow } from "./SettingsRow";
import { ThemeSwatches } from "./ThemeSwatches";

export interface ThemeOption<TValue extends string = string> {
  value: TValue;
  label: string;
  swatches: string[];
}

export interface SettingsThemeRowProps<TValue extends string = string> {
  label: string;
  value?: TValue;
  options: ThemeOption<TValue>[];
  onValueChange?: (value: TValue) => void;
  drawerTitle?: string;
  placement?: DrawerPlacement;
  showDivider?: boolean;
  disabled?: boolean;
  rowStyle?: ViewStyle;
  swatchSize?: number;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export function SettingsThemeRow<TValue extends string = string>({
  label,
  value,
  options,
  onValueChange,
  drawerTitle,
  placement = "bottom",
  showDivider = true,
  disabled = false,
  rowStyle,
  swatchSize = 22,
  visible,
  onVisibleChange
}: SettingsThemeRowProps<TValue>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof visible === "boolean" ? visible : internalOpen;
  const setOpen = (next: boolean) => {
    if (typeof visible !== "boolean") {
      setInternalOpen(next);
    }
    onVisibleChange?.(next);
  };

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const openDrawer = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <SettingsRow
        label={label}
        showDivider={showDivider}
        disabled={disabled}
        style={rowStyle}
        onPress={openDrawer}
        trailing={
          <View style={styles.trailing}>
            {selectedOption ? (
              <ThemeSwatches colors={selectedOption.swatches} size={swatchSize} />
            ) : null}
            <Text style={styles.chevron}>›</Text>
          </View>
        }
      />

      <Drawer
        visible={open}
        placement={placement}
        onRequestClose={() => setOpen(false)}
        contentStyle={styles.drawerContent}
      >
        {drawerTitle ? (
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>{drawerTitle}</Text>
          </View>
        ) : null}
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                onValueChange?.(option.value);
                setOpen(false);
              }}
              style={[
                styles.optionRow,
                active && styles.optionRowActive,
                index < options.length - 1 && styles.optionBorder
              ]}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option.label}</Text>
              <ThemeSwatches colors={option.swatches} size={28} gap={8} />
            </Pressable>
          );
        })}
      </Drawer>
    </>
  );
}

const styles = StyleSheet.create({
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  chevron: {
    color: "#AFAFAF",
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "700"
  },
  drawerContent: {
    padding: 0
  },
  drawerHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7"
  },
  drawerHeaderText: {
    color: "#8C8C8C",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  optionRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg
  },
  optionRowActive: {
    backgroundColor: "#DDF1FF"
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC"
  },
  optionLabel: {
    flex: 1,
    color: "#4B4B4B",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  optionLabelActive: {
    color: "#1CB0F6"
  }
});
