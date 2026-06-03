import { Children, PropsWithChildren, ReactElement, cloneElement, isValidElement } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface SettingsGroupProps extends PropsWithChildren {
  title?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  panelStyle?: ViewStyle;
}

type SettingsRowLikeProps = {
  showDivider?: boolean;
};

export function SettingsGroup({ title, style, titleStyle, panelStyle, children }: SettingsGroupProps) {
  const items = Children.toArray(children);
  const lastIndex = items.length - 1;

  const resolvedChildren = items.map((child, index) => {
    if (!isValidElement<SettingsRowLikeProps>(child)) {
      return child;
    }

    if (index === lastIndex && child.props.showDivider !== false) {
      return cloneElement(child as ReactElement<SettingsRowLikeProps>, { showDivider: false });
    }

    return child;
  });

  return (
    <View style={[styles.root, style]}>
      {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
      <View style={[styles.panel, panelStyle]}>{resolvedChildren}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    gap: spacing.sm
  },
  title: {
    color: "#8C8C8C",
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  panel: {
    width: "100%",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: colors.surface,
    overflow: "hidden"
  }
});
