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

    it('should set _cleanReferencesAfterRun to true', function() {
      expect(new Mocha()._cleanReferencesAfterRun, 'to be', true);
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

  describe('#cleanReferencesAfterRun()', function() {
    it('should set the _cleanReferencesAfterRun attribute', function() {
      var mocha = new Mocha(opts);
      mocha.cleanReferencesAfterRun();
      expect(mocha._cleanReferencesAfterRun, 'to be', true);
    });

    it('should set the _cleanReferencesAfterRun attribute to false', function() {
      var mocha = new Mocha(opts);
      mocha.cleanReferencesAfterRun(false);
      expect(mocha._cleanReferencesAfterRun, 'to be', false);
    });

    it('should be chainable', function() {
      var mocha = new Mocha(opts);
      expect(mocha.cleanReferencesAfterRun(), 'to be', mocha);
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

  describe('#dispose()', function() {
    it('should dispose the root suite', function() {
      var mocha = new Mocha(opts);
      var disposeStub = sandbox.stub(mocha.suite, 'dispose');
      mocha.dispose();
      expect(disposeStub, 'was called once');
    });

    it('should dispose previous test runner', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      var disposeStub = sandbox.stub(Mocha.Runner.prototype, 'dispose');
      mocha.run();
      runStub.callArg(0);
      mocha.dispose();
      expect(disposeStub, 'was called once');
    });

    it('should unload the files', function() {
      var mocha = new Mocha(opts);
      var unloadFilesStub = sandbox.stub(mocha, 'unloadFiles');
      mocha.dispose();
      expect(unloadFilesStub, 'was called once');
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

    it('should throw if a run is in progress', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      mocha.run();
      expect(
        function() {
          mocha.run();
        },
        'to throw',
        {
          message:
            'Mocha instance is currently running tests, cannot start a next test run until this one is done',
          code: 'ERR_MOCHA_INSTANCE_ALREADY_RUNNING',
          instance: mocha
        }
      );
      expect(runStub, 'was called once');
    });

    it('should throw the instance is already disposed', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      mocha.dispose();
      expect(
        function() {
          mocha.run();
        },
        'to throw',
        {
          message:
            'Mocha instance is already disposed, cannot start a new test run. Please create a new mocha instance. Be sure to set disable `cleanReferencesAfterRun` when you want to reuse the same mocha instance for multiple test runs.',
          code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED',
          cleanReferencesAfterRun: true,
          instance: mocha
        }
      );
      expect(runStub, 'was called times', 0);
    });

    it('should throw if a run for a second time', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      mocha.run();
      runStub.callArg(0);
      expect(
        function() {
          mocha.run();
        },
        'to throw',
        {
          message:
            'Mocha instance is already disposed, cannot start a new test run. Please create a new mocha instance. Be sure to set disable `cleanReferencesAfterRun` when you want to reuse the same mocha instance for multiple test runs.',
          code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED',
          instance: mocha
        }
      );
      expect(runStub, 'was called once');
    });

    it('should allow multiple runs if `cleanReferencesAfterRun` is disabled', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      mocha.cleanReferencesAfterRun(false);
      mocha.run();
      runStub.callArg(0);
      mocha.run();
      runStub.callArg(0);
      expect(runStub, 'called times', 2);
    });

    it('should reset between runs', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      var resetStub = sandbox.stub(Mocha.Suite.prototype, 'reset');
      mocha.cleanReferencesAfterRun(false);
      mocha.run();
      runStub.callArg(0);
      mocha.run();
      expect(resetStub, 'was called once');
    });

    it('should dispose the previous runner when the next run starts', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      var disposeStub = sandbox.stub(Mocha.Runner.prototype, 'dispose');
      mocha.cleanReferencesAfterRun(false);
      mocha.run();
      runStub.callArg(0);
      expect(disposeStub, 'was not called');
      mocha.run();
      expect(disposeStub, 'was called once');
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

  describe('#unloadFiles()', function() {
    it('should reset referencesCleaned and allow for next run', function() {
      var mocha = new Mocha(opts);
      var runStub = sandbox.stub(Mocha.Runner.prototype, 'run');
      mocha.run();
      runStub.callArg(0);
      mocha.unloadFiles();
      expect(function() {
        mocha.run();
      }, 'not to throw');
    });

    it('should not be allowed when the current instance is already disposed', function() {
      var mocha = new Mocha(opts);
      mocha.dispose();
      expect(
        function() {
          mocha.unloadFiles();
        },
        'to throw',
        'Mocha instance is already disposed, it cannot be used again.'
      );
    });
  });
});
