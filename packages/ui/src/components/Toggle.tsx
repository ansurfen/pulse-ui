import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { colors, radius } from "@pulse-ui/core";

export interface ToggleProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  activeThumbBorderColor?: string;
  inactiveThumbBorderColor?: string;
  style?: ViewStyle;
}

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 30;
const THUMB_OFFSET = TRACK_WIDTH - THUMB_SIZE;

export function Toggle({
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  activeColor = "#27A9F3",
  inactiveColor = "#E2E2E2",
  thumbColor = "#FFFFFF",
  activeThumbBorderColor = "#27A9F3",
  inactiveThumbBorderColor = "#E0E0E0",
  style
}: ToggleProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = typeof value === "boolean";
  const checked = isControlled ? value : internalValue;
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic)
    });
  }, [checked, progress]);

  const handlePress = () => {
    if (disabled) {
      return;
    }

    const next = !checked;
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [inactiveColor, activeColor])
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_OFFSET }],
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveThumbBorderColor, activeThumbBorderColor]
    )
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.shell, style, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, trackStyle]} />
      <Animated.View style={[styles.thumb, thumbStyle, { backgroundColor: thumbColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE,
    justifyContent: "center",
    position: "relative"
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill
  },
  thumb: {
    position: "absolute",
    left: 0,
    top: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    borderWidth: 2
  },
  disabled: {
    opacity: 0.5
  }
});
