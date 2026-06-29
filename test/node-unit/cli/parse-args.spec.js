import { constants } from "../../../lib/error-constants.js";
import { parseMochaArgs } from "../../../lib/cli/parse-args.js";

const defaults = {
  timeout: 1000,
  extension: ["js"],
};

describe("parse-args", function () {
  it("canonicalizes aliases and strips alias keys", function () {
    const result = parseMochaArgs(
      [
        "-R",
        "json",
        "-t",
        "123",
        "-A",
        "-b",
        "-g",
        "foo",
        "-r",
        "./x.js",
        "-O",
        "a=b",
        "test/a.js",
      ],
      defaults,
    );

    expect(result, "to satisfy", {
      _: ["test/a.js"],
      reporter: "json",
      timeout: "123",
      "async-only": true,
      bail: true,
      grep: "foo",
      require: ["./x.js"],
      "reporter-option": ["a=b"],
    });
    ["R", "t", "A", "b", "g", "r", "O"].forEach((alias) => {
      expect(result, "not to have property", alias);
    });
  });

  it("uses the last value for repeated scalar options across aliases", function () {
    expect(
      parseMochaArgs(["--timeout", "100", "-t", "10"], defaults),
      "to satisfy",
      {
        timeout: "10",
      },
    );
  });

  it("splits, deduplicates, and preserves order for repeated array options", function () {
    expect(
      parseMochaArgs(
        [
          "--require",
          "a",
          "--require",
          "a,b",
          "--extension",
          "js,ts",
          "--extension",
          "ts",
        ],
        defaults,
      ),
      "to satisfy",
      {
        require: ["a", "b"],
        extension: ["js", "ts"],
      },
    );
  });

  it("preserves boolean negation including long alias negation", function () {
    expect(
      parseMochaArgs(
        [
          "--color",
          "--no-color",
          "--parallel",
          "--no-parallel",
          "--no-timeouts",
        ],
        defaults,
      ),
      "to satisfy",
      {
        color: false,
        parallel: false,
        timeout: false,
      },
    );
  });

  it("keeps unknown options accepted and parsed", function () {
    expect(parseMochaArgs(["--foo", "bar"], defaults), "to satisfy", {
      _: [],
      foo: "bar",
    });
  });

  it("keeps unknown short options accepted with separated values", function () {
    expect(parseMochaArgs(["-x", "bar"], defaults), "to satisfy", {
      _: [],
      x: "bar",
    });
  });

  it("treats unknown short equals-form options as native grouped shorts", function () {
    expect(parseMochaArgs(["-x=bar"], defaults), "to satisfy", {
      _: [],
      x: true,
      "=": true,
      bail: true,
      a: true,
      require: ["true"],
    });
  });

  it("snapshots current option terminator behavior", function () {
    expect(
      parseMochaArgs(["--", "--not-an-option", "test.js"], defaults),
      "to satisfy",
      {
        _: [],
        "not-an-option": "test.js",
      },
    );
  });

  it("accepts dash-prefixed option values in equals form", function () {
    expect(parseMochaArgs(["--grep=-foo"], defaults), "to satisfy", {
      grep: "-foo",
    });
  });

  it("rejects dash-prefixed option values in separated form", function () {
    expect(
      () => parseMochaArgs(["--grep", "-foo"], defaults),
      "to throw",
      /Not enough arguments following: grep/,
    );
  });

  it("preserves directly-passed Node and V8 flags", function () {
    expect(
      parseMochaArgs(
        ["--trace-warnings", "--max-old-space-size=4096", "--conditions=dev"],
        defaults,
      ),
      "to satisfy",
      {
        "trace-warnings": true,
        "max-old-space-size": "4096",
        conditions: "dev",
      },
    );
  });

  it("uses native short option grouping behavior", function () {
    expect(parseMochaArgs(["-bc"], defaults), "to satisfy", {
      _: [],
      bail: true,
      color: true,
    });
  });

  it("preserves numeric positional argument errors", function () {
    expect(() => parseMochaArgs(["--delay", "123"], defaults), "to throw", {
      message: "Mocha flag '--delay' given invalid option: '123'",
      code: constants.INVALID_ARG_TYPE,
      argument: 123,
      actual: "number",
      expected: "boolean",
    });
  });
});
