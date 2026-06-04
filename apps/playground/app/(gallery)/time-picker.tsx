import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, TimePicker, type TimeValue } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function TimePickerScreen() {
  const [studyTime, setStudyTime] = useState<TimeValue>({
    hour: 7,
    minute: 30,
    period: "AM"
  });
  const [reviewTime, setReviewTime] = useState<TimeValue>({
    hour: 21,
    minute: 0
  });

  return (
    <ScreenTemplate
      title="Time Picker"
      description="Duolingo-style time selector with chunky selectable chips, a bold current time display, and support for 12h or 24h formats."
    >
      <View style={styles.stack}>
        <TimePicker value={studyTime} onValueChange={setStudyTime} />

        <Card title="当前提醒">
          <Text style={styles.copy}>学习提醒：{studyTime.hour}:{studyTime.minute.toString().padStart(2, "0")} {studyTime.period}</Text>
          <Text style={styles.copy}>复习提醒：{reviewTime.hour.toString().padStart(2, "0")}:{reviewTime.minute.toString().padStart(2, "0")}</Text>
        </Card>

        <TimePicker
          value={studyTime}
          onValueChange={setStudyTime}
          presentation="dialog"
          dialogTitle="选择学习提醒时间"
        />

        <TimePicker
          value={reviewTime}
          onValueChange={setReviewTime}
          format="24h"
          minuteStep={15}
          hourAccentColor="#58CC02"
          minuteAccentColor="#1CB0F6"
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
