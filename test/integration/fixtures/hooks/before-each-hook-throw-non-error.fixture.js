'use strict';

describe('throws non-Error in `beforeEach` hook', function () {
  describe('throws null', function () {
    beforeEach(function () {
      throw null;
    });
    it('test 1', function () {
      // Should be reported as failed due to beforeEach hook failure
    });
  });

  describe('throws undefined', function () {
    beforeEach(function () {
      throw undefined;
    });
    it('test 2', function () {
      // Should be reported as failed due to beforeEach hook failure
    });
  });

  describe('throws string', function () {
    beforeEach(function () {
      throw 'string error';
    });
    it('test 3', function () {
      // Should be reported as failed due to beforeEach hook failure
    });
  });
});
