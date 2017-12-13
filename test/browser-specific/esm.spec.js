'use strict';

it('should register a global if it did not fail', function () {
  expect(window.MOCHA_IS_OK).to.be.ok();
});
