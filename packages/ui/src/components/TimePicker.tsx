import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export type TimePickerFormat = "12h" | "24h";
export type TimePeriod = "AM" | "PM";
export type TimePickerPresentation = "inline" | "dialog";

export type TimeValue = {
  hour: number;
  minute: number;
  period?: TimePeriod;
};

export interface TimePickerProps {
  value?: TimeValue;
  defaultValue?: TimeValue;
  onValueChange?: (value: TimeValue) => void;
  onConfirm?: (value: TimeValue) => void;
  format?: TimePickerFormat;
  minuteStep?: number;
  disabled?: boolean;
  presentation?: TimePickerPresentation;
  hourAccentColor?: string;
  minuteAccentColor?: string;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  dialogTitle?: string;
  style?: ViewStyle;
}

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

function normalizeValue(value: TimeValue | undefined, format: TimePickerFormat, minuteStep: number): TimeValue {
  if (!value) {
    return format === "12h" ? { hour: 9, minute: 30, period: "AM" } : { hour: 9, minute: 30 };
  }

  const roundedMinute = Math.round(value.minute / minuteStep) * minuteStep;
  const minute = roundedMinute >= 60 ? 0 : Math.max(0, Math.min(59, roundedMinute));

  if (format === "12h") {
    return {
      hour: Math.max(1, Math.min(12, value.hour || 1)),
      minute,
      period: value.period === "PM" ? "PM" : "AM"
    };
  }

  return {
    hour: Math.max(0, Math.min(23, value.hour)),
    minute
  };
}

function formatDisplayValue(value: TimeValue, format: TimePickerFormat) {
  const hourText = format === "24h" ? value.hour.toString().padStart(2, "0") : value.hour.toString().padStart(2, "0");
  const minuteText = value.minute.toString().padStart(2, "0");
  const suffix = format === "12h" ? ` ${value.period ?? "AM"}` : "";

  return `${hourText}:${minuteText}${suffix}`;
}

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  onConfirm,
  format = "24h",
  minuteStep = 15,
  disabled = false,
  presentation = "dialog",
  hourAccentColor = "#7DDB00",
  minuteAccentColor = "#22AFFF",
  title = "选择时间",
  subtitle = "Pick your study time",
  confirmLabel = "确认时间",
  dialogTitle = "选择时间",
  style
}: TimePickerProps) {
  const theme = usePulseTheme();
  const { colors } = theme;
  const resolvedMinuteStep = minuteStep > 0 ? minuteStep : 15;
  const initial = normalizeValue(defaultValue, format, resolvedMinuteStep);
  const [internalValue, setInternalValue] = useState<TimeValue>(initial);
  const [dialogVisible, setDialogVisible] = useState(false);
  const selectedValue = normalizeValue(value ?? internalValue, format, resolvedMinuteStep);

  const hours = useMemo(
    () => (format === "24h" ? Array.from({ length: 24 }, (_, index) => index) : Array.from({ length: 12 }, (_, index) => index + 1)),
    [format]
  );
  const minutes = useMemo(() => {
    const result: number[] = [];
    for (let current = 0; current < 60; current += resolvedMinuteStep) {
      result.push(current);
    }
    return result;
  }, [resolvedMinuteStep]);

  const panelBorder = colors.border.default;
  const panelDepth = colors.border.subtle;
  const triggerDepth = colors.border.subtle;

  const setNextValue = (next: Partial<TimeValue>) => {
    if (disabled) {
      return;
    }

    const merged = normalizeValue({ ...selectedValue, ...next }, format, resolvedMinuteStep);

    if (value === undefined) {
      setInternalValue(merged);
    }

    onValueChange?.(merged);
  };

  const handleConfirm = () => {
    onConfirm?.(selectedValue);
    setDialogVisible(false);
  };

  const pickerCard = (
    <View style={[styles.cardShell, style, disabled && styles.disabled]}>
      <View style={[styles.cardDepth, { backgroundColor: colors.border.subtle }]} />
      <View style={[styles.cardFace, { backgroundColor: colors.background.surface, borderColor: colors.border.subtle }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.text.muted }]}>{subtitle}</Text>
          {format === "12h" ? (
            <View style={styles.periodTabs}>
              {(["AM", "PM"] as const).map((period) => (
                <MiniTab
                  key={period}
                  active={selectedValue.period === period}
                  label={period}
                  accentColor={period === "AM" ? hourAccentColor : minuteAccentColor}
                  onPress={() => setNextValue({ period })}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.heroRow}>
          <DisplayBlock value={selectedValue.hour} color={hourAccentColor} />
          <Text style={[styles.separator, { color: colors.text.primary }]}>:</Text>
          <DisplayBlock value={selectedValue.minute} color={minuteAccentColor} />
        </View>

        <View style={[styles.selectionPanel, { borderColor: panelBorder }]}>
          <View style={styles.selectionColumn}>
            <Text style={[styles.sectionHeading, { color: hourAccentColor }]}>小时</Text>
            <View style={styles.hourGrid}>
              {hours.map((hour) => (
                <SelectChip
                  key={hour}
                  active={selectedValue.hour === hour}
                  label={(format === "24h" ? hour : hour).toString().padStart(2, "0")}
                  accentColor={hourAccentColor}
                  surfaceColor={colors.background.surface}
                  textColor={colors.text.primary}
                  borderColor={colors.border.default}
                  onPress={() => setNextValue({ hour })}
                />
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: panelDepth }]} />

          <View style={styles.selectionColumnMinutes}>
            <Text style={[styles.sectionHeading, { color: minuteAccentColor }]}>分钟</Text>
            <View style={styles.minuteGrid}>
              {minutes.map((minute) => (
                <SelectChip
                  key={minute}
                  active={selectedValue.minute === minute}
                  label={minute.toString().padStart(2, "0")}
                  accentColor={minuteAccentColor}
                  surfaceColor={colors.background.surface}
                  textColor={colors.text.primary}
                  borderColor={colors.border.default}
                  onPress={() => setNextValue({ minute })}
                  minute
                />
              ))}
            </View>
          </View>
        </View>

        <Button
          label={confirmLabel}
          backgroundColor={hourAccentColor}
          onPress={handleConfirm}
          disabled={disabled}
        />
      </View>
    </View>
  );

  if (presentation === "inline") {
    return pickerCard;
  }

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setDialogVisible(true)}
        style={({ pressed }) => [
          styles.triggerShell,
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.disabled
        ]}
      >
        <View style={[styles.triggerDepth, { backgroundColor: triggerDepth }]} />
        <View style={[styles.triggerFace, { backgroundColor: colors.background.surface, borderColor: colors.border.default }]}>
          <Text style={[styles.triggerTitle, { color: colors.text.muted }]}>提醒时间</Text>
          <Text style={[styles.triggerValue, { color: colors.text.primary }]}>{formatDisplayValue(selectedValue, format)}</Text>
        </View>
      </Pressable>

      <Dialog
        visible={dialogVisible}
        onRequestClose={() => setDialogVisible(false)}
        style={styles.dialogCard}
      >
        {pickerCard}
      </Dialog>
    </>
  );
}

function DisplayBlock({ value, color }: { value: number; color: string }) {
  const depth = mixColor(color, "#000000", 0.2);
  const gloss = mixColor(color, "#FFFFFF", 0.14);

  return (
    <View style={styles.displayShell}>
      <View style={[styles.displayDepth, { backgroundColor: depth }]} />
      <View style={[styles.displayFace, { backgroundColor: color }]}>
        <View style={[styles.displayGloss, { backgroundColor: gloss }]} />
        <Text style={styles.displayText}>{value.toString().padStart(2, "0")}</Text>
      </View>
    </View>
  );
}

function MiniTab({
  label,
  active,
  accentColor,
  onPress
}: {
  label: string;
  active: boolean;
  accentColor: string;
  mutedColor?: string;
  onPress: () => void;
}) {
  const theme = usePulseTheme();
  const mutedColor = theme.colors.text.muted;

  return (
    <Pressable onPress={onPress} style={[styles.miniTab, active && { backgroundColor: mixColor(accentColor, "#FFFFFF", 0.82) }]}>
      <Text style={[styles.miniTabText, { color: active ? accentColor : mutedColor }]}>{label}</Text>
    </Pressable>
  );
}

function SelectChip({
  label,
  active,
  accentColor,
  surfaceColor,
  textColor,
  borderColor,
  onPress,
  minute = false
}: {
  label: string;
  active: boolean;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  borderColor: string;
  onPress: () => void;
  minute?: boolean;
}) {
  const theme = usePulseTheme();
  const depth = active ? mixColor(accentColor, "#000000", 0.18) : theme.colors.border.subtle;
  const border = active ? accentColor : borderColor;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chipShell, minute && styles.minuteChipShell, pressed && styles.chipPressed]}>
      <View style={[styles.chipDepth, { backgroundColor: depth, borderColor: depth }]} />
      <View style={[styles.chipFace, minute && styles.minuteChipFace, { backgroundColor: active ? accentColor : surfaceColor, borderColor: border }]}>
        <Text style={[styles.chipText, { color: active ? "#FFFFFF" : textColor }]}>{label}</Text>
      </View>
    </Pressable>
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
  periodTabs: {
    marginTop: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm
  },
  miniTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill
  },
  miniTabText: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg
  },
  separator: {
    color: "#454545",
    fontSize: 46,
    fontWeight: "900"
  },
  displayShell: {
    width: 160,
    position: "relative",
    paddingBottom: 8
  },
  displayDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 8,
    borderRadius: 24
  },
  displayFace: {
    minHeight: 128,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  displayGloss: {
    position: "absolute",
    top: 8,
    left: 18,
    right: 18,
    height: 16,
    borderRadius: radius.pill,
    opacity: 0.2
  },
  displayText: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
    letterSpacing: 1
  },
  selectionPanel: {
    borderWidth: 2,
    borderRadius: 28,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.lg
  },
  selectionColumn: {
    flex: 1,
    gap: spacing.md
  },
  selectionColumnMinutes: {
    width: 240,
    gap: spacing.md
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    marginVertical: spacing.xl
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "900"
  },
  hourGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  minuteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  chipShell: {
    width: 72,
    position: "relative",
    paddingBottom: 6
  },
  minuteChipShell: {
    width: 104
  },
  chipPressed: {
    transform: [{ translateY: 1 }, { scale: 0.995 }]
  },
  chipDepth: {
    ...StyleSheet.absoluteFillObject,
    top: 6,
    borderRadius: 18,
    borderWidth: 1
  },
  chipFace: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  minuteChipFace: {
    minHeight: 112
  },
  chipText: {
    fontSize: 28,
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
  triggerTitle: {
    fontSize: typography.body,
    fontWeight: "700"
  },
  triggerValue: {
    fontSize: 30,
    fontWeight: "900"
  },
  dialogCard: {
    maxWidth: 860,
    backgroundColor: "transparent",
    padding: 0
  },
  disabled: {
    opacity: 0.55
  }
});
