import { MotiView } from "moti";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface CoinProps {
  amount?: number;
}

export function Coin({ amount = 128 }: CoinProps) {
  return (
    <View style={styles.wrapper}>
      <MotiView
        animate={{ translateY: [0, -4, 0], rotate: ["0deg", "8deg", "-8deg", "0deg"] }}
        transition={{ type: "timing", duration: 1600, loop: true }}
        style={styles.coin}
      >
        <Text style={styles.coinText}>◉</Text>
      </MotiView>
      <Text style={styles.amount}>+{amount} coins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: spacing.sm
  },
  coin: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: "#FFF3BF",
    borderWidth: 4,
    borderColor: colors.coin,
    alignItems: "center",
    justifyContent: "center"
  },
  coinText: {
    fontSize: 34,
    color: "#C78800"
  },
  amount: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  }
});

