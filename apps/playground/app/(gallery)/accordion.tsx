import { Pressable, StyleSheet, Text, View } from "react-native";
import { Accordion, AccordionItem } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function AccordionScreen() {
  return (
    <ScreenTemplate
      title="Accordion"
      description="Expandable FAQ-style rows for help centers, settings details, and any collapsible content block."
    >
      <View style={styles.wrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.primaryLink}>使用多邻国</Text>
        </View>
        <Accordion style={styles.accordion}>
        <AccordionItem
          title="我的课程为什么跟原来不一样了？"
          defaultExpanded
        >
          <Text style={styles.body}>
            多邻国一直致力于不断优化教学内容，为你提供更优质高效的教育。在课程优化的过程中，我们会加入新内容，也会对原有内容进行修改和调整，因此你在学习小径中的位置可能有所变动。别担心，这些变动都是为了提供更美好的学习体验，让你不错过最新精彩内容！
          </Text>
          <Pressable style={styles.linkWrap}>
            <Text style={styles.link}>查看更多</Text>
          </Pressable>
        </AccordionItem>

        <AccordionItem title="什么是连胜？">
          <Text style={styles.body}>连胜表示你连续完成学习任务的天数，可以作为坚持学习的反馈指标。</Text>
        </AccordionItem>

        <AccordionItem title="什么是排行榜和排行榜等级？">
          <Text style={styles.body}>排行榜用于和其他学习者比较活跃度，等级则表示你所在的分组段位。</Text>
        </AccordionItem>

        <AccordionItem title="多邻国使用开源库吗？">
          <Text style={styles.body}>可以在这里放许可证说明、外部链接，或者更完整的帮助文档内容。</Text>
        </AccordionItem>
        </Accordion>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%"
  },
  titleRow: {
    minHeight: 72,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#E1E1E1",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.surface
  },
  accordion: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  primaryLink: {
    color: "#1CB0F6",
    fontSize: typography.title,
    fontWeight: "800"
  },
  body: {
    color: "#4B4B4B",
    fontSize: typography.title,
    lineHeight: 34,
    fontWeight: "500"
  },
  linkWrap: {
    alignSelf: "flex-start"
  },
  link: {
    color: "#1CB0F6",
    fontSize: typography.title,
    fontWeight: "800"
  }
});
