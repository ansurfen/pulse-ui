import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, DateTimePicker, type DateTimeValue } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function DateTimePickerScreen() {
  const [studyDateTime, setStudyDateTime] = useState<DateTimeValue>({
    year: 2024,
    month: 5,
    day: 20,
    hour: 9,
    minute: 30
  });

  return (
    <ScreenTemplate
      title="DateTime Picker"
      description="Duolingo-style date and time picker with a big summary bar, five picker columns, and a large confirm action."
    >
      <View style={styles.stack}>
        <DateTimePicker
          value={studyDateTime}
          onValueChange={setStudyDateTime}
          presentation="dialog"
        />

        <Card title="当前选择">
          <Text style={styles.copy}>
            {studyDateTime.year} 年 {studyDateTime.month.toString().padStart(2, "0")} 月{" "}
            {studyDateTime.day.toString().padStart(2, "0")} 日{" "}
            {studyDateTime.hour.toString().padStart(2, "0")}:
            {studyDateTime.minute.toString().padStart(2, "0")}
          </Text>
        </Card>

        <DateTimePicker
          value={studyDateTime}
          onValueChange={setStudyDateTime}
          presentation="inline"
          yearRange={{ start: 2022, end: 2026 }}
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing["2xl"]
  },
  copy: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "700",
    lineHeight: 24
  }
});
