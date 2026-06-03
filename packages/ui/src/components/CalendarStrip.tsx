import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export type CalendarStripMode = "week" | "month";
export type CalendarHighlightVariant = "fill" | "check";

export interface CalendarTheme {
  accentColor?: string;
  accentSoftColor?: string;
  accentTextColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  dayBackgroundColor?: string;
}

export interface CalendarDatePressEvent {
  date: Date;
  isCurrentMonth: boolean;
  isHighlighted: boolean;
}

export interface CalendarStripProps {
  mode?: CalendarStripMode;
  visibleDate?: Date;
  selectedDate?: Date;
  highlightedDates?: Date[];
  onDatePress?: (event: CalendarDatePressEvent) => void;
  onVisibleDateChange?: (date: Date) => void;
  showHeader?: boolean;
  theme?: CalendarTheme;
  weekdayLabels?: string[];
  highlightVariant?: CalendarHighlightVariant;
  showSelection?: boolean;
  style?: ViewStyle;
}

const defaultWeekdayLabels = ["日", "一", "二", "三", "四", "五", "六"] as const;

export function CalendarStrip({
  mode = "week",
  visibleDate = new Date(),
  selectedDate,
  highlightedDates = [],
  onDatePress,
  onVisibleDateChange,
  showHeader = mode === "month",
  theme,
  weekdayLabels = [...defaultWeekdayLabels],
  highlightVariant = "check",
  showSelection = false,
  style
}: CalendarStripProps) {
  const accentColor = theme?.accentColor ?? "#FF9600";
  const accentTextColor = theme?.accentTextColor ?? "#FFFFFF";
  const textColor = theme?.textColor ?? "#A0A5AE";
  const mutedTextColor = theme?.mutedTextColor ?? "#D7D9DE";
  const dayBackgroundColor = theme?.dayBackgroundColor ?? "#E6E6E8";

  const entries = useMemo(
    () => (mode === "week" ? buildWeekEntries(visibleDate) : buildMonthEntries(visibleDate)),
    [mode, visibleDate]
  );
  const rows = useMemo(() => chunk(entries, 7), [entries]);
  const highlightedKeys = useMemo(
    () => new Set(highlightedDates.map((date) => toDateKey(date))),
    [highlightedDates]
  );
  const monthLabel = `${visibleDate.getFullYear()}年 ${visibleDate.getMonth() + 1}月`;
  const isInteractive = Boolean(onDatePress);
  const isMonthMode = mode === "month";

  return (
    <View style={[styles.container, style]}>
      {showHeader ? (
        <View style={styles.header}>
          <Pressable onPress={() => onVisibleDateChange?.(addMonths(visibleDate, -1))} style={[styles.headerButton, styles.headerEdge]}>
            <Text style={[styles.headerButtonText, { color: textColor }]}>‹</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{monthLabel}</Text>
          <Pressable onPress={() => onVisibleDateChange?.(addMonths(visibleDate, 1))} style={[styles.headerButton, styles.headerEdge]}>
            <Text style={[styles.headerButtonText, { color: textColor }]}>›</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.weekdayRow}>
        {weekdayLabels.map((label, index) => {
          const isSelectedWeekday = showSelection && selectedDate ? selectedDate.getDay() === index : false;
          return (
            <View key={`${label}-${index}`} style={styles.cellSlot}>
              <Text style={[styles.weekdayLabel, { color: isSelectedWeekday ? accentColor : textColor }]}>{label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.rows}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((entry) => {
              const dateKey = toDateKey(entry.date);
              const isHighlighted = highlightedKeys.has(dateKey);
              const isSelected = showSelection && selectedDate ? isSameDay(selectedDate, entry.date) : false;
              const isCurrentMonth = entry.isCurrentMonth ?? true;
              const labelColor = isHighlighted
                ? accentTextColor
                : isSelected
                  ? accentColor
                  : isCurrentMonth
                    ? textColor
                    : mutedTextColor;

              const content = (
                <View style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayButton,
                      isMonthMode && styles.monthDayButton,
                      {
                        backgroundColor:
                          isHighlighted
                            ? accentColor
                            : isMonthMode
                              ? "transparent"
                              : dayBackgroundColor,
                        opacity: isCurrentMonth || !isMonthMode ? 1 : 0
                      },
                      isSelected && {
                        borderColor: accentColor,
                        borderWidth: 2
                      }
                    ]}
                  >
                    {isCurrentMonth && isHighlighted && highlightVariant === "check" ? (
                      <Text style={[styles.checkMark, { color: accentTextColor }]}>✓</Text>
                    ) : isCurrentMonth ? (
                      <Text style={[styles.dayLabel, { color: labelColor }]}>{entry.date.getDate()}</Text>
                    ) : (
                      <Text style={styles.hiddenLabel}>0</Text>
                    )}
                  </View>
                </View>
              );

              return (
                <View key={dateKey} style={styles.cellSlot}>
                  {isInteractive ? (
                    <Pressable onPress={() => onDatePress?.({ date: entry.date, isCurrentMonth, isHighlighted })}>
                      {content}
                    </Pressable>
                  ) : (
                    content
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

interface CalendarEntry {
  date: Date;
  isCurrentMonth?: boolean;
}

function buildWeekEntries(source: Date) {
  const start = startOfWeek(source);
  return Array.from({ length: 7 }, (_, index) => ({ date: addDays(start, index), isCurrentMonth: true }));
}

function buildMonthEntries(source: Date) {
  const monthStart = startOfMonth(source);
  const monthEnd = endOfMonth(source);
  const gridStart = startOfWeek(monthStart);
  const totalDays = differenceInDays(gridStart, monthEnd) + 1;
  const paddedCount = Math.ceil(totalDays / 7) * 7;

  return Array.from({ length: paddedCount }, (_, index) => {
    const date = addDays(gridStart, index);
    return { date, isCurrentMonth: date.getMonth() === source.getMonth() };
  });
}

function startOfWeek(date: Date) {
  return addDays(startOfDay(date), -date.getDay());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function differenceInDays(from: Date, to: Date) {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / 86400000);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function chunk<T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  headerEdge: {
    alignItems: "flex-start"
  },
  headerButtonText: {
    fontSize: 30,
    fontWeight: "500",
    lineHeight: 30
  },
  headerTitle: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  weekdayRow: {
    flexDirection: "row"
  },
  rows: {
    gap: spacing.md
  },
  row: {
    flexDirection: "row"
  },
  cellSlot: {
    flex: 1,
    alignItems: "center"
  },
  weekdayLabel: {
    textAlign: "center",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  dayCell: {
    alignItems: "center"
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  monthDayButton: {
    width: 32,
    height: 32
  },
  dayLabel: {
    fontSize: typography.body,
    fontWeight: "700"
  },
  hiddenLabel: {
    opacity: 0
  },
  checkMark: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 20
  },
});
