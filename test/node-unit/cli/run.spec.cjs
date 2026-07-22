"use strict";

const {
  getRunOptionDefinitions,
  types,
} = require("../../../lib/cli/run-option-metadata.cjs");
const { validateRunOptions } = require("../../../lib/cli/run.cjs");

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

describe("validateRunOptions()", function () {
  it("throws when multiple one-and-done options are provided", function () {
    expect(
      () =>
        validateRunOptions({
          "list-interfaces": true,
          "list-reporters": true,
        }),
      "to throw",
      /Arguments list-interfaces and list-reporters are mutually exclusive/,
    );
  });

  it("does not throw when no one-and-done option is provided", function () {
    expect(() => validateRunOptions({}), "not to throw");
  });

  // providing exactly one one-and-done option is tested via each option's tests
});
