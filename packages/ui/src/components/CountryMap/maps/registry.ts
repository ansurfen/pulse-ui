import type { CountryId, MapDefinition } from "../types";
import { australiaMap } from "./australia";
import { brazilMap } from "./brazil";
import { canadaMap } from "./canada";
import { chinaMap } from "./china";
import { franceMap } from "./france";
import { germanyMap } from "./germany";
import { indiaMap } from "./india";
import { italyMap } from "./italy";
import { japanMap } from "./japan";
import { mexicoMap } from "./mexico";
import { portugalMap } from "./portugal";
import { russiaMap } from "./russia";
import { south_koreaMap } from "./south-korea";
import { spainMap } from "./spain";
import { taiwanMap } from "./taiwan";
import { united_kingdomMap } from "./united-kingdom";
import { usaMap } from "./usa";

const maps = {
  japan: japanMap,
  china: chinaMap,
  "south-korea": south_koreaMap,
  taiwan: taiwanMap,
  france: franceMap,
  germany: germanyMap,
  spain: spainMap,
  italy: italyMap,
  portugal: portugalMap,
  "united-kingdom": united_kingdomMap,
  usa: usaMap,
  canada: canadaMap,
  mexico: mexicoMap,
  brazil: brazilMap,
  australia: australiaMap,
  india: indiaMap,
  russia: russiaMap
} as const satisfies Record<CountryId, MapDefinition>;

export function getMap(country: CountryId): MapDefinition {
  return maps[country];
}
