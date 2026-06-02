import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import ignore from "ignore";

const repoRoot = process.cwd();
const gitignorePath = path.join(repoRoot, ".gitignore");

function readGitignore() {
  const base = [
    ".git/",
    ".DS_Store",
    "Thumbs.db"
  ];

  if (!fs.existsSync(gitignorePath)) return base;
  const content = fs.readFileSync(gitignorePath, "utf8");
  return [...base, ...content.split(/\r?\n/)];
}

const ig = ignore().add(readGitignore());

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function walkFiles(dirAbs) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name);
    const rel = toPosix(path.relative(repoRoot, abs));

    // never pack the output folder itself
    if (rel === "dist" || rel.startsWith("dist/")) continue;

    // ignore rules are relative to repo root
    if (ig.ignores(rel + (ent.isDirectory() ? "/" : ""))) continue;

    if (ent.isDirectory()) {
      out.push(...walkFiles(abs));
    } else if (ent.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function formatDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

const files = walkFiles(repoRoot);
if (files.length === 0) {
  console.error("没有可打包的文件（可能全部被 .gitignore 排除了）。");
  process.exit(1);
}

fs.mkdirSync(path.join(repoRoot, "dist"), { recursive: true });
const outName = `pulse-ui-${formatDate(new Date())}.tar.gz`;
const outPath = path.join(repoRoot, "dist", outName);

const listPath = path.join(os.tmpdir(), `pulse-ui-pack-${Date.now()}.txt`);
fs.writeFileSync(listPath, files.join("\n") + "\n", "utf8");

const tarArgs = ["-czf", outPath, "-T", listPath];
const res = spawnSync("tar", tarArgs, { cwd: repoRoot, stdio: "inherit" });
try {
  fs.unlinkSync(listPath);
} catch {
  // ignore
}

if (res.status !== 0) process.exit(res.status ?? 1);

console.log(`\n打包完成：${path.relative(repoRoot, outPath)}`);
console.log(`文件数：${files.length}`);

