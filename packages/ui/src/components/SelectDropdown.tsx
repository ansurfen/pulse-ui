import { ReactNode, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BubblePopover, type BubblePopoverPlacement } from "./BubblePopover";
import { Drawer, type DrawerPlacement } from "./Drawer";
import { Overlay } from "./Overlay";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export interface SelectDropdownOption<TValue extends string = string> {
  value: TValue;
  label: string;
  icon?: ReactNode;
  description?: string;
}

export type SelectDropdownVariant = "default" | "inline";
export type SelectDropdownMenuPresentation = "popover" | "modal" | "drawer" | "drawer-top" | "drawer-bottom";

export interface SelectDropdownProps<TValue extends string = string> {
  value?: TValue;
  options: SelectDropdownOption<TValue>[];
  onValueChange?: (value: TValue) => void;
  placeholder?: string;
  title?: string;
  placement?: BubblePopoverPlacement;
  variant?: SelectDropdownVariant;
  menuPresentation?: SelectDropdownMenuPresentation;
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
  variant = "default",
  menuPresentation = "popover",
  style,
  renderValue,
  visible,
  onVisibleChange
}: SelectDropdownProps<TValue>) {
  const colors = usePulseLegacyColors();
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

  const trigger = (
    <Pressable onPress={() => setOpen(!open)} style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.surface }, variant === "inline" && styles.triggerInline, style]}>
      <Text
        style={[
          styles.triggerLabel,
          { color: colors.text },
          variant === "inline" && styles.triggerLabelInline,
          !selectedOption && { color: colors.textMuted }
        ]}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Text>
      <Text style={[styles.triggerChevron, { color: colors.textMuted }, variant === "inline" && styles.triggerChevronInline]}>
        {open ? "▴" : "▾"}
      </Text>
    </Pressable>
  );

  const menu = (
    <SelectDropdownMenu
      title={title}
      options={options}
      value={value}
      colors={colors}
      renderValue={renderValue}
      onSelect={(next) => {
        onValueChange?.(next);
        setOpen(false);
      }}
    />
  );

  if (menuPresentation === "modal") {
    return (
      <>
        {trigger}
        <Overlay visible={open} onRequestClose={() => setOpen(false)} cardStyle={styles.sheetCard}>
          {menu}
        </Overlay>
      </>
    );
  }

  if (
    menuPresentation === "drawer" ||
    menuPresentation === "drawer-top" ||
    menuPresentation === "drawer-bottom"
  ) {
    const drawerPlacement: DrawerPlacement =
      menuPresentation === "drawer-top" ? "top" : "bottom";

    return (
      <>
        {trigger}
        <Drawer
          visible={open}
          placement={drawerPlacement}
          onRequestClose={() => setOpen(false)}
          contentStyle={styles.drawerContent}
        >
          {menu}
        </Drawer>
      </>
    );
  }

  return (
    <BubblePopover
      placement={placement}
      visible={open}
      onVisibleChange={setOpen}
      trigger={trigger}
      bubbleStyle={styles.menuBubble}
      contentStyle={styles.menuContent}
    >
      {menu}
    </BubblePopover>
  );
}

interface SelectDropdownMenuProps<TValue extends string = string> {
  title?: string;
  options: SelectDropdownOption<TValue>[];
  value?: TValue;
  colors: ReturnType<typeof usePulseLegacyColors>;
  renderValue?: (option?: SelectDropdownOption<TValue>) => ReactNode;
  onSelect: (value: TValue) => void;
}

function SelectDropdownMenu<TValue extends string = string>({
  title,
  options,
  value,
  colors,
  renderValue,
  onSelect
}: SelectDropdownMenuProps<TValue>) {
  return (
    <>
      {title ? (
        <View style={styles.menuHeader}>
          <Text style={[styles.menuHeaderText, { color: colors.textMuted }]}>{title}</Text>
        </View>
      ) : null}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.optionRow,
                active && styles.optionRowActive,
                index < options.length - 1 && [styles.optionBorder, { borderBottomColor: colors.border }]
              ]}
            >
              <View style={styles.optionMain}>
                {option.icon ? <View style={styles.optionIcon}>{option.icon}</View> : null}
                <View style={styles.optionTextWrap}>
                  {renderValue && active ? (
                    renderValue(option)
                  ) : (
                    <Text style={[styles.optionLabel, { color: active ? "#1C9EF2" : colors.text }]}>{option.label}</Text>
                  )}
                  {option.description ? (
                    <Text style={[styles.optionDescription, { color: colors.textMuted }]}>{option.description}</Text>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minWidth: 180,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  triggerInline: {
    minWidth: 0,
    minHeight: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    gap: spacing.xs
  },
  triggerLabel: {
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  triggerLabelInline: {
    color: "#1CB0F6"
  },
  triggerPlaceholder: {
    
  },
  triggerChevron: {
    fontSize: typography.bodyLg
  },
  triggerChevronInline: {
    color: "#1CB0F6",
    fontWeight: "700"
  },
  sheetCard: {
    padding: 0,
    overflow: "hidden"
  },
  drawerContent: {
    padding: 0
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
    borderBottomWidth: 1
  },
  menuHeaderText: {
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
    borderBottomWidth: 1
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
    fontSize: typography.title,
    fontWeight: "700"
  },
  optionDescription: {
    fontSize: typography.body
  }
});
