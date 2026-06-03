export type MapRegion = {
  id: string;
  name: string;
  nameEn: string;
  d: string;
};

export type MapDefinition = {
  viewBox: string;
  regions: readonly MapRegion[];
};

export type RegionData = {
  id: string;
  active?: boolean;
  value?: number;
  color?: string;
};

export type RegionStyle = {
  fill: string;
  active: boolean;
};

export type CountryId =
  | "japan"
  | "china"
  | "south-korea"
  | "taiwan"
  | "france"
  | "germany"
  | "spain"
  | "italy"
  | "portugal"
  | "united-kingdom"
  | "usa"
  | "canada"
  | "mexico"
  | "brazil"
  | "australia"
  | "india"
  | "russia";

export type CountryMapProps = {
  country: CountryId;
  width?: number | string;
  height?: number | string;
  initialZoom?: number;
  initialCenter?: {
    x: number;
    y: number;
  };
  initialFocusRegionId?: string;
  initialFocusRegionIds?: readonly string[];
  activeRegions?: readonly string[];
  regions?: readonly RegionData[];
  baseColor?: string;
  activeColor?: string;
  oceanColor?: string;
  borderColor?: string;
  strokeWidth?: number;
  regionDepth?: boolean;
  regionDepthOffset?: number;
  showZoomControls?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  onRegionPress?: (id: string, name: string) => void;
};
