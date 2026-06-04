import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  LineChart,
  type LegendPosition,
  type LineChartSeriesType,
  type LineChartTooltipContext
} from "@pulse-ui/ui";
import { colors, radius, spacing, typography } from "@pulse-ui/core";
import { ScreenTemplate } from "../../src/components/ScreenTemplate";

const weekLabels = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"] as const;

const dualSeries = [
  {
    name: "Natalie",
    color: "#1CB0F6",
    summary: "180 XP",
    symbol: "filled" as const,
    data: [30, 85, 15, 15, 25, 15, 0]
  },
  {
    name: "You",
    color: "#C5C5C5",
    summary: "13 XP",
    symbol: "hollow" as const,
    data: [0, 0, 0, 0, 0, 15, 0]
  }
];

const singleSeries = [
  {
    name: "本周 XP",
    color: "#58CC02",
    summary: "96 XP",
    symbol: "filled" as const,
    data: [12, 28, 20, 35, 30, 42, 38]
  }
];

const chartTypes: LineChartSeriesType[] = ["line", "smooth", "area"];
const legendPositions: LegendPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

function CustomTooltip({ context }: { context: LineChartTooltipContext }) {
  const total = context.items.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={customTooltipStyles.card}>
      <Text style={customTooltipStyles.title}>{context.category} · 合计 {total} XP</Text>
      {context.items.map((item) => (
        <Text key={item.name} style={[customTooltipStyles.line, { color: item.color }]}>
          {item.name}: {item.value} XP
        </Text>
      ))}
    </View>
  );
}

export default function LineChartScreen() {
  const [chartType, setChartType] = useState<LineChartSeriesType>("line");
  const [legendPosition, setLegendPosition] = useState<LegendPosition>("top-left");

  return (
    <ScreenTemplate
      title="Line Chart"
      description="Hover a point to see values. Tooltip content is customizable via tooltip.render."
    >
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>Chart type</Text>
        <View style={styles.row}>
          {chartTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => setChartType(type)}
              style={[styles.chip, chartType === type && styles.chipActive]}
            >
              <Text style={[styles.chipText, chartType === type && styles.chipTextActive]}>{type}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.controlLabel}>Legend position</Text>
        <View style={styles.row}>
          {legendPositions.map((position) => (
            <Pressable
              key={position}
              onPress={() => setLegendPosition(position)}
              style={[styles.chip, legendPosition === position && styles.chipActive]}
            >
              <Text style={[styles.chipText, legendPosition === position && styles.chipTextActive]}>{position}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>双线对比</Text>
      <LineChart
        categories={weekLabels}
        legend={{ position: legendPosition, show: true }}
        series={dualSeries}
        type={chartType}
        yAxis={{ splitNumber: 4 }}
      />

      <Text style={styles.sectionTitle}>单条线</Text>
      <LineChart
        categories={weekLabels}
        legend={{ position: legendPosition, show: true }}
        series={singleSeries}
        type={chartType}
        yAxis={{ splitNumber: 4 }}
      />

      <Text style={styles.sectionTitle}>自定义 Tooltip</Text>
      <LineChart
        categories={weekLabels}
        legend={{ position: legendPosition, show: true }}
        series={dualSeries}
        tooltip={{ render: (context) => <CustomTooltip context={context} /> }}
        type={chartType}
        yAxis={{ splitNumber: 4 }}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  controlLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLg,
    fontWeight: "800",
    marginBottom: spacing.md
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipActive: {
    backgroundColor: "#EAF7FF",
    borderColor: "#1CB0F6"
  },
  chipText: {
    color: "#3C3F44",
    fontSize: typography.caption,
    fontWeight: "600"
  },
  chipTextActive: {
    color: "#1CB0F6"
  }
});

const customTooltipStyles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: "#1F2937",
    gap: 4
  },
  title: {
    color: "#F9FAFB",
    fontSize: typography.caption,
    fontWeight: "800"
  },
  line: {
    fontSize: typography.caption,
    fontWeight: "700"
  }
});
