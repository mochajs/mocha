"use strict";

// The original #3009 case. Run it with --unhandled-rejections=strict. In the
// default mode the old behavior only printed a warning and the tests still
// passed so the test using this fixture wouldnt have caught anything.

describe("a promise rejected in a before hook", function () {
  let promise;
  before(function () {
    promise = Promise.reject(new Error("rejected in before"));
  });

  it("can be handled in the first test", function () {
    return promise.catch(function () {});
  });
});

describe("a promise rejected in an outer beforeEach hook", function () {
  let promise;
  beforeEach(function () {
    promise = Promise.reject(new Error("rejected in outer beforeEach"));
  });

  describe("nested", function () {
    it("can be handled in the nested test", function () {
      return promise.catch(function () {});
    });
  });
});
