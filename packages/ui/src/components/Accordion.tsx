import { PropsWithChildren, ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";

export interface AccordionItemProps extends PropsWithChildren {
  title: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export interface AccordionProps extends PropsWithChildren {
  style?: ViewStyle;
}

export function Accordion({ children, style }: AccordionProps) {
  const theme = usePulseTheme();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.group,
        {
          borderColor: colors.border.default,
          backgroundColor: colors.background.surface
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

export function AccordionItem({
  title,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  disabled = false,
  style,
  contentStyle,
  children
}: AccordionItemProps) {
  const theme = usePulseTheme();
  const { colors } = theme;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = typeof expanded === "boolean";
  const isExpanded = isControlled ? expanded : internalExpanded;

  const setExpanded = (next: boolean) => {
    if (!isControlled) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  };

  return (
    <View style={[styles.item, { borderBottomColor: colors.border.default }, style]}>
      <Pressable
        disabled={disabled}
        onPress={() => setExpanded(!isExpanded)}
        style={({ pressed }) => [
          styles.header,
          { backgroundColor: colors.background.surface },
          pressed && !disabled && styles.headerPressed,
          disabled && styles.disabled
        ]}
      >
        <View style={styles.titleWrap}>
          {typeof title === "string" ? <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text> : title}
        </View>
        <Text style={[styles.chevron, { color: colors.text.muted }, isExpanded && styles.chevronExpanded]}>⌃</Text>
      </Pressable>

      {isExpanded ? <View style={[styles.content, { backgroundColor: colors.background.surface }, contentStyle]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: "hidden"
  },
  item: {
    width: "100%",
    borderBottomWidth: 1
  },
  header: {
    minHeight: 74,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerPressed: {
    opacity: 0.9
  },
  disabled: {
    opacity: 0.5
  },
  titleWrap: {
    flex: 1,
    paddingRight: spacing.lg
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24
  },
  chevron: {
    fontSize: 26,
    lineHeight: 26,
    transform: [{ rotate: "180deg" }]
  },
  chevronExpanded: {
    transform: [{ rotate: "0deg" }]
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
    gap: spacing.lg
  }
});
