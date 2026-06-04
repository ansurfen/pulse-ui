import { Children, PropsWithChildren, ReactElement, cloneElement, isValidElement } from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";
import { useSettingsBorder } from "./settingsTokens";

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
  const colors = usePulseLegacyColors();
  const settingsBorder = useSettingsBorder();
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
      {title ? <Text style={[styles.title, { color: colors.textMuted }, titleStyle]}>{title}</Text> : null}
      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.surface,
            borderColor: settingsBorder.color
          },
          panelStyle
        ]}
      >
        {resolvedChildren}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    gap: spacing.sm
  },
  title: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  panel: {
    width: "100%",
    borderRadius: radius.md,
    borderWidth: 2,
    overflow: "hidden"
  }
});
