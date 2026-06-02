import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

export interface XPBarStage {
  at: number;
  color: string;
}

export interface XPBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  fillColor?: string;
  trackColor?: string;
  height?: number;
  stages?: XPBarStage[];
  animatedFeedback?: boolean;
}

export function XPBar({
  value,
  max,
  label = "XP Progress",
  showValue = true,
  fillColor = "#58CC02",
  trackColor = "#E5E5E5",
  height = 16,
  stages,
  animatedFeedback = true
}: XPBarProps) {
  const progress = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const previousProgress = useRef(progress);
  const width = useSharedValue(0);
  const ringScale = useSharedValue(0.88);
  const ringOpacity = useSharedValue(0);
  const sparkleScale = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [burstSeed, setBurstSeed] = useState(0);

  const resolvedFillColor = useMemo(() => {
    if (!stages || stages.length === 0) {
      return fillColor;
    }

    const currentValue = progress * max;
    const sortedStages = [...stages].sort((a, b) => a.at - b.at);
    let activeColor = fillColor;

    for (const stage of sortedStages) {
      if (currentValue >= stage.at) {
        activeColor = stage.color;
      }
    }

    return activeColor;
  }, [fillColor, max, progress, stages]);

  useEffect(() => {
    width.value = withTiming(trackWidth * progress, { duration: 320, easing: Easing.out(Easing.cubic) });

    const hasIncreased = progress > previousProgress.current;
    if (animatedFeedback && hasIncreased && trackWidth > 0) {
      ringScale.value = 0.88;
      ringOpacity.value = 0.92;
      sparkleScale.value = 0.6;
      sparkleOpacity.value = 0;
      ringScale.value = withTiming(1.04, { duration: 420, easing: Easing.out(Easing.cubic) });
      ringOpacity.value = withTiming(0, { duration: 460, easing: Easing.out(Easing.quad) });
      sparkleScale.value = withSequence(
        withDelay(170, withTiming(1, { duration: 180, easing: Easing.out(Easing.back(1.4)) })),
        withTiming(0.7, { duration: 240, easing: Easing.out(Easing.quad) })
      );
      sparkleOpacity.value = withSequence(
        withDelay(170, withTiming(1, { duration: 80, easing: Easing.out(Easing.quad) })),
        withTiming(0, { duration: 260, easing: Easing.out(Easing.quad) })
      );
      setBurstSeed((current) => current + 1);
    }

    previousProgress.current = progress;
  }, [animatedFeedback, progress, ringOpacity, ringScale, sparkleOpacity, sparkleScale, trackWidth, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: width.value
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }]
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ scale: sparkleScale.value }]
  }));

  const markerStyle = useAnimatedStyle(() => {
    const markerX = interpolate(width.value, [0, Math.max(trackWidth, 1)], [0, Math.max(trackWidth - height, 0)]);

    return {
      transform: [{ translateX: markerX }]
    };
  });

  return (
    <View style={styles.container}>
      {label || showValue ? (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showValue ? (
            <Text style={styles.value}>
              {value}/{max}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)} style={[styles.track, { backgroundColor: trackColor, height }]}>
        <Animated.View style={[styles.fill, fillStyle, { backgroundColor: resolvedFillColor }]}>
          <View style={styles.fillGloss} />
        </Animated.View>
        {animatedFeedback ? (
          <Animated.View pointerEvents="none" style={[styles.markerWrap, { width: height, height }, markerStyle]}>
            <Animated.View style={[styles.ringWrap, ringStyle]}>
              <View style={[styles.markerRing, { borderColor: `${resolvedFillColor}55` }]} />
              <View style={[styles.markerRingAccent, { backgroundColor: resolvedFillColor }]} />
            </Animated.View>
            <Animated.View style={[styles.sparkleWrap, sparkleStyle]} key={burstSeed}>
              <View style={[styles.sparkleDot, styles.sparkleTop, { backgroundColor: resolvedFillColor }]} />
              <View style={[styles.sparkleDot, styles.sparkleLeft, { backgroundColor: resolvedFillColor }]} />
              <View style={[styles.sparkleDot, styles.sparkleRight, { backgroundColor: resolvedFillColor }]} />
              <View style={[styles.sparkleDot, styles.sparkleBottom, { backgroundColor: resolvedFillColor }]} />
            </Animated.View>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  },
  value: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  track: {
    borderRadius: radius.pill,
    overflow: "visible"
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    overflow: "hidden"
  },
  fillGloss: {
    position: "absolute",
    top: 3,
    left: 8,
    right: 8,
    height: 4,
    borderRadius: radius.pill,
    opacity: 0.8,
    backgroundColor: "rgba(255,255,255,0.26)"
  },
  markerWrap: {
    position: "absolute",
    top: "50%",
    marginTop: -21,
    alignItems: "center",
    justifyContent: "center"
  },
  ringWrap: {
    position: "absolute",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center"
  },
  markerRing: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 5
  },
  markerRingAccent: {
    position: "absolute",
    top: 3,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 999
  },
  sparkleWrap: {
    position: "absolute",
    width: 34,
    height: 34
  },
  sparkleDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 999
  },
  sparkleTop: {
    top: 2,
    left: 15
  },
  sparkleLeft: {
    top: 17,
    left: 2
  },
  sparkleRight: {
    top: 14,
    right: 2
  },
  sparkleBottom: {
    bottom: 2,
    left: 12
  }
});
