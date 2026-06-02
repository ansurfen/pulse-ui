import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface StreakBadgeProps {
  days: number;
}

export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.fire}>🔥</Text>
      <View style={styles.copy}>
        <Text style={styles.value}>{days} day streak</Text>
        <Text style={styles.caption}>Keep your momentum alive</Text>
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
    borderWidth: 1,
    borderColor: "#FFD2B2"
  },
  fire: {
    fontSize: 24
  },
  copy: {
    gap: 2
  },
  value: {
    color: colors.streak,
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  caption: {
    color: colors.textMuted,
    fontSize: typography.caption
  }
});

