#!/usr/bin/env node
// Structural checks for the ai-product-manager skill. Zero dependencies (Node 18+).
// - SKILL.md has YAML frontmatter with `name` and `description` (description <= 1024 chars)
// - SKILL.md body stays under 500 lines (progressive disclosure)
// - every `references/*.md` and `templates/*.md` mentioned in SKILL.md exists
// - every reference/template file on disk is mentioned somewhere in SKILL.md (no orphans)
// - evals/evals.json parses and every eval has a prompt and assertions
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = join(root, "skills", "ai-product-manager");
const errors = [];
const fail = (msg) => errors.push(msg);

const skill = readFileSync(join(skillDir, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) fail("SKILL.md: missing YAML frontmatter");
else {
  const front = fm[1];
  const name = front.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (name !== "ai-product-manager") fail(`SKILL.md: name should be "ai-product-manager", got "${name}"`);
  const descBlock = front.match(/^description:\s*>-?\n([\s\S]*?)(?=\n\S|$)/m);
  const desc = descBlock
    ? descBlock[1].split("\n").map((l) => l.trim()).join(" ").trim()
    : front.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!desc) fail("SKILL.md: missing description");
  else if (desc.length > 1024) fail(`SKILL.md: description is ${desc.length} chars (max 1024)`);
}

const bodyLines = skill.split("\n").length;
if (bodyLines > 500) fail(`SKILL.md: ${bodyLines} lines (keep under 500)`);

for (const sub of ["references", "templates"]) {
  const mentioned = new Set([...skill.matchAll(new RegExp(`${sub}/([\\w.-]+\\.md)`, "g"))].map((m) => m[1]));
  // the router table lists templates by bare filename, so collect those too
  if (sub === "templates") for (const m of skill.matchAll(/`([\w-]+\.md)`/g)) mentioned.add(m[1]);
  const onDisk = readdirSync(join(skillDir, sub)).filter((f) => f.endsWith(".md"));
  for (const f of mentioned) {
    if (sub === "templates" && !onDisk.includes(f) && existsSync(join(skillDir, "references", f))) continue;
    if (sub === "templates" && f === "SKILL.md") continue;
    if (!onDisk.includes(f)) fail(`SKILL.md mentions ${sub}/${f}, which does not exist`);
  }
  for (const f of onDisk) if (!mentioned.has(f)) fail(`${sub}/${f} is never mentioned in SKILL.md (orphan)`);
}

try {
  const evals = JSON.parse(readFileSync(join(root, "evals", "evals.json"), "utf8"));
  if (!Array.isArray(evals.evals) || evals.evals.length === 0) fail("evals.json: no evals");
  for (const e of evals.evals ?? []) {
    if (!e.prompt) fail(`evals.json: eval ${e.id} has no prompt`);
    if (!Array.isArray(e.assertions) || e.assertions.length === 0) fail(`evals.json: eval ${e.id} has no assertions`);
  }
} catch (err) {
  fail(`evals.json: ${err.message}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log("✓ ai-product-manager skill structure is valid");
