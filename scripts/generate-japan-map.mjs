import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "scripts/_japan-constants.ts"), "utf8");

const drawPathMatch = source.match(/export const drawPath = \{([\s\S]*?)\n\};/);
if (!drawPathMatch) {
  throw new Error("Could not parse drawPath from constants");
}

const drawPathBody = drawPathMatch[1];
const entries = [...drawPathBody.matchAll(/^\s+([^:\n]+):\s*\n?\s*'([^']*)',?\s*$/gm)];

const nameJa = {
  aichi: "爱知",
  akita: "秋田",
  aomori: "青森",
  chiba: "千叶",
  ehime: "爱媛",
  fukui: "福井",
  fukuoka: "福冈",
  fukushima: "福岛",
  gifu: "岐阜",
  gunma: "群马",
  hyogo: "兵库",
  hokkaido: "北海道",
  hiroshima: "广岛",
  ibaraki: "茨城",
  ishikawa: "石川",
  iwate: "岩手",
  kochi: "高知",
  kagawa: "香川",
  kumamoto: "熊本",
  kanagawa: "神奈川",
  kagoshima: "鹿儿岛",
  kyoto: "京都",
  mie: "三重",
  miyagi: "宫城",
  miyazaki: "宫崎",
  niigata: "新潟",
  nagano: "长野",
  nara: "奈良",
  nagasaki: "长崎",
  okinawa: "冲绳",
  osaka: "大阪",
  okayama: "冈山",
  oita: "大分",
  saga: "佐贺",
  shiga: "滋贺",
  shimane: "岛根",
  saitama: "埼玉",
  shizuoka: "静冈",
  tochigi: "栃木",
  tokyo: "东京",
  tokushima: "德岛",
  tottori: "鸟取",
  toyama: "富山",
  wakayama: "和歌山",
  yamaguchi: "山口",
  yamanashi: "山梨",
  yamagata: "山形"
};

const regions = entries.map(([_, key, d]) => {
  const id = key.trim().toLowerCase().replace(/[^a-z]/g, "");
  return {
    id,
    name: nameJa[id] ?? key.trim(),
    nameEn: key.trim(),
    d
  };
});

const output = `import type { MapDefinition } from "../types";

export const japanMap: MapDefinition = {
  viewBox: "0 0 500 500",
  regions: ${JSON.stringify(regions, null, 2)}
} as const;
`;

const outDir = join(root, "packages/ui/src/components/CountryMap/maps");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "japan.ts"), output, "utf8");
console.log(`Generated ${regions.length} prefectures -> ${join(outDir, "japan.ts")}`);
