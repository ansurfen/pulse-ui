import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button } from "./Button";
import { colors, radius, spacing, typography } from "@pulse-ui/core";

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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissOnBackdropPress ? onRequestClose : undefined} />
        <View style={[styles.card, style]}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {description ? <Text style={styles.description}>{description}</Text> : null}
          {children ? <View style={styles.content}>{children}</View> : null}
          {actions.length > 0 ? (
            <View style={[styles.actions, actionsLayout === "row" ? styles.actionsRow : styles.actionsStacked]}>
              {actions.map((action) => (
                <View key={action.label} style={actionsLayout === "row" ? styles.actionGrow : undefined}>
                  {action.tone === "text" ? (
                    <Pressable disabled={action.disabled} onPress={action.onPress} style={styles.textAction}>
                      <Text style={[styles.textActionLabel, action.disabled && styles.textActionDisabled]}>{action.label}</Text>
                    </Pressable>
                  ) : (
                    <Button
                      label={action.label}
                      tone={action.tone === "secondary" ? "flat" : "elevated"}
                      backgroundColor={action.tone === "secondary" ? "#FFFFFF" : "#2BA6E6"}
                      textColor={action.tone === "secondary" ? "#4B4B4B" : "#FFFFFF"}
                      borderColor={action.tone === "secondary" ? "#D9D9D9" : undefined}
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
              <Text style={[styles.dismissActionLabel, dismissAction.disabled && styles.textActionDisabled]}>{dismissAction.label}</Text>
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
    backgroundColor: "rgba(24, 32, 51, 0.28)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    textAlign: "center"
  },
  description: {
    color: colors.textMuted,
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
    color: "#FF4B4B",
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
    color: "#FF4B4B",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  }
});
