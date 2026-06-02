import { StyleSheet, View } from "react-native";
import { Coin } from "@pulse-ui/ui";
import { spacing } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function CoinScreen() {
  return (
    <ScreenTemplate title="Coins" description="Coins provide instant reward feedback for lessons, check-ins, quests, and progression milestones.">
      <View style={styles.row}>
        <Coin amount={24} />
        <Coin amount={120} />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl
  }
});

