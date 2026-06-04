export type ChartPoint = { x: number; y: number };

export type ChartPlot = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function resolveAxisRange(values: readonly number[], min?: number, max?: number, splitNumber = 4) {
  const dataMax = values.length ? Math.max(...values, 0) : 0;
  const resolvedMin = min ?? 0;
  let resolvedMax = max ?? niceCeil(dataMax, splitNumber);

  if (dataMax > resolvedMax) {
    resolvedMax = niceCeil(dataMax, splitNumber);
  }

  const step = (resolvedMax - resolvedMin) / splitNumber;

  return {
    min: resolvedMin,
    max: resolvedMax,
    ticks: Array.from({ length: splitNumber + 1 }, (_, index) => resolvedMin + step * index)
  };
}

function niceCeil(value: number, splitNumber: number) {
  if (value <= 0) {
    return splitNumber * 10;
  }

  const roughStep = value / splitNumber;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;

  let nice = 1;
  if (normalized > 5) {
    nice = 10;
  } else if (normalized > 2) {
    nice = 5;
  } else if (normalized > 1) {
    nice = 2;
  }

  return Math.ceil(value / (nice * magnitude)) * nice * magnitude;
}

export function buildPoints(
  data: readonly number[],
  plot: ChartPlot,
  min: number,
  max: number,
  topInset = 0
) {
  if (data.length === 0) {
    return [];
  }

  const range = Math.max(max - min, 1);
  const stepX = data.length > 1 ? plot.width / (data.length - 1) : 0;
  const drawableHeight = Math.max(plot.height - topInset, 1);

  return data.map((value, index) => ({
    x: plot.left + stepX * index,
    y: plot.top + topInset + drawableHeight - ((value - min) / range) * drawableHeight
  }));
}

export function buildLinePath(points: ChartPoint[]) {
  if (points.length === 0) {
    return "";
  }

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

export function buildSmoothPath(points: ChartPoint[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;

    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function buildAreaPath(points: ChartPoint[], baselineY: number) {
  if (points.length === 0) {
    return "";
  }

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];

  return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}
