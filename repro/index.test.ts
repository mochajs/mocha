import * as assert from "node:assert";
import env from "@zazuko/env";
import { describe, it } from "mocha";

describe("using tsx", () => {
  it("should load module correctly", () => {
    assert.equal(env.ns.schema.Person.value, "http://schema.org/Person");
  });
});
