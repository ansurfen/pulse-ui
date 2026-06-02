import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Heart } from "@pulse-ui/ui";
import { spacing } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function HeartScreen() {
  const [active, setActive] = useState(true);

  return (
    <ScreenTemplate title="Hearts" description="Hearts represent life, attempts, and forgiving retry loops across learning and game flows.">
      <View style={styles.row}>
        <Heart active={active} label={active ? "Life Available" : "Life Spent"} onToggle={setActive} />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.lg,
    alignItems: "flex-start"
  }
});

