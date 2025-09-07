import assert from "node:assert";

describe("my suite", () => {
  // mutable global ref
  let callCount = 0;

  // reset global ref before each test
  beforeEach(() => {
    callCount = 0;
  });

  it("should mutate call count asynchronously (broken but passes)", (/* done */) => {
    setTimeout(() => {
      callCount += 1;
      /* done() */
    }, 100);
  });

  it("should read call count asynchronously (correct but fails)", async () => {
    await new Promise((resolve) => setTimeout(resolve, 120));
    assert.equal(callCount, 0);
  });
});