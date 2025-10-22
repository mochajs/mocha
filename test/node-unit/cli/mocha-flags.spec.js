"use strict";

const {
  types,
  expectedTypeForFlag,
} = require("../../../lib/cli/run-option-metadata");

describe("mocha-flags", function () {
  describe("expectedTypeForFlag()", function () {
    Object.entries(types).forEach(([dataType, flags]) => {
      flags.forEach((flag) => {
        it(`returns expected ${flag}'s type as ${dataType}`, function () {
          expect(expectedTypeForFlag(flag), "to equal", dataType);
        });
      });
    });

    it("returns undefined for node flags", function () {
      expect(expectedTypeForFlag("--throw-deprecation"), "to equal", undefined);
      expect(expectedTypeForFlag("throw-deprecation"), "to equal", undefined);
    });

    it("returns undefined for unsupported flags", function () {
      expect(expectedTypeForFlag("--foo"), "to equal", undefined);
    });
  });
});
