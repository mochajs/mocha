'use strict';

describe('suite1', function () {
  before(function () {
    throw new Error('this hook should be only displayed');
  });

  it('should not display this error', function () {
    throw new Error('this should not be displayed');
  });
});
