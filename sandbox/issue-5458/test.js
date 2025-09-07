import assert from "node:assert";

describe("my suite", () => {
  /** "Fake" hook explicitly called in wrapper function */
  function myBeforeEach() {
    return { callCount: 0 };
  }

  function wrappedIt(name, fn) {
    it(name, function () {
      const initialState = myBeforeEach();
      return fn(initialState);
    });
  }

  wrappedIt("should mutate call count asynchronously (broken but passes)", ({ callCount }) => {
    setTimeout(() => {
      callCount += 1;
    }, 100);
  });

  wrappedIt("should read call count asynchronously (correct but fails)", async ({ callCount }) => {
    await new Promise((resolve) => setTimeout(resolve, 120));
    assert.equal(callCount, 0);
  });
});