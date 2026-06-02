import { StyleSheet, Text, View } from "react-native";
import { CoinIcon, FireIcon, GemIcon, HeartIcon, LightningIcon } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const items = [
  { label: "CoinIcon", Component: CoinIcon },
  { label: "FireIcon", Component: FireIcon },
  { label: "GemIcon", Component: GemIcon },
  { label: "HeartIcon", Component: HeartIcon },
  { label: "LightningIcon", Component: LightningIcon }
] as const;

export default function IconsScreen() {
  return (
    <ScreenTemplate title="Icons" description="PNG-based icon components wrapped for direct import from the UI package.">
      <View style={styles.grid}>
        {items.map(({ label, Component }) => (
          <View key={label} style={styles.card}>
            <Component size={72} />
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg
  },
  card: {
    minWidth: 160,
    minHeight: 150,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  }
});
