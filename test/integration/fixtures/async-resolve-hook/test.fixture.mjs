import { value } from "virtual:greetings";

describe("async resolve+load hook", function () {
  it("imports from a virtual specifier resolved by the hook", function () {
    expect(value, "to equal", "greetings");
  });
});
