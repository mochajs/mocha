"use strict";

const { isSafeMinorUpdate } = require("../../../scripts/check-pr-approval.cjs");

const lockfile = (version) => ({
  lockfileVersion: 3,
  packages: {
    "": {},
    "node_modules/eslint": { version, name: "eslint" },
  },
});

describe("PR approval check", function () {
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

    it("rejects patch-only updates", function () {
      expect(
        isSafeMinorUpdate(
          { "package-lock.json": lockfile("10.8.1") },
          { "package-lock.json": lockfile("10.8.2") },
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
