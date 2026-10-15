it("leaks a global", function () {
  globalThis.leakedVar = 123;
});
