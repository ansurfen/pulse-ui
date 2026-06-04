import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@pulse-ui/ui";
import { spacing, typography, usePulseTheme } from "@pulse-ui/core";

export interface ScreenTemplateProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function ScreenTemplate({ title, description, children }: ScreenTemplateProps) {
  const theme = usePulseTheme();
  const { colors } = theme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.page }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.text.muted }]}>{description}</Text>
      <Card style={styles.previewCard}>
        <View style={styles.preview}>{children}</View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: spacing["3xl"],
    gap: spacing.lg
  },
  title: {
    fontSize: typography.hero,
    fontWeight: "800"
  },
  description: {
    fontSize: typography.bodyLg,
    maxWidth: 760
  },
  previewCard: {
    minHeight: 420
  },
  preview: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center"
  }
});
