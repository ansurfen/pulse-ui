import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "@pulse-ui/ui";
import { spacing, typography, usePulseTheme } from "@pulse-ui/core";

export interface ScreenTemplateProps extends PropsWithChildren {
  title: string;
  description: string;
  /** When false, preview card allows popovers/tooltips to extend outside without clipping. */
  clipPreview?: boolean;
}

export function ScreenTemplate({ title, description, clipPreview = true, children }: ScreenTemplateProps) {
  const theme = usePulseTheme();
  const { colors } = theme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.page }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.text.muted }]}>{description}</Text>
      <Card style={{ ...styles.previewCard, ...(!clipPreview ? styles.previewCardUnclipped : undefined) }}>
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
  previewCardUnclipped: {
    overflow: "visible"
  },
  preview: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center"
  }
});
