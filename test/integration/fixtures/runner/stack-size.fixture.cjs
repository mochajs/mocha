"use strict";

// No hooks anywhere on purpose. My first idea for #3009 was to skip the turn
// for hook groups that are empty, and files shaped like this then died partway
// through: the stack overflowed and nothing got reported and and it still exited 0.

describe("many suites", function () {
  for (let i = 0; i < 2000; i++) {
    describe(`suite ${i}`, function () {
      it(`test ${i}`, function () {});
    });
  }
});

describe("many tests", function () {
  for (let i = 0; i < 5000; i++) {
    it(`test ${i}`, function () {});
  }
});
