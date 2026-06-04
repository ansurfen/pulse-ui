import { MotiView } from "moti";
import { Pressable, StyleSheet, Text } from "react-native";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export interface HeartProps {
  active?: boolean;
  label?: string;
  onToggle?: (next: boolean) => void;
}

export function Heart({ active = true, label = "Life", onToggle }: HeartProps) {
  const colors = usePulseLegacyColors();
  return (
    <Pressable onPress={() => onToggle?.(!active)} style={styles.pressable}>
      <MotiView
        animate={{
          scale: active ? 1 : 0.94,
          opacity: active ? 1 : 0.6
        }}
        transition={{ type: "timing", duration: 220 }}
        style={[styles.heart, active ? styles.active : [styles.inactive, { backgroundColor: colors.surfaceAlt }]]}
      >
        <Text style={[styles.icon, { color: colors.heart }]}>{active ? "♥" : "♡"}</Text>
      </MotiView>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
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
    
  },
  icon: {
    fontSize: 38
  },
  label: {
    fontSize: typography.body,
    fontWeight: "600"
  }
});
