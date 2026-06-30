"use strict";

const {
  getRunOptionDefinitions,
  types,
} = require("../../../lib/cli/run-option-metadata.cjs");

describe("command", function () {
  describe("run", function () {
    describe("option metadata", function () {
      ["number", "string", "boolean", "array"].forEach((type) => {
        describe(`${type} type`, function () {
          getRunOptionDefinitions()
            .filter((option) => option.type === type)
            .forEach((option) => {
              it(`should include option ${option.name}`, function () {
                expect(types[type], "to contain", option.name);
              });
            });
        });
      });
    });
  });
});
