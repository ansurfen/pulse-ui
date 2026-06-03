export function hexToRgb(input: string) {
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

export function mixColor(base: string, target: string, amount: number) {
  const a = hexToRgb(base);
  const b = hexToRgb(target);

  return rgbToHex(a.r + (b.r - a.r) * amount, a.g + (b.g - a.g) * amount, a.b + (b.b - a.b) * amount);
}

export function getRegionDepthFill(fill: string, amount = 0.22) {
  return mixColor(fill, "#000000", amount);
}

/** Country map design palette */
export const countryMapPalette = {
  duoGreen: "#58CC02",
  skyBlue: "#89CFF7",
  land: "#F2F3F5",
  border: "#D1D5DB",
  text: "#3C3F44",
  selected: "#1CB0F6",
  disabled: "#C8CDD4",
  containerBorder: "#78CBF6",
  zoomButtonFill: "#F2F3F5"
} as const;

export const defaultMapPalette = {
  ocean: countryMapPalette.skyBlue,
  land: countryMapPalette.land,
  landBorder: countryMapPalette.border,
  active: countryMapPalette.duoGreen
} as const;
