"use strict";

const {
  isSafeCompleteDiff,
  isSafeMinorUpdate,
} = require("../../../scripts/check-pr-approval.cjs");

const lockfile = (version, dependencyRange) => ({
  lockfileVersion: 3,
  packages: {
    "": dependencyRange ? { devDependencies: { eslint: dependencyRange } } : {},
    "node_modules/eslint": {
      version,
      name: "eslint",
      resolved: `https://registry.npmjs.org/eslint/-/eslint-${version}.tgz`,
      integrity: "sha512-AAAA",
    },
  },
});

const packageManifest = (version) => ({
  name: "fixture",
  version: "1.0.0",
  scripts: { test: "mocha" },
  devDependencies: { eslint: version },
});

const lockfileForManifest = (version, manifest) => {
  const result = lockfile(version);
  const rootPackage = result.packages[""];

  for (const section of [
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
  ]) {
    if (Object.hasOwn(manifest, section)) {
      rootPackage[section] = manifest[section];
    }
  }

  return result;
};

describe("PR approval check", function () {
  describe("isSafeCompleteDiff()", function () {
    const baseFiles = ["package-lock.json"];
    const baseLockfiles = { "package-lock.json": lockfile("10.8.2") };
    const headLockfiles = { "package-lock.json": lockfile("10.9.1") };
    const baseManifests = {};
    const headManifests = {};

    it("allows a minor lockfile update without unrelated changes", function () {
      expect(
        isSafeCompleteDiff(
          baseFiles,
          baseLockfiles,
          headLockfiles,
          baseManifests,
          headManifests,
        ),
        "to be true",
      );
    });

    it("rejects source, workflow, and other unrelated file changes", function () {
      for (const changedFile of [
        "src/file.js",
        ".github/workflows/ci.yml",
        "README.md",
      ]) {
        expect(
          isSafeCompleteDiff(
            [...baseFiles, changedFile],
            baseLockfiles,
            headLockfiles,
            baseManifests,
            headManifests,
          ),
          "to be false",
        );
      }
    });

    it("allows a minor dependency range update with its lockfile", function () {
      const baseManifest = packageManifest("^10.8.0");
      const headManifest = packageManifest("^10.9.0");

      expect(
        isSafeCompleteDiff(
          ["package.json", ...baseFiles],
          {
            "package-lock.json": lockfileForManifest("10.8.2", baseManifest),
          },
          {
            "package-lock.json": lockfileForManifest("10.9.1", headManifest),
          },
          { "package.json": baseManifest },
          { "package.json": headManifest },
        ),
        "to be true",
      );
    });

    it("rejects a changed package source in the lockfile", function () {
      const headLockfile = lockfile("10.9.1");
      headLockfile.packages["node_modules/eslint"].resolved =
        "https://attacker.example/eslint.tgz";

      expect(
        isSafeCompleteDiff(
          baseFiles,
          baseLockfiles,
          { "package-lock.json": headLockfile },
          baseManifests,
          headManifests,
        ),
        "to be false",
      );
    });

    it("rejects root dependency changes made only in the lockfile", function () {
      expect(
        isSafeCompleteDiff(
          baseFiles,
          { "package-lock.json": lockfile("10.8.2", "^10.8.0") },
          { "package-lock.json": lockfile("10.9.1", "^10.9.0") },
          baseManifests,
          headManifests,
        ),
        "to be false",
      );
    });

    it("requires manifest dependency updates to match the lockfile bump", function () {
      const baseManifest = packageManifest("^10.8.0");
      const headManifest = packageManifest("^10.9.0");
      const baseLockfile = lockfileForManifest("10.8.2", baseManifest);
      const headLockfile = lockfileForManifest("10.8.2", headManifest);
      baseLockfile.packages["node_modules/mocha"] = {
        version: "12.1.0",
        name: "mocha",
        resolved: "https://registry.npmjs.org/mocha/-/mocha-12.1.0.tgz",
        integrity: "sha512-AAAA",
      };
      headLockfile.packages["node_modules/mocha"] = {
        version: "12.2.0",
        name: "mocha",
        resolved: "https://registry.npmjs.org/mocha/-/mocha-12.2.0.tgz",
        integrity: "sha512-BBBB",
      };

      expect(
        isSafeCompleteDiff(
          ["package.json", ...baseFiles],
          { "package-lock.json": baseLockfile },
          { "package-lock.json": headLockfile },
          { "package.json": baseManifest },
          { "package.json": headManifest },
        ),
        "to be false",
      );
    });

    it("rejects changes to non-dependency manifest fields", function () {
      const baseManifest = packageManifest("^10.8.0");
      const headManifest = packageManifest("^10.9.0");
      headManifest.scripts.test = "node arbitrary.js";

      expect(
        isSafeCompleteDiff(
          ["package.json", ...baseFiles],
          {
            "package-lock.json": lockfileForManifest("10.8.2", baseManifest),
          },
          {
            "package-lock.json": lockfileForManifest("10.9.1", headManifest),
          },
          { "package.json": baseManifest },
          { "package.json": headManifest },
        ),
        "to be false",
      );
    });

    it("rejects added dependencies and non-minor dependency range changes", function () {
      const baseManifest = packageManifest("^10.8.0");

      for (const headManifest of [
        {
          ...packageManifest("^10.9.0"),
          dependencies: { unexpected: "^1.0.0" },
        },
        packageManifest("^11.0.0"),
        packageManifest("^10.8.1"),
        packageManifest("https://example.invalid/eslint.tgz"),
      ]) {
        const baseLockfile = lockfileForManifest("10.8.2", baseManifest);
        const headLockfile = lockfileForManifest("10.9.1", headManifest);

        expect(
          isSafeCompleteDiff(
            ["package.json", ...baseFiles],
            { "package-lock.json": baseLockfile },
            { "package-lock.json": headLockfile },
            { "package.json": baseManifest },
            { "package.json": headManifest },
          ),
          "to be false",
        );
      }
    });

    it("rejects manifest changes without a matching lockfile change", function () {
      expect(
        isSafeCompleteDiff(
          ["package.json"],
          {},
          {},
          { "package.json": packageManifest("^10.8.0") },
          { "package.json": packageManifest("^10.9.0") },
        ),
        "to be false",
      );
    });
  });

  describe("isSafeMinorUpdate()", function () {
    it("allows a lockfile minor update regardless of its title format", function () {
      expect(
        isSafeMinorUpdate(
          { "package-lock.json": lockfile("10.8.2") },
          { "package-lock.json": lockfile("10.9.1") },
        ),
        "to be true",
      );
    });

    it("rejects a major update even when another dependency has a minor update", function () {
      const baseLockfile = lockfile("10.8.2");
      const headLockfile = lockfile("10.9.1");
      baseLockfile.packages["node_modules/mocha"] = {
        version: "11.0.0",
        name: "mocha",
      };
      headLockfile.packages["node_modules/mocha"] = {
        version: "12.0.0",
        name: "mocha",
      };

      expect(
        isSafeMinorUpdate(
          { "package-lock.json": baseLockfile },
          { "package-lock.json": headLockfile },
        ),
        "to be false",
      );
    });

    it("rejects a major update hidden by swapping duplicate package versions", function () {
      const baseLockfile = lockfile("10.8.2");
      const headLockfile = lockfile("10.9.1");
      baseLockfile.packages["node_modules/mocha"] = {
        version: "11.0.0",
        name: "mocha",
      };
      baseLockfile.packages["node_modules/eslint/node_modules/mocha"] = {
        version: "12.0.0",
        name: "mocha",
      };
      headLockfile.packages["node_modules/mocha"] = {
        version: "12.0.0",
        name: "mocha",
      };
      headLockfile.packages["node_modules/eslint/node_modules/mocha"] = {
        version: "11.1.0",
        name: "mocha",
      };

      expect(
        isSafeMinorUpdate(
          { "package-lock.json": baseLockfile },
          { "package-lock.json": headLockfile },
        ),
        "to be false",
      );
    });

    it("rejects patch-only updates", function () {
      expect(
        isSafeMinorUpdate(
          { "package-lock.json": lockfile("10.8.1") },
          { "package-lock.json": lockfile("10.8.2") },
        ),
        "to be false",
      );
    });

    it("rejects removed packages", function () {
      const baseLockfile = lockfile("10.8.2");
      const headLockfile = lockfile("10.9.1");
      baseLockfile.packages["node_modules/mocha"] = {
        version: "11.0.0",
        name: "mocha",
      };

      expect(
        isSafeMinorUpdate(
          { "package-lock.json": baseLockfile },
          { "package-lock.json": headLockfile },
        ),
        "to be false",
      );
    });

    it("rejects missing or added lockfiles", function () {
      expect(
        isSafeMinorUpdate({}, { "package-lock.json": lockfile("10.9.1") }),
        "to be false",
      );
      expect(
        isSafeMinorUpdate(
          { "package-lock.json": lockfile("10.8.2") },
          { "npm-shrinkwrap.json": lockfile("10.9.1") },
        ),
        "to be false",
      );
    });
  });
});
