const value: number = 1;

it("should run a TypeScript spec loaded via tsx", function () {
  if (value !== 1) {
    throw new Error("unexpected value");
  }
});
