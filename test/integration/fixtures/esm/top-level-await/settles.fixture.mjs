const value = await new Promise((resolve) => setTimeout(() => resolve(42), 50));

it("should run after the top-level await settles", () => {
  expect(value, "to be", 42);
});
