'use strict';

describe('throws non-Error in `before` hook', function () {
  describe('throws null', function () {
    before(function () {
      throw null;
    });
    it('test 1', function () {
      // Should be reported as failed due to before hook failure
    });
  });

  describe('throws undefined', function () {
    before(function () {
      throw undefined;
    });
    it('test 2', function () {
      // Should be reported as failed due to before hook failure
    });
  });

  describe('throws string', function () {
    before(function () {
      throw 'string error';
    });
    it('test 3', function () {
      // Should be reported as failed due to before hook failure
    });
  });

  describe('throws number', function () {
    before(function () {
      throw 42;
    });
    it('test 4', function () {
      // Should be reported as failed due to before hook failure
    });
  });
});
