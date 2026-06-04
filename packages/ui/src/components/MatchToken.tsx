import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { radius, spacing, typography, usePulseLegacyColors } from "@pulse-ui/core";

export type MatchTokenStatus = "idle" | "selected" | "correct" | "wrong" | "disabled";

export interface MatchTokenProps {
  label: string;
  value: string;
  index?: number | string;
  status?: MatchTokenStatus;
  onPress?: (value: string) => void;
  style?: ViewStyle;
}

const statusPalette: Record<
  MatchTokenStatus,
  {
    background: string;
    border: string;
    text: string;
    badgeBackground: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  idle: {
    background: "#FFFFFF",
    border: "#D9D9D9",
    text: "#4B4B4B",
    badgeBackground: "#FFFFFF",
    badgeBorder: "#E2E2E2",
    badgeText: "#C0C0C0"
  },
  selected: {
    background: "#EAF7FF",
    border: "#7BCFFF",
    text: "#1CB0F6",
    badgeBackground: "#FFFFFF",
    badgeBorder: "#B8E8FF",
    badgeText: "#53BAF7"
  },
  correct: {
    background: "#CCFC9D",
    border: "#8FE244",
    text: "#58A700",
    badgeBackground: "#F7FFE8",
    badgeBorder: "#AAE868",
    badgeText: "#6DBA14"
  },
  wrong: {
    background: "#FFC9C9",
    border: "#FF9A9A",
    text: "#D63B3B",
    badgeBackground: "#FFF4F4",
    badgeBorder: "#FFB6B6",
    badgeText: "#E06060"
  },
  disabled: {
    background: "#F6F6F6",
    border: "#E6E6E6",
    text: "#B8B8B8",
    badgeBackground: "#F7F7F7",
    badgeBorder: "#E6E6E6",
    badgeText: "#C9C9C9"
  }
};

const burstParticles = [
  { x: -76, y: -10, scale: 0.95, delay: 0 },
  { x: -26, y: 6, scale: 0.75, delay: 80 },
  { x: 18, y: -18, scale: 0.82, delay: 120 },
  { x: 66, y: 3, scale: 0.9, delay: 160 }
] as const;

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

export function MatchToken({
  label,
  value,
  index,
  status = "idle",
  onPress,
  style
}: MatchTokenProps) {
  const [burstKey, setBurstKey] = useState(0);
  const isDisabled = status === "disabled";
  const palette = statusPalette[status];
  const bottomColor = mixColor(palette.background, "#000000", 0.08);
  const glossColor = mixColor(palette.background, "#FFFFFF", 0.12);

  useEffect(() => {
    if (status === "correct") {
      setBurstKey((current) => current + 1);
    }
  }, [status]);

  const animationState = useMemo(() => {
    if (status === "selected") {
      return {
        scale: 1.01,
        translateY: -1
      };
    }

    if (status === "wrong") {
      return {
        scale: 0.995,
        translateY: 0
      };
    }

    return {
      scale: 1,
      translateY: 0
    };
  }, [status]);

  return (
    <Pressable disabled={isDisabled} onPress={onPress ? () => onPress(value) : undefined} style={({ pressed }) => [styles.shell, style, pressed && !isDisabled && styles.pressedShell, isDisabled && styles.disabled]}>
      {({ pressed }) => (
        <MotiView
          animate={animationState}
          transition={{ type: "timing", duration: 180 }}
          style={styles.motionWrap}
        >
          <View style={[styles.depth, { backgroundColor: bottomColor, borderColor: palette.border }]} />
          <LinearGradient
            colors={[palette.background, palette.background]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.face, { borderColor: palette.border }, pressed && !isDisabled && styles.facePressed]}
          >
            <View style={[styles.gloss, { backgroundColor: glossColor }]} />
            {typeof index !== "undefined" ? (
              <View style={[styles.badge, { backgroundColor: palette.badgeBackground, borderColor: palette.badgeBorder }]}>
                <Text style={[styles.badgeText, { color: palette.badgeText }]}>{index}</Text>
              </View>
            ) : null}
            <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
              {label}
            </Text>
            {status === "correct" ? <Burst key={burstKey} /> : null}
          </LinearGradient>
        </MotiView>
      )}
    </Pressable>
  );
}

function Burst() {
  const colors = usePulseLegacyColors();
  return (
    <View pointerEvents="none" style={styles.burst}>
      {burstParticles.map((particle, index) => (
        <MotiView
          key={`${index}-${particle.x}-${particle.y}`}
          from={{ opacity: 0, scale: 0.3, translateX: 0, translateY: 0, rotate: "0deg" }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, particle.scale, particle.scale * 0.82],
            translateX: [0, particle.x],
            translateY: [0, particle.y],
            rotate: ["0deg", "18deg", "0deg"]
          }}
          transition={{
            type: "timing",
            duration: 560,
            delay: particle.delay
          }}
          style={styles.particle}
        >
          <View style={[styles.sparkleVertical, { backgroundColor: colors.xp }]} />
          <View style={[styles.sparkleHorizontal, { backgroundColor: colors.xp }]} />
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 52,
    borderRadius: radius.pill,
    position: "relative"
  },
  motionWrap: {
    position: "relative",
    minHeight: 52
  },
  depth: {
    ...StyleSheet.absoluteFillObject,
    top: 3,
    borderRadius: radius.pill,
    borderWidth: 1
  },
  face: {
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingLeft: 58,
    paddingRight: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible"
  },
  gloss: {
    position: "absolute",
    top: 4,
    left: 14,
    right: 14,
    height: 8,
    borderRadius: radius.pill,
    opacity: 0.18
  },
  facePressed: {
    transform: [{ translateY: 1 }]
  },
  pressedShell: {
    transform: [{ translateY: 2 }, { scale: 0.995 }]
  },
  disabled: {
    opacity: 0.65
  },
  badge: {
    position: "absolute",
    left: spacing.md,
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    fontSize: typography.body,
    fontWeight: "800"
  },
  label: {
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  burst: {
    ...StyleSheet.absoluteFillObject,
    overflow: "visible"
  },
  particle: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -8,
    marginTop: -8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  sparkleVertical: {
    position: "absolute",
    width: 6,
    height: 14,
    borderRadius: radius.pill
  },
  sparkleHorizontal: {
    position: "absolute",
    width: 14,
    height: 6,
    borderRadius: radius.pill
  }
});
