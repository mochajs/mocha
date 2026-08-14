"use strict";

describe("issue-5184 unhandled rejection", function () {
  it("passes then rejects", function () {
    setTimeout(() => {
      Promise.reject(new Error("late unhandled rejection"));
    }, 50);
  });
});
