"use strict";

var assert = require("node:assert");
var run = require("./helpers").runMochaJSON;
var args = [];

describe("this.timeout()", function () {
  it("is respected by sync and async suites", function (done) {
    run("timeout.fixture.js", args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.pending, 0);
      assert.strictEqual(res.stats.passes, 0);
      assert.strictEqual(res.stats.failures, 2);
      assert.strictEqual(res.code, 2);
      done();
    });
  });

  it("should allow overriding if disabled per-test", function (done) {
    run("timeout-override.fixture.js", args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.failures, 1);
      done();
    });
  });
});

describe("describe.timeout()", function () {
  it("should fail due to suite-level timeout lower than elapsed time of inner test", function (done) {
    run("timeout-chained-call.fixture.js", args, function (err, res) {
      if (err) {
        done(err);
        return;
      }

      assert.ok(res.failures[0].err.message.match(/Timeout of 50ms exceeded/));
      assert.strictEqual(res.code, 1);
      done();
    });
  });
});
