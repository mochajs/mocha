const { equal } = require("assert");
const index = require('../src/index');

describe('programmatic usage suite', function() {

  it('should pass', function() {
    // pass
  });
  describe('#index', function() {
    it('should return expected string', function() {
        equal(index(), "programmatic example");
    });
  });
});
