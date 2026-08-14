"use strict";

describe("issue-5184 delayed failure", function () {
  it("fails after a delay", async function () {
    await new Promise((resolve) => setTimeout(resolve, 150));
    throw new Error("delayed failure");
  });
});
