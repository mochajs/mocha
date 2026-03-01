import { posix as path } from "node:path";
import helpers from "../helpers.js";
var runMochaJSON = helpers.runMochaJSON;

describe("--retries", function () {
  var args = [];

  it("should retry test failures after a certain threshold", function (done) {
    args = ["--retries", "3"];
    var fixture = path.join("options", "retries");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, "to have failed")
        .and("not to have pending tests")
        .and("not to have passed tests")
        .and("to have retried test", "should fail", 3);
      done();
    });
  });
});
