import type { CountryId } from "../types";

export type CountryPreset = {
  label: string;
  regions: readonly string[];
};

export type CountryCatalogItem = {
  id: CountryId;
  label: string;
  sampleRegions: readonly string[];
  presets?: readonly CountryPreset[];
};

export const countryCatalog: readonly CountryCatalogItem[] = [
  {
    id: "japan",
    label: "日本",
    sampleRegions: ["tokyo", "kyoto", "osaka"],
    presets: [
      { label: "京都", regions: ["kyoto"] },
      { label: "关西", regions: ["kyoto", "osaka", "nara", "hyogo"] },
      { label: "关东", regions: ["tokyo", "kanagawa", "saitama", "chiba"] }
    ]
  },
  { id: "china", label: "中国", sampleRegions: ["beijing", "shanghai", "guangdong"] },
  { id: "south-korea", label: "韩国", sampleRegions: ["seoul", "busan", "gyeonggi"] },
  { id: "taiwan", label: "台湾", sampleRegions: ["taipei", "kaohsiung", "taichung"] },
  { id: "france", label: "法国", sampleRegions: ["le-de-france", "bretagne", "corse"] },
  { id: "germany", label: "德国", sampleRegions: ["bavaria", "berlin", "hamburg"] },
  { id: "spain", label: "西班牙", sampleRegions: ["madrid", "catalonia", "andalusia"] },
  { id: "italy", label: "意大利", sampleRegions: ["lazio", "lombardia", "toscana"] },
  { id: "portugal", label: "葡萄牙", sampleRegions: ["lisboa", "porto", "faro"] },
  { id: "united-kingdom", label: "英国", sampleRegions: ["greater-london", "scotland", "wales"] },
  { id: "usa", label: "美国", sampleRegions: ["california", "new-york", "texas"] },
  { id: "canada", label: "加拿大", sampleRegions: ["ontario", "quebec", "british-columbia"] },
  { id: "mexico", label: "墨西哥", sampleRegions: ["distrito-federal", "jalisco", "nuevo-len"] },
  { id: "brazil", label: "巴西", sampleRegions: ["so-paulo", "rio-de-janeiro", "bahia"] },
  { id: "australia", label: "澳大利亚", sampleRegions: ["new-south-wales", "victoria", "queensland"] },
  { id: "india", label: "印度", sampleRegions: ["delhi", "maharashtra", "karnataka"] },
  { id: "russia", label: "俄罗斯", sampleRegions: ["moskva", "leningrad", "novosibirsk"] }
];

export function getCountryCatalogItem(country: CountryId) {
  return countryCatalog.find((item) => item.id === country);
}
