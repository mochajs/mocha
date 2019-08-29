'use strict';

var utils = require('../../lib/utils');
var Mocha = require('../../lib/mocha');
var sinon = require('sinon');

describe('Mocha', function() {
  var opts = {reporter: utils.noop}; // no output
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('constructor', function() {
    beforeEach(function() {
      sandbox.stub(Mocha.prototype, 'timeout').returnsThis();
      sandbox.stub(Mocha.prototype, 'globals').returnsThis();
      sandbox.stub(Mocha.prototype, 'useInlineDiffs').returnsThis();
    });

    describe('when "options.timeout" is `undefined`', function() {
      it('should not attempt to set timeout', function() {
        // eslint-disable-next-line no-new
        new Mocha({timeout: undefined});
        expect(Mocha.prototype.timeout, 'was not called');
      });
    });

    describe('when "options.timeout" is `false`', function() {
      it('should set a timeout of 0', function() {
        // eslint-disable-next-line no-new
        new Mocha({timeout: false});
        expect(Mocha.prototype.timeout, 'to have a call satisfying', [0]).and(
          'was called once'
        );
      });
    });

    describe('when "options.global" is provided', function() {
      it('should pass "options.global" to #globals()', function() {
        // eslint-disable-next-line no-new
        new Mocha({global: ['singular']});
        expect(Mocha.prototype.globals, 'to have a call satisfying', [
          ['singular']
        ]).and('was called once');
      });
    });

    describe('when "options.inlineDiffs" is `undefined`', function() {
      it('should set inlineDiffs to `true`', function() {
        // eslint-disable-next-line no-new
        new Mocha({inlineDiffs: true});
        expect(Mocha.prototype.useInlineDiffs, 'to have a call satisfying', [
          true
        ]).and('was called once');
      });
    });
  });

  describe('#allowUncaught()', function() {
    it('should set the allowUncaught option to true', function() {
      var mocha = new Mocha(opts);
      mocha.allowUncaught();
      expect(mocha.options, 'to have property', 'allowUncaught', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.allowUncaught(), 'to be', mocha);
    });
  });

  describe('#bail()', function() {
    it('should set the suite._bail to true if there is no arguments', function() {
      var mocha = new Mocha(opts);
      mocha.bail();
      expect(mocha.suite._bail, 'to be', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.bail(), 'to be', mocha);
    });
  });

  describe('#checkLeaks()', function() {
    it('should set the checkLeaks option to true', function() {
      var mocha = new Mocha(opts);
      mocha.checkLeaks();
      expect(mocha.options, 'to have property', 'checkLeaks', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.checkLeaks(), 'to be', mocha);
    });
  });

  describe('#delay()', function() {
    it('should set the delay option to true', function() {
      var mocha = new Mocha(opts);
      mocha.delay();
      expect(mocha.options, 'to have property', 'delay', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.delay(), 'to be', mocha);
    });
  });

  describe('#enableTimeouts()', function() {
    it('should set the suite._enableTimeouts to true if no argument', function() {
      var mocha = new Mocha(opts);
      mocha.enableTimeouts();
      expect(mocha.suite._enableTimeouts, 'to be', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.enableTimeouts(), 'to be', mocha);
    });
  });

  describe('#fullTrace()', function() {
    it('should set the fullTrace option to true', function() {
      var mocha = new Mocha(opts);
      mocha.fullTrace();
      expect(mocha.options, 'to have property', 'fullTrace', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.fullTrace(), 'to be', mocha);
    });
  });

  describe('#globals()', function() {
    it('should be an empty array initially', function() {
      var mocha = new Mocha();
      expect(mocha.options.global, 'to be empty');
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.globals(), 'to be', mocha);
    });

    describe('when argument is invalid', function() {
      it('should not modify the whitelist when given empty string', function() {
        var mocha = new Mocha(opts);
        mocha.globals('');
        expect(mocha.options.global, 'to be empty');
      });

      it('should not modify the whitelist when given empty array', function() {
        var mocha = new Mocha(opts);
        mocha.globals([]);
        expect(mocha.options.global, 'to be empty');
      });
    });

    describe('when argument is valid', function() {
      var elem = 'foo';
      var elem2 = 'bar';
      var elem3 = 'baz';

      it('should add string to the whitelist', function() {
        var mocha = new Mocha(opts);
        mocha.globals(elem);
        expect(mocha.options.global, 'to contain', elem);
        expect(mocha.options.global, 'to have length', 1);
      });

      it('should add contents of string array to the whitelist', function() {
        var mocha = new Mocha(opts);
        var elems = [elem, elem2];
        mocha.globals(elems);
        expect(mocha.options.global, 'to contain', elem, elem2);
        expect(mocha.options.global, 'to have length', elems.length);
      });

      it('should not have duplicates', function() {
        var mocha = new Mocha({globals: [elem, elem2]});
        var elems = [elem, elem2, elem3];
        mocha.globals(elems);
        expect(mocha.options.global, 'to contain', elem, elem2, elem3);
        expect(mocha.options.global, 'to have length', elems.length);
      });
    });
  });

  describe('#growl()', function() {
    describe('if capable of notifications', function() {
      it('should set the growl option to true', function() {
        var mocha = new Mocha(opts);
        mocha.isGrowlCapable = function forceEnable() {
          return true;
        };
        mocha.growl();
        expect(mocha.options, 'to have property', 'growl', true);
      });
    });

    describe('if not capable of notifications', function() {
      it('should set the growl option to false', function() {
        var mocha = new Mocha(opts);
        mocha.isGrowlCapable = function forceDisable() {
          return false;
        };
        mocha.growl();
        expect(mocha.options, 'to have property', 'growl', false);
      });
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.growl(), 'to be', mocha);
    });
  });

  describe('#hideDiff()', function() {
    it('should set the diff option to false when param equals true', function() {
      var mocha = new Mocha(opts);
      mocha.hideDiff(true);
      expect(mocha.options, 'to have property', 'diff', false);
    });

    it('should set the diff option to true when param equals false', function() {
      var mocha = new Mocha(opts);
      mocha.hideDiff(false);
      expect(mocha.options, 'to have property', 'diff', true);
    });

    it('should set the diff option to true when the param is undefined', function() {
      var mocha = new Mocha(opts);
      mocha.hideDiff();
      expect(mocha.options, 'to have property', 'diff', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.hideDiff(), 'to be', mocha);
    });
  });

  describe('#ignoreLeaks()', function() {
    it('should set the checkLeaks option to false when param equals true', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks(true);
      expect(mocha.options, 'to have property', 'checkLeaks', false);
    });

    it('should set the checkLeaks option to true when param equals false', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks(false);
      expect(mocha.options, 'to have property', 'checkLeaks', true);
    });

    it('should set the checkLeaks option to true when the param is undefined', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks();
      expect(mocha.options, 'to have property', 'checkLeaks', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.ignoreLeaks(), 'to be', mocha);
    });
  });

  describe('#invert()', function() {
    it('should set the invert option to true', function() {
      var mocha = new Mocha(opts);
      mocha.invert();
      expect(mocha.options, 'to have property', 'invert', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.invert(), 'to be', mocha);
    });
  });

  describe('#noHighlighting()', function() {
    // :NOTE: Browser-only option...
    it('should set the noHighlighting option to true', function() {
      var mocha = new Mocha(opts);
      mocha.noHighlighting();
      expect(mocha.options, 'to have property', 'noHighlighting', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.noHighlighting(), 'to be', mocha);
    });
  });

  describe('#reporter()', function() {
    it('should throw reporter error if an invalid reporter is given', function() {
      var updatedOpts = {reporter: 'invalidReporter', reporterOptions: {}};
      var throwError = function() {
        // eslint-disable-next-line no-new
        new Mocha(updatedOpts);
      };
      expect(throwError, 'to throw', {
        message: "invalid reporter 'invalidReporter'",
        code: 'ERR_MOCHA_INVALID_REPORTER',
        reporter: 'invalidReporter'
      });
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.reporter(), 'to be', mocha);
    });
  });

  describe('#run(fn)', function() {
    it('should execute the callback when complete', function(done) {
      var mocha = new Mocha(opts);
      sandbox.stub(Mocha.Runner.prototype, 'run').callsArg(0);
      mocha.run(done);
    });

    it('should not raise errors if callback was not provided', function() {
      sandbox.stub(Mocha.Runner.prototype, 'run');
      var mocha = new Mocha(opts);
      expect(function() {
        mocha.run();
      }, 'not to throw');
    });

    describe('#reporter("xunit")#run(fn)', function() {
      // :TBD: Why does specifying reporter differentiate this test from preceding one
      it('should not raise errors if callback was not provided', function() {
        var mocha = new Mocha();
        expect(function() {
          try {
            mocha.reporter('xunit').run();
          } catch (e) {
            console.log(e);
            expect.fail(e.message);
          }
        }, 'not to throw');
      });
    });
  });

  describe('#useColors()', function() {
    it('should set the color option to true', function() {
      var mocha = new Mocha(opts);
      mocha.useColors(true);
      expect(mocha.options, 'to have property', 'color', true);
    });

    it('should not create the color property', function() {
      var mocha = new Mocha(opts);
      mocha.useColors();
      expect(mocha.options, 'not to have property', 'color');
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.useColors(), 'to be', mocha);
    });
  });

  describe('#useInlineDiffs()', function() {
    it('should set the inlineDiffs option to true when param equals true', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs(true);
      expect(mocha.options, 'to have property', 'inlineDiffs', true);
    });

    it('should set the inlineDiffs option to false when param equals false', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs(false);
      expect(mocha.options, 'to have property', 'inlineDiffs', false);
    });

    it('should set the inlineDiffs option to false when the param is undefined', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs();
      expect(mocha.options, 'to have property', 'inlineDiffs', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.useInlineDiffs(), 'to be', mocha);
    });
  });
});
