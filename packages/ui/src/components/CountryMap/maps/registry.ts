import type { CountryId, MapDefinition } from "../types";
import { japanMap } from "./japan";

const maps = {
  japan: japanMap
} as const satisfies Record<CountryId, MapDefinition>;

export function getMap(country: CountryId): MapDefinition {
  return maps[country];
}
