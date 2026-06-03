import { PropsWithChildren, ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

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
  return <View style={[styles.group, style]}>{children}</View>;
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
    <View style={[styles.item, style]}>
      <Pressable
        disabled={disabled}
        onPress={() => setExpanded(!isExpanded)}
        style={({ pressed }) => [
          styles.header,
          pressed && !disabled && styles.headerPressed,
          disabled && styles.disabled
        ]}
      >
        <View style={styles.titleWrap}>
          {typeof title === "string" ? <Text style={styles.title}>{title}</Text> : title}
        </View>
        <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>⌃</Text>
      </Pressable>

      {isExpanded ? <View style={[styles.content, contentStyle]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "#E1E1E1",
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  item: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5"
  },
  header: {
    minHeight: 74,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface
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
    color: "#3E3E3E",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24
  },
  chevron: {
    color: "#7E7E7E",
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
    gap: spacing.lg,
    backgroundColor: colors.surface
  }
});
