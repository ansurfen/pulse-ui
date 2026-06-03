import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, spacing } from "@pulse-ui/core";
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
  const group = useChoiceGroup();
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isSelected = selected ?? (group ? isChoiceSelected(group, value) : false);
  const isMultiple = group?.mode === "multiple";

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
              isSelected && styles.depthSelected,
              hovered && !isSelected && styles.depthHovered
            ]}
          />
          <View
            style={[
              styles.card,
              isSelected && styles.cardSelected,
              hovered && !isSelected && styles.cardHovered
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
    backgroundColor: "#D7D7D7",
    borderWidth: 2,
    borderColor: "#D0D0D0"
  },
  card: {
    minHeight: 250,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "#E1E1E1",
    backgroundColor: colors.surface,
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
  depthHovered: {
    backgroundColor: "#DCE4EE",
    borderColor: "#D3DDEA"
  },
  cardHovered: {
    borderColor: "#D3DDEA",
    backgroundColor: "#FAFCFF"
  },
  cardDisabled: {
    opacity: 0.55
  }
});
