import { StyleSheet, Text, View } from "react-native";
import { MatchBoard, MatchToken } from "@pulse-ui/ui";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const basicPairs = [
  { value: "welcome", index: 5, leftLabel: "欢迎", rightLabel: "welcome" },
  { value: "hot", index: 7, leftLabel: "热", rightLabel: "hot" },
  { value: "museum", index: 3, leftLabel: "博物馆", rightLabel: "museum" }
] as const;

const customPairs = [
  { value: "coffee", index: 2, emoji: "☕", leftLabel: "coffee", rightLabel: "咖啡" },
  { value: "tea", index: 1, emoji: "🍵", leftLabel: "tea", rightLabel: "茶" },
  { value: "museum", index: 3, emoji: "🏛️", leftLabel: "museum", rightLabel: "博物馆" }
] as const;

const refillPairs = [
  { value: "coffee", index: 1, emoji: "☕", leftLabel: "coffee", rightLabel: "咖啡" },
  { value: "tea", index: 2, emoji: "🍵", leftLabel: "tea", rightLabel: "茶" },
  { value: "museum", index: 3, emoji: "🏛️", leftLabel: "museum", rightLabel: "博物馆" },
  { value: "book", index: 4, emoji: "📘", leftLabel: "book", rightLabel: "书" },
  { value: "train", index: 5, emoji: "🚆", leftLabel: "train", rightLabel: "火车" },
  { value: "hotel", index: 6, emoji: "🏨", leftLabel: "hotel", rightLabel: "酒店" },
  { value: "bread", index: 7, emoji: "🥖", leftLabel: "bread", rightLabel: "面包" },
  { value: "music", index: 8, emoji: "🎵", leftLabel: "music", rightLabel: "音乐" },
  { value: "river", index: 9, emoji: "🌊", leftLabel: "river", rightLabel: "河流" },
  { value: "ticket", index: 10, emoji: "🎫", leftLabel: "ticket", rightLabel: "票" }
] as const;

function EmojiLabel({ emoji, label }: { emoji: string; label: string }) {
  const theme = usePulseTheme();

  return (
    <View style={styles.customTokenRow}>
      <Text style={styles.customEmoji}>{emoji}</Text>
      <Text style={[styles.customLabel, { color: theme.colors.text.primary }]}>{label}</Text>
    </View>
  );
}

export default function MatchTokenScreen() {
  const theme = usePulseTheme();

  return (
    <ScreenTemplate
      title="Match Tokens"
      description="Duolingo-style match chips with reusable board logic: shuffled columns, configurable visible rows, gray-disabled resolved states, and auto-refill when more data is waiting."
    >
      <View style={styles.wrapper}>
        <View style={[styles.previewBlock, { backgroundColor: theme.colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>States</Text>
          <View style={styles.stateStack}>
            <MatchToken label="热" value="state-idle" index={7} status="idle" />
            <MatchToken label="coffee" value="state-selected" index={2} status="selected" />
            <MatchToken label="欢迎" value="state-correct" index={5} status="correct" />
            <MatchToken label="museum" value="state-disabled" index={3} status="disabled" />
          </View>
        </View>

        <View style={[styles.previewBlock, { backgroundColor: theme.colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Basic Board</Text>
          <Text style={[styles.helper, { color: theme.colors.text.muted }]}>
            Left and right are automatically shuffled. A correct match turns green, then becomes gray and unselectable.
          </Text>
          <MatchBoard items={basicPairs} rows={3} />
        </View>

        <View style={[styles.previewBlock, { backgroundColor: theme.colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Custom Content</Text>
          <Text style={[styles.helper, { color: theme.colors.text.muted }]}>
            Left side uses custom token content with emoji + English. Right side keeps the Chinese meaning.
          </Text>
          <MatchBoard
            items={customPairs}
            rows={3}
            renderLeft={(item) => <EmojiLabel emoji={item.emoji} label={item.leftLabel} />}
          />
        </View>

        <View style={[styles.previewBlock, { backgroundColor: theme.colors.background.surfaceAlt }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Auto Refill</Text>
          <Text style={[styles.helper, { color: theme.colors.text.muted }]}>
            This board only shows 4 rows at a time, but it has 10 pairs underneath. After a correct match goes green and then gray, a new pair appears to replace it.
          </Text>
          <MatchBoard
            items={refillPairs}
            rows={4}
            renderLeft={(item) => <EmojiLabel emoji={item.emoji} label={item.leftLabel} />}
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl
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
  stateStack: {
    gap: spacing.md
  },
  helper: {
    fontSize: typography.body
  },
  customTokenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  customEmoji: {
    fontSize: 22,
    lineHeight: 24
  },
  customLabel: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  }
});
