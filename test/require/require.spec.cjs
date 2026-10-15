"use strict";

describe("require test", function () {
  it("should require args in order", function () {
    var req = global.required;
    expect(req.indexOf("a.cjs"), "to be", 0);
    expect(req.indexOf("b.coffee"), "to be", 1);
    expect(req.indexOf("c.cjs"), "to be", 2);
    expect(req.indexOf("d.coffee"), "to be", 3);
  });
});
