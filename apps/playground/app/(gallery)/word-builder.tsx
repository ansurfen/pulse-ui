import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WordBuilder, type WordBuilderItem } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const allItems: WordBuilderItem[] = [
  { id: "and", label: "and" },
  { id: "coffee", label: "coffee" },
  { id: "with", label: "with" },
  { id: "tea", label: "tea" }
];

const advancedItems: WordBuilderItem[] = [
  { id: "i", label: "I" },
  { id: "would", label: "would" },
  { id: "like", label: "like" },
  { id: "to", label: "to" },
  { id: "visit", label: "visit" },
  { id: "the", label: "the" },
  { id: "museum", label: "museum" },
  { id: "with", label: "with" },
  { id: "my", label: "my" },
  { id: "friends", label: "friends" },
  { id: "this", label: "this" },
  { id: "weekend", label: "weekend" }
];

export default function WordBuilderScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["and", "coffee"]);
  const [advancedAnswerRows, setAdvancedAnswerRows] = useState<string[][]>([
    ["i", "would", "like"],
    ["to", "visit", "museum"],
    ["the", "with", "my"],
    ["friends", "this", "weekend"]
  ]);

  return (
    <ScreenTemplate title="Word Builder" description="A Duolingo-style word bank layout where selected words leave placeholders in their original bank slots and return to the same position when removed.">
      <View style={styles.wrapper}>
        <View style={styles.exampleBlock}>
          <Text style={styles.exampleTitle}>Basic</Text>
          <WordBuilder
            items={allItems}
            selectedIds={selectedIds}
            onSelectedItemPress={(item) => {
              setSelectedIds((current) => current.filter((id) => id !== item.id));
            }}
            onOptionItemPress={(item) => {
              setSelectedIds((current) => [...current, item.id]);
            }}
          />
        </View>
        <View style={styles.exampleBlock}>
          <Text style={styles.exampleTitle}>Long Sentence</Text>
          <WordBuilder
            items={advancedItems}
            answerRows={advancedAnswerRows}
            onSelectedItemPress={(item) => {
              setAdvancedAnswerRows((current) =>
                current.map((row) => row.filter((id) => id !== item.id))
              );
            }}
            onOptionItemPress={(item) => {
              setAdvancedAnswerRows((current) => {
                const nextRows = current.map((row) => [...row]);
                const targetRowIndex = nextRows.findIndex((row) => row.length < 3);

                if (targetRowIndex >= 0) {
                  nextRows[targetRowIndex].push(item.id);
                  return nextRows;
                }

                nextRows.push([item.id]);
                return nextRows;
              });
            }}
          />
        </View>
        <Text style={styles.hint}>Tap a chip to move it between the answer row and its original slot in the word bank.</Text>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl
  },
  exampleBlock: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: "#F8FAFD"
  },
  exampleTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.bodyLg
  }
});
