"use strict";

const {
  generateOrderSeed,
  parseOrder,
  randomizeOrder,
} = require("../../lib/order.js");
const Mocha = require("../../lib/mocha.cjs");

describe("order", function () {
  describe("parseOrder()", function () {
    it("should parse 'default'", function () {
      expect(parseOrder("default"), "to equal", {
        mode: "default",
        seed: null,
      });
    });

    it("should parse 'random' without a seed", function () {
      expect(parseOrder("random"), "to equal", { mode: "random", seed: null });
    });

    it("should parse 'random' with a seed", function () {
      expect(parseOrder("random:42"), "to equal", { mode: "random", seed: 42 });
    });

    it("should normalize seeds to unsigned 32-bit integers", function () {
      expect(parseOrder("random:4294967296"), "to equal", {
        mode: "random",
        seed: 0,
      });
    });

    it("should reject unknown values", function () {
      expect(parseOrder("banana"), "to be null");
      expect(parseOrder("random:"), "to be null");
      expect(parseOrder("random:-1"), "to be null");
      expect(parseOrder("random:1.5"), "to be null");
    });
  });

  describe("generateOrderSeed()", function () {
    it("should return an unsigned 32-bit integer", function () {
      const seed = generateOrderSeed();
      expect(Number.isInteger(seed), "to be true");
      expect(seed, "to be within", 0, 4294967295);
    });
  });

  describe("randomizeOrder()", function () {
    function createSuiteTree() {
      return {
        suites: [
          {
            suites: [],
            tests: ["one", "two", "three", "four"],
          },
          {
            suites: [],
            tests: ["five", "six", "seven"],
          },
        ],
        tests: ["eight", "nine", "ten"],
      };
    }

    it("should produce identical order for identical seeds", function () {
      const a = createSuiteTree();
      const b = createSuiteTree();
      randomizeOrder(a, 42);
      randomizeOrder(b, 42);
      expect(a, "to equal", b);
    });

    it("should produce a different order for a different seed", function () {
      const a = createSuiteTree();
      const b = createSuiteTree();
      randomizeOrder(a, 42);
      randomizeOrder(b, 1337);
      expect(a, "not to equal", b);
    });

    it("should keep every suite and test, shuffled within its parent", function () {
      const tree = createSuiteTree();
      randomizeOrder(tree, 42);
      expect(tree.tests.slice().sort(), "to equal", ["eight", "nine", "ten"]);
      expect(tree.suites, "to have length", 2);
      const allNestedTests = tree.suites.flatMap((suite) => suite.tests).sort();
      expect(allNestedTests, "to equal", [
        "five",
        "four",
        "one",
        "seven",
        "six",
        "three",
        "two",
      ]);
    });
  });

  describe("Mocha#order()", function () {
    it("should be chainable", function () {
      const mocha = new Mocha({ reporter: function () {} });
      expect(mocha.order("default"), "to be", mocha);
    });

    it("should store a normalized value", function () {
      const mocha = new Mocha({ reporter: function () {} });
      mocha.order("random:42");
      expect(mocha.options.order, "to be", "random:42");
    });

    it("should fill in a generated seed when none given", function () {
      const mocha = new Mocha({ reporter: function () {} });
      mocha.order("random");
      expect(mocha.options.order, "to match", /^random:\d+$/);
    });

    it("should be settable via constructor options", function () {
      const mocha = new Mocha({
        reporter: function () {},
        order: "random:42",
      });
      expect(mocha.options.order, "to be", "random:42");
    });

    it("should throw on an invalid value", function () {
      const mocha = new Mocha({ reporter: function () {} });
      expect(
        function () {
          mocha.order("banana");
        },
        "to throw",
        {
          code: "ERR_MOCHA_INVALID_ARG_VALUE",
        },
      );
    });
  });
});
