"use strict";

const assert = require("node:assert");

it("listener-throws", () => {
  const poison = new Proxy(
    {},
    {
      ownKeys() {
        throw new TypeError("poisoned ownKeys");
      },
      getOwnPropertyDescriptor() {
        throw new TypeError("poisoned descriptor");
      },
      get() {
        throw new TypeError("poisoned get");
      },
    },
  );
  throw new assert.AssertionError({
    actual: poison,
    expected: { a: 1 },
    message: "boom",
  });
});
