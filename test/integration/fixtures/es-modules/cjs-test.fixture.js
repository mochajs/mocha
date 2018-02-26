var cjs = require('./cjs-module').cjs;


describe('testing common js require', function () {
  it('should be able to require cjs modules', function () {
    assert(cjs, 'cjs');
  });
});
