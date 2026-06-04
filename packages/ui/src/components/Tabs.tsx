import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { spacing, typography, usePulseTheme } from "@pulse-ui/core";

export type TabItem<TValue extends string = string> = {
  value: TValue;
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
};

export interface TabsProps<TValue extends string = string> {
  items: readonly TabItem<TValue>[];
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;
  style?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  dividerColor?: string;
}

export function Tabs<TValue extends string = string>({
  items,
  value,
  defaultValue,
  onValueChange,
  style,
  activeColor,
  inactiveColor,
  activeTextColor,
  inactiveTextColor,
  dividerColor
}: TabsProps<TValue>) {
  const theme = usePulseTheme();
  const { colors } = theme;
  const resolvedActiveColor = activeColor ?? colors.brand.secondary;
  const resolvedInactiveColor = inactiveColor ?? colors.border.default;
  const resolvedActiveTextColor = activeTextColor ?? colors.brand.secondary;
  const resolvedInactiveTextColor = inactiveTextColor ?? colors.text.primary;
  const resolvedDividerColor = dividerColor ?? colors.border.default;
  const [internalValue, setInternalValue] = useState<TValue | undefined>(defaultValue ?? items[0]?.value);
  const selectedValue = value ?? internalValue ?? items[0]?.value;

  const handlePress = (nextValue: TValue, disabled?: boolean) => {
    if (disabled) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <View style={[styles.wrapper, { borderBottomColor: resolvedDividerColor }, style]}>
      <View style={styles.row}>
        {items.map((item) => {
          const active = item.value === selectedValue;

          return (
            <Pressable
              key={item.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: active, disabled: item.disabled }}
              disabled={item.disabled}
              onPress={() => handlePress(item.value, item.disabled)}
              style={({ pressed }) => [
                styles.tab,
                item.disabled && styles.disabledTab,
                pressed && !item.disabled && styles.pressedTab
              ]}
            >
              <View style={styles.content}>
                {item.prefix ? <View style={styles.affix}>{item.prefix}</View> : null}
                <Text
                  style={[
                    styles.label,
                    { color: active ? resolvedActiveTextColor : resolvedInactiveTextColor },
                    item.disabled && { color: colors.text.muted }
                  ]}
                >
                  {item.label}
                </Text>
                {item.suffix ? <View style={styles.affix}>{item.suffix}</View> : null}
              </View>
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: active ? resolvedActiveColor : "transparent",
                    borderTopColor: active ? resolvedActiveColor : resolvedInactiveColor
                  }
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderBottomWidth: 1
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  tab: {
    flex: 1,
    minHeight: 68,
    alignItems: "center",
    justifyContent: "space-between"
  },
  pressedTab: {
    opacity: 0.82
  },
  disabledTab: {
    opacity: 0.45
  },
  content: {
    flex: 1,
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  affix: {
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    fontSize: typography.title,
    fontWeight: "800"
  },
  indicator: {
    width: "100%",
    height: 4,
    borderTopWidth: 0
  }
});
