'use strict';

var sinon = require('sinon');
var mocha = require('../../lib/mocha');
var Test = mocha.Test;
var Runnable = mocha.Runnable;

describe('Test', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('.clone()', function () {
    beforeEach(function () {
      this._test = new Test('To be cloned', function () {});
      this._test._timeout = 3043;
      this._test._slow = 101;
      this._test._retries = 3;
      this._test._currentRetry = 1;
      this._test._repeats = 3;
      this._test._currentRepeat = 1;
      this._test._allowedGlobals = ['foo'];
      this._test.parent = 'foo';
      this._test.file = 'bar';
    });

    it('should copy the title', function () {
      expect(this._test.clone().title, 'to be', 'To be cloned');
    });

    it('should copy the timeout value', function () {
      expect(this._test.clone().timeout(), 'to be', 3043);
    });

    it('should copy the slow value', function () {
      expect(this._test.clone().slow(), 'to be', 101);
    });

    it('should copy the retries value', function () {
      expect(this._test.clone().retries(), 'to be', 3);
    });

    it('should copy the currentRetry value', function () {
      expect(this._test.clone().currentRetry(), 'to be', 1);
    });

    it('should add/keep the retriedTest value', function () {
      var clone1 = this._test.clone();
      expect(clone1.retriedTest(), 'to be', this._test);
      expect(clone1.clone().retriedTest(), 'to be', this._test);
    });

    it('should copy the repeats value', function () {
      expect(this._test.clone().repeats(), 'to be', 3);
    });

    it('should copy the currentRepeat value', function () {
      expect(this._test.clone().currentRepeat(), 'to be', 1);
    });

    it('should copy the globals value', function () {
      expect(this._test.clone().globals(), 'not to be empty');
    });

    it('should copy the parent value', function () {
      expect(this._test.clone().parent, 'to be', 'foo');
    });

    it('should copy the file value', function () {
      expect(this._test.clone().file, 'to be', 'bar');
    });
  });

  describe('.reset()', function () {
    beforeEach(function () {
      this._test = new Test('Test to be reset', function () {});
    });

    it('should reset the run state', function () {
      this._test.pending = true;
      this._test.reset();
      expect(this._test.pending, 'to be', false);
    });

    it('should call Runnable.reset', function () {
      var runnableResetStub = sinon.stub(Runnable.prototype, 'reset');
      this._test.reset();
      expect(runnableResetStub, 'was called once');
    });
  });

  describe('.isPending()', function () {
    beforeEach(function () {
      this._test = new Test('Is it skipped', function () {});
    });

    it('should not be pending by default', function () {
      expect(this._test.isPending(), 'not to be', true);
    });

    it('should be pending when marked as such', function () {
      this._test.pending = true;
      expect(this._test.isPending(), 'to be', true);
    });

    it('should be pending when its parent is pending', function () {
      this._test.parent = {
        isPending: function () {
          return true;
        }
      };
      expect(this._test.isPending(), 'to be', true);
    });
  });

  describe('.markOnly()', function () {
    afterEach(function () {
      sinon.restore();
    });

    it('should call appendOnlyTest on parent', function () {
      var test = new Test('foo');
      var spy = sinon.spy();
      test.parent = {
        appendOnlyTest: spy
      };
      test.markOnly();

      expect(spy, 'to have a call exhaustively satisfying', [test]).and(
        'was called once'
      );
    });
  });
});
