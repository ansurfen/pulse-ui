import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CoinIcon, countryCatalog, FireIcon, FlagIcon, GemIcon, HeartIcon, LightningIcon } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const gameIcons = [
  { label: "CoinIcon", Component: CoinIcon },
  { label: "FireIcon", Component: FireIcon },
  { label: "GemIcon", Component: GemIcon },
  { label: "HeartIcon", Component: HeartIcon },
  { label: "LightningIcon", Component: LightningIcon }
] as const;

export default function IconsScreen() {
  return (
    <ScreenTemplate
      title="Icons"
      description="PNG game icons and rounded flag tiles."
    >
      <Text style={styles.sectionTitle}>Game Icons</Text>
      <View style={styles.grid}>
        {gameIcons.map(({ label, Component }) => (
          <View key={label} style={styles.card}>
            <Component size={72} />
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Flag Icons</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flagRow}>
        {countryCatalog.map((item) => (
          <View key={item.id} style={styles.flagItem}>
            <FlagIcon country={item.id} size={44} />
            <Text style={styles.flagLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    marginBottom: spacing["3xl"]
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
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
    paddingBottom: spacing.lg
  },
  flagItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  flagLabel: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "600"
  }
});
