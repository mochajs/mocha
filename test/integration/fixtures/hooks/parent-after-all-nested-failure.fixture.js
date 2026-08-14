"use strict";

describe("outer suite", function () {
  after(function () {
    throw new Error("outer cleanup failed");
  });

  describe("inner suite", function () {
    it("fails for the real reason", function () {
      throw new Error("inner test failed");
    });
  });
});
