import { posix as path } from "node:path";
import helpers from "../helpers.js";
var runMochaJSON = helpers.runMochaJSON;

describe("--async-only", function () {
  var args = [];

  before(function () {
    args = ["--async-only"];
  });

  it("should fail synchronous specs", function (done) {
    var fixture = path.join("options", "async-only-sync");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed");
      done();
    });
  });

  it("should allow asynchronous specs", function (done) {
    var fixture = path.join("options", "async-only-async");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed");
      done();
    });
  });
});
