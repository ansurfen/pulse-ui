import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Tabs, type TabItem } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

type MissionTab = "special" | "badge";

const missionTabs: readonly TabItem<MissionTab>[] = [
  { value: "special", label: "特别任务" },
  { value: "badge", label: "独家徽章" }
];

export default function TabScreen() {
  const [value, setValue] = useState<MissionTab>("badge");

  const content = useMemo(() => {
    if (value === "badge") {
      return {
        title: "独家徽章",
        body: "当前选中项使用蓝色文字和底部蓝色横线，整体是更轻、更扁的顶部导航 tab。"
      };
    }

    return {
      title: "特别任务",
      body: "未选中项保持深灰文字，没有按钮外壳，只在底部保留一条很轻的分隔线。"
    };
  }, [value]);

  return (
    <ScreenTemplate
      title="Tabs"
      description="Top navigation tabs styled like Duolingo: bold text, bottom divider, and a single active underline."
    >
      <View style={styles.stack}>
        <Tabs items={missionTabs} value={value} onValueChange={setValue} />

        <Card title={content.title}>
          <Text style={styles.body}>{content.body}</Text>
        </Card>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.xl
  },
  body: {
    color: colors.text,
    fontSize: typography.bodyLg,
    lineHeight: 24
  }
});
