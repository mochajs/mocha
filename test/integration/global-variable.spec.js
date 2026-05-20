"use strict";

const mochaPackageJson = require("../../package.json");

describe('global "mochaVar" object', function () {
  it("exposes the runner name and version", function () {
    expect(globalThis.mochaVar, "to be an object");
    expect(globalThis.mochaVar.name, "to equal", mochaPackageJson.name);
    expect(globalThis.mochaVar.version, "to equal", mochaPackageJson.version);
  });

  it("returns a fresh object on each access (read-only getter)", function () {
    const a = globalThis.mochaVar;
    const b = globalThis.mochaVar;
    expect(a, "not to be", b);
    expect(a, "to equal", b);
  });
});
