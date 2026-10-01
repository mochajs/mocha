"use strict";

const { execFileSync } = require("node:child_process");

const argv = process.argv.slice(2);
const args = {};

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];

  if (!arg.startsWith("--")) {
    continue;
  }

  const key = arg.slice(2);
  const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "";

  if (value === "") {
    args[key] = "";
  } else {
    args[key] = value;
    i += 1;
  }
}

const author = args.author || "";
const title = args.title || "";
const hasHumanApproval = args["has-human-approval"] === "true";

const isRenovate = author === "renovate[bot]";

const getVersions = (lockfile) => {
  const versions = new Map();

  if (lockfile.packages) {
    for (const [path, pkg] of Object.entries(lockfile.packages)) {
      if (!path.includes("node_modules/") || typeof pkg.version !== "string") {
        continue;
      }

      const name = pkg.name || path.split("node_modules/").at(-1);
      versions.set(name, [...(versions.get(name) || []), pkg.version]);
    }
  } else if (lockfile.dependencies) {
    const visit = (dependencies) => {
      for (const [name, pkg] of Object.entries(dependencies)) {
        if (typeof pkg.version === "string") {
          versions.set(name, [...(versions.get(name) || []), pkg.version]);
        }
        visit(pkg.dependencies || {});
      }
    };

    visit(lockfile.dependencies);
  }

  return versions;
};

const parseVersion = (version) => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:[-+][0-9A-Za-z.-]+)?$/);
  return match && match.slice(1).map(Number);
};

const isSafeMinorUpdate = (baseLockfiles, headLockfiles) => {
  let hasMinorUpdate = false;
  let hasLockfileVersionChange = false;

  for (const file of Object.keys(headLockfiles)) {
    const baseLockfile = baseLockfiles[file];
    const headLockfile = headLockfiles[file];

    if (!baseLockfile || !headLockfile) {
      return false;
    }

    const oldVersions = getVersions(baseLockfile);
    const newVersions = getVersions(headLockfile);

    for (const [name, versions] of newVersions) {
      const previousVersions = oldVersions.get(name) || [];

      for (const newVersion of versions) {
        if (previousVersions.includes(newVersion)) {
          continue;
        }

        hasLockfileVersionChange = true;
        const parsedNewVersion = parseVersion(newVersion);

        if (!parsedNewVersion) {
          return false;
        }

        const parsedPreviousVersions = previousVersions.map(parseVersion);

        if (parsedPreviousVersions.some((version) => !version)) {
          return false;
        }

        const sameMajorVersions = parsedPreviousVersions.filter(
          ([major]) => major === parsedNewVersion[0],
        );

        if (previousVersions.length > 0 && sameMajorVersions.length === 0) {
          return false;
        }

        if (sameMajorVersions.length === 0) {
          continue;
        }

        const [, oldMinor, oldPatch] = sameMajorVersions.reduce(
          (latest, version) =>
            version[1] > latest[1] ||
            (version[1] === latest[1] && version[2] > latest[2])
              ? version
              : latest,
        );
        const [, newMinor, newPatch] = parsedNewVersion;

        if (
          newMinor < oldMinor ||
          (newMinor === oldMinor && newPatch < oldPatch)
        ) {
          return false;
        }

        if (newMinor > oldMinor) {
          hasMinorUpdate = true;
        }
      }
    }
  }

  return hasLockfileVersionChange && hasMinorUpdate;
};

const getLockfiles = (baseSha, headSha) => {
  const files = execFileSync(
    "git",
    [
      "diff",
      "--name-only",
      "-z",
      baseSha,
      headSha,
      "--",
      ":(glob)**/package-lock.json",
      ":(glob)**/npm-shrinkwrap.json",
    ],
    { encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean);

  const readLockfiles = (sha) =>
    Object.fromEntries(
      files.map((file) => [
        file,
        JSON.parse(
          execFileSync("git", ["show", `${sha}:${file}`], { encoding: "utf8" }),
        ),
      ]),
    );

  return [readLockfiles(baseSha), readLockfiles(headSha)];
};

module.exports = { isSafeMinorUpdate };

if (require.main === module) {
  if (isRenovate) {
    let isSafe;

    try {
      const [baseLockfiles, headLockfiles] = getLockfiles(
        args["base-sha"],
        args["head-sha"],
      );
      isSafe = isSafeMinorUpdate(baseLockfiles, headLockfiles);
    } catch (error) {
      console.error(
        `Unable to verify Renovate lockfile changes: ${error.message}`,
      );
      process.exit(1);
    }

    if (isSafe) {
      console.log(
        `Renovate minor update allowed without an approval: ${title}`,
      );
      process.exit(0);
    }

    console.error(
      `Renovate PRs must contain a minor npm lockfile update with no major version changes. "${title}" requires human review.`,
    );
    process.exit(1);
  }

  if (hasHumanApproval) {
    console.log("Human approval is present for this PR.");
    process.exit(0);
  }

  console.error("This PR requires a human approval before it can merge.");
  process.exit(1);
}
