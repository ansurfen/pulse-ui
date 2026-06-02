import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CountryMap } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const presets = [
  { label: "京都", regions: ["kyoto"] },
  { label: "关西", regions: ["kyoto", "osaka", "nara", "hyogo"] },
  { label: "关东", regions: ["tokyo", "kanagawa", "saitama", "chiba"] },
  { label: "清空", regions: [] as string[] }
] as const;

export default function CountryMapScreen() {
  const [activeRegions, setActiveRegions] = useState<string[]>(["kyoto", "osaka", "tokyo"]);
  const [lastPressed, setLastPressed] = useState("");

  const regions = useMemo(
    () =>
      activeRegions.map((id) => ({
        id,
        active: true
      })),
    [activeRegions]
  );

  return (
    <ScreenTemplate
      title="Country Map"
      description="SVG prefecture map with data-driven highlighting. Tap a region on the map or use the presets below."
    >
      <CountryMap
        country="japan"
        height={360}
        regions={regions}
        onRegionPress={(id, name) => {
          setLastPressed(name);
          setActiveRegions((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
        }}
      />

      {lastPressed ? <Text style={styles.hint}>最近点击：{lastPressed}</Text> : null}

      <View style={styles.presets}>
        {presets.map((preset) => (
          <Pressable
            key={preset.label}
            onPress={() => setActiveRegions([...preset.regions])}
            style={({ pressed }) => [styles.preset, pressed && styles.presetPressed]}
          >
            <Text style={styles.presetText}>{preset.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.caption}>当前点亮：{activeRegions.length ? activeRegions.join("、") : "无"}</Text>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: typography.body
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xl
  },
  preset: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  presetPressed: {
    opacity: 0.85
  },
  presetText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600"
  },
  caption: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "600"
  }
});
