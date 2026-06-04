import { useMemo, useState, type ReactNode } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";
import { radius, spacing, typography, usePulseLegacyColors, usePulseTheme } from "@pulse-ui/core";
import {
  buildAreaPath,
  buildLinePath,
  buildPoints,
  buildSmoothPath,
  resolveAxisRange,
  type ChartPlot
} from "./chartGeometry";
import type {
  LegendPosition,
  LineChartLegend,
  LineChartProps,
  LineChartSeries,
  LineChartSeriesType,
  LineChartTooltip,
  LineChartTooltipContext
} from "./types";

const CHART_PADDING = {
  left: 30,
  right: 12,
  top: 16,
  bottom: 26
};

const POINT_MARKER_RADIUS = 6;
const ACTIVE_POINT_MARKER_RADIUS = 8;
const POINT_MARKER_STROKE = 2.5;
const PLOT_TOP_INSET = POINT_MARKER_RADIUS + POINT_MARKER_STROKE + 2;
const TOOLTIP_OFFSET = 12;
const HIT_ZONE_MIN_WIDTH = 28;

function resolveSeriesType(
  series: LineChartSeries,
  chartType: LineChartSeriesType
): LineChartSeriesType {
  return series.type ?? chartType;
}

function buildSeriesPath(points: ReturnType<typeof buildPoints>, type: LineChartSeriesType) {
  if (type === "smooth") {
    return buildSmoothPath(points);
  }

  return buildLinePath(points);
}

function buildTooltipContext(
  index: number,
  categories: readonly string[],
  series: readonly LineChartSeries[]
): LineChartTooltipContext {
  return {
    index,
    category: categories[index] ?? "",
    items: series.map((item) => ({
      name: item.name,
      color: item.color,
      value: item.data[index] ?? 0,
      series: item
    }))
  };
}

function DefaultTooltipCard({
  context,
  style,
  contentStyle
}: {
  context: LineChartTooltipContext;
  style?: LineChartTooltip["style"];
  contentStyle?: LineChartTooltip["contentStyle"];
}) {
  const colors = usePulseLegacyColors();
  return (
    <View
      style={[
        styles.tooltipCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style
      ]}
    >
      <View style={[styles.tooltipContent, contentStyle]}>
        <Text style={[styles.tooltipCategory, { color: colors.text }]}>{context.category}</Text>
        {context.items.map((item) => (
          <View key={item.name} style={styles.tooltipRow}>
            <View style={[styles.tooltipDot, { backgroundColor: item.color }]} />
            <Text style={[styles.tooltipName, { color: colors.textMuted }]}>{item.name}</Text>
            <Text style={[styles.tooltipValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function resolveTooltipContent(
  context: LineChartTooltipContext,
  tooltip?: LineChartTooltip
): ReactNode {
  if (tooltip?.render) {
    return tooltip.render(context);
  }

  return (
    <DefaultTooltipCard
      contentStyle={tooltip?.contentStyle}
      context={context}
      style={tooltip?.style}
    />
  );
}

function LegendRow({
  series,
  position
}: {
  series: readonly LineChartSeries[];
  position: LegendPosition;
}) {
  const colors = usePulseLegacyColors();
  const align = position.includes("right") ? "flex-end" : "flex-start";

  return (
    <View style={[styles.legendRow, { alignItems: align }]}>
      {series.map((item) => (
        <View key={item.name} style={styles.legendItem}>
          <View
            style={[
              styles.legendSymbol,
              item.symbol === "hollow"
                ? { borderColor: item.color, backgroundColor: colors.surface }
                : { backgroundColor: item.color, borderColor: item.color }
            ]}
          />
          <Text style={[styles.legendLabel, { color: item.color }]}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
}

function SummaryRow({ series, align }: { series: readonly LineChartSeries[]; align: "left" | "right" }) {
  const colors = usePulseLegacyColors();
  return (
    <View style={[styles.summaryRow, align === "right" ? styles.summaryRight : styles.summaryLeft]}>
      {series.map((item) => (
        <Text
          key={`${item.name}-summary`}
          style={[
            styles.summaryText,
            { color: item.summary ? item.color : colors.textMuted },
            item.summary && styles.summaryTextStrong
          ]}
        >
          {item.summary ?? ""}
        </Text>
      ))}
    </View>
  );
}

function ChartSvg({
  width,
  height,
  categories,
  series,
  chartType,
  yAxis,
  grid,
  activeIndex
}: {
  width: number;
  height: number;
  categories: readonly string[];
  series: readonly LineChartSeries[];
  chartType: LineChartSeriesType;
  yAxis?: LineChartProps["yAxis"];
  grid?: LineChartProps["grid"];
  activeIndex: number | null;
}) {
  const colors = usePulseLegacyColors();
  const plot: ChartPlot = {
    left: CHART_PADDING.left,
    top: CHART_PADDING.top,
    width: Math.max(width - CHART_PADDING.left - CHART_PADDING.right, 1),
    height: Math.max(height - CHART_PADDING.top - CHART_PADDING.bottom, 1)
  };
  const baselineY = plot.top + plot.height;
  const allValues = series.flatMap((item) => item.data);
  const axis = resolveAxisRange(allValues, yAxis?.min, yAxis?.max, yAxis?.splitNumber ?? 4);
  const gridColor = grid?.color ?? colors.border;
  const mutedColor = colors.textMuted;
  const showGrid = grid?.show ?? true;

  const renderedSeries = useMemo(
    () =>
      series.map((item) => {
        const type = resolveSeriesType(item, chartType);
        const points = buildPoints(item.data, plot, axis.min, axis.max, PLOT_TOP_INSET);
        const path = buildSeriesPath(points, type);
        const areaPath = type === "area" ? buildAreaPath(points, baselineY) : "";

        return {
          item,
          type,
          points,
          path,
          areaPath
        };
      }),
    [series, chartType, width, height, axis.min, axis.max]
  );

  const categoryStep = categories.length > 1 ? plot.width / (categories.length - 1) : 0;
  const activeX =
    activeIndex !== null && categories.length > 0 ? plot.left + categoryStep * activeIndex : null;

  return (
    <View pointerEvents="none" style={{ width, height, overflow: "visible" }}>
      <Svg height={height} width={width}>
      {activeX !== null ? (
        <Line
          x1={activeX}
          x2={activeX}
          y1={plot.top}
          y2={baselineY}
          stroke={colors.border}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
      ) : null}
      {showGrid
        ? axis.ticks.map((tick) => {
            const y = plot.top + plot.height - ((tick - axis.min) / Math.max(axis.max - axis.min, 1)) * plot.height;

            return (
              <Line
                key={`grid-${tick}`}
                x1={plot.left}
                x2={plot.left + plot.width}
                y1={y}
                y2={y}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })
        : null}

      {axis.ticks.map((tick) => {
        const y = plot.top + plot.height - ((tick - axis.min) / Math.max(axis.max - axis.min, 1)) * plot.height;

        return (
          <SvgText
            key={`y-${tick}`}
            fill={mutedColor}
            fontSize={11}
            fontWeight="600"
            textAnchor="end"
            x={plot.left - 8}
            y={y + 4}
          >
            {Math.round(tick)}
          </SvgText>
        );
      })}

      {categories.map((label, index) => (
        <SvgText
          key={`x-${label}-${index}`}
          fill={mutedColor}
          fontSize={11}
          fontWeight="600"
          textAnchor="middle"
          x={plot.left + categoryStep * index}
          y={baselineY + 18}
        >
          {label}
        </SvgText>
      ))}

      {renderedSeries.map(({ item, type, points, path, areaPath }) => (
        <G key={item.name}>
          {type === "area" && areaPath ? (
            <Path d={areaPath} fill={item.areaColor ?? `${item.color}33`} />
          ) : null}
          <Path
            d={path}
            fill="none"
            stroke={item.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={item.lineWidth ?? 3}
          />
          {points.map((point, index) => {
            const isActive = activeIndex === index;
            const isDimmed = activeIndex !== null && !isActive;

            return (
              <Circle
                key={`${item.name}-point-${index}`}
                cx={point.x}
                cy={point.y}
                fill={item.symbol === "hollow" ? colors.surface : item.color}
                opacity={isDimmed ? 0.45 : 1}
                r={isActive ? ACTIVE_POINT_MARKER_RADIUS : POINT_MARKER_RADIUS}
                stroke={item.color}
                strokeWidth={isActive ? POINT_MARKER_STROKE + 0.5 : POINT_MARKER_STROKE}
              />
            );
          })}
        </G>
      ))}
      </Svg>
    </View>
  );
}

function ChartSurface({
  width,
  height,
  categories,
  series,
  chartType,
  yAxis,
  grid,
  tooltip
}: {
  width: number;
  height: number;
  categories: readonly string[];
  series: readonly LineChartSeries[];
  chartType: LineChartSeriesType;
  yAxis?: LineChartProps["yAxis"];
  grid?: LineChartProps["grid"];
  tooltip?: LineChartTooltip;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const showTooltip = tooltip?.show ?? true;

  const plot: ChartPlot = {
    left: CHART_PADDING.left,
    top: CHART_PADDING.top,
    width: Math.max(width - CHART_PADDING.left - CHART_PADDING.right, 1),
    height: Math.max(height - CHART_PADDING.top - CHART_PADDING.bottom, 1)
  };
  const allValues = series.flatMap((item) => item.data);
  const axis = resolveAxisRange(allValues, yAxis?.min, yAxis?.max, yAxis?.splitNumber ?? 4);
  const categoryStep = categories.length > 1 ? plot.width / (categories.length - 1) : 0;
  const hitHalfWidth = Math.max(categoryStep > 0 ? categoryStep / 2 : plot.width / 2, HIT_ZONE_MIN_WIDTH / 2);

  const renderedSeries = useMemo(
    () =>
      series.map((item) => {
        const type = resolveSeriesType(item, chartType);
        const points = buildPoints(item.data, plot, axis.min, axis.max, PLOT_TOP_INSET);

        return { item, points };
      }),
    [series, chartType, width, height, axis.min, axis.max]
  );

  const tooltipContext =
    activeIndex !== null && showTooltip ? buildTooltipContext(activeIndex, categories, series) : null;

  const anchorPoint = useMemo(() => {
    if (activeIndex === null) {
      return null;
    }

    const candidates = renderedSeries
      .map((entry) => entry.points[activeIndex])
      .filter((point): point is NonNullable<typeof point> => Boolean(point));

    if (candidates.length === 0) {
      return null;
    }

    return candidates.reduce((top, point) => (point.y < top.y ? point : top));
  }, [activeIndex, renderedSeries]);

  const tooltipLeft =
    anchorPoint && tooltipSize.width > 0
      ? Math.min(Math.max(anchorPoint.x - tooltipSize.width / 2, 8), width - tooltipSize.width - 8)
      : anchorPoint?.x ?? 0;

  const clearActiveIndex = () => setActiveIndex(null);

  return (
    <Pressable onHoverOut={clearActiveIndex} style={[styles.chartSurface, { height }]}>
      <ChartSvg
        activeIndex={activeIndex}
        categories={categories}
        chartType={chartType}
        grid={grid}
        height={height}
        series={series}
        width={width}
        yAxis={yAxis}
      />

      {showTooltip
        ? categories.map((_, index) => {
            const anchorX = plot.left + categoryStep * index;

            return (
              <Pressable
                key={`hit-${index}`}
                onHoverIn={() => setActiveIndex(index)}
                onPressIn={() => setActiveIndex(index)}
                style={[
                  styles.hitZone,
                  {
                    left: anchorX - hitHalfWidth,
                    top: plot.top,
                    width: hitHalfWidth * 2,
                    height: plot.height
                  }
                ]}
              />
            );
          })
        : null}

      {tooltipContext && anchorPoint ? (
        <View
          onLayout={(event) => {
            const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
            if (
              nextWidth > 0 &&
              nextHeight > 0 &&
              (nextWidth !== tooltipSize.width || nextHeight !== tooltipSize.height)
            ) {
              setTooltipSize({ width: nextWidth, height: nextHeight });
            }
          }}
          pointerEvents="none"
          style={[
            styles.tooltipLayer,
            {
              left: tooltipLeft,
              top: Math.max(
                anchorPoint.y - (tooltipSize.height || 0) - TOOLTIP_OFFSET,
                plot.top
              )
            }
          ]}
        >
          {resolveTooltipContent(tooltipContext, tooltip)}
        </View>
      ) : null}
    </Pressable>
  );
}

function HeaderBlock({
  series,
  legend
}: {
  series: readonly LineChartSeries[];
  legend: Required<LineChartLegend>;
}) {
  const position = legend.position ?? "top-left";
  const legendOnLeft = position === "top-left" || position === "bottom-left";

  return (
    <View style={styles.headerRow}>
      {legendOnLeft ? <LegendRow position={position} series={series} /> : <SummaryRow align="left" series={series} />}
      {legendOnLeft ? <SummaryRow align="right" series={series} /> : <LegendRow position={position} series={series} />}
    </View>
  );
}

export function LineChart({
  categories,
  series,
  type = "line",
  legend = { show: true, position: "top-left" },
  yAxis,
  grid,
  tooltip = { show: true },
  height = 220,
  style,
  contentStyle
}: LineChartProps) {
  const colors = usePulseLegacyColors();
  const theme = usePulseTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const resolvedLegend: Required<LineChartLegend> = {
    show: legend.show ?? true,
    position: legend.position ?? "top-left"
  };
  const legendOnTop = resolvedLegend.position === "top-left" || resolvedLegend.position === "top-right";

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== chartWidth) {
      setChartWidth(nextWidth);
    }
  };

  return (
    <View
      style={[
        styles.card,
        theme.shadows.sm,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        {resolvedLegend.show && resolvedLegend.position !== "none" && legendOnTop ? (
          <HeaderBlock legend={resolvedLegend} series={series} />
        ) : null}

        <View onLayout={handleLayout} style={styles.chartLayout}>
          {chartWidth > 0 ? (
            <ChartSurface
              categories={categories}
              chartType={type}
              grid={grid}
              height={height}
              series={series}
              tooltip={tooltip}
              width={chartWidth}
              yAxis={yAxis}
            />
          ) : null}
        </View>

        {resolvedLegend.show && resolvedLegend.position !== "none" && !legendOnTop ? (
          <HeaderBlock legend={resolvedLegend} series={series} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md
  },
  chartLayout: {
    width: "100%"
  },
  chartSurface: {
    width: "100%",
    position: "relative"
  },
  hitZone: {
    position: "absolute",
    zIndex: 2
  },
  tooltipLayer: {
    position: "absolute",
    zIndex: 3,
    alignSelf: "flex-start"
  },
  tooltipCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4
  },
  tooltipContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6
  },
  tooltipCategory: {
    fontSize: typography.caption,
    fontWeight: "800"
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  tooltipName: {
    flex: 1,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  tooltipValue: {
    fontSize: typography.caption,
    fontWeight: "800"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  legendRow: {
    gap: spacing.sm
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  legendSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2
  },
  legendLabel: {
    fontSize: typography.body,
    fontWeight: "700"
  },
  summaryRow: {
    gap: 4
  },
  summaryLeft: {
    alignItems: "flex-start"
  },
  summaryRight: {
    alignItems: "flex-end"
  },
  summaryText: {
    fontSize: typography.body,
    fontWeight: "600"
  },
  summaryTextStrong: {
    fontWeight: "800"
  }
});
