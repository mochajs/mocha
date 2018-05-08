'use strict';

var mocha = require('../../lib/mocha');
var Test = mocha.Test;

describe('Test', function() {
  describe('.clone()', function() {
    beforeEach(function() {
      this._test = new Test('To be cloned', function() {});
      this._test._timeout = 3043;
      this._test._slow = 101;
      this._test._enableTimeouts = true;
      this._test._retries = 3;
      this._test._currentRetry = 1;
      this._test._allowedGlobals = ['foo'];
      this._test.parent = 'foo';
      this._test.file = 'bar';
    });

    it('should copy the title', function() {
      expect(this._test.clone().title, 'to be', 'To be cloned');
    });

    it('should copy the timeout value', function() {
      expect(this._test.clone().timeout(), 'to be', 3043);
    });

    it('should copy the slow value', function() {
      expect(this._test.clone().slow(), 'to be', 101);
    });

    it('should copy the enableTimeouts value', function() {
      expect(this._test.clone().enableTimeouts(), 'to be', true);
    });

    it('should copy the retries value', function() {
      expect(this._test.clone().retries(), 'to be', 3);
    });

    it('should copy the currentRetry value', function() {
      expect(this._test.clone().currentRetry(), 'to be', 1);
    });

    it('should copy the globals value', function() {
      expect(this._test.clone().globals(), 'not to be empty');
    });

    it('should copy the parent value', function() {
      expect(this._test.clone().parent, 'to be', 'foo');
    });

    it('should copy the file value', function() {
      expect(this._test.clone().file, 'to be', 'bar');
    });
  });

  describe('.isPending()', function() {
    beforeEach(function() {
      this._test = new Test('Is it skipped', function() {});
    });

    it('should not be pending by default', function() {
      expect(this._test.isPending(), 'not to be', true);
    });

    it('should be pending when marked as such', function() {
      this._test.pending = true;
      expect(this._test.isPending(), 'to be', true);
    });

    it('should be pending when its parent is pending', function() {
      this._test.parent = {
        isPending: function() {
          return true;
        }
      };
      expect(this._test.isPending(), 'to be', true);
    });
  });
});
