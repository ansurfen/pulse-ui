import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MatchToken, type MatchTokenStatus } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

interface PairItem {
  value: string;
  index: number;
  leftLabel: string;
  rightLabel: string;
}

const pairs: PairItem[] = [
  { value: "welcome", index: 5, leftLabel: "欢迎", rightLabel: "welcome" },
  { value: "hot", index: 7, leftLabel: "热", rightLabel: "hot" },
  { value: "museum", index: 3, leftLabel: "博物馆", rightLabel: "museum" }
];

type Side = "left" | "right";
type TokenKey = `${Side}:${string}`;

function getTokenKey(side: Side, value: string): TokenKey {
  return `${side}:${value}`;
}

export default function MatchTokenScreen() {
  const [selected, setSelected] = useState<{ side: Side; value: string } | null>(null);
  const [resolved, setResolved] = useState<Record<TokenKey, MatchTokenStatus>>({} as Record<TokenKey, MatchTokenStatus>);

  const leftItems = useMemo(
    () =>
      pairs.map((item) => ({
        side: "left" as const,
        value: item.value,
        index: item.index,
        label: item.leftLabel
      })),
    []
  );

  const rightItems = useMemo(
    () =>
      pairs.map((item) => ({
        side: "right" as const,
        value: item.value,
        index: item.index,
        label: item.rightLabel
      })),
    []
  );

  const handlePress = (side: Side, value: string) => {
    const currentKey = getTokenKey(side, value);

    if (resolved[currentKey] === "correct") {
      return;
    }

    if (!selected) {
      setSelected({ side, value });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }

    if (selected.value === value) {
      const firstKey = getTokenKey(selected.side, selected.value);
      setResolved((current) => ({
        ...current,
        [firstKey]: "correct",
        [currentKey]: "correct"
      }));
      setSelected(null);

      return;
    }

    const firstKey = getTokenKey(selected.side, selected.value);
    setResolved((current) => ({
      ...current,
      [firstKey]: "wrong",
      [currentKey]: "wrong"
    }));
    setSelected(null);

    setTimeout(() => {
      setResolved((current) => {
        const next = { ...current };
        if (next[firstKey] === "wrong") {
          delete next[firstKey];
        }
        if (next[currentKey] === "wrong") {
          delete next[currentKey];
        }
        return next;
      });
    }, 720);
  };

  const getStatus = (side: Side, value: string): MatchTokenStatus => {
    const state = resolved[getTokenKey(side, value)];

    if (state === "correct") {
      return "correct";
    }

    if (state === "wrong") {
      return "wrong";
    }

    if (selected?.side === side && selected.value === value) {
      return "selected";
    }

    return "idle";
  };

  return (
    <ScreenTemplate title="Match Tokens" description="Duolingo-style match chips for vocabulary pairing. Correct matches flash green with celebratory sparkles, while wrong picks briefly turn red.">
      <View style={styles.wrapper}>
        <View style={styles.previewBlock}>
          <Text style={styles.sectionTitle}>States</Text>
          <View style={styles.stateStack}>
            <MatchToken label="热" value="state-idle" index={7} status="idle" />
            <MatchToken label="coffee" value="state-selected" index={2} status="selected" />
            <MatchToken label="欢迎" value="state-correct" index={5} status="correct" />
            <MatchToken label="museum" value="state-wrong" index={3} status="wrong" />
          </View>
        </View>

        <View style={styles.previewBlock}>
          <Text style={styles.sectionTitle}>Interactive Pairing</Text>
          <Text style={styles.helper}>Tap one chip on the left and one on the right. Matching pairs turn green, mismatches flash red.</Text>
          <View style={styles.matchGrid}>
            <View style={styles.column}>
              {leftItems.map((item) => (
                <MatchToken
                  key={`left-${item.value}`}
                  label={item.label}
                  value={item.value}
                  index={item.index}
                  status={getStatus("left", item.value)}
                  onPress={() => handlePress("left", item.value)}
                />
              ))}
            </View>
            <View style={styles.column}>
              {rightItems.map((item) => (
                <MatchToken
                  key={`right-${item.value}`}
                  label={item.label}
                  value={item.value}
                  index={item.index}
                  status={getStatus("right", item.value)}
                  onPress={() => handlePress("right", item.value)}
                />
              ))}
            </View>
          </View>
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
    borderRadius: radius.lg,
    backgroundColor: "#F8FAFD"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  stateStack: {
    gap: spacing.md
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  matchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl
  },
  column: {
    flex: 1,
    minWidth: 280,
    gap: spacing.md
  }
});
