import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { colors, radius, shadows, spacing, typography } from "@pulse-ui/core";
import { getMap } from "./maps/registry";
import {
  createDefaultViewport,
  isDefaultViewport,
  panViewport,
  parseViewBox,
  type MapViewport,
  type ViewBoxBounds,
  viewportToViewBox,
  zoomViewport
} from "./mapViewport";
import { ResetViewIcon } from "./ResetViewIcon";
import { getRegionDepthFill, defaultMapPalette } from "./mapColors";
import type { CountryMapProps } from "./types";
import { useRegionStyles } from "./useRegionStyles";

export type { CountryId, CountryMapProps, RegionData } from "./types";
export { countryCatalog, getCountryCatalogItem } from "./maps/catalog";
export type { CountryCatalogItem, CountryPreset } from "./maps/catalog";

const DRAG_THRESHOLD = 4;
const DEFAULT_REGION_DEPTH_OFFSET = 2.8;

type LayoutSize = {
  width: number;
  height: number;
};

export function CountryMap({
  country,
  width = "100%",
  height = 320,
  activeRegions = [],
  regions = [],
  baseColor = defaultMapPalette.land,
  activeColor = defaultMapPalette.active,
  oceanColor = defaultMapPalette.ocean,
  borderColor = defaultMapPalette.landBorder,
  strokeWidth = 0.75,
  regionDepth = true,
  regionDepthOffset = DEFAULT_REGION_DEPTH_OFFSET,
  showZoomControls = true,
  minZoom = 1,
  maxZoom = 3,
  zoomStep = 0.35,
  onRegionPress,
  style
}: CountryMapProps & { style?: ViewStyle }) {
  const [viewport, setViewport] = useState(() => createDefaultViewport(minZoom));
  const [layout, setLayout] = useState<LayoutSize>({ width: 0, height: 0 });

  const viewportRef = useRef<MapViewport>(viewport);
  const boundsRef = useRef<ViewBoxBounds>(parseViewBox(getMap(country).viewBox));
  const layoutRef = useRef<LayoutSize>(layout);
  const dragOriginRef = useRef<MapViewport>(viewport);
  const isDraggingRef = useRef(false);
  const canPanRef = useRef(false);

  const map = getMap(country);
  const bounds = parseViewBox(map.viewBox);
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
    const nextViewport = createDefaultViewport(minZoom);
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  }, [country, minZoom]);

  const canZoomOut = viewport.zoom > minZoom;
  const canZoomIn = viewport.zoom < maxZoom;
  const canReset = !isDefaultViewport(viewport, minZoom);
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
    const nextViewport = createDefaultViewport(minZoom);
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  };

  return (
    <View style={[styles.container, { height: containerHeight }, style]}>
      <View
        style={styles.mapSurface}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        accessibilityLabel="Interactive map"
      >
        <Svg viewBox={viewBox} width={width} height={height} accessibilityRole="image">
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
    overflow: "hidden"
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
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt
  },
  zoomButtonPressed: {
    opacity: 0.85
  },
  zoomButtonDisabled: {
    opacity: 0.45
  },
  zoomIcon: {
    color: colors.secondary,
    fontSize: typography.title,
    fontWeight: "700",
    lineHeight: 22
  },
  zoomIconDisabled: {
    color: colors.textMuted
  }
});
