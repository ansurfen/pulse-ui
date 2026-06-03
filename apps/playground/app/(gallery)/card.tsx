import { StyleSheet, Text, View } from "react-native";
import { Card } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function CardScreen() {
  return (
    <ScreenTemplate
      title="Cards"
      description="Card supports flat and elevated tones. Elevated cards use the same bottom depth treatment as Button."
    >
      <View style={styles.stack}>
        <Card>
          <Text style={styles.paragraph}>
            多邻国一直致力于不断优化教学内容，为你提供更优质高效的教育。在课程优化的过程中，我们会加入新内容，也会对原有内容进行修改和调整，因此你在学习小径中的位置可能有所变动。别担心，这些变动都是为了提供更美好的学习体验，让你不错过最新精彩内容！
          </Text>
        </Card>

        <View style={styles.elevatedRow}>
          <Card contentStyle={styles.collectibleContent} padded={false} style={styles.collectibleCard} tone="elevated">
            <Text style={styles.emoji}>🍜</Text>
            <Text style={styles.collectibleTitle}>拉面</Text>
            <Text style={styles.collectibleMeta}>★ ★ ★</Text>
          </Card>

          <Card contentStyle={styles.collectibleContent} padded={false} style={styles.collectibleCard} tone="elevated">
            <Text style={[styles.emoji, styles.emojiLocked]}>🐙</Text>
            <Text style={styles.collectibleTitle}>章鱼烧</Text>
            <Text style={styles.lockedLabel}>未解锁</Text>
          </Card>
        </View>

        <Card
          title="相关问答"
          footer={
            <View style={styles.linkList}>
              <Text style={styles.link}>什么是连胜？</Text>
              <Text style={styles.link}>什么是排行榜和排行榜等级？</Text>
              <Text style={styles.link}>多邻国使用开源库吗？</Text>
              <Text style={styles.link}>我想提交错误报告</Text>
            </View>
          }
          padded={false}
          contentStyle={styles.emptyContent}
        />

        <Card title="帐户">
          <View style={styles.menuList}>
            <Text style={styles.menuItem}>偏好设置</Text>
            <Text style={styles.menuItem}>隐私设置</Text>
          </View>
        </Card>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    gap: spacing.xl
  },
  paragraph: {
    color: "#3F3F3F",
    fontSize: typography.title,
    lineHeight: 40,
    fontWeight: "600"
  },
  elevatedRow: {
    flexDirection: "row",
    gap: spacing.lg
  },
  collectibleCard: {
    flex: 1
  },
  collectibleContent: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm
  },
  emoji: {
    fontSize: 42,
    lineHeight: 50
  },
  emojiLocked: {
    opacity: 0.45
  },
  collectibleTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  collectibleMeta: {
    color: "#FFC800",
    fontSize: typography.body,
    fontWeight: "800",
    letterSpacing: 2
  },
  lockedLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  emptyContent: {
    minHeight: 0
  },
  linkList: {
    gap: spacing.lg
  },
  link: {
    color: "#1CB0F6",
    fontSize: typography.title,
    fontWeight: "800"
  },
  menuList: {
    gap: spacing.xl,
    paddingLeft: spacing.lg
  },
  menuItem: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "700"
  }
});
