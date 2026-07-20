"use strict";

const pkg = require("../../package.json");

describe("package.json entry point", function () {
  // without "main" or "exports", importing mocha from an ES module emits
  // DEP0151; see https://github.com/mochajs/mocha/issues/6147
  it('should define "main" or "exports"', function () {
    expect(pkg.main || pkg.exports, "to be defined");
  });
});
