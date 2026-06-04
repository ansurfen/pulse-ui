import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, CalendarStrip, Dialog } from "@pulse-ui/ui";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function CalendarScreen() {
  const theme = usePulseTheme();
  const { colors } = theme;
  const [mode, setMode] = useState<"week" | "month">("week");
  const [visibleDate, setVisibleDate] = useState(new Date(2026, 5, 3));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 3));
  const [dialogDate, setDialogDate] = useState<Date | null>(null);

  const highlightedDates = useMemo(
    () => [
      new Date(2026, 5, 3),
      new Date(2026, 5, 6),
      new Date(2026, 5, 9),
      new Date(2026, 5, 16),
      new Date(2026, 5, 24)
    ],
    []
  );

  return (
    <ScreenTemplate
      title="Calendar"
      description="A Duolingo-style calendar strip that can render the current week or a whole month, with theme colors, controlled navigation, and highlighted day states."
    >
      <View style={styles.wrapper}>
        <View style={styles.controlRow}>
          <Button
            label="本周"
            tone="flat"
            backgroundColor={mode === "week" ? "#FFF0DB" : "#FFFFFF"}
            textColor={mode === "week" ? "#FF9600" : "#767B84"}
            borderColor={mode === "week" ? "#FFC987" : "#D9D9D9"}
            onPress={() => setMode("week")}
          />
          <Button
            label="本月"
            tone="flat"
            backgroundColor={mode === "month" ? "#EAF7FF" : "#FFFFFF"}
            textColor={mode === "month" ? "#1CB0F6" : "#767B84"}
            borderColor={mode === "month" ? "#8DDCFF" : "#D9D9D9"}
            onPress={() => setMode("month")}
          />
        </View>

        <View style={[styles.previewBlock, { backgroundColor: colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{theme.mode === "dark" ? "Orange Theme / Dark" : "Orange Theme"}</Text>
          <CalendarStrip
            mode={mode}
            visibleDate={visibleDate}
            highlightedDates={highlightedDates}
            onVisibleDateChange={setVisibleDate}
            onDatePress={({ date }) => {
              setSelectedDate(date);
              setDialogDate(date);
            }}
            highlightVariant="check"
            theme={{
              accentColor: "#FF9600",
              accentTextColor: "#FFFFFF",
              textColor: "#9EA3AC",
              mutedTextColor: "#D7D9DE",
              dayBackgroundColor: "#E5E5E8"
            }}
          />
        </View>

        <View style={[styles.previewBlock, { backgroundColor: colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{theme.mode === "dark" ? "Blue Theme / Dark" : "Blue Theme"}</Text>
          <CalendarStrip
            mode="week"
            visibleDate={visibleDate}
            highlightedDates={[new Date(2026, 5, 2), new Date(2026, 5, 5)]}
            highlightVariant="fill"
            theme={{
              accentColor: "#1CB0F6",
              accentTextColor: "#FFFFFF",
              textColor: "#99A2AE",
              mutedTextColor: "#D7DCE3",
              dayBackgroundColor: "#E9EEF4"
            }}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.background.subtle }]}>
          <Text style={[styles.infoText, { color: colors.text.muted }]}>
            当前选中：
            {`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`}
          </Text>
        </View>
      </View>
      <Dialog
        visible={Boolean(dialogDate)}
        title="继续努力"
        description={dialogDate ? `你点击了 ${dialogDate.getMonth() + 1} 月 ${dialogDate.getDate()} 日。这里可以接弹窗、详情或打卡逻辑。` : undefined}
        actions={[{ label: "继续努力", onPress: () => setDialogDate(null) }]}
        dismissAction={{ label: "退出", onPress: () => setDialogDate(null) }}
        onRequestClose={() => setDialogDate(null)}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl
  },
  controlRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  previewBlock: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg
  },
  sectionTitle: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  infoCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md
  },
  infoText: {
    fontSize: typography.body,
    fontWeight: "600"
  }
});
