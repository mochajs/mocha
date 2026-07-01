import {
  unparseMochaArgs,
  unparseNodeFlags,
} from "../../../lib/cli/unparse-args.js";

describe("unparse-args", function () {
  describe("unparseNodeFlags()", function () {
    it("unparses Node and V8 flags using equals for values", function () {
      expect(
        unparseNodeFlags({
          "trace-warnings": true,
          "max-old-space-size": "4096",
          inspect: "0.0.0.0:9229",
        }),
        "to equal",
        [
          "--trace-warnings",
          "--max-old-space-size=4096",
          "--inspect=0.0.0.0:9229",
        ],
      );
    });

    it("omits false and nullish Node and V8 flag values", function () {
      expect(
        unparseNodeFlags({
          "trace-warnings": false,
          conditions: undefined,
          "zero-fill-buffers": null,
        }),
        "to equal",
        [],
      );
    });
  });

  describe("unparseMochaArgs()", function () {
    it("unparses positionals, booleans, scalars, and repeated arrays", function () {
      expect(
        unparseMochaArgs({
          _: ["test/a.spec.js", "test/b.spec.js"],
          require: ["tsx", "./setup.js"],
          reporter: "json",
          timeout: "0",
          color: false,
          bail: true,
        }),
        "to equal",
        [
          "test/a.spec.js",
          "test/b.spec.js",
          "--require",
          "tsx",
          "--require",
          "./setup.js",
          "--reporter",
          "json",
          "--timeout",
          "0",
          "--no-color",
          "--bail",
        ],
      );
    });

    it("emits positionals first regardless of object insertion order", function () {
      expect(
        unparseMochaArgs({
          reporter: "json",
          _: ["test/a.spec.js"],
        }),
        "to equal",
        ["test/a.spec.js", "--reporter", "json"],
      );
    });

    it("omits absent positionals", function () {
      expect(
        unparseMochaArgs({
          _: undefined,
          reporter: "json",
        }),
        "to equal",
        ["--reporter", "json"],
      );
    });

    it("unparses reporter-option object values in dotted form", function () {
      expect(
        unparseMochaArgs({
          "reporter-option": {
            foo: "bar",
            baz: true,
          },
        }),
        "to equal",
        ["--reporter-option.foo=bar", "--reporter-option.baz"],
      );
    });
  });
});
