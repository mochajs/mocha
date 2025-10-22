const obj: unknown = { foo: "bar" };
enum Foo {
  Bar = "bar",
}

describe("esm written in esm with top-level-await", () => {
  it("should work", () => {
    expect(obj, "to equal", { foo: Foo.Bar });
  });
});

await undefined;

export const foo = "bar";
