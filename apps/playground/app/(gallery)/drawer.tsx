import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Drawer } from "@pulse-ui/ui";
import { colors, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function DrawerScreen() {
  const [bottomOpen, setBottomOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);

  return (
    <ScreenTemplate
      title="Drawer"
      description="Slide-in panels from the top or bottom edge. Uses Modal plus Reanimated, without z-index stacking."
    >
      <View style={styles.wrapper}>
        <Button label="底部抽屉" backgroundColor="#1CB0F6" onPress={() => setBottomOpen(true)} />
        <Button label="顶部抽屉" backgroundColor="#58CC02" onPress={() => setTopOpen(true)} />
      </View>

      <Drawer visible={bottomOpen} placement="bottom" onRequestClose={() => setBottomOpen(false)}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>底部抽屉</Text>
          <Text style={styles.sheetDescription}>从屏幕下方向上滑入，适合操作菜单或表单。</Text>
          <Button label="关闭" backgroundColor="#1CB0F6" onPress={() => setBottomOpen(false)} />
        </View>
      </Drawer>

      <Drawer visible={topOpen} placement="top" onRequestClose={() => setTopOpen(false)}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>顶部抽屉</Text>
          <Text style={styles.sheetDescription}>从屏幕顶部向下滑入，适合通知或快捷筛选。</Text>
          <Button label="关闭" backgroundColor="#58CC02" onPress={() => setTopOpen(false)} />
        </View>
      </Drawer>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
    maxWidth: 320
  },
  sheetContent: {
    gap: spacing.lg
  },
  sheetTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    textAlign: "center"
  },
  sheetDescription: {
    color: colors.textMuted,
    fontSize: typography.bodyLg,
    lineHeight: 22,
    textAlign: "center"
  }
});
