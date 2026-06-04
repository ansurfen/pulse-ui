import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

export type LineChartSeriesType = "line" | "smooth" | "area";

export type LegendPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "none";

export type LineChartSymbol = "filled" | "hollow";

export type LineChartSeries = {
  name: string;
  data: readonly number[];
  color: string;
  /** Shown on the opposite side of the legend row, e.g. "180 XP". */
  summary?: string;
  symbol?: LineChartSymbol;
  type?: LineChartSeriesType;
  areaColor?: string;
  lineWidth?: number;
};

export type LineChartAxis = {
  min?: number;
  max?: number;
  splitNumber?: number;
};

export type LineChartGrid = {
  show?: boolean;
  color?: string;
};

export type LineChartLegend = {
  show?: boolean;
  position?: LegendPosition;
};

export type LineChartTooltipSeriesItem = {
  name: string;
  color: string;
  value: number;
  series: LineChartSeries;
};

export type LineChartTooltipContext = {
  index: number;
  category: string;
  items: readonly LineChartTooltipSeriesItem[];
};

export type LineChartTooltip = {
  show?: boolean;
  /** Custom tooltip card. Omit for the built-in default layout. */
  render?: (context: LineChartTooltipContext) => ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export type LineChartProps = {
  categories: readonly string[];
  series: readonly LineChartSeries[];
  /** Default series rendering style when a series does not set `type`. */
  type?: LineChartSeriesType;
  legend?: LineChartLegend;
  yAxis?: LineChartAxis;
  grid?: LineChartGrid;
  tooltip?: LineChartTooltip;
  height?: number;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};
