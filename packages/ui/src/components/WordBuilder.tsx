import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { radius, spacing, typography, usePulseLegacyColors, usePulseTheme } from "@pulse-ui/core";

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
  const theme = usePulseTheme();
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
                    mode={theme.mode}
                    onPress={onSelectedItemPress ? () => onSelectedItemPress(item) : undefined}
                  />
                );
              })}
            </View>
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.mode === "dark" ? colors.border : "#E6E6E6" }
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.optionsRow}>
        {items.map((item) =>
          resolvedSelectedIds.includes(item.id) ? (
            <View
              key={item.id}
              style={[
                styles.placeholder,
                { backgroundColor: "#E5E5E5" }
              ]}
            >
              <Text style={styles.placeholderLabel}>{item.label}</Text>
            </View>
          ) : (
            <WordToken
              key={item.id}
              label={item.label}
              disabled={item.disabled}
              colors={colors}
              mode={theme.mode}
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
  mode: "light" | "dark";
  onPress?: () => void;
}

function WordToken({ label, disabled, colors, mode, onPress }: WordTokenProps) {
  const isInteractive = Boolean(onPress) && !disabled;
  const hoverBackground = mode === "dark" ? colors.surfaceAlt : "#F7F7F7";
  const disabledText = mode === "dark" ? colors.textMuted : "#A2A2A2";
  const depthColor = mode === "dark" ? colors.border : "#D8D8D8";

  return (
    <Pressable
      disabled={!isInteractive}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.tokenShell,
        disabled && styles.tokenDisabled,
        isInteractive && pressed && styles.tokenPressed
      ]}
    >
      {({ hovered }) => (
        <>
          <View style={[styles.tokenDepth, { backgroundColor: depthColor, borderColor: colors.border }]} />
          <View
            style={[
              styles.tokenFace,
              { borderColor: colors.border, backgroundColor: colors.surface },
              isInteractive && hovered && { backgroundColor: hoverBackground }
            ]}
          >
            <Text style={[styles.tokenLabel, { color: colors.text }, disabled && { color: disabledText }]}>
              {label}
            </Text>
          </View>
        </>
      )}
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
  tokenShell: {
    minWidth: 68,
    minHeight: 52,
    borderRadius: radius.md,
    position: "relative"
  },
  tokenDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 3,
    borderRadius: radius.md,
    borderWidth: 2
  },
  tokenFace: {
    minWidth: 68,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  tokenPressed: {
    transform: [{ translateY: 2 }]
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
    borderRadius: radius.md
  },
  placeholderLabel: {
    fontSize: typography.title,
    fontWeight: "500",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    opacity: 0
  }
});
