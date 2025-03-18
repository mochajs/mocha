'use strict';
const sinon = require('sinon');
const Mocha = require('../../lib/mocha');
const Hook = Mocha.Hook;
const Runnable = Mocha.Runnable;

describe('Hook', function () {
  let hook;

  beforeEach(function () {
    hook = new Hook('Some hook', function () {});
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('error', function () {
    it('should set the hook._error', function () {
      const expectedError = new Error('Expected error');
      hook.error(expectedError);
      expect(hook._error, 'to be', expectedError);
    });
    it('should get the hook._error when called without arguments', function () {
      const expectedError = new Error('Expected error');
      hook._error = expectedError;
      expect(hook.error(), 'to be', expectedError);
    });
  });

  describe('reset', function () {
    it('should call Runnable.reset', function () {
      const runnableResetStub = sinon.stub(Runnable.prototype, 'reset');
      hook.reset();
      expect(runnableResetStub, 'was called once');
    });

    it('should reset the error state', function () {
      hook.error(new Error('Expected error for test'));
      hook.reset();
      expect(hook.error(), 'to be undefined');
    });
  });
});
