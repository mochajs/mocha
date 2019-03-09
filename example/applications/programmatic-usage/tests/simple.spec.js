const { equal } = require("assert");
const index = require('../src/index');

describe('my suite', function() {

  it('pass', function() {
    // pass
  });
  it('#index', function() {
      equal(index(), "programmatic example");
  });
});
