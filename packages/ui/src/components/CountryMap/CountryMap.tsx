import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { colors, radius, shadows, spacing, typography } from "@pulse-ui/core";
import { getMap } from "./maps/registry";
import {
  createViewportForCenter,
  createDefaultViewport,
  panViewport,
  parseViewBox,
  type MapViewport,
  type ViewBoxBounds,
  viewportToViewBox,
  zoomViewport
} from "./mapViewport";
import { ResetViewIcon } from "./ResetViewIcon";
import { countryMapPalette, getRegionDepthFill, defaultMapPalette } from "./mapColors";
import type { CountryMapProps } from "./types";
import { useRegionStyles } from "./useRegionStyles";

export type { CountryId, CountryMapProps, RegionData } from "./types";
export { countryCatalog, getCountryCatalogItem } from "./maps/catalog";
export type { CountryCatalogItem, CountryPreset } from "./maps/catalog";
export { countryMapPalette, defaultMapPalette } from "./mapColors";

const DRAG_THRESHOLD = 4;
type LayoutSize = {
  width: number;
  height: number;
};

export function CountryMap({
  country,
  width = "100%",
  height = 320,
  initialZoom,
  initialCenter,
  initialFocusRegionId,
  initialFocusRegionIds,
  activeRegions = [],
  regions = [],
  baseColor = defaultMapPalette.land,
  activeColor = defaultMapPalette.active,
  oceanColor = defaultMapPalette.ocean,
  borderColor = defaultMapPalette.landBorder,
  strokeWidth = 1.15,
  regionDepth = false,
  regionDepthOffset = 0,
  showZoomControls = true,
  minZoom = 1,
  maxZoom = 3,
  zoomStep = 0.35,
  onRegionPress,
  style
}: CountryMapProps & { style?: ViewStyle }) {
  const map = getMap(country);
  const bounds = getMapViewportBounds(map.viewBox, map.regions);
  const focusRegionIds =
    initialFocusRegionIds && initialFocusRegionIds.length > 0
      ? initialFocusRegionIds
      : initialFocusRegionId
        ? [initialFocusRegionId]
        : undefined;
  const focusBounds = getRegionsBounds(map.regions, focusRegionIds);
  const autoInitialZoom = focusBounds ? getAutoFocusZoom(bounds, focusBounds, minZoom, maxZoom) : minZoom;
  const resolvedInitialZoom = clampInitialZoom(initialZoom ?? autoInitialZoom, minZoom, maxZoom);
  const initialRegionCenter = getBoundsCenter(focusBounds);
  const resolvedInitialCenter = initialCenter ?? initialRegionCenter;
  const createInitialViewport = () => {
    if (resolvedInitialCenter || resolvedInitialZoom !== minZoom) {
      return createViewportForCenter(bounds, resolvedInitialZoom, resolvedInitialCenter);
    }

    return createDefaultViewport(minZoom);
  };

  const [viewport, setViewport] = useState<MapViewport>(() => createInitialViewport());
  const [layout, setLayout] = useState<LayoutSize>({ width: 0, height: 0 });
  const initialViewport = createInitialViewport();

  const viewportRef = useRef<MapViewport>(viewport);
  const boundsRef = useRef<ViewBoxBounds>(bounds);
  const layoutRef = useRef<LayoutSize>(layout);
  const dragOriginRef = useRef<MapViewport>(viewport);
  const isDraggingRef = useRef(false);
  const canPanRef = useRef(false);

  const viewBox = viewportToViewBox(viewport, bounds);
  const visibleBounds = parseViewBox(viewBox);
  const regionStyles = useRegionStyles({
    mapRegions: map.regions,
    activeRegions,
    regions,
    baseColor,
    activeColor
  });

  viewportRef.current = viewport;
  boundsRef.current = bounds;
  layoutRef.current = layout;
  canPanRef.current = viewport.zoom > minZoom;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => canPanRef.current,
      onStartShouldSetPanResponderCapture: () => canPanRef.current,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        dragOriginRef.current = viewportRef.current;
        isDraggingRef.current = false;
      },
      onPanResponderMove: (_, gesture) => {
        if (Math.abs(gesture.dx) > DRAG_THRESHOLD || Math.abs(gesture.dy) > DRAG_THRESHOLD) {
          isDraggingRef.current = true;
        }

        const { width: containerWidth, height: containerHeight } = layoutRef.current;
        if (containerWidth <= 0 || containerHeight <= 0) {
          return;
        }

        const nextViewport = panViewport(
          dragOriginRef.current,
          boundsRef.current,
          gesture.dx,
          gesture.dy,
          containerWidth,
          containerHeight
        );

        viewportRef.current = nextViewport;
        setViewport(nextViewport);
      },
      onPanResponderRelease: () => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 0);
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
      }
    })
  ).current;

  useEffect(() => {
    const nextViewport = createInitialViewport();
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  }, [
    country,
    initialFocusRegionId,
    initialFocusRegionIds?.join(","),
    initialCenter?.x,
    initialCenter?.y,
    minZoom,
    maxZoom,
    initialZoom
  ]);

  const canZoomOut = viewport.zoom > minZoom;
  const canZoomIn = viewport.zoom < maxZoom;
  const canReset = !isSameViewport(viewport, initialViewport);
  const containerHeight = typeof height === "number" ? height : 320;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
    setLayout({ width: nextWidth, height: nextHeight });
  };

  const handleZoomOut = () => {
    const nextZoom = Math.max(minZoom, Number((viewport.zoom - zoomStep).toFixed(2)));
    const nextViewport = zoomViewport(viewport, bounds, nextZoom);
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  };

  const handleZoomIn = () => {
    const nextZoom = Math.min(maxZoom, Number((viewport.zoom + zoomStep).toFixed(2)));
    const nextViewport = zoomViewport(viewport, bounds, nextZoom);
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  };

  const handleReset = () => {
    const nextViewport = createInitialViewport();
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  };

  return (
    <View
      style={[
        styles.container,
        { height: containerHeight, backgroundColor: oceanColor, borderColor: countryMapPalette.containerBorder },
        style
      ]}
    >
      <View
        style={[styles.mapSurface, { backgroundColor: oceanColor }]}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        accessibilityLabel="Interactive map"
      >
        <Svg
          accessibilityRole="image"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ backgroundColor: oceanColor }}
          viewBox={viewBox}
          width="100%"
        >
          <Rect
            x={visibleBounds.x}
            y={visibleBounds.y}
            width={visibleBounds.width}
            height={visibleBounds.height}
            fill={oceanColor}
          />
          <G>
            {regionDepth ? (
              <G transform={`translate(0, ${regionDepthOffset})`}>
                {map.regions.map((region) => {
                  const regionStyle = regionStyles[region.id];

                  return (
                    <Path
                      key={`${region.id}-depth`}
                      d={region.d}
                      fill={getRegionDepthFill(regionStyle.fill)}
                      stroke="none"
                    />
                  );
                })}
              </G>
            ) : null}

            {map.regions.map((region) => {
              const regionStyle = regionStyles[region.id];

              return (
                <Path
                  key={region.id}
                  d={region.d}
                  fill={regionStyle.fill}
                  stroke={borderColor}
                  strokeWidth={strokeWidth / viewport.zoom}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  accessibilityLabel={region.name}
                  onPress={
                    onRegionPress
                      ? () => {
                        if (isDraggingRef.current) {
                          return;
                        }

                        onRegionPress(region.id, region.name);
                      }
                      : undefined
                  }
                />
              );
            })}
          </G>
        </Svg>
      </View>

      {showZoomControls ? (
        <View style={styles.zoomControls} pointerEvents="box-none">
          <Pressable
            accessibilityLabel="Zoom out"
            disabled={!canZoomOut}
            onPress={handleZoomOut}
            style={({ pressed }) => [
              styles.zoomButton,
              !canZoomOut && styles.zoomButtonDisabled,
              pressed && canZoomOut && styles.zoomButtonPressed
            ]}
          >
            <Text style={[styles.zoomIcon, !canZoomOut && styles.zoomIconDisabled]}>−</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Reset map view"
            disabled={!canReset}
            onPress={handleReset}
            style={({ pressed }) => [
              styles.zoomButton,
              !canReset && styles.zoomButtonDisabled,
              pressed && canReset && styles.zoomButtonPressed
            ]}
          >
            <ResetViewIcon disabled={!canReset} />
          </Pressable>

          <Pressable
            accessibilityLabel="Zoom in"
            disabled={!canZoomIn}
            onPress={handleZoomIn}
            style={({ pressed }) => [
              styles.zoomButton,
              !canZoomIn && styles.zoomButtonDisabled,
              pressed && canZoomIn && styles.zoomButtonPressed
            ]}
          >
            <Text style={[styles.zoomIcon, !canZoomIn && styles.zoomIconDisabled]}>+</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: 2
  },
  mapSurface: {
    flex: 1,
    touchAction: "none"
  },
  zoomControls: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(233, 239, 245, 0.95)",
    ...shadows.sm
  },
  zoomButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: countryMapPalette.zoomButtonFill
  },
  zoomButtonPressed: {
    opacity: 0.85
  },
  zoomButtonDisabled: {
    opacity: 0.45
  },
  zoomIcon: {
    color: countryMapPalette.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20
  },
  zoomIconDisabled: {
    color: colors.textMuted
  }
});

function clampInitialZoom(initialZoom: number | undefined, minZoom: number, maxZoom: number) {
  if (typeof initialZoom !== "number" || Number.isNaN(initialZoom)) {
    return minZoom;
  }

  return Math.min(Math.max(initialZoom, minZoom), maxZoom);
}

function isSameViewport(a: MapViewport, b: MapViewport) {
  return a.zoom === b.zoom && a.offsetX === b.offsetX && a.offsetY === b.offsetY;
}

type PathBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function getMapViewportBounds(
  declaredViewBox: string,
  regions: readonly {
    id: string;
    d: string;
  }[]
) {
  const declaredBounds = parseViewBox(declaredViewBox);
  const regionBounds = getRegionsBounds(
    regions,
    regions.map((region) => region.id)
  );

  if (!regionBounds) {
    return declaredBounds;
  }

  const mergedMinX = Math.min(declaredBounds.x, regionBounds.minX);
  const mergedMinY = Math.min(declaredBounds.y, regionBounds.minY);
  const mergedMaxX = Math.max(declaredBounds.x + declaredBounds.width, regionBounds.maxX);
  const mergedMaxY = Math.max(declaredBounds.y + declaredBounds.height, regionBounds.maxY);
  const mergedWidth = mergedMaxX - mergedMinX;
  const mergedHeight = mergedMaxY - mergedMinY;
  const paddingX = mergedWidth * 0.04;
  const paddingY = mergedHeight * 0.04;

  return {
    x: mergedMinX - paddingX,
    y: mergedMinY - paddingY,
    width: mergedWidth + paddingX * 2,
    height: mergedHeight + paddingY * 2
  };
}

function getRegionsBounds(
  regions: readonly {
    id: string;
    d: string;
  }[],
  regionIds?: readonly string[]
) {
  if (!regionIds?.length) {
    return undefined;
  }

  let mergedBounds: PathBounds | undefined;

  for (const regionId of regionIds) {
    const region = regions.find((item) => item.id === regionId);
    if (!region) {
      continue;
    }

    const bounds = getPathBounds(region.d);
    if (!bounds) {
      continue;
    }

    if (!mergedBounds) {
      mergedBounds = { ...bounds };
      continue;
    }

    mergedBounds.minX = Math.min(mergedBounds.minX, bounds.minX);
    mergedBounds.minY = Math.min(mergedBounds.minY, bounds.minY);
    mergedBounds.maxX = Math.max(mergedBounds.maxX, bounds.maxX);
    mergedBounds.maxY = Math.max(mergedBounds.maxY, bounds.maxY);
  }

  return mergedBounds;
}

function getBoundsCenter(bounds?: PathBounds) {
  if (!bounds) {
    return undefined;
  }

  return {
    x: bounds.minX + (bounds.maxX - bounds.minX) / 2,
    y: bounds.minY + (bounds.maxY - bounds.minY) / 2
  };
}

function getAutoFocusZoom(
  mapBounds: ViewBoxBounds,
  focusBounds: PathBounds,
  minZoom: number,
  maxZoom: number
) {
  const focusWidth = Math.max(focusBounds.maxX - focusBounds.minX, mapBounds.width * 0.08);
  const focusHeight = Math.max(focusBounds.maxY - focusBounds.minY, mapBounds.height * 0.08);
  const paddedWidth = focusWidth * 2.1;
  const paddedHeight = focusHeight * 2.1;
  const zoomFromWidth = mapBounds.width / paddedWidth;
  const zoomFromHeight = mapBounds.height / paddedHeight;
  const nextZoom = Math.min(zoomFromWidth, zoomFromHeight);

  return Math.min(Math.max(nextZoom, minZoom), maxZoom);
}

function getPathBounds(path: string) {
  const tokens = path.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) {
    return undefined;
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  const pushPoint = (x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  const readNumber = () => Number(tokens[index++]);
  const isCommand = (value: string | undefined) => Boolean(value && /^[a-zA-Z]$/.test(value));

  while (index < tokens.length) {
    if (isCommand(tokens[index])) {
      command = tokens[index++]!;
    }

    if (!command) {
      break;
    }

    const relative = command === command.toLowerCase();

    switch (command.toLowerCase()) {
      case "m": {
        while (index + 1 < tokens.length && !isCommand(tokens[index])) {
          const x = readNumber();
          const y = readNumber();
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          startX = currentX;
          startY = currentY;
          pushPoint(currentX, currentY);
          command = relative ? "l" : "L";
          break;
        }
        break;
      }
      case "l": {
        while (index + 1 < tokens.length && !isCommand(tokens[index])) {
          const x = readNumber();
          const y = readNumber();
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "h": {
        while (index < tokens.length && !isCommand(tokens[index])) {
          const x = readNumber();
          currentX = relative ? currentX + x : x;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "v": {
        while (index < tokens.length && !isCommand(tokens[index])) {
          const y = readNumber();
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "c": {
        while (index + 5 < tokens.length && !isCommand(tokens[index])) {
          const x1 = readNumber();
          const y1 = readNumber();
          const x2 = readNumber();
          const y2 = readNumber();
          const x = readNumber();
          const y = readNumber();
          pushPoint(relative ? currentX + x1 : x1, relative ? currentY + y1 : y1);
          pushPoint(relative ? currentX + x2 : x2, relative ? currentY + y2 : y2);
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "s":
      case "q": {
        while (index + 3 < tokens.length && !isCommand(tokens[index])) {
          const x1 = readNumber();
          const y1 = readNumber();
          const x = readNumber();
          const y = readNumber();
          pushPoint(relative ? currentX + x1 : x1, relative ? currentY + y1 : y1);
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "t": {
        while (index + 1 < tokens.length && !isCommand(tokens[index])) {
          const x = readNumber();
          const y = readNumber();
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "a": {
        while (index + 6 < tokens.length && !isCommand(tokens[index])) {
          index += 5;
          const x = readNumber();
          const y = readNumber();
          currentX = relative ? currentX + x : x;
          currentY = relative ? currentY + y : y;
          pushPoint(currentX, currentY);
        }
        break;
      }
      case "z": {
        currentX = startX;
        currentY = startY;
        pushPoint(currentX, currentY);
        break;
      }
      default: {
        index += 1;
        break;
      }
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return undefined;
  }

  return { minX, minY, maxX, maxY };
}
