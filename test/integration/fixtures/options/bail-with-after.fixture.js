'use strict';

describe('suite1', function () {
  it('should only display this error', function () {
    throw new Error('this should be displayed');
  });

  after(function () {
    throw new Error('this hook should not be displayed');
  });
});
