import { useEffect, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export type DateTimePickerPresentation = "inline" | "dialog";

export type DateTimeValue = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export interface DateTimePickerProps {
  value?: DateTimeValue;
  defaultValue?: DateTimeValue;
  onValueChange?: (value: DateTimeValue) => void;
  onConfirm?: (value: DateTimeValue) => void;
  presentation?: DateTimePickerPresentation;
  yearRange?: {
    start: number;
    end: number;
  };
  minuteStep?: number;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  dialogTitle?: string;
  dateAccentColor?: string;
  timeAccentColor?: string;
  style?: ViewStyle;
}

const WHEEL_ITEM_HEIGHT = 62;
const WHEEL_VISIBLE_ROWS = 5;
const WHEEL_CENTER_INDEX = 2;

function hexToRgb(input: string) {
  const hex = input.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixColor(base: string, target: string, amount: number) {
  const a = hexToRgb(base);
  const b = hexToRgb(target);

  return rgbToHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function normalizeValue(
  value: DateTimeValue | undefined,
  yearRange: { start: number; end: number },
  minuteStep: number
) {
  const today = new Date();
  const base = value ?? {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: 9,
    minute: 30
  };

  const year = Math.max(yearRange.start, Math.min(yearRange.end, base.year));
  const month = Math.max(1, Math.min(12, base.month));
  const maxDay = getDaysInMonth(year, month);
  const day = Math.max(1, Math.min(maxDay, base.day));
  const hour = Math.max(0, Math.min(23, base.hour));
  const roundedMinute = Math.round(base.minute / minuteStep) * minuteStep;
  const minute = roundedMinute >= 60 ? 0 : Math.max(0, Math.min(59, roundedMinute));

  return { year, month, day, hour, minute };
}

function formatSummary(value: DateTimeValue) {
  return `${value.year} 年 ${value.month.toString().padStart(2, "0")} 月 ${value.day
    .toString()
    .padStart(2, "0")} 日    ${value.hour.toString().padStart(2, "0")}:${value.minute
    .toString()
    .padStart(2, "0")}`;
}

export function DateTimePicker({
  value,
  defaultValue,
  onValueChange,
  onConfirm,
  presentation = "dialog",
  yearRange = { start: 2022, end: 2026 },
  minuteStep = 15,
  disabled = false,
  title = "选择日期和时间",
  subtitle = "Pick your study time",
  confirmLabel = "确认",
  dialogTitle = "选择日期和时间",
  dateAccentColor = "#7DDB00",
  timeAccentColor = "#22AFFF",
  style
}: DateTimePickerProps) {
  const theme = usePulseTheme();
  const { colors } = theme;
  const resolvedMinuteStep = minuteStep > 0 ? minuteStep : 15;
  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(defaultValue, yearRange, resolvedMinuteStep)
  );
  const [visible, setVisible] = useState(false);
  const selectedValue = normalizeValue(value ?? internalValue, yearRange, resolvedMinuteStep);
  const triggerDepth = colors.border.subtle;

  const years = useMemo(
    () =>
      Array.from(
        { length: yearRange.end - yearRange.start + 1 },
        (_, index) => yearRange.start + index
      ),
    [yearRange.end, yearRange.start]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(selectedValue.year, selectedValue.month) }, (_, index) => index + 1),
    [selectedValue.month, selectedValue.year]
  );
  const hours = useMemo(() => Array.from({ length: 24 }, (_, index) => index), []);
  const minutes = useMemo(() => {
    const result: number[] = [];
    for (let minute = 0; minute < 60; minute += resolvedMinuteStep) {
      result.push(minute);
    }
    return result;
  }, [resolvedMinuteStep]);

  const setNextValue = (next: Partial<DateTimeValue>) => {
    if (disabled) {
      return;
    }

    const merged = normalizeValue(
      {
        ...selectedValue,
        ...next
      },
      yearRange,
      resolvedMinuteStep
    );

    if (value === undefined) {
      setInternalValue(merged);
    }

    onValueChange?.(merged);
  };

  const handleConfirm = () => {
    onConfirm?.(selectedValue);
    setVisible(false);
  };

  const card = (
    <View style={[styles.cardShell, style, disabled && styles.disabled]}>
      <View style={[styles.cardDepth, { backgroundColor: colors.border.subtle }]} />
      <View style={[styles.cardFace, { backgroundColor: colors.background.surface, borderColor: colors.border.subtle }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.text.muted }]}>{subtitle}</Text>
        </View>

        <View style={styles.summaryShell}>
          <View style={[styles.summaryDepth, { backgroundColor: mixColor(dateAccentColor, "#000000", 0.1) }]} />
          <View
            style={[
              styles.summaryBar,
              {
                borderColor: mixColor(dateAccentColor, "#FFFFFF", 0.7),
                backgroundColor: colors.background.surfaceAlt
              }
            ]}
          >
            <View style={styles.summaryGroup}>
              <CalendarIcon color={dateAccentColor} />
              <Text style={[styles.summaryDate, { color: dateAccentColor }]}>
                {selectedValue.year} 年 {selectedValue.month.toString().padStart(2, "0")} 月 {selectedValue.day
                  .toString()
                  .padStart(2, "0")} 日
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border.default }]} />
            <View style={styles.summaryGroup}>
              <ClockIcon color={timeAccentColor} />
              <Text style={[styles.summaryTime, { color: timeAccentColor }]}>
                {selectedValue.hour.toString().padStart(2, "0")}:{selectedValue.minute.toString().padStart(2, "0")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.columns}>
          <PickerColumn
            title="年"
            accentColor={dateAccentColor}
            surfaceColor={colors.background.surface}
            borderColor={colors.border.default}
            textColor={colors.text.primary}
            dividerColor={colors.border.subtle}
            values={years}
            selected={selectedValue.year}
            onSelect={(year) => setNextValue({ year })}
            formatValue={(year) => year.toString()}
          />
          <PickerColumn
            title="月"
            accentColor={dateAccentColor}
            surfaceColor={colors.background.surface}
            borderColor={colors.border.default}
            textColor={colors.text.primary}
            dividerColor={colors.border.subtle}
            values={months}
            selected={selectedValue.month}
            onSelect={(month) => setNextValue({ month })}
            formatValue={(month) => month.toString().padStart(2, "0")}
          />
          <PickerColumn
            title="日"
            accentColor={dateAccentColor}
            surfaceColor={colors.background.surface}
            borderColor={colors.border.default}
            textColor={colors.text.primary}
            dividerColor={colors.border.subtle}
            values={days}
            selected={selectedValue.day}
            onSelect={(day) => setNextValue({ day })}
            formatValue={(day) => day.toString().padStart(2, "0")}
          />
          <PickerColumn
            title="小时"
            accentColor={timeAccentColor}
            surfaceColor={colors.background.surface}
            borderColor={colors.border.default}
            textColor={colors.text.primary}
            dividerColor={colors.border.subtle}
            values={hours}
            selected={selectedValue.hour}
            onSelect={(hour) => setNextValue({ hour })}
            formatValue={(hour) => hour.toString().padStart(2, "0")}
          />
          <PickerColumn
            title="分钟"
            accentColor={timeAccentColor}
            surfaceColor={colors.background.surface}
            borderColor={colors.border.default}
            textColor={colors.text.primary}
            dividerColor={colors.border.subtle}
            values={minutes}
            selected={selectedValue.minute}
            onSelect={(minute) => setNextValue({ minute })}
            formatValue={(minute) => minute.toString().padStart(2, "0")}
          />
        </View>

        <Button
          label={confirmLabel}
          backgroundColor={dateAccentColor}
          disabled={disabled}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );

  if (presentation === "inline") {
    return card;
  }

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.triggerShell,
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.disabled
        ]}
      >
        <View style={[styles.triggerDepth, { backgroundColor: triggerDepth }]} />
        <View style={[styles.triggerFace, { backgroundColor: colors.background.surface, borderColor: colors.border.default }]}>
          <Text style={[styles.triggerLabel, { color: colors.text.muted }]}>日期和时间</Text>
          <Text style={[styles.triggerValue, { color: colors.text.primary }]}>{formatSummary(selectedValue)}</Text>
        </View>
      </Pressable>

      <Dialog visible={visible} onRequestClose={() => setVisible(false)} style={styles.dialogCard}>
        {card}
      </Dialog>
    </>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24">
      <Rect x="3" y="5" width="18" height="16" rx="2.5" stroke={color} strokeWidth="2.2" fill="none" />
      <Path d="M8 3.5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M16 3.5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M3 9H21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2.2" fill="none" />
      <Path d="M12 7.6V12.2L15.2 14.4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PickerColumn({
  title,
  accentColor,
  surfaceColor,
  borderColor,
  textColor,
  dividerColor,
  values,
  selected,
  onSelect,
  formatValue
}: {
  title: string;
  accentColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  dividerColor: string;
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  formatValue: (value: number) => string;
}) {
  const theme = usePulseTheme();
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(
    0,
    values.findIndex((value) => value === selected)
  );
  const lastIndexRef = useRef(selectedIndex);

  useEffect(() => {
    lastIndexRef.current = selectedIndex;
    scrollRef.current?.scrollTo({
      y: selectedIndex * WHEEL_ITEM_HEIGHT,
      animated: false
    });
  }, [selectedIndex]);

  const commitIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(values.length - 1, index));
    const nextValue = values[nextIndex];
    if (nextValue !== undefined && nextValue !== selected) {
      onSelect(nextValue);
    }
  };

  const syncToIndex = (rawIndex: number, animated: boolean) => {
    const nextIndex = Math.max(0, Math.min(values.length - 1, rawIndex));
    lastIndexRef.current = nextIndex;
    scrollRef.current?.scrollTo({
      y: nextIndex * WHEEL_ITEM_HEIGHT,
      animated
    });
    commitIndex(nextIndex);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const nextIndex = Math.max(0, Math.min(values.length - 1, rawIndex));

    if (nextIndex !== lastIndexRef.current) {
      lastIndexRef.current = nextIndex;
      commitIndex(nextIndex);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    syncToIndex(rawIndex, true);
  };

  const stepBy = (delta: number) => {
    const nextIndex = Math.max(0, Math.min(values.length - 1, selectedIndex + delta));
    syncToIndex(nextIndex, true);
  };

  return (
    <View style={styles.column}>
      <Text style={[styles.columnTitle, { color: accentColor }]}>{title}</Text>
      <Pressable onPress={() => stepBy(-1)} style={styles.arrowButton}>
        <Text style={[styles.arrowText, { color: accentColor }]}>⌃</Text>
      </Pressable>
      <View style={[styles.columnCard, { borderColor, backgroundColor: surfaceColor }]}>
        <View
          pointerEvents="none"
          style={[
            styles.selectionHighlightDepth,
            {
              top: WHEEL_CENTER_INDEX * WHEEL_ITEM_HEIGHT + 4,
              backgroundColor:
                theme.mode === "dark"
                  ? mixColor(accentColor, "#000000", 0.28)
                  : theme.colors.border.subtle
            }
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.selectionHighlight,
            {
              top: WHEEL_CENTER_INDEX * WHEEL_ITEM_HEIGHT,
              backgroundColor: accentColor,
              borderColor: accentColor
            }
          ]}
        />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={WHEEL_ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          bounces={false}
          disableIntervalMomentum
          style={styles.wheelScroll}
          contentContainerStyle={styles.wheelContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
        >
          {values.map((value, index) => {
            const active = index === selectedIndex;
            return (
              <Pressable
                key={value}
                onPress={() => {
                  syncToIndex(index, true);
                }}
                style={({ pressed }) => [styles.optionShell, pressed && styles.optionPressed]}
              >
                <View style={[styles.optionFace, { borderBottomColor: dividerColor, backgroundColor: "transparent" }]}>
                  <Text style={[styles.optionText, { color: active ? "#FFFFFF" : textColor }]}>
                    {formatValue(value)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <Pressable onPress={() => stepBy(1)} style={styles.arrowButton}>
        <Text style={[styles.arrowText, { color: accentColor }]}>⌄</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    width: "100%",
    position: "relative",
    borderRadius: 34,
    paddingBottom: 10
  },
  cardDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 10,
    borderRadius: 34
  },
  cardFace: {
    borderRadius: 34,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.xl
  },
  header: {
    alignItems: "center",
    gap: spacing.sm
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  },
  summaryBar: {
    minHeight: 92,
    borderRadius: 24,
    borderWidth: 2,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    alignSelf: "center"
  },
  summaryShell: {
    position: "relative",
    paddingBottom: 8,
    alignSelf: "center"
  },
  summaryDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 8,
    borderRadius: 24,
    opacity: 0.18
  },
  summaryGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  summaryDate: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.4
  },
  summaryDivider: {
    width: 1,
    alignSelf: "stretch",
    marginVertical: spacing.md,
    marginHorizontal: spacing.sm
  },
  summaryTime: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.4
  },
  columns: {
    flexDirection: "row",
    gap: spacing.md
  },
  column: {
    flex: 1,
    gap: spacing.md
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center"
  },
  columnCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ROWS
  },
  wheelContent: {
    paddingVertical: WHEEL_ITEM_HEIGHT * WHEEL_CENTER_INDEX
  },
  wheelScroll: {
    zIndex: 1
  },
  arrowButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28
  },
  arrowText: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 28
  },
  selectionHighlightDepth: {
    position: "absolute",
    left: 8,
    right: 8,
    height: WHEEL_ITEM_HEIGHT - 4,
    borderRadius: 16,
    zIndex: 0
  },
  selectionHighlight: {
    position: "absolute",
    left: 8,
    right: 8,
    height: WHEEL_ITEM_HEIGHT - 4,
    borderRadius: 16,
    borderWidth: 1,
    zIndex: 0
  },
  optionShell: {
    height: WHEEL_ITEM_HEIGHT,
    position: "relative"
  },
  optionPressed: {
    opacity: 0.9
  },
  optionFace: {
    height: WHEEL_ITEM_HEIGHT,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  },
  optionText: {
    fontSize: 24,
    fontWeight: "900"
  },
  triggerShell: {
    width: "100%",
    position: "relative",
    paddingBottom: 6
  },
  triggerPressed: {
    transform: [{ translateY: 1 }, { scale: 0.995 }]
  },
  triggerDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 6,
    borderRadius: radius.lg
  },
  triggerFace: {
    minHeight: 88,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    gap: spacing.xs
  },
  triggerLabel: {
    fontSize: typography.body,
    fontWeight: "700"
  },
  triggerValue: {
    fontSize: 24,
    fontWeight: "900"
  },
  dialogCard: {
    maxWidth: 1180,
    backgroundColor: "transparent",
    padding: 0
  },
  disabled: {
    opacity: 0.55
  }
});
