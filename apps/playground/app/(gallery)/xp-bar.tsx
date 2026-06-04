import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, XPBar } from "@pulse-ui/ui";
import { spacing, usePulseTheme } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function XPBarScreen() {
  const theme = usePulseTheme();
  const [demoValue, setDemoValue] = useState(12);
  const neutralTrack = theme.mode === "dark" ? theme.colors.background.surfaceAlt : "#E5E5E5";
  const infoTrack = theme.mode === "dark" ? theme.colors.background.surfaceAlt : "#E9EEF5";

  return (
    <ScreenTemplate title="XP Bars" description="Duolingo-inspired progress bars with staged colors, animated progress gain, and configurable end-cap effects that stay in sync with the fill color.">
      <View style={styles.column}>
        <XPBar label="" showValue={false} value={10} max={100} fillColor="#58CC02" trackColor={neutralTrack} height={16} />
        <XPBar label="Explorer Rank" value={32} max={100} fillColor="#58CC02" trackColor={neutralTrack} />
        <XPBar label="Lesson Mastery" value={76} max={100} fillColor="#2BA6E6" trackColor={infoTrack} />
        <XPBar
          label="Stage Color Demo"
          value={demoValue}
          max={100}
          fillColor="#58CC02"
          trackColor={infoTrack}
          height={18}
          stages={[
            { at: 0, color: "#58CC02" },
            { at: 35, color: "#FFB648" },
            { at: 70, color: "#1CB0F6" }
          ]}
        />
        <Button
          label="增加进度"
          backgroundColor="#58CC02"
          onPress={() => {
            setDemoValue((current) => (current >= 100 ? 8 : Math.min(current + 14, 100)));
          }}
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  column: {
    width: "100%",
    gap: spacing.xl
  }
});
