import { useState } from "react";
import { Slot, usePathname, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import {
  PulseThemeBrandName,
  PulseThemeMode,
  PulseThemeProvider,
  createPulseTheme,
  pulseThemeBrands,
  spacing,
  typography
} from "@pulse-ui/core";

const items = [
  { label: "Accordion", href: "/accordion" },
  { label: "Calendar", href: "/calendar" },
  { label: "Bubble", href: "/bubble" },
  { label: "Cards", href: "/card" },
  { label: "Country Map", href: "/country-map" },
  { label: "Dialog", href: "/dialog" },
  { label: "Drawer", href: "/drawer" },
  { label: "Buttons", href: "/button" },
  { label: "Choices", href: "/choice-card" },
  { label: "Icons", href: "/icons" },
  { label: "Line Chart", href: "/line-chart" },
  { label: "Tabs", href: "/tab" },
  { label: "DateTime Picker", href: "/date-time-picker" },
  { label: "Time Picker", href: "/time-picker" },
  { label: "Text Fields", href: "/text-field" },
  { label: "Toggles", href: "/toggle" },
  { label: "Tags", href: "/tag" },
  { label: "Section Headings", href: "/section-heading" },
  { label: "Settings", href: "/settings" },
  { label: "Match Tokens", href: "/match-token" },
  { label: "Word Builder", href: "/word-builder" },
  { label: "XP Bars", href: "/xp-bar" }
] as const;

const brandOptions: { key: PulseThemeBrandName; label: string }[] = [
  { key: "pulse", label: pulseThemeBrands.pulse.label },
  { key: "voyika", label: pulseThemeBrands.voyika.label }
];

const modeOptions: { key: PulseThemeMode; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" }
];

export default function GalleryLayout() {
  const [brandName, setBrandName] = useState<PulseThemeBrandName>("pulse");
  const [mode, setMode] = useState<PulseThemeMode>("light");
  const theme = createPulseTheme(brandName, mode);
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  return (
    <PulseThemeProvider theme={theme}>
      <View style={[styles.page, { backgroundColor: theme.colors.background.page }]}>
        <View
          style={[
            styles.sidebar,
            !isWide && styles.sidebarCompact,
            { backgroundColor: theme.mode === "dark" ? theme.colors.background.surface : theme.colors.brand.secondaryDeep }
          ]}
        >
          <Text style={[styles.brand, { color: theme.colors.text.inverse }]}>PulseUI</Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.mode === "dark" ? theme.colors.text.muted : "rgba(255,255,255,0.72)" }
            ]}
          >
            Gamified React Native playground
          </Text>

          <View style={styles.controlGroup}>
            <Text style={[styles.controlLabel, { color: theme.mode === "dark" ? theme.colors.text.muted : "rgba(255,255,255,0.72)" }]}>
              Theme
            </Text>
            <View style={styles.themeSwitch}>
              {brandOptions.map((option) => {
                const active = option.key === brandName;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setBrandName(option.key)}
                    style={[
                      styles.themeChip,
                      {
                        backgroundColor: active
                          ? theme.colors.background.surface
                          : theme.mode === "dark"
                            ? theme.colors.background.surfaceAlt
                            : "rgba(255,255,255,0.08)",
                        borderColor: active
                          ? theme.colors.border.default
                          : theme.mode === "dark"
                            ? theme.colors.border.default
                            : "rgba(255,255,255,0.12)"
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeChipText,
                        {
                          color: active
                            ? theme.colors.text.primary
                            : theme.mode === "dark"
                              ? theme.colors.text.secondary
                              : theme.colors.text.inverse
                        }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.controlGroup}>
            <Text style={[styles.controlLabel, { color: theme.mode === "dark" ? theme.colors.text.muted : "rgba(255,255,255,0.72)" }]}>
              Mode
            </Text>
            <View style={styles.themeSwitch}>
              {modeOptions.map((option) => {
                const active = option.key === mode;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setMode(option.key)}
                    style={[
                      styles.themeChip,
                      {
                        backgroundColor: active
                          ? theme.colors.background.surface
                          : theme.mode === "dark"
                            ? theme.colors.background.surfaceAlt
                            : "rgba(255,255,255,0.08)",
                        borderColor: active
                          ? theme.colors.border.default
                          : theme.mode === "dark"
                            ? theme.colors.border.default
                            : "rgba(255,255,255,0.12)"
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeChipText,
                        {
                          color: active
                            ? theme.colors.text.primary
                            : theme.mode === "dark"
                              ? theme.colors.text.secondary
                              : theme.colors.text.inverse
                        }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.navList} showsVerticalScrollIndicator={false}>
            {items.map((item) => {
              const active = pathname === item.href || (pathname === "/" && item.href === "/button");
              return (
                <Pressable
                  key={item.href}
                  onPress={() => router.replace(item.href as never)}
                  style={[
                    styles.navItem,
                    {
                      backgroundColor: active
                        ? theme.colors.background.surface
                        : theme.mode === "dark"
                          ? theme.colors.background.surfaceAlt
                          : "rgba(255,255,255,0.06)"
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.navText,
                      {
                        color: active
                          ? theme.colors.text.primary
                          : theme.mode === "dark"
                            ? theme.colors.text.secondary
                            : theme.colors.text.inverse
                      }
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </PulseThemeProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "row"
  },
  sidebar: {
    width: 280,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.xl
  },
  sidebarCompact: {
    width: 220
  },
  brand: {
    fontSize: typography.hero,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: typography.body
  },
  themeSwitch: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  controlGroup: {
    marginTop: spacing.lg,
    gap: spacing.sm
  },
  controlLabel: {
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  themeChip: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  themeChipText: {
    fontSize: typography.body,
    fontWeight: "700"
  },
  navList: {
    gap: spacing.sm,
    marginTop: spacing["2xl"]
  },
  navItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16
  },
  navText: {
    fontSize: typography.bodyLg,
    fontWeight: "600"
  },
  content: {
    flex: 1
  }
});
