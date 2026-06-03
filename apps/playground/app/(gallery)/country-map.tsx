import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CountryMap, countryCatalog, FlagIcon, getCountryCatalogItem, SelectDropdown, type CountryId, type CountryPreset } from "@pulse-ui/ui";
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
  const [focusedPresetRegions, setFocusedPresetRegions] = useState<readonly string[] | undefined>(undefined);

  const presets = useMemo(() => getPresets(country), [country]);
  const countryOptions = useMemo(
    () =>
      countryCatalog.map((item) => ({
        value: item.id,
        label: item.label,
        icon: <FlagIcon country={item.id} size={30} />
      })),
    []
  );

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
      <SelectDropdown
        title="选择国家"
        value={country}
        options={countryOptions}
        onValueChange={(nextCountry) => {
          const item = getCountryCatalogItem(nextCountry);
          setCountry(nextCountry);
          setActiveRegions(item ? [...item.sampleRegions] : []);
          setLastPressed("");
          setFocusedPresetRegions(undefined);
        }}
        style={styles.countrySelect}
      />

      <CountryMap
        key={`${country}-${focusedPresetRegions?.join(",") ?? "default"}`}
        country={country}
        height={360}
        regions={regions}
        regionDepth={false}
        showZoomControls
        strokeWidth={1.2}
        initialFocusRegionIds={focusedPresetRegions}
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
            onPress={() => {
              setActiveRegions([...preset.regions]);
              setFocusedPresetRegions(preset.regions.length ? [...preset.regions] : undefined);
            }}
            style={({ pressed }) => [
              styles.preset,
              isSamePreset(focusedPresetRegions, preset.regions) && styles.presetActive,
              pressed && styles.presetPressed
            ]}
          >
            <Text style={[styles.presetText, isSamePreset(focusedPresetRegions, preset.regions) && styles.presetTextActive]}>
              {preset.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.caption}>当前点亮：{activeRegions.length ? activeRegions.join("、") : "无"}</Text>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  countrySelect: {
    minWidth: 220,
    marginBottom: spacing.lg
  },
  hint: {
    marginTop: spacing.md,
    color: "#3C3F44",
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
  presetActive: {
    backgroundColor: "#E8F7D9",
    borderColor: "#58CC02"
  },
  presetPressed: {
    opacity: 0.85
  },
  presetText: {
    color: "#3C3F44",
    fontSize: typography.body,
    fontWeight: "600"
  },
  presetTextActive: {
    color: "#3F7B17"
  },
  caption: {
    marginTop: spacing.lg,
    color: "#3C3F44",
    fontSize: typography.bodyLg,
    fontWeight: "600"
  }
});

function isSamePreset(current: readonly string[] | undefined, next: readonly string[]) {
  if (!current?.length && !next.length) {
    return true;
  }

  if ((current?.length ?? 0) !== next.length) {
    return false;
  }

  return next.every((item, index) => current?.[index] === item);
}
