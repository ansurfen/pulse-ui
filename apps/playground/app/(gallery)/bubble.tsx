import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BubblePopover,
  type BubblePopoverPlacement,
  FlagIcon,
  SelectDropdown,
  type SelectDropdownOption
} from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const placements: BubblePopoverPlacement[] = ["top", "bottom", "left", "right"];

const placementLabels: Record<BubblePopoverPlacement, string> = {
  top: "上方 Top",
  bottom: "下方 Bottom",
  left: "左侧 Left",
  right: "右侧 Right"
};

function DemoAnchor({ label }: { label: string }) {
  return (
    <View style={styles.anchor}>
      <Text style={styles.anchorText}>{label}</Text>
    </View>
  );
}

export default function BubbleScreen() {
  const [course, setCourse] = useState<string>("english");
  const courseOptions: SelectDropdownOption[] = [
    {
      value: "english",
      label: "英语",
      icon: <FlagIcon country="usa" size={34} />
    },
    {
      value: "add",
      label: "添加新课程",
      icon: (
        <View style={styles.plusTile}>
          <Text style={styles.plusTileText}>＋</Text>
        </View>
      )
    }
  ];

  return (
    <ScreenTemplate
      title="Bubble Popover"
      description="Four arrow directions shown at once around a shared anchor. SelectDropdown reuses the same bubble component."
      clipPreview={false}
    >
      <View style={styles.wrapper}>
        <Text style={styles.sectionTitle}>四向气泡（同时展示）</Text>
        <View style={styles.demoStage}>
          <View style={styles.compassHost}>
            {placements.map((placement) => (
              <BubblePopover
                key={placement}
                placement={placement}
                defaultVisible
                openOnPress={false}
                style={styles.compassPopover}
                trigger={<DemoAnchor label="锚点" />}
              >
                <View style={styles.simpleBubble}>
                  <Text style={styles.simpleBubbleText}>{placementLabels[placement]}</Text>
                </View>
              </BubblePopover>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>SelectDropdown</Text>
        <View style={styles.dropdownRow}>
          <SelectDropdown
            title="我的课程"
            value={course}
            options={courseOptions}
            onValueChange={setCourse}
            placement="bottom"
            style={styles.dropdownTrigger}
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}

const STAGE_PADDING = 112;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing["2xl"],
    width: "100%"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  demoStage: {
    width: "100%",
    paddingVertical: STAGE_PADDING,
    paddingHorizontal: STAGE_PADDING,
    alignItems: "center",
    justifyContent: "center"
  },
  compassHost: {
    position: "relative",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center"
  },
  compassPopover: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  anchor: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  anchorText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: "700"
  },
  simpleBubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  simpleBubbleText: {
    color: "#4B4B4B",
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  dropdownRow: {
    minHeight: 120,
    justifyContent: "flex-start",
    paddingTop: spacing.lg
  },
  dropdownTrigger: {
    minWidth: 220
  },
  plusTile: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  plusTileText: {
    color: "#979797",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 24
  }
});
