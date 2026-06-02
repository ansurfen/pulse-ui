import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ChoiceCard, ChoiceGroup } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const options = [
  { value: "tea", label: "tea", index: 1, icon: "☕" },
  { value: "coffee", label: "coffee", index: 2, icon: "🫘" },
  { value: "sugar", label: "sugar", index: 3, icon: "🧃" }
] as const;

export default function ChoiceCardScreen() {
  const [value, setValue] = useState("coffee");

  return (
    <ScreenTemplate title="Choice Cards" description="Selectable answer cards with radio-style behavior. The card owns selection state and feedback, while the inner content stays fully custom.">
      <ChoiceGroup value={value} onValueChange={setValue}>
        <View style={styles.grid}>
          {options.map((option) => {
            const selected = value === option.value;

            return (
              <ChoiceCard key={option.value} value={option.value} style={styles.choice}>
                <View style={styles.choiceBody}>
                  <View style={styles.iconWrap}>
                    <Text style={styles.icon}>{option.icon}</Text>
                  </View>
                  <View style={styles.footer}>
                    <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
                    <View style={[styles.indexBadge, selected && styles.indexBadgeSelected]}>
                      <Text style={[styles.indexText, selected && styles.indexTextSelected]}>{option.index}</Text>
                    </View>
                  </View>
                </View>
              </ChoiceCard>
            );
          })}
        </View>
      </ChoiceGroup>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg
  },
  choice: {
    flexBasis: 190,
    flexGrow: 1,
    maxWidth: 210
  },
  choiceBody: {
    flex: 1,
    justifyContent: "space-between"
  },
  iconWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl
  },
  icon: {
    fontSize: 72
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  label: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "500",
    textTransform: "lowercase"
  },
  labelSelected: {
    color: "#1493E6"
  },
  indexBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "#E1E1E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  indexBadgeSelected: {
    borderColor: "#78D0FF",
    backgroundColor: "#EAF7FF"
  },
  indexText: {
    color: "#9E9E9E",
    fontSize: typography.body,
    fontWeight: "700"
  },
  indexTextSelected: {
    color: "#1493E6"
  }
});
