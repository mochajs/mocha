import assert from "node:assert";
import { describe, it } from "../../index.js";

describe('using imported "describe"', function () {
  it('using imported "it"', function (done) {
    assert.ok(true);
    done();
  });
});
