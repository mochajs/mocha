const obj = { foo: "bar" };

describe("esm written in esm with top-level-await", () => {
  it("should work", () => {
    expect(obj, "to equal", { foo: "bar" });
  });
});

await undefined;

export const foo = "bar";
