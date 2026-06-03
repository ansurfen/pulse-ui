import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Toggle } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function ToggleScreen() {
  const [soundOn, setSoundOn] = useState(false);
  const [animationOn, setAnimationOn] = useState(true);

  return (
    <ScreenTemplate
      title="Toggle"
      description="Compact game-style toggles with a pill track and a square thumb. Supports controlled usage and custom theme colors."
    >
      <View style={styles.panel}>
        <View style={styles.row}>
          <Text style={styles.label}>音效</Text>
          <Toggle value={soundOn} onValueChange={setSoundOn} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>动画</Text>
          <Toggle value={animationOn} onValueChange={setAnimationOn} />
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    gap: spacing["2xl"]
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "700"
  }
});
