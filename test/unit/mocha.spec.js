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
      sandbox.stub(Mocha.prototype, 'useColors').returnsThis();
      sandbox.stub(utils, 'deprecate');
    });

    it('should prefer "color" over "useColors"', function() {
      // eslint-disable-next-line no-new
      new Mocha({useColors: true, color: false});
      expect(Mocha.prototype.useColors, 'to have a call satisfying', [false]);
    });

    it('should assign "useColors" to "color"', function() {
      // eslint-disable-next-line no-new
      new Mocha({useColors: true});
      expect(Mocha.prototype.useColors, 'to have a call satisfying', [true]);
    });

    it('should call utils.deprecate()', function() {
      // eslint-disable-next-line no-new
      new Mocha({useColors: true});
      expect(utils.deprecate, 'was called');
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
    it('should set the ignoreLeaks option to false', function() {
      var mocha = new Mocha(opts);
      mocha.checkLeaks();
      expect(mocha.options, 'to have property', 'ignoreLeaks', false);
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

  describe('#fullTrace()', function() {
    it('should set the fullStackTrace option to true', function() {
      var mocha = new Mocha(opts);
      mocha.fullTrace();
      expect(mocha.options, 'to have property', 'fullStackTrace', true);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.fullTrace(), 'to be', mocha);
    });
  });

  describe('#globals()', function() {
    it('should be an empty array initially', function() {
      var mocha = new Mocha();
      expect(mocha.options.globals, 'to be empty');
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.globals(), 'to be', mocha);
    });

    describe('when argument is invalid', function() {
      it('should not modify the whitelist when given empty string', function() {
        var mocha = new Mocha(opts);
        mocha.globals('');
        expect(mocha.options.globals, 'to be empty');
      });

      it('should not modify the whitelist when given empty array', function() {
        var mocha = new Mocha(opts);
        mocha.globals([]);
        expect(mocha.options.globals, 'to be empty');
      });
    });

    describe('when argument is valid', function() {
      var elem = 'foo';
      var elem2 = 'bar';

      it('should add string to the whitelist', function() {
        var mocha = new Mocha(opts);
        mocha.globals(elem);
        expect(mocha.options.globals, 'to contain', elem);
        expect(mocha.options.globals, 'to have length', 1);
      });

      it('should add contents of string array to the whitelist', function() {
        var mocha = new Mocha(opts);
        var elems = [elem, elem2];
        mocha.globals(elems);
        expect(mocha.options.globals, 'to contain', elem, elem2);
        expect(mocha.options.globals, 'to have length', elems.length);
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

  describe('#ignoreLeaks()', function() {
    it('should set the ignoreLeaks option to true when param equals true', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks(true);
      expect(mocha.options, 'to have property', 'ignoreLeaks', true);
    });

    it('should set the ignoreLeaks option to false when param equals false', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks(false);
      expect(mocha.options, 'to have property', 'ignoreLeaks', false);
    });

    it('should set the ignoreLeaks option to false when the param is undefined', function() {
      var mocha = new Mocha(opts);
      mocha.ignoreLeaks();
      expect(mocha.options, 'to have property', 'ignoreLeaks', false);
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

  describe('#useInlineDiffs()', function() {
    it('should set the useInlineDiffs option to true when param equals true', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs(true);
      expect(mocha.options, 'to have property', 'useInlineDiffs', true);
    });

    it('should set the useInlineDiffs option to false when param equals false', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs(false);
      expect(mocha.options, 'to have property', 'useInlineDiffs', false);
    });

    it('should set the useInlineDiffs option to false when the param is undefined', function() {
      var mocha = new Mocha(opts);
      mocha.useInlineDiffs();
      expect(mocha.options, 'to have property', 'useInlineDiffs', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.useInlineDiffs(), 'to be', mocha);
    });
  });
});
