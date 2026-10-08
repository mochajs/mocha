"use strict";

const { execFileSync } = require("node:child_process");
const { isDeepStrictEqual } = require("node:util");

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
      versions.set(path, { name, version: pkg.version });
    }
  } else if (lockfile.dependencies) {
    const visit = (dependencies, parentPath = "") => {
      for (const [name, pkg] of Object.entries(dependencies)) {
        const path = `${parentPath}node_modules/${name}`;

        if (typeof pkg.version === "string") {
          versions.set(path, { name, version: pkg.version });
        }
        visit(pkg.dependencies || {}, `${path}/`);
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

const mutablePackageFields = [
  "version",
  "resolved",
  "integrity",
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "acceptDependencies",
  "bundleDependencies",
  "bin",
  "deprecated",
  "dev",
  "devOptional",
  "engines",
  "funding",
  "hasInstallScript",
  "inBundle",
  "license",
  "optional",
  "os",
  "peer",
  "cpu",
];

const isSafeUpdatedPackage = (basePackage, headPackage, name) => {
  const baseOtherFields = { ...basePackage };
  const headOtherFields = { ...headPackage };

  for (const field of mutablePackageFields) {
    delete baseOtherFields[field];
    delete headOtherFields[field];
  }

  if (!isDeepStrictEqual(baseOtherFields, headOtherFields)) {
    return false;
  }

  try {
    const resolved = new URL(headPackage.resolved);
    const packageName = name || headPackage.name;
    const tarballName = packageName.split("/").at(-1);

    if (
      resolved.protocol !== "https:" ||
      resolved.hostname !== "registry.npmjs.org" ||
      resolved.port !== "" ||
      resolved.username !== "" ||
      resolved.password !== "" ||
      resolved.search !== "" ||
      resolved.hash !== "" ||
      decodeURIComponent(resolved.pathname) !==
        `/${packageName}/-/${tarballName}-${headPackage.version}.tgz` ||
      typeof headPackage.integrity !== "string" ||
      !/^sha(?:1|256|384|512)-[A-Za-z0-9+/]+=*$/.test(headPackage.integrity)
    ) {
      return false;
    }

    if (
      basePackage.resolved &&
      new URL(basePackage.resolved).origin !== resolved.origin
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

const isSafePackageEntriesChange = (baseEntries, headEntries, manifestPair) => {
  if (
    !isDeepStrictEqual(
      Object.keys(baseEntries).sort(),
      Object.keys(headEntries).sort(),
    )
  ) {
    return false;
  }

  for (const [path, headPackage] of Object.entries(headEntries)) {
    const basePackage = baseEntries[path];

    if (path === "") {
      const baseOtherFields = { ...basePackage };
      const headOtherFields = { ...headPackage };

      for (const section of [
        "dependencies",
        "devDependencies",
        "optionalDependencies",
        "peerDependencies",
      ]) {
        delete baseOtherFields[section];
        delete headOtherFields[section];

        if (manifestPair) {
          if (
            !isDeepStrictEqual(
              basePackage[section],
              manifestPair.base[section],
            ) ||
            !isDeepStrictEqual(headPackage[section], manifestPair.head[section])
          ) {
            return false;
          }
        } else if (
          !isDeepStrictEqual(basePackage[section], headPackage[section])
        ) {
          return false;
        }
      }

      if (!isDeepStrictEqual(baseOtherFields, headOtherFields)) {
        return false;
      }

      continue;
    }

    if (basePackage.version === headPackage.version) {
      if (!isDeepStrictEqual(basePackage, headPackage)) {
        return false;
      }
    } else if (
      !isSafeUpdatedPackage(
        basePackage,
        headPackage,
        headPackage.name || path.split("node_modules/").at(-1),
      )
    ) {
      return false;
    }
  }

  return true;
};

const isSafeDependencyTreeChange = (baseDependencies, headDependencies) => {
  if (
    !isDeepStrictEqual(
      Object.keys(baseDependencies).sort(),
      Object.keys(headDependencies).sort(),
    )
  ) {
    return false;
  }

  for (const [name, headDependency] of Object.entries(headDependencies)) {
    const baseDependency = baseDependencies[name];
    const baseMetadata = { ...baseDependency };
    const headMetadata = { ...headDependency };
    const baseChildren = baseMetadata.dependencies || {};
    const headChildren = headMetadata.dependencies || {};

    delete baseMetadata.dependencies;
    delete headMetadata.dependencies;

    if (baseMetadata.version === headMetadata.version) {
      if (!isDeepStrictEqual(baseMetadata, headMetadata)) {
        return false;
      }
    } else if (!isSafeUpdatedPackage(baseMetadata, headMetadata, name)) {
      return false;
    }

    if (!isSafeDependencyTreeChange(baseChildren, headChildren)) {
      return false;
    }
  }

  return true;
};

const isSafeLockfileContent = (baseLockfile, headLockfile, manifestPair) => {
  const baseMetadata = { ...baseLockfile };
  const headMetadata = { ...headLockfile };
  const basePackages = baseMetadata.packages;
  const headPackages = headMetadata.packages;
  const baseDependencies = baseMetadata.dependencies || {};
  const headDependencies = headMetadata.dependencies || {};

  delete baseMetadata.packages;
  delete headMetadata.packages;
  delete baseMetadata.dependencies;
  delete headMetadata.dependencies;

  if (
    !isDeepStrictEqual(baseMetadata, headMetadata) ||
    !isSafeDependencyTreeChange(baseDependencies, headDependencies)
  ) {
    return false;
  }

  if (basePackages || headPackages) {
    if (
      !basePackages ||
      !headPackages ||
      !isSafePackageEntriesChange(basePackages, headPackages, manifestPair) ||
      (manifestPair && (!basePackages[""] || !headPackages[""]))
    ) {
      return false;
    }
  } else if (manifestPair) {
    return false;
  }

  return true;
};

const isSafeDependencyManifestChange = (baseManifest, headManifest) => {
  if (
    !baseManifest ||
    typeof baseManifest !== "object" ||
    Array.isArray(baseManifest) ||
    !headManifest ||
    typeof headManifest !== "object" ||
    Array.isArray(headManifest)
  ) {
    return false;
  }

  const dependencySections = [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
  ];
  const baseOtherFields = { ...baseManifest };
  const headOtherFields = { ...headManifest };

  for (const section of dependencySections) {
    delete baseOtherFields[section];
    delete headOtherFields[section];
  }

  if (!isDeepStrictEqual(baseOtherFields, headOtherFields)) {
    return false;
  }

  for (const section of dependencySections) {
    const baseHasSection = Object.hasOwn(baseManifest, section);
    const headHasSection = Object.hasOwn(headManifest, section);
    const baseDependencies = baseHasSection ? baseManifest[section] : {};
    const headDependencies = headHasSection ? headManifest[section] : {};

    if (
      baseHasSection !== headHasSection ||
      typeof baseDependencies !== "object" ||
      baseDependencies === null ||
      Array.isArray(baseDependencies) ||
      typeof headDependencies !== "object" ||
      headDependencies === null ||
      Array.isArray(headDependencies) ||
      !isDeepStrictEqual(
        Object.keys(baseDependencies).sort(),
        Object.keys(headDependencies).sort(),
      )
    ) {
      return false;
    }

    for (const [name, headRange] of Object.entries(headDependencies)) {
      const baseRange = baseDependencies[name];

      if (baseRange === headRange) {
        continue;
      }

      if (typeof baseRange !== "string" || typeof headRange !== "string") {
        return false;
      }

      const baseMatch = baseRange.match(/^([~^]?)(\d+\.\d+\.\d+)$/);
      const headMatch = headRange.match(/^([~^]?)(\d+\.\d+\.\d+)$/);

      if (!baseMatch || !headMatch || baseMatch[1] !== headMatch[1]) {
        return false;
      }

      const [baseMajor, baseMinor] = parseVersion(baseMatch[2]);
      const [headMajor, headMinor] = parseVersion(headMatch[2]);

      if (baseMajor !== headMajor || headMinor <= baseMinor) {
        return false;
      }
    }
  }

  return true;
};

const isSafeMinorUpdate = (
  baseLockfiles,
  headLockfiles,
  manifestPairs = {},
) => {
  let hasMinorUpdate = false;
  let hasLockfileVersionChange = false;

  for (const file of Object.keys(headLockfiles)) {
    const baseLockfile = baseLockfiles[file];
    const headLockfile = headLockfiles[file];

    if (
      !baseLockfile ||
      !headLockfile ||
      !isSafeLockfileContent(baseLockfile, headLockfile, manifestPairs[file])
    ) {
      return false;
    }

    const oldVersions = getVersions(baseLockfile);
    const newVersions = getVersions(headLockfile);
    const changedManifest = manifestPairs[file];

    if (changedManifest) {
      const updatedNames = new Set(
        [...newVersions].flatMap(([path, pkg]) => {
          const previousPackage = oldVersions.get(path);

          return !previousPackage || previousPackage.version !== pkg.version
            ? [pkg.name]
            : [];
        }),
      );

      for (const section of [
        "dependencies",
        "devDependencies",
        "optionalDependencies",
        "peerDependencies",
      ]) {
        const baseDependencies = changedManifest.base[section] || {};
        const headDependencies = changedManifest.head[section] || {};

        for (const [name, range] of Object.entries(headDependencies)) {
          if (baseDependencies[name] !== range && !updatedNames.has(name)) {
            return false;
          }
        }
      }
    }

    for (const path of oldVersions.keys()) {
      if (!newVersions.has(path)) {
        return false;
      }
    }

    for (const [path, { name, version: newVersion }] of newVersions) {
      const previousPackage = oldVersions.get(path);

      if (!previousPackage) {
        if ([...oldVersions.values()].some((pkg) => pkg.name === name)) {
          return false;
        }
        continue;
      }

      if (previousPackage.name !== name) {
        return false;
      }

      if (previousPackage.version === newVersion) {
        continue;
      }

      hasLockfileVersionChange = true;
      const parsedNewVersion = parseVersion(newVersion);
      const parsedPreviousVersion = parseVersion(previousPackage.version);

      if (!parsedNewVersion || !parsedPreviousVersion) {
        return false;
      }

      if (parsedPreviousVersion[0] !== parsedNewVersion[0]) {
        return false;
      }

      const [, oldMinor, oldPatch] = parsedPreviousVersion;
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

  return hasLockfileVersionChange && hasMinorUpdate;
};

const isLockfile = (file) =>
  /(?:^|\/)(?:package-lock\.json|npm-shrinkwrap\.json)$/.test(file);

const isPackageManifest = (file) => /(?:^|\/)package\.json$/.test(file);

const isSafeCompleteDiff = (
  changedFiles,
  baseLockfiles,
  headLockfiles,
  baseManifests,
  headManifests,
) => {
  const lockfilePaths = changedFiles.filter(isLockfile);
  const manifestPaths = changedFiles.filter(isPackageManifest);

  if (
    lockfilePaths.length === 0 ||
    changedFiles.some(
      (file) => !isLockfile(file) && !isPackageManifest(file),
    ) ||
    !isDeepStrictEqual(
      lockfilePaths.slice().sort(),
      Object.keys(baseLockfiles).sort(),
    ) ||
    !isDeepStrictEqual(
      lockfilePaths.slice().sort(),
      Object.keys(headLockfiles).sort(),
    ) ||
    !isDeepStrictEqual(
      manifestPaths.slice().sort(),
      Object.keys(baseManifests).sort(),
    ) ||
    !isDeepStrictEqual(
      manifestPaths.slice().sort(),
      Object.keys(headManifests).sort(),
    )
  ) {
    return false;
  }

  for (const manifestPath of manifestPaths) {
    const directory = manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1);

    if (
      !lockfilePaths.includes(`${directory}package-lock.json`) &&
      !lockfilePaths.includes(`${directory}npm-shrinkwrap.json`)
    ) {
      return false;
    }

    if (
      !isSafeDependencyManifestChange(
        baseManifests[manifestPath],
        headManifests[manifestPath],
      )
    ) {
      return false;
    }
  }

  const manifestPairs = {};

  for (const manifestPath of manifestPaths) {
    const directory = manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1);

    for (const lockfilePath of lockfilePaths) {
      if (
        lockfilePath === `${directory}package-lock.json` ||
        lockfilePath === `${directory}npm-shrinkwrap.json`
      ) {
        manifestPairs[lockfilePath] = {
          base: baseManifests[manifestPath],
          head: headManifests[manifestPath],
        };
      }
    }
  }

  return isSafeMinorUpdate(baseLockfiles, headLockfiles, manifestPairs);
};

const getChangedFiles = (baseSha, headSha) =>
  execFileSync("git", ["diff", "--name-only", "-z", baseSha, headSha], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);

const readJsonFiles = (sha, files) =>
  Object.fromEntries(
    files.map((file) => [
      file,
      JSON.parse(
        execFileSync("git", ["show", `${sha}:${file}`], { encoding: "utf8" }),
      ),
    ]),
  );

const getChangedData = (baseSha, headSha) => {
  const changedFiles = getChangedFiles(baseSha, headSha);
  const lockfiles = changedFiles.filter(isLockfile);
  const manifests = changedFiles.filter(isPackageManifest);

  return {
    changedFiles,
    baseLockfiles: readJsonFiles(baseSha, lockfiles),
    headLockfiles: readJsonFiles(headSha, lockfiles),
    baseManifests: readJsonFiles(baseSha, manifests),
    headManifests: readJsonFiles(headSha, manifests),
  };
};

module.exports = {
  isSafeCompleteDiff,
  isSafeDependencyManifestChange,
  isSafeMinorUpdate,
};

if (require.main === module) {
  if (isRenovate) {
    let isSafe;

    try {
      const {
        changedFiles,
        baseLockfiles,
        headLockfiles,
        baseManifests,
        headManifests,
      } = getChangedData(args["base-sha"], args["head-sha"]);
      isSafe = isSafeCompleteDiff(
        changedFiles,
        baseLockfiles,
        headLockfiles,
        baseManifests,
        headManifests,
      );
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
