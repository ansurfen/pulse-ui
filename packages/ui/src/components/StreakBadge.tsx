import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export interface StreakBadgeProps {
  days: number;
}

export function StreakBadge({ days }: StreakBadgeProps) {
  const colors = usePulseLegacyColors();
  return (
    <View style={[styles.badge, { borderColor: `${colors.streak}44` }]}>
      <Text style={styles.fire}>🔥</Text>
      <View style={styles.copy}>
        <Text style={[styles.value, { color: colors.streak }]}>{days} day streak</Text>
        <Text style={[styles.caption, { color: colors.textMuted }]}>Keep your momentum alive</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: "#FFF1E8",
    borderWidth: 1
  },
  fire: {
    fontSize: 24
  },
  copy: {
    gap: 2
  },
  value: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  caption: {
    fontSize: typography.caption
  }
});
