import { MotiView } from "moti";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface HeartProps {
  active?: boolean;
  label?: string;
  onToggle?: (next: boolean) => void;
}

export function Heart({ active = true, label = "Life", onToggle }: HeartProps) {
  return (
    <Pressable onPress={() => onToggle?.(!active)} style={styles.pressable}>
      <MotiView
        animate={{
          scale: active ? 1 : 0.94,
          opacity: active ? 1 : 0.6
        }}
        transition={{ type: "timing", duration: 220 }}
        style={[styles.heart, active ? styles.active : styles.inactive]}
      >
        <Text style={styles.icon}>{active ? "♥" : "♡"}</Text>
      </MotiView>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    gap: spacing.sm
  },
  heart: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#FFE2E7"
  },
  inactive: {
    backgroundColor: colors.surfaceAlt
  },
  icon: {
    fontSize: 38,
    color: colors.heart
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600"
  }
});

