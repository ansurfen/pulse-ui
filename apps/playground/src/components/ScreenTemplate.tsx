import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";

export interface ScreenTemplateProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function ScreenTemplate({ title, description, children }: ScreenTemplateProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
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
    color: colors.text,
    fontSize: typography.hero,
    fontWeight: "800"
  },
  description: {
    color: colors.textMuted,
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

