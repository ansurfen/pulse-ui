import { StyleSheet, View } from "react-native";
import { SectionHeading } from "@pulse-ui/ui";
import { spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function SectionHeadingScreen() {
  return (
    <ScreenTemplate
      title="Section Headings"
      description="Section labels with divider lines. Supports centered inline labels and title-with-underline layouts."
    >
      <View style={styles.stack}>
        <SectionHeading variant="centered">元音</SectionHeading>
        <SectionHeading variant="title">道具</SectionHeading>
        <SectionHeading color="#1CB0F6" fontSize={typography.bodyLg} variant="centered">
          自定义颜色与字号
        </SectionHeading>
        <SectionHeading fontSize={typography.title} fontWeight="800" variant="title">
          大号标题
        </SectionHeading>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing["2xl"]
  }
});
