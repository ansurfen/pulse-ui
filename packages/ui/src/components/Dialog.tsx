import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button } from "./Button";
import { radius, spacing, typography, usePulseTheme } from "@pulse-ui/core";

export type DialogActionTone = "primary" | "secondary" | "text";
export type DialogActionsLayout = "stacked" | "row";

export interface DialogAction {
  label: string;
  onPress?: () => void;
  tone?: DialogActionTone;
  disabled?: boolean;
}

export interface DialogProps {
  visible: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  actions?: DialogAction[];
  actionsLayout?: DialogActionsLayout;
  dismissAction?: DialogAction;
  onRequestClose?: () => void;
  dismissOnBackdropPress?: boolean;
  style?: ViewStyle;
}

export function Dialog({
  visible,
  title,
  description,
  children,
  actions = [],
  actionsLayout = "stacked",
  dismissAction,
  onRequestClose,
  dismissOnBackdropPress = true,
  style
}: DialogProps) {
  const theme = usePulseTheme();
  const { colors } = theme;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlay.scrim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissOnBackdropPress ? onRequestClose : undefined} />
        <View style={[styles.card, { backgroundColor: colors.background.surface }, style]}>
          {title ? <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text> : null}
          {description ? <Text style={[styles.description, { color: colors.text.muted }]}>{description}</Text> : null}
          {children ? <View style={styles.content}>{children}</View> : null}
          {actions.length > 0 ? (
            <View style={[styles.actions, actionsLayout === "row" ? styles.actionsRow : styles.actionsStacked]}>
              {actions.map((action) => (
                <View key={action.label} style={actionsLayout === "row" ? styles.actionGrow : undefined}>
                  {action.tone === "text" ? (
                    <Pressable disabled={action.disabled} onPress={action.onPress} style={styles.textAction}>
                      <Text style={[styles.textActionLabel, { color: colors.feedback.danger }, action.disabled && styles.textActionDisabled]}>{action.label}</Text>
                    </Pressable>
                  ) : (
                    <Button
                      label={action.label}
                      tone={action.tone === "secondary" ? "flat" : "elevated"}
                      backgroundColor={action.tone === "secondary" ? colors.background.surface : colors.brand.secondary}
                      textColor={action.tone === "secondary" ? colors.text.primary : colors.text.inverse}
                      borderColor={action.tone === "secondary" ? colors.border.strong : undefined}
                      hoverBackgroundColor={action.tone === "secondary" ? "#F3F3F3" : undefined}
                      hoverBorderColor={action.tone === "secondary" ? "#CDCDCD" : undefined}
                      onPress={action.onPress}
                      disabled={action.disabled}
                    />
                  )}
                </View>
              ))}
            </View>
          ) : null}
          {dismissAction ? (
            <Pressable disabled={dismissAction.disabled} onPress={dismissAction.onPress} style={styles.dismissAction}>
              <Text style={[styles.dismissActionLabel, { color: colors.feedback.danger }, dismissAction.disabled && styles.textActionDisabled]}>{dismissAction.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg
  },
  title: {
    fontSize: typography.title,
    fontWeight: "800",
    textAlign: "center"
  },
  description: {
    fontSize: typography.bodyLg,
    textAlign: "center",
    lineHeight: 22
  },
  content: {
    gap: spacing.md
  },
  actions: {
    gap: spacing.md
  },
  actionsStacked: {},
  actionsRow: {
    flexDirection: "row"
  },
  actionGrow: {
    flex: 1
  },
  textAction: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm
  },
  textActionLabel: {
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  textActionDisabled: {
    opacity: 0.45
  },
  dismissAction: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xs
  },
  dismissActionLabel: {
    fontSize: typography.bodyLg,
    fontWeight: "700"
  }
});
