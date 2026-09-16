import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

// Reports are written per file with / on Linux and \ on Windows.
const toPosix = (path) => path.split("\\").join("/");

// lcov marks a branch that was never reached with "-" rather than 0.
const toHits = (value) => (value === "-" ? 0 : Number(value));

function findReports(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".info"))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

function parseReport(file) {
  const sources = new Map();
  let current = null;
  let functions = [];
  let functionHits = 0;

  const linesSeen = new Map();
  const functionKey = (line) => {
    const seen = linesSeen.get(line) ?? 0;
    linesSeen.set(line, seen + 1);
    return `${line}:${seen}`;
  };

  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    const value = line.slice(line.indexOf(":") + 1);

    if (line.startsWith("SF:")) {
      const path = toPosix(value);
      if (!sources.has(path)) {
        sources.set(path, {
          branches: new Map(),
          functions: new Map(),
          lines: new Map(),
        });
      }
      current = sources.get(path);
      functions = [];
      functionHits = 0;
      linesSeen.clear();
    } else if (!current) {
      continue;
    } else if (line.startsWith("FN:")) {
      const [start, ...name] = value.split(",");
      functions.push({ key: functionKey(start), name: name.join(","), start });
    } else if (line.startsWith("FNDA:")) {
      const [hits, ...name] = value.split(",");
      const fn = functions[functionHits++];
      if (!fn) {
        throw new Error(
          `${file}: more FNDA than FN records, cannot pair "${name.join(",")}"`,
        );
      }
      fn.hits = toHits(hits);
    } else if (line.startsWith("DA:")) {
      const [start, hits] = value.split(",");
      current.lines.set(start, (current.lines.get(start) ?? 0) + toHits(hits));
    } else if (line.startsWith("BRDA:")) {
      const [start, block, branch, taken] = value.split(",");
      const key = `${start},${block},${branch}`;
      current.branches.set(
        key,
        (current.branches.get(key) ?? 0) + toHits(taken),
      );
    } else if (line === "end_of_record") {
      for (const fn of functions) {
        const merged = current.functions.get(fn.key);
        if (merged) {
          merged.hits += fn.hits ?? 0;
        } else {
          current.functions.set(fn.key, {
            hits: fn.hits ?? 0,
            name: fn.name,
            start: fn.start,
          });
        }
      }
      current = null;
    }
  }

  return sources;
}

function mergeInto(into, from) {
  for (const [path, source] of from) {
    const target = into.get(path);
    if (!target) {
      into.set(path, source);
      continue;
    }

    for (const [line, hits] of source.lines) {
      target.lines.set(line, (target.lines.get(line) ?? 0) + hits);
    }
    for (const [key, taken] of source.branches) {
      target.branches.set(key, (target.branches.get(key) ?? 0) + taken);
    }
    for (const [key, fn] of source.functions) {
      const merged = target.functions.get(key);
      if (merged) {
        merged.hits += fn.hits;
      } else {
        target.functions.set(key, fn);
      }
    }
  }
}

function formatReport(sources) {
  const byNumber = (a, b) => Number(a[0]) - Number(b[0]);
  const out = [];

  for (const path of [...sources.keys()].sort()) {
    const { branches, functions, lines } = sources.get(path);
    const fns = [...functions.values()].sort(
      (a, b) => Number(a.start) - Number(b.start),
    );

    out.push("TN:", `SF:${path}`);
    for (const fn of fns) out.push(`FN:${fn.start},${fn.name}`);
    out.push(
      `FNF:${fns.length}`,
      `FNH:${fns.filter((fn) => fn.hits > 0).length}`,
    );
    for (const fn of fns) out.push(`FNDA:${fn.hits},${fn.name}`);

    const daLines = [...lines.entries()].sort(byNumber);
    for (const [line, hits] of daLines) out.push(`DA:${line},${hits}`);
    out.push(
      `LF:${daLines.length}`,
      `LH:${daLines.filter(([, hits]) => hits > 0).length}`,
    );

    const brdaLines = [...branches.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], "en", { numeric: true }),
    );
    for (const [key, taken] of brdaLines) out.push(`BRDA:${key},${taken}`);
    out.push(
      `BRF:${brdaLines.length}`,
      `BRH:${brdaLines.filter(([, taken]) => taken > 0).length}`,
      "end_of_record",
    );
  }

  return out.join("\n") + "\n";
}

function summarize(sources) {
  const totals = { branches: [0, 0], functions: [0, 0], lines: [0, 0] };

  for (const source of sources.values()) {
    for (const [name, values] of [
      ["branches", source.branches.values()],
      ["functions", [...source.functions.values()].map((fn) => fn.hits)],
      ["lines", source.lines.values()],
    ]) {
      for (const hits of values) {
        totals[name][1]++;
        if (hits > 0) totals[name][0]++;
      }
    }
  }

  return totals;
}

const [inputDir, outputFile] = process.argv.slice(2);
if (!inputDir || !outputFile) {
  console.error(
    "Usage: node scripts/merge-coverage.js <input-dir> <output-file>",
  );
  process.exit(1);
}

const reports = findReports(inputDir);
if (reports.length === 0) {
  console.error(`No coverage reports found in ${inputDir}`);
  process.exit(1);
}

const merged = new Map();
for (const report of reports) {
  const sources = parseReport(report);
  if (sources.size === 0) {
    console.warn(`Empty coverage report: ${relative(inputDir, report)}`);
  }
  mergeInto(merged, sources);
}

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, formatReport(merged));

const totals = summarize(merged);
console.log(
  `Merged ${reports.length} coverage reports covering ${merged.size} files ` +
    `into ${toPosix(outputFile.split(sep).join("/"))}`,
);
for (const [name, [covered, total]] of Object.entries(totals)) {
  const pct = total === 0 ? 100 : (covered / total) * 100;
  console.log(`  ${name.padEnd(9)} ${pct.toFixed(2)}% (${covered}/${total})`);
}
