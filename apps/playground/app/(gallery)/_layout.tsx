import { Slot, usePathname, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { colors, spacing, typography } from "@pulse-ui/core";

const items = [
  { label: "Accordion", href: "/accordion" },
  { label: "Calendar", href: "/calendar" },
  { label: "Bubble", href: "/bubble" },
  { label: "Cards", href: "/card" },
  { label: "Country Map", href: "/country-map" },
  { label: "Dialog", href: "/dialog" },
  { label: "Buttons", href: "/button" },
  { label: "Choices", href: "/choice-card" },
  { label: "Icons", href: "/icons" },
  { label: "Tabs", href: "/tab" },
  { label: "Text Fields", href: "/text-field" },
  { label: "Toggles", href: "/toggle" },
  { label: "Tags", href: "/tag" },
  { label: "Section Headings", href: "/section-heading" },
  { label: "Match Tokens", href: "/match-token" },
  { label: "Word Builder", href: "/word-builder" },
  { label: "XP Bars", href: "/xp-bar" }
] as const;

export default function GalleryLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  return (
    <View style={styles.page}>
      <View style={[styles.sidebar, !isWide && styles.sidebarCompact]}>
        <Text style={styles.brand}>PulseUI</Text>
        <Text style={styles.subtitle}>Gamified React Native playground</Text>
        <ScrollView contentContainerStyle={styles.navList} showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            const active = pathname === item.href || (pathname === "/" && item.href === "/button");
            return (
              <Pressable key={item.href} onPress={() => router.replace(item.href as never)} style={[styles.navItem, active && styles.navItemActive]}>
                <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background
  },
  sidebar: {
    width: 280,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.xl,
    backgroundColor: colors.secondary
  },
  sidebarCompact: {
    width: 220
  },
  brand: {
    color: colors.surface,
    fontSize: typography.hero,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: spacing.sm,
    color: "#BFC8E6",
    fontSize: typography.body
  },
  navList: {
    gap: spacing.sm,
    marginTop: spacing["2xl"]
  },
  navItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  navItemActive: {
    backgroundColor: colors.surface
  },
  navText: {
    color: colors.surface,
    fontSize: typography.bodyLg,
    fontWeight: "600"
  },
  navTextActive: {
    color: colors.secondary
  },
  content: {
    flex: 1
  }
});
