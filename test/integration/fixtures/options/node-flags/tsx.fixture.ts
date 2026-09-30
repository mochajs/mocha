// `enum` is not erasable syntax, so Node's built-in type stripping rejects it.
// This spec only runs when tsx is actually loaded.
enum Answer {
  Yes = 1,
}

it("should run a TypeScript spec loaded via tsx", function () {
  if (Answer.Yes !== 1) {
    throw new Error("unexpected value");
  }
});
