const obj: unknown = { foo: "bar" };
enum Foo {
  Bar = "bar",
}

describe("esm written in esm", () => {
  it("should work", () => {
    expect(obj, "to equal", { foo: Foo.Bar });
  });
});

export const foo = "bar";
