"use strict";

const sinon = require("sinon");

// sinon fakes queueMicrotask along with the usual timers. If Mocha ever grabs the
// global at call time instead of holding on to the real one, the nested suite's
// setup hooks get queued on the fake clock and the run never finishes.
describe("fake timers installed in a before hook", function () {
  let clock;
  before(function () {
    clock = sinon.useFakeTimers();
  });
  after(function () {
    clock.restore();
  });
  beforeEach(function () {});

  describe("nested", function () {
    before(function () {});
    beforeEach(function () {});

    it("still runs", function () {});
  });
});
