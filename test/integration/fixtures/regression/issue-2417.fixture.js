'use strict';

describe('outer describe', function () {
  describe.only('outer describe.only', function () {
    it.only('inner it.only', function () {
      // should run and exit without error
    });
  });
});
