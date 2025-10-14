const obj = { foo: "bar" };

describe("cjs written in esm", () => {
  it("should work", () => {
    expect(obj, "to equal", { foo: "bar" });
  });
});

export const foo = "bar";
