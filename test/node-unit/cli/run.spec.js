"use strict";

const { builder } = require("../../../lib/cli/run.mjs");
const { types } = require("../../../lib/cli/run-option-metadata.mjs");

describe("command", function () {
  describe("run", function () {
    describe("builder", function () {
      const IGNORED_OPTIONS = new Set(["help", "version"]);
      const options = builder(require("yargs")()).getOptions();
      ["number", "string", "boolean", "array"].forEach((type) => {
        describe(`${type} type`, function () {
          Array.from(new Set(options[type])).forEach((option) => {
            if (!IGNORED_OPTIONS.has(option)) {
              it(`should include option ${option}`, function () {
                expect(types[type], "to contain", option);
              });
            }
          });
        });
      });
    });

    it("is available as an ESM command module", async function () {
      const runModule = await import("../../../lib/cli/run.mjs");

      expect(runModule, "to satisfy", {
        command: ["$0 [spec..]", "inspect"],
        describe: "Run tests with Mocha",
        builder: expect.it("to be a function"),
        handler: expect.it("to be a function"),
      });
    });
  });
});
