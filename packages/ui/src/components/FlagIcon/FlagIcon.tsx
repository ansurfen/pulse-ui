import { StyleProp, View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import type { CountryId } from "../CountryMap/types";
import { FLAG_TILE_ASPECT, getFlagDefinition } from "./registry";

export type { FlagCountryId } from "./registry";
export { countryFlagCodes, FLAG_TILE_ASPECT } from "./registry";

export interface FlagIconProps {
  country: CountryId;
  /** Tile width in px. Height follows 4:3 ratio. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const TILE_RADIUS_RATIO = 0.28;

/** Rounded flag tile with simplified SVG artwork. */
export function FlagIcon({ country, size = 48, style }: FlagIconProps) {
  const definition = getFlagDefinition(country);
  const tileWidth = size;
  const tileHeight = size / FLAG_TILE_ASPECT;
  const borderRadius = tileHeight * TILE_RADIUS_RATIO;

  return (
    <View
      accessibilityLabel={`${country} flag`}
      style={[
        {
          width: tileWidth,
          height: tileHeight,
          borderRadius,
          overflow: "hidden",
          backgroundColor: definition.baseColor
        },
        style
      ]}
    >
      <SvgXml height={tileHeight} width={tileWidth} xml={definition.svg} />
    </View>
  );
}
