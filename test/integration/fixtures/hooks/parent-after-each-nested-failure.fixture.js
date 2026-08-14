"use strict";

describe("outer suite", function () {
  afterEach(function () {
    throw new Error("outer cleanup failed");
  });

  describe("inner suite", function () {
    beforeEach(function () {
      throw new Error("inner setup failed");
    });

    it("does something", function () {});
  });
});
