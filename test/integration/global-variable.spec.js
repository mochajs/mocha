"use strict";

const mochaPackageJson = require("../../package.json");
const { runMochaAsync, resolveFixturePath, DEFAULT_FIXTURE } = require("./helpers");

describe('global "mocha" object', function () {
  it("exposes the runner name and version", function () {
    expect(globalThis.mocha, "to be an object");
    expect(globalThis.mocha.name, "to equal", mochaPackageJson.name);
    expect(globalThis.mocha.version, "to equal", mochaPackageJson.version);
  });

  it("is writable and configurable so other code can overwrite it", function () {
    const original = globalThis.mocha;
    globalThis.mocha = { instance: true };
    expect(globalThis.mocha, "to equal", { instance: true });
    globalThis.mocha = original;
  });

  it("logs via debug instead of throwing when globalThis.mocha is already non-configurable", async function () {
    const preloadPath = resolveFixturePath("global-variable-occupied");
    const result = await runMochaAsync(DEFAULT_FIXTURE, [], {
      stdio: "pipe",
      env: {
        ...process.env,
        DEBUG: "mocha:context",
        NODE_OPTIONS: `--require ${preloadPath}`,
      },
    });
    expect(result.code, "to be", 0);
    expect(result.output, "to contain", "unable to define globalThis.mocha");
  });
});
