import { ReactNode, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BubblePopover, type BubblePopoverPlacement } from "./BubblePopover";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface SelectDropdownOption<TValue extends string = string> {
  value: TValue;
  label: string;
  icon?: ReactNode;
  description?: string;
}

export interface SelectDropdownProps<TValue extends string = string> {
  value?: TValue;
  options: SelectDropdownOption<TValue>[];
  onValueChange?: (value: TValue) => void;
  placeholder?: string;
  title?: string;
  placement?: BubblePopoverPlacement;
  style?: ViewStyle;
  renderValue?: (option?: SelectDropdownOption<TValue>) => ReactNode;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export function SelectDropdown<TValue extends string = string>({
  value,
  options,
  onValueChange,
  placeholder = "请选择",
  title,
  placement = "bottom",
  style,
  renderValue,
  visible,
  onVisibleChange
}: SelectDropdownProps<TValue>) {
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

  return (
    <BubblePopover
      placement={placement}
      visible={open}
      onVisibleChange={setOpen}
      trigger={
        <View style={[styles.trigger, style]}>
          <Text style={[styles.triggerLabel, !selectedOption && styles.triggerPlaceholder]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text style={styles.triggerChevron}>{open ? "▴" : "▾"}</Text>
        </View>
      }
      bubbleStyle={styles.menuBubble}
      contentStyle={styles.menuContent}
    >
      {title ? (
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>{title}</Text>
        </View>
      ) : null}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
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
              <View style={styles.optionMain}>
                {option.icon ? <View style={styles.optionIcon}>{option.icon}</View> : null}
                <View style={styles.optionTextWrap}>
                  {renderValue && active ? (
                    renderValue(option)
                  ) : (
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option.label}</Text>
                  )}
                  {option.description ? (
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </BubblePopover>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minWidth: 180,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  triggerLabel: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  triggerPlaceholder: {
    color: colors.textMuted
  },
  triggerChevron: {
    color: colors.textMuted,
    fontSize: typography.bodyLg
  },
  menuBubble: {
    minWidth: 240
  },
  menuContent: {
    paddingVertical: spacing.sm
  },
  menuHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7"
  },
  menuHeaderText: {
    color: "#8C8C8C",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  menuList: {
    maxHeight: 320
  },
  optionRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg
  },
  optionRowActive: {
    backgroundColor: "#DDF1FF"
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC"
  },
  optionMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  optionIcon: {
    width: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  optionTextWrap: {
    flex: 1,
    gap: spacing.xs
  },
  optionLabel: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "700"
  },
  optionLabelActive: {
    color: "#1C9EF2"
  },
  optionDescription: {
    color: colors.textMuted,
    fontSize: typography.body
  }
});
