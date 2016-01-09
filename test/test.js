var mocha = require('../')
  , Context = mocha.Context
  , Test = mocha.Test;

describe('Test', function(){
  describe('.clone()', function(){
    beforeEach(function(){
      this._test = new Test('To be cloned', function () {});
      this._test._timeout = 3043;
      this._test._slow = 101;
      this._test._enableTimeouts = true;
      this._test._retries = 3;
      this._test._currentRetry = 1;
      this._test._allowedGlobals = ['foo'];
      this._test.parent = 'foo';
      this._test.file = 'bar';
    });

    it('should copy the title', function(){
      this._test.clone().title.should.equal('To be cloned');
    });

    it('should copy the timeout value', function(){
      this._test.clone().timeout().should.equal(3043);
    });

    it('should copy the slow value', function(){
      this._test.clone().slow().should.equal(101);
    });

    it('should copy the enableTimeouts value', function(){
      this._test.clone().enableTimeouts().should.be.true;
    });

    it('should copy the retries value', function(){
      this._test.clone().retries().should.equal(3);
    });

    it('should copy the currentRetry value', function(){
      this._test.clone().currentRetry().should.equal(1);
    });

    it('should copy the globals value', function(){
      this._test.clone().globals().should.not.be.empty;
    });

    it('should copy the parent value', function(){
      this._test.clone().parent.should.equal('foo');
    });

    it('should copy the file value', function(){
      this._test.clone().file.should.equal('bar');
    });
  });
});
