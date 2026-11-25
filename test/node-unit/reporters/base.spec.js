import { getColorSupport } from "../../../lib/reporters/base.js";

describe("Base reporter color support", function () {
  it("should unwrap ESM default-export color support metadata", function () {
    const support = { stdout: { level: 1 } };

    expect(getColorSupport({ default: support }), "to be", support);
    expect(getColorSupport(support), "to be", support);
  });
});
