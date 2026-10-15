"use strict";

const Mocha = require("../../../lib/mocha.cjs");
const { Suite } = Mocha;

describe("exports interface", function () {
  it("assigns file to nested suites and their hooks", function () {
    const mocha = new Mocha({ ui: "exports" });
    const file = "/tmp/array.exports.js";

    mocha.suite.emit(
      Suite.constants.EVENT_FILE_REQUIRE,
      {
        Array: {
          before: function () {},
          after: function () {},
          "#indexOf()": {
            beforeEach: function () {},
            afterEach: function () {},
            "should return -1 when the value is not present": function () {},
          },
        },
      },
      file,
    );

    const arraySuite = mocha.suite.suites[0];
    const nestedSuite = arraySuite.suites[0];

    expect(arraySuite.file, "to be", file);
    expect(nestedSuite.file, "to be", file);
    expect(arraySuite.getHooks("beforeAll")[0].file, "to be", file);
    expect(arraySuite.getHooks("afterAll")[0].file, "to be", file);
    expect(nestedSuite.getHooks("beforeEach")[0].file, "to be", file);
    expect(nestedSuite.getHooks("afterEach")[0].file, "to be", file);
    expect(nestedSuite.tests[0].file, "to be", file);
  });

  it("keeps each file on its own suites and leaves the shared root unset", function () {
    const mocha = new Mocha({ ui: "exports" });

    mocha.suite.emit(
      Suite.constants.EVENT_FILE_REQUIRE,
      { One: {} },
      "/tmp/one.js",
    );
    mocha.suite.emit(
      Suite.constants.EVENT_FILE_REQUIRE,
      { Two: {} },
      "/tmp/two.js",
    );

    expect(mocha.suite.file, "to be undefined");
    expect(mocha.suite.suites[0].file, "to be", "/tmp/one.js");
    expect(mocha.suite.suites[1].file, "to be", "/tmp/two.js");
  });
});
