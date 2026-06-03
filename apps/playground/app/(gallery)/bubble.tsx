import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BubblePopover, Button, CoinIcon, FlagIcon, GemIcon, SelectDropdown, type SelectDropdownOption } from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

export default function BubbleScreen() {
  const [course, setCourse] = useState<string>("english");
  const [gemOpen, setGemOpen] = useState(true);
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
      description="A reusable speech-bubble style popover with custom content and four arrow directions. Hover can be one trigger mode inside the same component, and SelectDropdown is built on top of it."
    >
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <SelectDropdown
            title="我的课程"
            value={course}
            options={courseOptions}
            onValueChange={setCourse}
            placement="bottom"
            style={styles.dropdownTrigger}
          />
        </View>

        <View style={styles.row}>
          <BubblePopover
            placement="bottom"
            visible={gemOpen}
            onVisibleChange={setGemOpen}
            trigger={<View style={styles.anchorBox}><Text style={styles.anchorText}>宝石提示</Text></View>}
            bubbleStyle={styles.largeBubble}
          >
            <View style={styles.gemBubble}>
              <GemIcon size={78} />
              <View style={styles.gemTextWrap}>
                <Text style={styles.gemTitle}>宝石</Text>
                <Text style={styles.gemDescription}>你有 505 颗宝石</Text>
                <Text style={styles.gemLink}>访问宝石小店</Text>
              </View>
            </View>
          </BubblePopover>
        </View>

        <View style={styles.directionRow}>
          <View style={styles.leftPlacementZone}>
            <BubblePopover
              placement="left"
              defaultVisible
              openOnPress={false}
              trigger={<View style={styles.miniAnchor} />}
            >
              <View style={styles.simpleBubble}>
                <Text style={styles.simpleBubbleText}>牛奶</Text>
              </View>
            </BubblePopover>
          </View>

          <View style={styles.leftPlacementWideZone}>
            <BubblePopover
              placement="left"
              defaultVisible
              openOnPress={false}
              trigger={<View style={styles.miniAnchor} />}
              bubbleStyle={styles.audioBubble}
            >
              <View style={styles.audioRow}>
                <Text style={styles.audioIcon}>🔊</Text>
                <View style={styles.audioTextWrap}>
                  <Text style={styles.audioText}>Tea with sugar.</Text>
                  <View style={styles.audioUnderline} />
                </View>
              </View>
            </BubblePopover>
          </View>
        </View>

        <View style={styles.hoverRow}>
          <BubblePopover
            placement="top"
            openOnHover
            openOnPress={false}
            trigger={<Button label="Hover 我" tone="flat" backgroundColor="#FFFFFF" textColor="#4B4B4B" borderColor="#D9D9D9" />}
          >
            <View style={styles.simpleBubble}>
              <Text style={styles.simpleBubbleText}>hover 不需要单独做一套组件。</Text>
            </View>
          </BubblePopover>

          <BubblePopover
            placement="right"
            defaultVisible
            openOnPress={false}
            trigger={<View style={styles.rightAnchor}><CoinIcon size={36} /></View>}
          >
            <View style={styles.simpleBubble}>
              <Text style={styles.simpleBubbleText}>右侧箭头</Text>
            </View>
          </BubblePopover>
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing["2xl"]
  },
  row: {
    minHeight: 180,
    justifyContent: "flex-start",
    paddingTop: spacing.lg
  },
  directionRow: {
    flexDirection: "row",
    gap: spacing["2xl"],
    minHeight: 160,
    alignItems: "center"
  },
  hoverRow: {
    flexDirection: "row",
    gap: spacing["2xl"],
    minHeight: 140,
    alignItems: "center"
  },
  anchorBox: {
    minWidth: 120,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  anchorText: {
    color: colors.textMuted,
    fontSize: typography.bodyLg,
    fontWeight: "700"
  },
  dropdownTrigger: {
    minWidth: 220
  },
  leftPlacementZone: {
    width: 180,
    alignItems: "flex-end"
  },
  leftPlacementWideZone: {
    width: 320,
    alignItems: "flex-end"
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
  },
  largeBubble: {
    minWidth: 340
  },
  gemBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg
  },
  gemTextWrap: {
    gap: spacing.xs
  },
  gemTitle: {
    color: "#4B4B4B",
    fontSize: 22,
    fontWeight: "800"
  },
  gemDescription: {
    color: "#6E7380",
    fontSize: typography.bodyLg,
    fontWeight: "600"
  },
  gemLink: {
    color: "#1C9EF2",
    fontSize: typography.bodyLg,
    fontWeight: "800"
  },
  miniAnchor: {
    width: 16,
    height: 16
  },
  simpleBubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  simpleBubbleText: {
    color: "#4B4B4B",
    fontSize: typography.title,
    fontWeight: "700"
  },
  audioBubble: {
    minWidth: 220
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  audioIcon: {
    fontSize: 28
  },
  audioTextWrap: {
    gap: spacing.xs
  },
  audioText: {
    color: "#4B4B4B",
    fontSize: 18,
    fontWeight: "600"
  },
  audioUnderline: {
    width: 120,
    height: 2,
    backgroundColor: "#D1D1D1",
    borderRadius: radius.pill
  },
  rightAnchor: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  }
});
