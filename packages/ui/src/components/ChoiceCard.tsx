import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { radius, spacing, usePulseTheme } from "@pulse-ui/core";
import { useChoiceGroup } from "./ChoiceGroup";

export interface ChoiceCardProps extends PropsWithChildren {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: (value: string) => void;
  style?: ViewStyle;
}

function isChoiceSelected(group: ReturnType<typeof useChoiceGroup>, value: string): boolean {
  if (!group) {
    return false;
  }

  if (group.mode === "multiple") {
    return (group.value ?? []).includes(value);
  }

  return group.value === value;
}

export function ChoiceCard({ value, selected, disabled, onPress, style, children }: ChoiceCardProps) {
  const theme = usePulseTheme();
  const { colors } = theme;
  const group = useChoiceGroup();
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isSelected = selected ?? (group ? isChoiceSelected(group, value) : false);
  const isMultiple = group?.mode === "multiple";
  const depthBase = theme.mode === "dark" ? colors.border.subtle : "#D7D7D7";
  const depthBorder = theme.mode === "dark" ? colors.border.default : "#D0D0D0";
  const faceBorder = theme.mode === "dark" ? colors.border.default : "#E1E1E1";
  const hoverDepth = theme.mode === "dark" ? colors.border.default : "#DCE4EE";
  const hoverDepthBorder = theme.mode === "dark" ? colors.border.strong : "#D3DDEA";
  const hoverFaceBorder = theme.mode === "dark" ? colors.border.strong : "#D3DDEA";
  const hoverFaceBackground = theme.mode === "dark" ? colors.background.subtle : "#FAFCFF";

  function handlePress() {
    if (isDisabled) {
      return;
    }

    onPress?.(value);

    if (!group) {
      return;
    }

    if (group.mode === "multiple") {
      const current = group.value ?? [];
      const next = isSelected ? current.filter((entry) => entry !== value) : [...current, value];
      group.onValueChange?.(next);
      return;
    }

    group.onValueChange?.(value);
  }

  return (
    <Pressable
      accessibilityRole={isMultiple ? "checkbox" : "radio"}
      accessibilityState={{ checked: isSelected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed, hovered }) => [
        styles.shell,
        style,
        pressed && styles.shellPressed,
        isDisabled && styles.cardDisabled
      ]}
    >
      {({ hovered }) => (
        <>
          <View
            style={[
              styles.depth,
              { backgroundColor: depthBase, borderColor: depthBorder },
              isSelected && styles.depthSelected,
              hovered &&
                !isSelected && {
                  backgroundColor: hoverDepth,
                  borderColor: hoverDepthBorder
                }
            ]}
          />
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.surface, borderColor: faceBorder },
              isSelected && styles.cardSelected,
              hovered &&
                !isSelected && {
                  backgroundColor: hoverFaceBackground,
                  borderColor: hoverFaceBorder
                }
            ]}
          >
            <View style={styles.inner}>{children}</View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 256,
    minWidth: 188,
    borderRadius: radius.lg,
    position: "relative"
  },
  shellPressed: {
    transform: [{ translateY: 2 }, { scale: 0.99 }]
  },
  depth: {
    ...StyleSheet.absoluteFillObject,
    top: 4,
    borderRadius: radius.lg,
    borderWidth: 2
  },
  card: {
    minHeight: 250,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.lg
  },
  inner: {
    flex: 1
  },
  depthSelected: {
    backgroundColor: "#8ACFF5",
    borderColor: "#74C7F3"
  },
  cardSelected: {
    borderColor: "#78D0FF",
    backgroundColor: "#DDF2FF"
  },
  cardDisabled: {
    opacity: 0.55
  }
});
