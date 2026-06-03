import { StyleSheet, Text, View } from "react-native";
import { Button, LightningIcon } from "@pulse-ui/ui";
import { spacing } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function ButtonScreen() {
  return (
    <ScreenTemplate title="Buttons" description="Duolingo-inspired action buttons with chunky depth, playful gloss, and optional custom color control.">
      <View style={styles.row}>
        <Button label="开始 +10 经验" backgroundColor="#2BA6E6" />
        <Button label="创建档案" backgroundColor="#58CC02" />
        <Button label="登录" backgroundColor="#2BA6E6" />
        <Button
          label="去学个单元"
          tone="flat"
          backgroundColor="#FFFFFF"
          textColor="#1CB0F6"
          borderColor="#D9D9D9"
          hoverBackgroundColor="#E5E5E5"
          hoverTextColor="#1CB0F6"
          hoverBorderColor="#C8C8C8"
        />
        <Button
          label="我知道一些常用词汇"
          tone="flat"
          backgroundColor="#FFFFFF"
          textColor="#4B4B4B"
          borderColor="#D9D9D9"
          hoverBackgroundColor="#F3F3F3"
          hoverTextColor="#4B4B4B"
          hoverBorderColor="#CDCDCD"
          contentAlign="left"
          prefix={
            <View style={styles.barIcon}>
              <View style={[styles.bar, { height: 10, backgroundColor: "#2BA6E6" }]} />
              <View style={[styles.bar, { height: 14, backgroundColor: "#66C7F3" }]} />
              <View style={[styles.bar, { height: 18, backgroundColor: "#9ADBFA" }]} />
              <View style={[styles.bar, { height: 22, backgroundColor: "#C8EEFF" }]} />
            </View>
          }
        />
        <Button
          label="GOOGLE"
          tone="flat"
          backgroundColor="#FFFFFF"
          textColor="#4285F4"
          borderColor="#DADCE0"
          hoverBackgroundColor="#F8F9FA"
          hoverTextColor="#4285F4"
          hoverBorderColor="#C8CDD3"
          contentAlign="center"
          prefix={
            <View style={styles.googleIcon}>
              <View style={[styles.googleDot, { backgroundColor: "#EA4335" }]} />
              <View style={[styles.googleDot, { backgroundColor: "#FBBC05" }]} />
              <View style={[styles.googleDot, { backgroundColor: "#34A853" }]} />
              <View style={[styles.googleDot, { backgroundColor: "#4285F4" }]} />
            </View>
          }
        />
        <Button
          label="继续"
          tone="flat"
          backgroundColor="#FFFFFF"
          textColor="#4B4B4B"
          borderColor="#D9D9D9"
          hoverBackgroundColor="#F3F3F3"
          hoverTextColor="#4B4B4B"
          hoverBorderColor="#CDCDCD"
          suffix={
            <View style={styles.energySuffix}>
              <LightningIcon size={18} />
              <Text style={styles.energyText}>3</Text>
            </View>
          }
        />
        <Button label="已完成" backgroundColor="#58CC02" textColor="#FFFFFF" disabled />
        <Button
          label="当前不可用"
          tone="flat"
          backgroundColor="#FFFFFF"
          textColor="#A3A3A3"
          borderColor="#DDDDDD"
          disabled
        />
        <Button label="保存中..." backgroundColor="#FFB648" loading textColor="#FFFFFF" />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md
  },
  barIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3
  },
  bar: {
    width: 6,
    borderRadius: 3
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden"
  },
  googleDot: {
    width: 9,
    height: 9
  },
  energySuffix: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  energyText: {
    color: "#7C8798",
    fontSize: 14,
    fontWeight: "800"
  }
});
