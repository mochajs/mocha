"use strict";

const assert = require("node:assert");

// Little tripwire, same idea as the repro on the issue. If Mocha gives the event
// loop a turn anywhere between the setup hooks and the test, this fires first.
function armTickProbe() {
  const probe = { ticked: false };
  setImmediate(() => {
    probe.ticked = true;
  });
  return probe;
}

describe("a before hook", function () {
  let probe;
  before(function () {
    probe = armTickProbe();
  });

  it("runs in the same turn as the first test", function () {
    assert.strictEqual(probe.ticked, false);
  });
});

describe("an outer beforeEach hook", function () {
  let probe;
  beforeEach(function () {
    probe = armTickProbe();
  });

  describe("nested", function () {
    it("runs in the same turn as the nested test", function () {
      assert.strictEqual(probe.ticked, false);
    });
  });
});

// Arming it in the outermost "before" on purpose. If it were armed in the
// innermost beforeEach this would pass even without the fix because that one
// was already the only setup hook that ran right before its test.
describe("setup hooks at several levels", function () {
  let probe;
  before(function () {
    probe = armTickProbe();
  });
  beforeEach(function () {});

  describe("nested", function () {
    before(function () {});
    beforeEach(function () {});

    it("all run in the same turn as the test", function () {
      assert.strictEqual(probe.ticked, false);
    });
  });
});
