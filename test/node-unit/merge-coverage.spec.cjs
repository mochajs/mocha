"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const script = path.join(__dirname, "..", "..", "scripts", "merge-coverage.js");

const reports = {
  "a.info": [
    "TN:",
    "SF:lib/a.js",
    "FN:5,foo",
    "FNF:1",
    "FNH:1",
    "FNDA:1,foo",
    "DA:5,1",
    "DA:6,0",
    "LF:2",
    "LH:1",
    "BRF:0",
    "BRH:0",
    "end_of_record",
  ].join("\n"),
  "b.info": [
    "TN:",
    "SF:lib\\a.js",
    "FN:5,foo$2",
    "FNF:1",
    "FNH:1",
    "FNDA:2,foo$2",
    "DA:5,2",
    "DA:6,0",
    "LF:2",
    "LH:1",
    "BRF:0",
    "BRH:0",
    "end_of_record",
  ].join("\n"),
};

describe("merge-coverage", function () {
  this.timeout(10000);

  let tmpDir;

  const merge = (inputDir) => {
    const output = path.join(tmpDir, "merged.info");
    const result = spawnSync(process.execPath, [script, inputDir, output], {
      encoding: "utf8",
    });
    return { ...result, output };
  };

  beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-merge-coverage-"));
  });

  afterEach(function () {
    fs.rmSync(tmpDir, { force: true, recursive: true });
  });

  it("should combine reports of the same file from every job", function () {
    for (const [name, contents] of Object.entries(reports)) {
      const dir = path.join(tmpDir, `coverage-${path.parse(name).name}`);
      fs.mkdirSync(dir);
      fs.writeFileSync(path.join(dir, name), contents);
    }

    const { output, status } = merge(tmpDir);

    expect(status, "to be", 0);
    expect(fs.readFileSync(output, "utf8").trim().split("\n"), "to equal", [
      "TN:",
      "SF:lib/a.js",
      "FN:5,foo",
      "FNF:1",
      "FNH:1",
      "FNDA:3,foo",
      "DA:5,3",
      "DA:6,0",
      "LF:2",
      "LH:1",
      "BRF:0",
      "BRH:0",
      "end_of_record",
    ]);
  });

  it("should fail when no reports were collected", function () {
    const { output, status, stderr } = merge(tmpDir);

    expect(status, "to be", 1);
    expect(stderr, "to contain", "No coverage reports found");
    expect(fs.existsSync(output), "to be false");
  });
});
