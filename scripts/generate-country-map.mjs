import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const country = process.argv[2];

if (!country) {
  console.error("Usage: node scripts/generate-country-map.mjs <country-slug>");
  process.exit(1);
}

const response = await fetch(`https://unpkg.com/@react-map/${country}@latest/src/constants.ts`);
if (!response.ok) {
  console.error(`Failed to download @react-map/${country}: ${response.status}`);
  process.exit(1);
}

const source = await response.text();
const widthMatch = source.match(/WIDTH:\s*(\d+)/);
const drawPathMatch = source.match(/export const drawPath = \{([\s\S]*?)\n\};/);

if (!widthMatch || !drawPathMatch) {
  console.error("Could not parse constants.ts");
  process.exit(1);
}

const width = widthMatch[1];
const entries = [...drawPathMatch[1].matchAll(/^\s+([^:\n]+):\s*\n?\s*'([^']*)',?\s*$/gm)];

function toId(key) {
  return key
    .trim()
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toNameEn(key) {
  return key.trim().replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ").trim();
}

const regions = entries.map(([_, key, d]) => {
  const nameEn = toNameEn(key);
  return {
    id: toId(key) || toId(nameEn),
    name: nameEn,
    nameEn,
    d
  };
});

const slug = country.replace(/-/g, "_");
const exportName = `${slug}Map`;

const output = `// Region SVG paths adapted from @react-map/${country} (MIT).
import type { MapDefinition } from "../types";

export const ${exportName}: MapDefinition = {
  viewBox: "0 0 ${width} ${width}",
  regions: ${JSON.stringify(regions, null, 2)}
} as const;
`;

const outDir = join(root, "packages/ui/src/components/CountryMap/maps");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${country}.ts`);
writeFileSync(outFile, output, "utf8");
console.log(`Generated ${regions.length} regions -> ${outFile}`);
