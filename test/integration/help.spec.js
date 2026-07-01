import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { sync as rimrafSync } from "rimraf";
import { invokeMocha } from "./helpers.cjs";

function expectSuccessfulOutput(args, matcher, done) {
  invokeMocha(
    args,
    function (err, result) {
      if (err) {
        return done(err);
      }
      expect(result, "to have succeeded");
      expect(result.output, "to match", matcher);
      done();
    },
    { stdio: "pipe" },
  );
}

describe("help", function () {
  it("prints usage, commands and common options", function (done) {
    invokeMocha(
      ["--help"],
      function (err, result) {
        if (err) {
          return done(err);
        }
        expect(result, "to have succeeded");
        expect(result.output, "to contain", "Usage: mocha [spec..]");
        expect(result.output, "to contain", "mocha init <path>");
        expect(result.output, "to contain", "--reporter");
        expect(result.output, "to contain", "--timeout");
        done();
      },
      { stdio: "pipe" },
    );
  });

  it("prints usage for -h", function (done) {
    expectSuccessfulOutput(["-h"], /Usage: mocha \[spec\.\.\]/, done);
  });

  it("prints help for init --help without writing files", function (done) {
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-init-help-"));

    invokeMocha(
      ["init", tmpdir, "--help"],
      function (err, result) {
        const files = fs.readdirSync(tmpdir);
        rimrafSync(tmpdir);
        if (err) {
          return done(err);
        }
        expect(result, "to have succeeded");
        expect(result.output, "to contain", "Usage: mocha [spec..]");
        expect(files, "to be empty");
        done();
      },
      { stdio: "pipe" },
    );
  });
});

describe("version", function () {
  it("prints version for --version", function (done) {
    expectSuccessfulOutput(["--version"], /^\d+\.\d+\.\d+/, done);
  });

  it("prints version for -V", function (done) {
    expectSuccessfulOutput(["-V"], /^\d+\.\d+\.\d+/, done);
  });

  it("prints version without loading required modules", function (done) {
    expectSuccessfulOutput(
      ["--version", "--require", "definitely-missing-module"],
      /^\d+\.\d+\.\d+/,
      done,
    );
  });
});
