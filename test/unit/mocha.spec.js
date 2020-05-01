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
      sandbox.stub(Mocha.prototype, 'global').returnsThis();
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
      it('should pass "options.global" to #global()', function() {
        // eslint-disable-next-line no-new
        new Mocha({global: ['singular']});
        expect(Mocha.prototype.global, 'to have a call satisfying', [
          ['singular']
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

    it('should set the allowUncaught option to false', function() {
      var mocha = new Mocha(opts);
      mocha.allowUncaught(false);
      expect(mocha.options, 'to have property', 'allowUncaught', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.allowUncaught(), 'to be', mocha);
    });
  });

  describe('#asyncOnly()', function() {
    it('should set the asyncOnly option to true', function() {
      var mocha = new Mocha(opts);
      mocha.asyncOnly();
      expect(mocha.options, 'to have property', 'asyncOnly', true);
    });

    it('should set the asyncOnly option to false', function() {
      var mocha = new Mocha(opts);
      mocha.asyncOnly(false);
      expect(mocha.options, 'to have property', 'asyncOnly', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.asyncOnly(), 'to be', mocha);
    });
  });

  describe('#bail()', function() {
    it('should set the suite._bail to true if there is no arguments', function() {
      var mocha = new Mocha(opts);
      mocha.bail();
      expect(mocha.suite._bail, 'to be', true);
    });

    it('should set the suite._bail to false', function() {
      var mocha = new Mocha(opts);
      mocha.bail(false);
      expect(mocha.suite._bail, 'to be', false);
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

    it('should set the checkLeaks option to false', function() {
      var mocha = new Mocha(opts);
      mocha.checkLeaks(false);
      expect(mocha.options, 'to have property', 'checkLeaks', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.checkLeaks(), 'to be', mocha);
    });
  });

  describe('#color()', function() {
    it('should set the color option to true', function() {
      var mocha = new Mocha(opts);
      mocha.color();
      expect(mocha.options, 'to have property', 'color', true);
    });

    it('should set the color option to false', function() {
      var mocha = new Mocha(opts);
      mocha.color(false);
      expect(mocha.options, 'to have property', 'color', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.color(), 'to be', mocha);
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

  describe('#diff()', function() {
    it('should set the diff option to true', function() {
      var mocha = new Mocha(opts);
      mocha.diff();
      expect(mocha.options, 'to have property', 'diff', true);
    });

    it('should set the diff option to false', function() {
      var mocha = new Mocha(opts);
      mocha.diff(false);
      expect(mocha.options, 'to have property', 'diff', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.diff(), 'to be', mocha);
    });
  });

  describe('#forbidOnly()', function() {
    it('should set the forbidOnly option to true', function() {
      var mocha = new Mocha(opts);
      mocha.forbidOnly();
      expect(mocha.options, 'to have property', 'forbidOnly', true);
    });

    it('should set the forbidOnly option to false', function() {
      var mocha = new Mocha(opts);
      mocha.forbidOnly(false);
      expect(mocha.options, 'to have property', 'forbidOnly', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.forbidOnly(), 'to be', mocha);
    });
  });

  describe('#forbidPending()', function() {
    it('should set the forbidPending option to true', function() {
      var mocha = new Mocha(opts);
      mocha.forbidPending();
      expect(mocha.options, 'to have property', 'forbidPending', true);
    });

    it('should set the forbidPending option to false', function() {
      var mocha = new Mocha(opts);
      mocha.forbidPending(false);
      expect(mocha.options, 'to have property', 'forbidPending', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.forbidPending(), 'to be', mocha);
    });
  });

  describe('#fullTrace()', function() {
    it('should set the fullTrace option to true', function() {
      var mocha = new Mocha(opts);
      mocha.fullTrace();
      expect(mocha.options, 'to have property', 'fullTrace', true);
    });

    it('should set the fullTrace option to false', function() {
      var mocha = new Mocha(opts);
      mocha.fullTrace(false);
      expect(mocha.options, 'to have property', 'fullTrace', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.fullTrace(), 'to be', mocha);
    });
  });

  describe('#global()', function() {
    it('should be an empty array initially', function() {
      var mocha = new Mocha();
      expect(mocha.options.global, 'to be empty');
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.global(), 'to be', mocha);
    });

    describe('when argument is invalid', function() {
      it('should not modify the whitelist when given empty string', function() {
        var mocha = new Mocha(opts);
        mocha.global('');
        expect(mocha.options.global, 'to be empty');
      });

      it('should not modify the whitelist when given empty array', function() {
        var mocha = new Mocha(opts);
        mocha.global([]);
        expect(mocha.options.global, 'to be empty');
      });
    });

    describe('when argument is valid', function() {
      var elem = 'foo';
      var elem2 = 'bar';
      var elem3 = 'baz';

      it('should add string to the whitelist', function() {
        var mocha = new Mocha(opts);
        mocha.global(elem);
        expect(mocha.options.global, 'to contain', elem);
        expect(mocha.options.global, 'to have length', 1);
      });

      it('should add contents of string array to the whitelist', function() {
        var mocha = new Mocha(opts);
        var elems = [elem, elem2];
        mocha.global(elems);
        expect(mocha.options.global, 'to contain', elem, elem2);
        expect(mocha.options.global, 'to have length', elems.length);
      });

      it('should not have duplicates', function() {
        var mocha = new Mocha({global: [elem, elem2]});
        var elems = [elem, elem2, elem3];
        mocha.global(elems);
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

  describe('#inlineDiffs()', function() {
    it('should set the inlineDiffs option to true', function() {
      var mocha = new Mocha(opts);
      mocha.inlineDiffs();
      expect(mocha.options, 'to have property', 'inlineDiffs', true);
    });

    it('should set the inlineDiffs option to false', function() {
      var mocha = new Mocha(opts);
      mocha.inlineDiffs(false);
      expect(mocha.options, 'to have property', 'inlineDiffs', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.inlineDiffs(), 'to be', mocha);
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

    it('should keep reporterOption on options', function() {
      var mocha = new Mocha({
        reporter: 'spec',
        reporterOption: {
          foo: 'bar'
        }
      });
      expect(mocha.options.reporterOption, 'to have property', 'foo', 'bar');
      // To support the legacy property name that can be used by reporters
      expect(mocha.options.reporterOptions, 'to have property', 'foo', 'bar');
    });

    it('should support legacy reporterOptions', function() {
      var mocha = new Mocha({
        reporter: 'spec',
        reporterOptions: {
          foo: 'bar'
        }
      });
      expect(mocha.options.reporterOption, 'to have property', 'foo', 'bar');
      // To support the legacy property name that can be used by reporters
      expect(mocha.options.reporterOptions, 'to have property', 'foo', 'bar');
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

    it('should catch the `start` event if no tests are provided', function(done) {
      var mocha = new Mocha(opts);
      mocha.run().on('start', done);
    });

    it('should catch the `end` event if no tests are provided', function(done) {
      var mocha = new Mocha(opts);
      mocha.run().on('end', done);
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
});
