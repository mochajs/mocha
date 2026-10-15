var assert = require('assert');

describe('Wrapper suite', function () {
  for(let i=0; i < 400; i++) {
    describe(`suite ${i}`, function () {
      it(`test ${i}`, function () {
        assert.equal(1, 1);
      });
    });
  }
});
