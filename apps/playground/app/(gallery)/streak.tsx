import { StyleSheet, View } from "react-native";
import { StreakBadge } from "@pulse-ui/ui";
import { spacing } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function StreakScreen() {
  return (
    <ScreenTemplate title="Streaks" description="Streak badges celebrate daily consistency without coupling the component to any app-specific rules.">
      <View style={styles.column}>
        <StreakBadge days={3} />
        <StreakBadge days={14} />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  column: {
    gap: spacing.lg,
    alignItems: "flex-start"
  }
});
