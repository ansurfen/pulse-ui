import { StyleSheet, View } from "react-native";
import { Tag } from "@pulse-ui/ui";
import { spacing } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function TagScreen() {
  return (
    <ScreenTemplate
      title="Tags"
      description="Compact labels with preset variants and fully themeable background, text, and border colors."
    >
      <View style={styles.row}>
        <Tag label="下一级" />
        <Tag label="下一级" variant="primary" />
        <Tag label="已完成" variant="success" />
        <Tag label="待复习" variant="warning" />
        <Tag label="已过期" variant="danger" />
        <Tag label="新功能" variant="info" />
      </View>

      <View style={styles.row}>
        <Tag label="小号" size="sm" />
        <Tag label="小号" size="sm" variant="primary" />
        <Tag
          label="自定义"
          theme={{
            backgroundColor: "#1D2B53",
            textColor: "#FFFFFF"
          }}
        />
        <Tag
          label="描边"
          theme={{
            backgroundColor: "#FFFFFF",
            textColor: "#58CC02",
            borderColor: "#58CC02"
          }}
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl
  }
});
