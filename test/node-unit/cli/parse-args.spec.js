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

  it("canonicalizes long aliases in equals form", function () {
    const result = parseMochaArgs(
      ["--reporter-options=a=b", "--timeouts=200"],
      defaults,
    );

    expect(result, "to satisfy", {
      "reporter-option": ["a=b"],
      timeout: "200",
    });
    expect(result, "not to have property", "reporter-options");
    expect(result, "not to have property", "timeouts");
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

  it("does not split glob array options on commas", function () {
    expect(
      parseMochaArgs(
        [
          "--spec",
          "{dirA,dirB}/**/*.spec.js",
          "--ignore",
          "fixtures/{one,two}.js",
        ],
        defaults,
      ),
      "to satisfy",
      {
        spec: ["{dirA,dirB}/**/*.spec.js"],
        ignore: ["fixtures/{one,two}.js"],
      },
    );
  });

  it("replaces default array options before merging user config arrays", function () {
    expect(
      parseMochaArgs(
        [],
        defaults,
        { extension: ["ts"] },
        { extension: ["tsx"] },
      ),
      "to satisfy",
      {
        extension: ["ts", "tsx"],
      },
    );
  });

  it("canonicalizes aliases from config objects", function () {
    const result = parseMochaArgs([], defaults, {
      R: "json",
      r: ["./setup.js"],
      timeouts: "200",
    });

    expect(result, "to satisfy", {
      reporter: "json",
      require: ["./setup.js"],
      timeout: "200",
    });
    expect(result, "not to have property", "R");
    expect(result, "not to have property", "r");
    expect(result, "not to have property", "timeouts");
  });

  it("gives parsed args precedence over config objects", function () {
    expect(
      parseMochaArgs(["--require", "./cli.js", "--timeout", "100"], defaults, {
        require: ["./config.js"],
        timeout: "200",
      }),
      "to satisfy",
      {
        require: ["./cli.js"],
        timeout: "100",
      },
    );
  });

  it("preserves boolean negation including long alias negation", function () {
    expect(
      parseMochaArgs(
        [
          "--color",
          "--no-color",
          "--no-colors",
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

  it("coerces known boolean options in equals form", function () {
    expect(
      parseMochaArgs(["--color=false", "--parallel=true"], defaults),
      "to satisfy",
      {
        color: false,
        parallel: true,
      },
    );
  });

  it("coerces repeated number options to the last numeric value", function () {
    expect(
      parseMochaArgs(["--jobs", "2", "-j", "4", "--retries=3"], defaults),
      "to satisfy",
      {
        jobs: 4,
        retries: 3,
      },
    );
  });

  it("preserves unknown option negation", function () {
    expect(parseMochaArgs(["--no-foo"], defaults), "to satisfy", {
      foo: false,
    });
  });

  it("keeps unknown options accepted in equals form", function () {
    expect(parseMochaArgs(["--foo=bar"], defaults), "to satisfy", {
      _: [],
      foo: "bar",
    });
  });

  it("treats separated unknown option values as positionals", function () {
    expect(
      parseMochaArgs(["--foo", "bar", "-x", "baz"], defaults),
      "to satisfy",
      {
        _: ["bar", "baz"],
        foo: true,
        x: true,
      },
    );
  });

  it("treats the option terminator as the start of positionals", function () {
    expect(
      parseMochaArgs(["--", "--not-an-option", "test.js"], defaults),
      "to satisfy",
      {
        _: ["--not-an-option", "test.js"],
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

  it("uses the last value for repeated directly-passed Node and V8 flags", function () {
    expect(
      parseMochaArgs(["--conditions=dev", "--conditions=test"], defaults),
      "to satisfy",
      {
        conditions: "test",
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
