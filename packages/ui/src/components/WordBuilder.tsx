import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export interface WordBuilderItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface WordBuilderProps {
  items: WordBuilderItem[];
  selectedIds?: string[];
  answerRows?: string[][];
  onSelectedItemPress?: (item: WordBuilderItem) => void;
  onOptionItemPress?: (item: WordBuilderItem) => void;
  style?: ViewStyle;
}

export function WordBuilder({
  items,
  selectedIds,
  answerRows,
  onSelectedItemPress,
  onOptionItemPress,
  style
}: WordBuilderProps) {
  const colors = usePulseLegacyColors();
  const resolvedAnswerRows = answerRows && answerRows.length > 0 ? answerRows : [selectedIds ?? []];
  const resolvedSelectedIds = resolvedAnswerRows.flat();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.answerArea}>
        {resolvedAnswerRows.map((row, rowIndex) => (
          <View key={`answer-row-${rowIndex}`} style={styles.answerLine}>
            <View style={styles.selectedRow}>
              {row.map((id) => {
                const item = items.find((entry) => entry.id === id);

                if (!item) {
                  return null;
                }

                return (
                  <WordToken
                    key={item.id}
                    label={item.label}
                    disabled={item.disabled}
                    colors={colors}
                    onPress={onSelectedItemPress ? () => onSelectedItemPress(item) : undefined}
                  />
                );
              })}
            </View>
            <View style={styles.divider} />
          </View>
        ))}
      </View>
      <View style={styles.optionsRow}>
        {items.map((item) =>
          resolvedSelectedIds.includes(item.id) ? (
            <View key={item.id} style={styles.placeholder}>
              <Text style={styles.placeholderLabel}>{item.label}</Text>
            </View>
          ) : (
            <WordToken
              key={item.id}
              label={item.label}
              disabled={item.disabled}
              colors={colors}
              onPress={onOptionItemPress ? () => onOptionItemPress(item) : undefined}
            />
          )
        )}
      </View>
    </View>
  );
}

interface WordTokenProps {
  label: string;
  disabled?: boolean;
  colors: ReturnType<typeof usePulseLegacyColors>;
  onPress?: () => void;
}

function WordToken({ label, disabled, colors, onPress }: WordTokenProps) {
  const isInteractive = Boolean(onPress) && !disabled;

  return (
    <Pressable
      disabled={!isInteractive}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.token,
        { borderColor: colors.border, backgroundColor: colors.surface },
        disabled && styles.tokenDisabled,
        isInteractive && hovered && { backgroundColor: "#F7F7F7" },
        isInteractive && pressed && styles.tokenPressed
      ]}
    >
      <Text style={[styles.tokenLabel, { color: colors.text }, disabled && { color: "#A2A2A2" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg
  },
  answerArea: {
    gap: spacing.md
  },
  answerLine: {
    gap: spacing.sm
  },
  selectedRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md
  },
  divider: {
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: "#E6E6E6"
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xl
  },
  token: {
    minWidth: 68,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1
  },
  tokenPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 1 }
  },
  tokenDisabled: {
    opacity: 0.5
  },
  tokenLabel: {
    fontSize: typography.title,
    fontWeight: "500"
  },
  placeholder: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: "#E5E5E5"
  },
  placeholderLabel: {
    fontSize: typography.title,
    fontWeight: "500",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    opacity: 0
  }
});
