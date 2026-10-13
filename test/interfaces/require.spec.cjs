"use strict";

var assert = require("node:assert");
var mocha = require("../../index");

var after = mocha.after;
var afterEach = mocha.afterEach;
var beforeEach = mocha.beforeEach;
var context = mocha.context;
var describe = mocha.describe;
var it = mocha.it;
var setup = mocha.setup;
var specify = mocha.specify;
var suite = mocha.suite;
var suiteSetup = mocha.suiteSetup;
var suiteTeardown = mocha.suiteTeardown;
var teardown = mocha.teardown;
var test = mocha.test;

assert.strictEqual(global.describe, undefined);
assert.strictEqual(global.it, undefined);
assert.strictEqual(global.suite, undefined);
assert.strictEqual(global.test, undefined);

describe("require interface", function () {
  suite("allows mixing interfaces", function () {
    var suiteLifecycle = [];

    suiteSetup(function () {
      suiteLifecycle.push("suiteSetup");
      this.answer = 40;
    });

    beforeEach(function () {
      this.answer += 1;
    });

    afterEach(function () {
      this.answer = 40;
    });

    test("runs a TDD test", function () {
      expect(this.answer, "to be", 41);
    });

    describe("inside a BDD suite", function () {
      it("runs a BDD test inside a TDD suite", function () {
        expect(this.answer, "to be", 41);
      });
    });

    context("using aliases", function () {
      var aliasLifecycle = [];

      setup(function () {
        aliasLifecycle.push("setup");
      });

      specify("runs alias functions", function () {
        aliasLifecycle.push("specify");
        expect(this.answer, "to be", 41);
      });

      teardown(function () {
        aliasLifecycle.push("teardown");
      });

      after(function () {
        expect(aliasLifecycle, "to equal", ["setup", "specify", "teardown"]);
      });
    });

    suiteTeardown(function () {
      suiteLifecycle.push("suiteTeardown");
    });

    after(function () {
      expect(suiteLifecycle, "to equal", ["suiteSetup", "suiteTeardown"]);
    });
  });
});
