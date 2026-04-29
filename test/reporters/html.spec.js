"use strict";

var fs = require("node:fs");
var path = require("node:path");

describe("HTML reporter", function () {
  function fixture(file) {
    return fs.readFileSync(path.join(__dirname, "../..", file), "utf8");
  }

  it("should label pending tests as skipped on hover", function () {
    var css = fixture("mocha.css");

    expect(css, "to contain", "#mocha .test.pending:hover h2::after");
    expect(css, "to contain", 'content: "(skipped)"');
    expect(css, "not to contain", 'content: "(pending)"');
  });

  it("should add replay link and code toggle for pending tests", function () {
    var source = fixture("lib/reporters/html.js");
    var pendingHandlerStart = source.indexOf("runner.on(EVENT_TEST_PENDING");
    var pendingHandlerEnd = source.indexOf(
      "updateStats();",
      pendingHandlerStart,
    );

    expect(pendingHandlerStart, "not to be", -1);
    expect(pendingHandlerEnd, "not to be", -1);

    var pendingHandler = source.slice(pendingHandlerStart, pendingHandlerEnd);

    expect(pendingHandler, "to contain", 'class="test pass pending"');
    expect(pendingHandler, "to contain", "self.testURL(test)");
    expect(pendingHandler, "to contain", "self.addCodeToggle(el, test.body)");
  });
});
