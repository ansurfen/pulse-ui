import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CountryMap, countryCatalog, getCountryCatalogItem, type CountryId, type CountryPreset } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const defaultCountry: CountryId = "japan";

function getPresets(country: CountryId): CountryPreset[] {
  const item = getCountryCatalogItem(country);
  if (!item) {
    return [{ label: "清空", regions: [] }];
  }

  if (item.presets?.length) {
    return [...item.presets, { label: "清空", regions: [] }];
  }

  return [
    ...item.sampleRegions.map((id) => ({ label: id, regions: [id] })),
    { label: "全部", regions: [...item.sampleRegions] },
    { label: "清空", regions: [] }
  ];
}

export default function CountryMapScreen() {
  const [country, setCountry] = useState<CountryId>(defaultCountry);
  const [activeRegions, setActiveRegions] = useState<string[]>(() => [...getCountryCatalogItem(defaultCountry)!.sampleRegions]);
  const [lastPressed, setLastPressed] = useState("");

  const presets = useMemo(() => getPresets(country), [country]);

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
      description="SVG region map with data-driven highlighting. Switch countries below, then tap regions or use presets."
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.countryRow}>
        {countryCatalog.map((item) => {
          const selected = country === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setCountry(item.id);
                setActiveRegions([...item.sampleRegions]);
                setLastPressed("");
              }}
              style={({ pressed }) => [
                styles.countryChip,
                selected && styles.countryChipSelected,
                pressed && styles.chipPressed
              ]}
            >
              <Text style={[styles.countryChipText, selected && styles.countryChipTextSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <CountryMap
        key={country}
        country={country}
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
  countryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingBottom: spacing.lg
  },
  countryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  countryChipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  countryChipText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600"
  },
  countryChipTextSelected: {
    color: colors.surface
  },
  chipPressed: {
    opacity: 0.85
  },
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
