import helpers from "../helpers.js";
var invokeMocha = helpers.invokeMocha;
var escapeRegExp = helpers.escapeRegExp;
import { interfaces } from "../../../lib/mocha.js";

describe("--list-interfaces", function () {
  it("should dump a list of all interfaces with descriptions", function (done) {
    var expected = Object.keys(interfaces)
      .filter(function (name) {
        return /^[a-z]/.test(name);
      })
      .map(function (name) {
        return {
          name: escapeRegExp(name),
          description: escapeRegExp(interfaces[name].description),
        };
      });

    invokeMocha(["--list-interfaces"], function (err, result) {
      if (err) {
        return done(err);
      }

      expect(result.code, "to be", 0);
      expected.forEach(function (ui) {
        expect(
          result.output,
          "to match",
          new RegExp(ui.name + "\\s*-\\s*" + ui.description),
        );
      });
      done();
    });
  });
});
