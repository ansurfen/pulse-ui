import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Dialog } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function DialogScreen() {
  const [open, setOpen] = useState<null | "single" | "stacked" | "row">(null);

  return (
    <ScreenTemplate
      title="Dialog"
      description="Configurable modal dialogs for Duolingo-style prompts. Supports a single primary action, stacked action + text dismiss, or two side-by-side buttons."
    >
      <View style={styles.wrapper}>
        <View style={styles.previewBlock}>
          <Text style={styles.sectionTitle}>Open Examples</Text>
          <View style={styles.buttonStack}>
            <Button label="单按钮弹窗" backgroundColor="#2BA6E6" onPress={() => setOpen("single")} />
            <Button label="主按钮 + 文字退出" backgroundColor="#58CC02" onPress={() => setOpen("stacked")} />
            <Button label="左右两个按钮" backgroundColor="#FFB648" onPress={() => setOpen("row")} />
          </View>
        </View>
      </View>

      <Dialog
        visible={open === "single"}
        title="任务完成"
        description="这种形式适合只有一个明确下一步的提示。"
        actions={[{ label: "知道了", onPress: () => setOpen(null) }]}
        onRequestClose={() => setOpen(null)}
      />

      <Dialog
        visible={open === "stacked"}
        title="继续努力"
        description="这类结构适合主按钮在上，危险或放弃操作放在下面。"
        actions={[{ label: "继续努力", onPress: () => setOpen(null) }]}
        dismissAction={{ label: "退出", onPress: () => setOpen(null) }}
        onRequestClose={() => setOpen(null)}
      />

      <Dialog
        visible={open === "row"}
        title="确认退出？"
        description="也支持左右两个按钮并排，适合确认型弹窗。"
        actionsLayout="row"
        actions={[
          { label: "取消", tone: "secondary", onPress: () => setOpen(null) },
          { label: "确认", onPress: () => setOpen(null) }
        ]}
        onRequestClose={() => setOpen(null)}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl
  },
  previewBlock: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: "#F8FAFD"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  buttonStack: {
    gap: spacing.md
  }
});
