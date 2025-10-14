const obj: unknown = { foo: "bar" };

describe("cts written in esm", () => {
  it("should work", () => {
    expect(obj, "to equal", { foo: "bar" });
  });
});

export const foo = "bar";
