'use strict';

// test titles containing regex-conflicting characters

// leading $
describe('$.jQuery', function () {
  // parens
  describe('.on()', function () {
    it('should set an event', function () {
      assert(true);
    });
  });

  describe('.off()', function () {
    it('should remove an event', function () {

    });
  });
});

// another generic describe block to verify it is absent
// when grepping on $.jQuery
describe('@Array', function () {
  it('.pop()', function () {
    assert(true);
  });
  it('.push()', function () {
    assert(true);
  });
  it('.length', function () {
    assert(true);
  });
});
