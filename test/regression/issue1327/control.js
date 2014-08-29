var assert = require("assert"),
    fs = require("fs");

describe("GitHub issue #1327: expected behavior of case.js", function() {
    it("should have run 3 tests", function() {
        var results = JSON.parse(fs.readFileSync(
            "test-outputs/issue1327/case-out.json"));
        results.stats.tests.should.equal(3);
    });
});
