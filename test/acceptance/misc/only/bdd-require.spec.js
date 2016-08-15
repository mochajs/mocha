/*jshint node: true */

var mocha = require('../../../../lib/mocha');

var beforeEach = mocha.beforeEach;
var it = mocha.it;
var describe = mocha.describe;

describe('it.only via require("mocha")', function() {
  beforeEach(function() {
    this.didRunBeforeEach = true;
  });
  describe("nested within a describe/context", function() {
    it.only('should run all enclosing beforeEach hooks', function() {
      require('assert').equal(this.didRunBeforeEach, true);
    });
  });
});
