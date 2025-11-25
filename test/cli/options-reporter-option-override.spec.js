"use strict";

const { loadOptions } = require("../../lib/cli/options");
const { writeFileSync, unlinkSync, existsSync } = require("node:fs");
const { join } = require("node:path");

describe("Reporter Options Override", function () {
  const configPath = join(__dirname, ".mocharc.yml");
  const originalConfig = `reporter: xunit
reporter-options:
  - 'output=./test-reports/xunit.xml'`;

  beforeEach(function () {
    // Create a test config file
    writeFileSync(configPath, originalConfig);
  });

  afterEach(function () {
    // Clean up test config file
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }
  });

  it("should use config file reporter-options when no CLI option provided", function () {
    // Change directory to where the config file is
    const originalCwd = process.cwd();
    process.chdir(__dirname);

    try {
      const options = loadOptions([]);
      // When no CLI option is provided, it should use the config file value
      expect(options["reporter-option"], "to equal", [
        "output=./test-reports/xunit.xml",
      ]);
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("should override config file with CLI reporter-options", function () {
    const options = loadOptions([
      "--reporter-options",
      "output=./test-reports/cli.xml",
    ]);
    expect(options["reporter-option"], "to equal", [
      "output=./test-reports/cli.xml",
    ]);
  });

  it("should override config file with CLI reporter-options using = syntax", function () {
    const options = loadOptions([
      "--reporter-options=output=./test-reports/equal.xml",
    ]);
    expect(options["reporter-option"], "to equal", [
      "output=./test-reports/equal.xml",
    ]);
  });

  it("should use the last CLI reporter-option when multiple are provided", function () {
    const options = loadOptions([
      "--reporter-options",
      "first.xml",
      "--reporter-options",
      "second.xml",
    ]);
    expect(options["reporter-option"], "to equal", ["second.xml"]);
  });

  it("should work with reporter-option alias", function () {
    const options = loadOptions([
      "--reporter-option",
      "output=./test-reports/single.xml",
    ]);
    expect(options["reporter-option"], "to equal", [
      "output=./test-reports/single.xml",
    ]);
  });
});
