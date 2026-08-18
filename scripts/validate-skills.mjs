#!/usr/bin/env node
// Validates every SKILL.md in this repo, plus the two JSON manifests.
// Run locally with `node scripts/validate-skills.mjs`; CI runs it on every PR.
//
// Zero dependencies on purpose: this repo ships markdown, not a toolchain, so a
// contributor can run the check with nothing installed but Node.
//
// The failure this exists to catch: SKILL.md frontmatter that does not parse as
// YAML loads with ALL FRONTMATTER SILENTLY DROPPED rather than erroring. The
// skill still appears, with no name and no description, so it never gets
// selected and nothing tells you why. The most common cause by far is an
// unquoted value containing a colon followed by a space, which is exactly what
// a natural-sounding description does:
//
//   description: Prepare a client's year end: statements, GIFI, and a CCA schedule.
//                                          ^^ breaks the whole block
//
// Quoting the value fixes it. Everything below is in service of catching that
// class of mistake before it reaches anyone's assistant.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");

// The Agent Skills spec fields, and the ONLY ones portable across Claude Code,
// claude.ai skill uploads, and the Skills API. Anything else is rejected at
// upload time with "Unexpected key(s) in SKILL.md frontmatter", so a field that
// works locally in Claude Code can still break the download path. Keep this
// list in sync with the spec, not with what one client happens to tolerate.
const ALLOWED = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);
// The two fields that may hold a nested block rather than a scalar.
const NESTABLE = new Set(["metadata", "allowed-tools"]);

// Spec limits.
const MAX_COMPATIBILITY = 500;
// Claude Code truncates the description in the skill listing at 1536 chars.
const MAX_DESCRIPTION = 1536;

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

/** Every plugins/<plugin>/skills/<slug>/SKILL.md in the repo. */
function findSkillFiles() {
  const out = [];
  const pluginsDir = join(ROOT, "plugins");
  if (!existsSync(pluginsDir)) return out;
  for (const plugin of readdirSync(pluginsDir)) {
    const skillsDir = join(pluginsDir, plugin, "skills");
    if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) continue;
    for (const slug of readdirSync(skillsDir)) {
      const file = join(skillsDir, slug, "SKILL.md");
      if (existsSync(file)) out.push({ file, slug });
      else if (statSync(join(skillsDir, slug)).isDirectory()) {
        fail(`plugins/${plugin}/skills/${slug}`, "directory has no SKILL.md");
      }
    }
  }
  return out;
}

/**
 * Is this scalar safe unquoted? Mirrors the YAML rules that actually bite in
 * practice rather than implementing YAML: a plain scalar cannot contain ": ",
 * cannot contain " #", and cannot begin with an indicator character.
 */
function unquotedScalarProblem(value) {
  if (value.includes(": ")) {
    return 'contains ": " (colon + space), which YAML reads as a nested key. Wrap the value in double quotes';
  }
  if (value.endsWith(":")) {
    return "ends with a colon, which YAML reads as a nested key. Wrap the value in double quotes";
  }
  if (value.includes(" #")) {
    return 'contains " #", which YAML reads as a comment. Wrap the value in double quotes';
  }
  if (/^[[{&*!|>%@`]/.test(value)) {
    return `starts with the YAML indicator "${value[0]}". Wrap the value in double quotes`;
  }
  return null;
}

/** Strip surrounding quotes, if the value is quoted. */
function unquote(value) {
  const m = value.match(/^"(.*)"$/s) || value.match(/^'(.*)'$/s);
  return m ? m[1] : value;
}

function validateSkill({ file, slug }) {
  const rel = file.slice(ROOT.length + 1);
  const raw = readFileSync(file, "utf8");

  if (!raw.startsWith("---\n")) {
    fail(rel, "must begin with a YAML frontmatter block opened by --- on line 1");
    return;
  }
  const end = raw.indexOf("\n---\n", 3);
  if (end === -1) {
    fail(rel, "frontmatter block is never closed by a --- line");
    return;
  }
  const lines = raw.slice(4, end).split("\n");

  const seen = new Map();
  let currentKey = null;
  lines.forEach((line, i) => {
    const lineNo = i + 2; // +1 for the opening ---, +1 for 1-based
    if (line.trim() === "" || line.trimStart().startsWith("#")) return;

    // Indented line: part of the previous key's nested block.
    if (/^\s/.test(line)) {
      if (!currentKey) {
        fail(rel, `line ${lineNo}: indented line with no key above it`);
      } else if (!NESTABLE.has(currentKey)) {
        fail(
          rel,
          `line ${lineNo}: "${currentKey}" is given a nested block, but only ${[...NESTABLE].join(" and ")} may be nested. A multi-line value must be quoted on one line`,
        );
      }
      return;
    }

    const m = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(.*)$/);
    if (!m) {
      fail(rel, `line ${lineNo}: not a "key: value" pair -> ${line.slice(0, 60)}`);
      return;
    }
    const [, key, rest] = m;
    currentKey = key;

    if (!ALLOWED.has(key)) {
      fail(
        rel,
        `line ${lineNo}: "${key}" is not an Agent Skills spec field. Allowed: ${[...ALLOWED].join(", ")}. Anything else is rejected when the skill is uploaded`,
      );
      return;
    }
    if (seen.has(key)) fail(rel, `line ${lineNo}: "${key}" is defined twice`);

    const value = rest.trim();
    seen.set(key, value);

    if (value === "") return; // nested block follows, checked above
    const quoted = /^".*"$/s.test(value) || /^'.*'$/s.test(value);
    if (!quoted) {
      const problem = unquotedScalarProblem(value);
      if (problem) fail(rel, `line ${lineNo}: "${key}" ${problem}`);
    }
  });

  // Required fields.
  for (const required of ["name", "description"]) {
    if (!seen.has(required)) fail(rel, `frontmatter is missing "${required}"`);
  }

  // The frontmatter name sets the command's last segment for a plugin skill, so
  // a mismatch with the directory silently changes how the skill is invoked.
  const name = seen.has("name") ? unquote(seen.get("name")) : null;
  if (name && name !== slug) {
    fail(rel, `name "${name}" does not match its directory "${slug}"`);
  }

  const description = seen.has("description") ? unquote(seen.get("description")) : "";
  if (description && description.length > MAX_DESCRIPTION) {
    fail(rel, `description is ${description.length} chars, over the ${MAX_DESCRIPTION} limit`);
  }
  if (description && description.length < 40) {
    warn(rel, `description is only ${description.length} chars. It is what the assistant uses to decide when to load the skill, so say what the skill does AND when to use it`);
  }

  const compat = seen.has("compatibility") ? unquote(seen.get("compatibility")) : "";
  if (compat.length > MAX_COMPATIBILITY) {
    fail(rel, `compatibility is ${compat.length} chars, over the ${MAX_COMPATIBILITY} limit`);
  }

  // House rule, and the one with real consequences: no client data, ever.
  if (/\bcompany[_ ]id\b\s*[:=]\s*["']?[A-Za-z0-9]{16,}/i.test(raw)) {
    fail(rel, "looks like it contains a real company identifier. No client data in this repo");
  }
  // House style, matching the rest of ReInvestWealth's published writing.
  if (raw.includes("—")) {
    warn(rel, "contains an em dash. House style is a comma, a period, or parentheses");
  }
}

function validateManifests() {
  const mkPath = join(ROOT, ".claude-plugin", "marketplace.json");
  if (!existsSync(mkPath)) {
    fail(".claude-plugin/marketplace.json", "missing");
    return;
  }
  let mk;
  try {
    mk = JSON.parse(readFileSync(mkPath, "utf8"));
  } catch (e) {
    fail(".claude-plugin/marketplace.json", `is not valid JSON: ${e.message}`);
    return;
  }
  for (const field of ["name", "owner", "plugins"]) {
    if (!mk[field]) fail(".claude-plugin/marketplace.json", `missing required field "${field}"`);
  }
  if (mk.owner && !mk.owner.name) {
    fail(".claude-plugin/marketplace.json", 'owner is missing "name"');
  }
  for (const plugin of mk.plugins ?? []) {
    if (!plugin.name || !plugin.source) {
      fail(".claude-plugin/marketplace.json", "a plugin entry is missing name or source");
      continue;
    }
    // Only relative-path sources are resolvable inside this repo; anything else
    // is a remote source and is out of scope for a local check.
    if (typeof plugin.source === "string" && plugin.source.startsWith("./")) {
      const dir = join(ROOT, plugin.source);
      if (!existsSync(dir)) {
        fail(".claude-plugin/marketplace.json", `plugin "${plugin.name}" points at ${plugin.source}, which does not exist`);
        continue;
      }
      const pj = join(dir, ".claude-plugin", "plugin.json");
      if (!existsSync(pj)) {
        fail(".claude-plugin/marketplace.json", `plugin "${plugin.name}" has no .claude-plugin/plugin.json`);
        continue;
      }
      try {
        const parsed = JSON.parse(readFileSync(pj, "utf8"));
        if (parsed.name !== plugin.name) {
          fail(`${plugin.source}/.claude-plugin/plugin.json`, `name "${parsed.name}" does not match the marketplace entry "${plugin.name}"`);
        }
      } catch (e) {
        fail(`${plugin.source}/.claude-plugin/plugin.json`, `is not valid JSON: ${e.message}`);
      }
    }
  }
}

const skills = findSkillFiles();
if (skills.length === 0) fail("plugins/", "found no SKILL.md files to validate");
skills.forEach(validateSkill);
validateManifests();

for (const w of warnings) console.log(`warning  ${w}`);
for (const e of errors) console.error(`ERROR    ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s) in ${skills.length} skill(s). Nothing merges until these are fixed.`);
  process.exit(1);
}
console.log(`\nOK: ${skills.length} skill(s) and 2 manifest(s) valid${warnings.length ? `, ${warnings.length} warning(s)` : ""}.`);
