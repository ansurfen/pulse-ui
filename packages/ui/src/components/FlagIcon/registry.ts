import type { CountryId } from "../CountryMap/types";

/** ISO 3166-1 alpha-2 codes aligned with bundled flags. */
export const countryFlagCodes = {
  japan: "jp",
  china: "cn",
  "south-korea": "kr",
  taiwan: "tw",
  france: "fr",
  germany: "de",
  spain: "es",
  italy: "it",
  portugal: "pt",
  "united-kingdom": "gb",
  usa: "us",
  canada: "ca",
  mexico: "mx",
  brazil: "br",
  australia: "au",
  india: "in",
  russia: "ru"
} as const satisfies Record<CountryId, string>;

export type FlagCountryId = keyof typeof countryFlagCodes;

/** Duolingo-style tile ratio (width / height). */
export const FLAG_TILE_ASPECT = 4 / 3;

export { flagSvgDefinitions } from "./flagSvgs";
export type { FlagSvgDefinition } from "./flagSvgs";

import { flagSvgDefinitions } from "./flagSvgs";

export function getFlagDefinition(country: CountryId) {
  return flagSvgDefinitions[country];
}
