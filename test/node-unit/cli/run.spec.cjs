"use strict";

const { types } = require("../../../lib/cli/run-option-metadata.cjs");

describe("command", function () {
  describe("run", function () {
    describe("builder", function () {
      const IGNORED_OPTIONS = new Set(["help", "version"]);

      ["number", "string", "boolean", "array"].forEach((type) => {
        it(`should include ${type} options in metadata`, async function () {
          const { builder } = await import("../../../lib/cli/run.js");
          const options = builder(require("yargs")()).getOptions();

          Array.from(new Set(options[type])).forEach((option) => {
            if (!IGNORED_OPTIONS.has(option)) {
              expect(types[type], "to contain", option);
            }
          });
        });
      });
    });

    it("is available as an ESM command module", async function () {
      const runModule = await import("../../../lib/cli/run.js");

      expect(runModule, "to satisfy", {
        command: ["$0 [spec..]", "inspect"],
        describe: "Run tests with Mocha",
        builder: expect.it("to be a function"),
        handler: expect.it("to be a function"),
      });
    });
  });
});
