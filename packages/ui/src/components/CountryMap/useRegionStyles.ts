import { useMemo } from "react";
import { colors } from "@pulse-ui/core";
import type { MapRegion, RegionData, RegionStyle } from "./types";

function hexToRgb(input: string) {
  const hex = input.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixColor(base: string, target: string, amount: number) {
  const a = hexToRgb(base);
  const b = hexToRgb(target);

  return rgbToHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount);
}

function resolveRegionData(id: string, activeRegions: readonly string[], regions: readonly RegionData[]) {
  const entry = regions.find((region) => region.id === id);
  const activeFromList = activeRegions.includes(id);
  const activeFromEntry = entry?.active ?? (entry?.value !== undefined ? entry.value > 0 : undefined);
  const active = entry?.active === false ? false : activeFromEntry ?? activeFromList;

  return {
    active,
    value: entry?.value,
    color: entry?.color
  };
}

export function useRegionStyles({
  mapRegions,
  activeRegions = [],
  regions = [],
  baseColor = colors.surfaceAlt,
  activeColor = colors.success
}: {
  mapRegions: readonly MapRegion[];
  activeRegions?: readonly string[];
  regions?: readonly RegionData[];
  baseColor?: string;
  activeColor?: string;
}) {
  return useMemo(() => {
    const styles: Record<string, RegionStyle> = {};

    for (const region of mapRegions) {
      const data = resolveRegionData(region.id, activeRegions, regions);
      let fill = baseColor;

      if (data.active) {
        if (data.color) {
          fill = data.color;
        } else if (data.value !== undefined) {
          fill = mixColor(baseColor, activeColor, Math.max(0, Math.min(100, data.value)) / 100);
        } else {
          fill = activeColor;
        }
      }

      styles[region.id] = {
        fill,
        active: data.active
      };
    }

    return styles;
  }, [activeColor, activeRegions, baseColor, mapRegions, regions]);
}
