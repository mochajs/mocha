'use strict';

var sinon = require('sinon');
var EventEmitter = require('node:events').EventEmitter;
var Mocha = require('../../lib/mocha');
var utils = require('../../lib/utils');
const errors = require('../../lib/errors');

describe('Mocha', function () {
  /**
   * Options for `Mocha` constructor
   */
  var opts;

  /**
   * Stub `Runner` constructor; returns a stubbed `EventEmitter`
   */
  var Runner;

  /**
   * Stub `Suite` constructor; returns a stubbed `EventEmitter`
   */
  var Suite;

  /**
   * Stub `Suite` instance (root suite in our case)
   */
  var suite;

  /**
   * Stub `Runner` (`EventEmitter`) instance
   */
  var runner;

  /**
   * Stub `Base` reporter constructor
   */
  var Base;

  /**
   * Instance of a hypothetical reporter
   */
  var reporterInstance;

  beforeEach(function () {
    reporterInstance = {};
    opts = {reporter: sinon.stub().returns(reporterInstance)};

    // NOTE: calling `stub(someObject, someFunction)` where `someFunction` has
    // its own static properties WILL NOT blast those static properties!
    Base = sinon.stub(Mocha.reporters, 'Base').returns({});
    sinon.stub(Mocha.reporters, 'base').returns({});
    sinon.stub(Mocha.reporters, 'spec').returns({});

    runner = {
      ...sinon.createStubInstance(EventEmitter),
      runAsync: sinon.stub().resolves(0),
      globals: sinon.stub(),
      grep: sinon.stub(),
      dispose: sinon.stub()
    };
    Runner = sinon.stub(Mocha, 'Runner').returns(runner);
    // the Runner constructor is the main export, and constants is a static prop.
    // we don't need the constants themselves, but the object cannot be undefined
    Runner.constants = {};
    suite = {
      ...sinon.createStubInstance(EventEmitter),
      slow: sinon.stub(),
      timeout: sinon.stub(),
      bail: sinon.stub(),
      dispose: sinon.stub(),
      reset: sinon.stub(),
      beforeAll: sinon.stub(),
      beforeEach: sinon.stub(),
      afterAll: sinon.stub(),
      afterEach: sinon.stub()
    };
    Suite = sinon.stub(Mocha, 'Suite').returns(suite);
    Suite.constants = {};

    sinon.stub(errors, 'warn');
    sinon.stub(utils, 'isString');
    sinon.stub(utils, 'noop');
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('constructor', function () {
    var mocha;

    beforeEach(function () {
      mocha = sinon.createStubInstance(Mocha);
      mocha.timeout.returnsThis();
      mocha.retries.returnsThis();
      sinon.stub(Mocha.prototype, 'timeout').returnsThis();
      sinon.stub(Mocha.prototype, 'global').returnsThis();
      sinon.stub(Mocha.prototype, 'retries').returnsThis();
      sinon.stub(Mocha.prototype, 'rootHooks').returnsThis();
      sinon.stub(Mocha.prototype, 'parallelMode').returnsThis();
      sinon.stub(Mocha.prototype, 'globalSetup').returnsThis();
      sinon.stub(Mocha.prototype, 'globalTeardown').returnsThis();
      sinon.stub(Mocha.prototype, 'enableGlobalSetup').returnsThis();
      sinon.stub(Mocha.prototype, 'enableGlobalTeardown').returnsThis();
    });

    it('should set _cleanReferencesAfterRun to true', function () {
      expect(new Mocha()._cleanReferencesAfterRun, 'to be', true);
    });

    describe('when `timeout` option is `undefined`', function () {
      it('should not attempt to set timeout', function () {
        // eslint-disable-next-line no-new
        new Mocha({timeout: undefined});
        expect(Mocha.prototype.timeout, 'was not called');
      });
    });

    describe('when `timeout` option is `false`', function () {
      it('should attempt to set timeout', function () {
        // eslint-disable-next-line no-new
        new Mocha({timeout: false});
        expect(Mocha.prototype.timeout, 'to have a call satisfying', [0]).and(
          'was called once'
        );
      });
    });

    describe('when `global` option is an `Array`', function () {
      it('should attempt to set globals', function () {
        // eslint-disable-next-line no-new
        new Mocha({global: ['singular']});
        expect(Mocha.prototype.global, 'to have a call satisfying', [
          ['singular']
        ]).and('was called once');
      });
    });

    describe('when `retries` option is present', function () {
      it('should attempt to set retries`', function () {
        // eslint-disable-next-line no-new
        new Mocha({retries: 1});
        expect(Mocha.prototype.retries, 'to have a call satisfying', [1]).and(
          'was called once'
        );
      });
    });

    describe('when `retries` option is not present', function () {
      it('should not attempt to set retries', function () {
        // eslint-disable-next-line no-new
        new Mocha({});
        expect(Mocha.prototype.retries, 'was not called');
      });
    });

    describe('when `rootHooks` option is truthy', function () {
      it('shouid attempt to set root hooks', function () {
        // eslint-disable-next-line no-new
        new Mocha({rootHooks: ['a root hook']});
        expect(Mocha.prototype.rootHooks, 'to have a call satisfying', [
          ['a root hook']
        ]).and('was called once');
      });
    });

    describe('when `parallel` option is true', function () {
      describe('and `jobs` option > 1', function () {
        it('should enable parallel mode', function () {
          // eslint-disable-next-line no-new
          new Mocha({parallel: true, jobs: 2});
          expect(Mocha.prototype.parallelMode, 'to have a call satisfying', [
            true
          ]).and('was called once');
        });
      });

      describe('and `jobs` option <= 1', function () {
        it('should not enable parallel mode', function () {
          // eslint-disable-next-line no-new
          new Mocha({parallel: true, jobs: 1});
          expect(Mocha.prototype.parallelMode, 'was not called');
        });
      });

      describe('when `globalSetup` option is present', function () {
        it('should configure global setup fixtures', function () {
          const globalSetup = [() => {}];
          const mocha = new Mocha({globalSetup});
          expect(mocha.globalSetup, 'to have a call satisfying', [
            globalSetup
          ]).and('was called once');
        });
      });

      describe('when `globalTeardown` option is present', function () {
        it('should configure global teardown fixtures', function () {
          const globalTeardown = [() => {}];
          const mocha = new Mocha({globalTeardown});
          expect(mocha.globalTeardown, 'to have a call satisfying', [
            globalTeardown
          ]).and('was called once');
        });
      });

      describe('when `enableGlobalSetup` option is present', function () {
        it('should toggle global setup fixtures', function () {
          const mocha = new Mocha({enableGlobalSetup: 1});
          expect(mocha.enableGlobalSetup, 'to have a call satisfying', [1]).and(
            'was called once'
          );
        });
      });

      describe('when `enableGlobalTeardown` option is present', function () {
        it('should configure global teardown fixtures', function () {
          const mocha = new Mocha({enableGlobalTeardown: 1});
          expect(mocha.enableGlobalTeardown, 'to have a call satisfying', [
            1
          ]).and('was called once');
        });
      });
    });
  });

  describe('instance method', function () {
    var mocha;

    beforeEach(function () {
      mocha = new Mocha(opts);
    });

    describe('allowUncaught()', function () {
      it('should set the allowUncaught option to true', function () {
        mocha.allowUncaught();
        expect(mocha.options, 'to have property', 'allowUncaught', true);
      });

      it('should set the allowUncaught option to false', function () {
        mocha.allowUncaught(false);
        expect(mocha.options, 'to have property', 'allowUncaught', false);
      });

      it('should be chainable', function () {
        expect(mocha.allowUncaught(), 'to be', mocha);
      });
    });

    describe('asyncOnly()', function () {
      it('should set the asyncOnly option to true', function () {
        mocha.asyncOnly();
        expect(mocha.options, 'to have property', 'asyncOnly', true);
      });

      it('should set the asyncOnly option to false', function () {
        mocha.asyncOnly(false);
        expect(mocha.options, 'to have property', 'asyncOnly', false);
      });

      it('should be chainable', function () {
        expect(mocha.asyncOnly(), 'to be', mocha);
      });
    });

    describe('bail()', function () {
      it('should set the "bail" flag on the root suite', function () {
        mocha.bail();
        expect(suite.bail, 'to have a call satisfying', [true]).and(
          'was called once'
        );
      });

      it('should unset the "bail" flag on the root suite', function () {
        mocha.bail(false);
        expect(suite.bail, 'to have a call satisfying', [false]).and(
          'was called once'
        );
      });

      it('should be chainable', function () {
        expect(mocha.bail(), 'to be', mocha);
      });
    });

    describe('checkLeaks()', function () {
      it('should set the checkLeaks option to true', function () {
        mocha.checkLeaks();
        expect(mocha.options, 'to have property', 'checkLeaks', true);
      });
    });

    describe('cleanReferencesAfterRun()', function () {
      it('should set the _cleanReferencesAfterRun attribute', function () {
        mocha.cleanReferencesAfterRun();
        expect(mocha._cleanReferencesAfterRun, 'to be', true);
      });

      it('should set the _cleanReferencesAfterRun attribute to false', function () {
        mocha.cleanReferencesAfterRun(false);
        expect(mocha._cleanReferencesAfterRun, 'to be', false);
      });

      it('should be chainable', function () {
        expect(mocha.cleanReferencesAfterRun(), 'to be', mocha);
      });
    });

    describe('color()', function () {
      it('should set the color option to true', function () {
        mocha.color();
        expect(mocha.options, 'to have property', 'color', true);
      });

      it('should set the color option to false', function () {
        mocha.color(false);
        expect(mocha.options, 'to have property', 'color', false);
      });

      it('should be chainable', function () {
        expect(mocha.color(), 'to be', mocha);
      });
    });

    describe('delay()', function () {
      it('should set the delay option to true', function () {
        mocha.delay();
        expect(mocha.options, 'to have property', 'delay', true);
      });

      it('should be chainable', function () {
        expect(mocha.delay(), 'to be', mocha);
      });
    });

    describe('diff()', function () {
      it('should set the diff option to true', function () {
        mocha.diff();
        expect(mocha.options, 'to have property', 'diff', true);
      });

      it('should set the diff option to false', function () {
        mocha.diff(false);
        expect(mocha.options, 'to have property', 'diff', false);
      });
    });

    describe('dispose()', function () {
      it('should dispose the root suite', function () {
        mocha.dispose();
        expect(suite.dispose, 'was called once');
      });

      it('should dispose previous test runner', function () {
        mocha._previousRunner = runner;
        mocha.dispose();
        expect(runner.dispose, 'was called once');
      });

      it('should unload the files', function () {
        var unloadFilesStub = sinon.stub(mocha, 'unloadFiles');
        mocha.dispose();
        expect(unloadFilesStub, 'was called once');
      });
    });

    describe('dryRun()', function () {
      it('should set the dryRun option to true', function () {
        mocha.dryRun();
        expect(mocha.options, 'to have property', 'dryRun', true);
      });

      it('should set the dryRun option to false', function () {
        mocha.dryRun(false);
        expect(mocha.options, 'to have property', 'dryRun', false);
      });
    });

    describe('passOnFailingTestSuite()', function() {
      it('should set the passOnFailingTestSuite option to false', function() {
        mocha.passOnFailingTestSuite();
        expect(
          mocha.options,
          'to have property',
          'passOnFailingTestSuite',
          false
        );
      });

      it('should set the passOnFailingTestSuite option to true', function() {
        mocha.passOnFailingTestSuite(true);
        expect(
          mocha.options,
          'to have property',
          'passOnFailingTestSuite',
          true
        );
      });
    });

    describe('failZero()', function () {
      it('should set the failZero option to true', function () {
        mocha.failZero();
        expect(mocha.options, 'to have property', 'failZero', true);
      });

      it('should set the failZero option to false', function () {
        mocha.failZero(false);
        expect(mocha.options, 'to have property', 'failZero', false);
      });
    });

    describe('forbidOnly()', function () {
      it('should set the forbidOnly option to true', function () {
        mocha.forbidOnly();
        expect(mocha.options, 'to have property', 'forbidOnly', true);
      });

      it('should set the forbidOnly option to false', function () {
        mocha.forbidOnly(false);
        expect(mocha.options, 'to have property', 'forbidOnly', false);
      });

      it('should be chainable', function () {
        expect(mocha.forbidOnly(), 'to be', mocha);
      });
    });

    describe('forbidPending()', function () {
      it('should set the forbidPending option to true', function () {
        mocha.forbidPending();
        expect(mocha.options, 'to have property', 'forbidPending', true);
      });

      it('should set the forbidPending option to false', function () {
        mocha.forbidPending(false);
        expect(mocha.options, 'to have property', 'forbidPending', false);
      });

      it('should be chainable', function () {
        expect(mocha.forbidPending(), 'to be', mocha);
      });
    });

    describe('fullTrace()', function () {
      it('should set the fullTrace option to true', function () {
        mocha.fullTrace();
        expect(mocha.options, 'to have property', 'fullTrace', true);
      });

      it('should set the fullTrace option to false', function () {
        mocha.fullTrace(false);
        expect(mocha.options, 'to have property', 'fullTrace', false);
      });

      it('should be chainable', function () {
        expect(mocha.fullTrace(), 'to be', mocha);
      });
    });

    describe('global()', function () {
      it('should be an empty array initially', function () {
        expect(mocha.options.global, 'to be empty');
      });

      it('should be chainable', function () {
        expect(mocha.global(), 'to be', mocha);
      });

      describe('when argument is invalid', function () {
        it('should not modify the whitelist when given empty string', function () {
          mocha.global('');
          expect(mocha.options.global, 'to be empty');
        });

        it('should not modify the whitelist when given empty array', function () {
          mocha.global([]);
          expect(mocha.options.global, 'to be empty');
        });
      });

      describe('when argument is valid', function () {
        var elem = 'foo';
        var elem2 = 'bar';
        var elem3 = 'baz';

        it('should add string to the whitelist', function () {
          mocha.global(elem);
          expect(mocha.options.global, 'to contain', elem);
          expect(mocha.options.global, 'to have length', 1);
        });

        it('should add contents of string array to the whitelist', function () {
          var elems = [elem, elem2];
          mocha.global(elems);
          expect(mocha.options.global, 'to contain', elem, elem2);
          expect(mocha.options.global, 'to have length', elems.length);
        });

        it('should not have duplicates', function () {
          var mocha = new Mocha({global: [elem, elem2]});
          var elems = [elem, elem2, elem3];
          mocha.global(elems);
          expect(mocha.options.global, 'to contain', elem, elem2, elem3);
          expect(mocha.options.global, 'to have length', elems.length);
        });
      });
    });

    describe('inlineDiffs()', function () {
      it('should set the inlineDiffs option to true', function () {
        mocha.inlineDiffs();
        expect(mocha.options, 'to have property', 'inlineDiffs', true);
      });

      it('should set the inlineDiffs option to false', function () {
        mocha.inlineDiffs(false);
        expect(mocha.options, 'to have property', 'inlineDiffs', false);
      });

      it('should be chainable', function () {
        expect(mocha.inlineDiffs(), 'to be', mocha);
      });
    });

    describe('invert()', function () {
      it('should set the invert option to true', function () {
        mocha.invert();
        expect(mocha.options, 'to have property', 'invert', true);
      });

      it('should be chainable', function () {
        expect(mocha.invert(), 'to be', mocha);
      });
    });

    describe('noHighlighting()', function () {
      // :NOTE: Browser-only option...
      it('should set the noHighlighting option to true', function () {
        mocha.noHighlighting();
        expect(mocha.options, 'to have property', 'noHighlighting', true);
      });

      it('should be chainable', function () {
        expect(mocha.noHighlighting(), 'to be', mocha);
      });
    });

    describe('reporter()', function () {
      it('should be chainable', function () {
        expect(mocha.reporter(), 'to be', mocha);
      });

      it('should keep reporterOption on options', function () {
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

      it('should support legacy reporterOptions', function () {
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

    describe('run()', function () {
      let globalFixtureContext;

      beforeEach(function () {
        globalFixtureContext = {};
        sinon.stub(mocha, 'runGlobalSetup').returns(globalFixtureContext);
        sinon.stub(mocha, 'runGlobalTeardown').returns(globalFixtureContext);
      });

      describe('when files have been added to the Mocha instance', function () {
        beforeEach(function () {
          sinon.stub(mocha, 'loadFiles');
          mocha.addFile('some-file.js');
        });

        describe('when Mocha is set to eagerly load files', function () {
          it('should eagerly load files', function (done) {
            mocha.run(function () {
              expect(mocha.loadFiles, 'was called once');
              done();
            });
          });
        });

        describe('when Mocha is set to lazily load files', function () {
          beforeEach(function () {
            mocha.lazyLoadFiles(true);
          });

          it('should not eagerly load files', function (done) {
            mocha.run(function () {
              expect(mocha.loadFiles, 'was not called');
              done();
            });
          });
        });
      });

      describe('Runner initialization', function () {
        it('should instantiate a Runner', function (done) {
          mocha.run(function () {
            expect(Runner, 'to have a call satisfying', {
              calledWithNew: true,
              args: [
                mocha.suite,
                {
                  delay: mocha.options.delay,
                  cleanReferencesAfterRun: mocha.options.cleanReferencesAfterRun
                }
              ]
            }).and('was called once');
            done();
          });
        });

        describe('when "grep" option is present', function () {
          beforeEach(function () {
            mocha.options.grep = /foo/;
            mocha.options.invert = false;
          });

          it('should configure "grep"', function (done) {
            mocha.run(function () {
              expect(runner.grep, 'to have a call satisfying', [
                mocha.options.grep,
                mocha.options.invert
              ]).and('was called once');
              done();
            });
          });
        });

        describe('when "global" option is present', function () {
          beforeEach(function () {
            mocha.options.global = ['foo', 'bar'];
          });

          it('should configure global vars', function (done) {
            mocha.run(function () {
              expect(runner.globals, 'to have a call satisfying', [
                mocha.options.global
              ]).and('was called once');
              done();
            });
          });
        });
      });

      describe('Base reporter initialization', function () {
        beforeEach(function () {
          mocha.options.inlineDiffs = 'some value';
          mocha.options.diff = false;
        });

        describe('when "color" options is set', function () {
          beforeEach(function () {
            mocha.options.color = 'truthy';
          });

          it('should configure the Base reporter', function (done) {
            mocha.run(function () {
              expect(Base, 'to satisfy', {
                inlineDiffs: 'some value',
                hideDiff: true,
                useColors: 'truthy'
              });
              done();
            });
          });
        });

        it('should configure the Base reporter', function (done) {
          mocha.run(function () {
            expect(Base, 'to satisfy', {
              inlineDiffs: 'some value',
              hideDiff: true
            });
            done();
          });
        });
      });

      it('should instantiate a reporter', function (done) {
        mocha.run(function () {
          expect(opts.reporter, 'to have a call satisfying', {
            calledWithNew: true,
            args: [runner, mocha.options]
          }).and('was called once');
          done();
        });
      });

      // TODO: figure out how to stub the stats collector
      it('should initialize the stats collector');

      describe('when a reporter instance has a "done" method', function () {
        beforeEach(function () {
          reporterInstance.done = sinon.stub().callsArgAsync(1);
        });

        it('should call the reporter "done" method', function (done) {
          mocha.run(function () {
            expect(reporterInstance.done, 'was called once');
            done();
          });
        });
      });

      it('should execute the callback when complete', function (done) {
        mocha.run(done);
      });

      describe('when a run is in progress', function () {
        it('should throw', function (done) {
          mocha.run(done); // this is async!
          expect(
            function () {
              mocha.run();
            },
            'to throw',
            {
              code: 'ERR_MOCHA_INSTANCE_ALREADY_RUNNING',
              instance: mocha
            }
          );
        });

        it('should not call `Runner#runAsync`', function (done) {
          mocha.run(done); // this is async!
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            // it'll be 0 or 1, depending on timing.
            expect(runner.runAsync.callCount, 'to be less than', 2);
          }
        });
      });

      describe('when the `Mocha` instance is already disposed', function () {
        beforeEach(function () {
          mocha.dispose();
        });

        it('should throw', function () {
          expect(
            function () {
              mocha.run();
            },
            'to throw',
            {
              code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED',
              cleanReferencesAfterRun: true,
              instance: mocha
            }
          );
        });

        it('should not call `Runner#runAsync`', function () {
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            expect(runner.runAsync, 'was not called');
          }
        });
      });

      describe('when a run has finished and is called again', function () {
        beforeEach(function (done) {
          mocha.run(function () {
            runner.runAsync.reset();
            done();
          });
        });

        it('should throw', function () {
          expect(
            function () {
              mocha.run();
            },
            'to throw',
            {
              code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED',
              instance: mocha
            }
          );
        });

        it('should not call `Runner#runAsync()`', function () {
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            expect(runner.runAsync, 'was not called');
          }
        });
      });

      describe('when Mocha configured for multiple runs and multiple runs are attempted', function () {
        beforeEach(function () {
          mocha.cleanReferencesAfterRun(false);
        });

        it('should not throw', function (done) {
          mocha.run(function () {
            mocha.run(done);
          });
        });

        it('should call `Runner#runAsync` for each call', function (done) {
          mocha.run(function () {
            mocha.run(function () {
              expect(runner.runAsync, 'was called twice');
              done();
            });
          });
        });

        it('should reset the root Suite between runs', function (done) {
          mocha.run(function () {
            mocha.run(function () {
              expect(suite.reset, 'was called once');
              done();
            });
          });
        });

        it('should dispose the previous runner', function (done) {
          mocha.run(function () {
            mocha.run(function () {
              expect(runner.dispose, 'was called once');
              done();
            });
          });
        });
      });

      describe('when global setup fixtures enabled', function () {
        beforeEach(function () {
          mocha.options.enableGlobalSetup = true;
        });
        describe('when global setup fixtures not present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalSetupFixtures').returns(false);
          });

          it('should not run global setup fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalSetup, 'was not called');
              done();
            });
          });
        });

        describe('when global setup fixtures are present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalSetupFixtures').returns(true);
          });

          it('should run global setup fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalSetup, 'to have a call satisfying', {
                args: [expect.it('to be', runner)]
              }).and('was called once');
              done();
            });
          });
        });
      });

      describe('when global setup fixtures disabled', function () {
        beforeEach(function () {
          mocha.options.enableGlobalSetup = false;
        });
        describe('when global setup fixtures not present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalSetupFixtures').returns(false);
          });

          it('should not run global setup fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalSetup, 'was not called');
              done();
            });
          });
        });

        describe('when global setup fixtures are present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalSetupFixtures').returns(true);
          });

          it('should not run global setup fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalSetup, 'was not called');
              done();
            });
          });
        });
      });

      describe('when global teardown fixtures enabled', function () {
        beforeEach(function () {
          mocha.options.enableGlobalTeardown = true;
        });
        describe('when global teardown fixtures not present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalTeardownFixtures').returns(false);
          });

          it('should not run global teardown fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalTeardown, 'was not called');
              done();
            });
          });
        });

        describe('when global teardown fixtures are present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalTeardownFixtures').returns(true);
          });

          it('should run global teardown fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalTeardown, 'to have a call satisfying', {
                args: [expect.it('to be', runner), {context: {}}]
              }).and('was called once');
              done();
            });
          });

          describe('when global setup fixtures are present and enabled', function () {
            beforeEach(function () {
              sinon.stub(mocha, 'hasGlobalSetupFixtures').returns(true);
              mocha.options.enableGlobalSetup = true;
            });

            it('should use the same context as returned by `runGlobalSetup`', function (done) {
              mocha.run(() => {
                expect(mocha.runGlobalTeardown, 'to have a call satisfying', {
                  args: [
                    expect.it('to be', runner),
                    {context: globalFixtureContext}
                  ]
                }).and('was called once');
                done();
              });
            });
          });
        });
      });

      describe('when global teardown fixtures disabled', function () {
        beforeEach(function () {
          mocha.options.enableGlobalTeardown = false;
        });
        describe('when global teardown fixtures not present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalTeardownFixtures').returns(false);
          });

          it('should not run global teardown fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalTeardown, 'was not called');
              done();
            });
          });
        });

        describe('when global teardown fixtures are present', function () {
          beforeEach(function () {
            sinon.stub(mocha, 'hasGlobalTeardownFixtures').returns(true);
          });

          it('should not run global teardown fixtures', function (done) {
            mocha.run(() => {
              expect(mocha.runGlobalTeardown, 'was not called');
              done();
            });
          });
        });
      });
    });

    describe('parallelMode()', function () {
      describe('when `Mocha` is running in a browser', function () {
        beforeEach(function () {
          sinon.stub(utils, 'isBrowser').returns(true);
        });

        it('should throw', function () {
          expect(
            function () {
              mocha.parallelMode();
            },
            'to throw',
            {code: 'ERR_MOCHA_UNSUPPORTED'}
          );
        });
      });
    });

    describe('unloadFile()', function () {
      describe('when run in a browser', function () {
        beforeEach(function () {
          sinon.stub(utils, 'isBrowser').returns(true);
        });

        it('should throw', function () {
          expect(() => Mocha.unloadFile('guy-fieri.js'), 'to throw', {
            code: 'ERR_MOCHA_UNSUPPORTED'
          });
        });
      });
    });

    describe('_runGlobalFixtures()', function () {
      it('should execute multiple fixtures in order', async function () {
        const fixtures = [
          sinon.stub().resolves('foo'),
          sinon.stub().returns('bar')
        ];
        const context = await mocha._runGlobalFixtures(fixtures);

        return expect(fixtures, 'to satisfy', [
          expect.it('to have a call satisfying', {
            thisValue: context,
            returnValue: expect.it('to be fulfilled with', 'foo')
          }),
          expect.it('to have a call satisfying', {
            thisValue: context,
            returnValue: 'bar'
          })
        ]);
      });
    });

    describe('runGlobalSetup()', function () {
      let context;

      beforeEach(function () {
        sinon.stub(mocha, '_runGlobalFixtures').resolvesArg(1);
        context = {};
      });

      describe('when fixture(s) are present', function () {
        beforeEach(function () {
          mocha.options.globalSetup = [sinon.spy()];
        });

        it('should attempt run the fixtures', async function () {
          await mocha.runGlobalSetup(context);
          expect(mocha._runGlobalFixtures, 'to have a call satisfying', [
            mocha.options.globalSetup,
            context
          ]);
        });
      });

      describe('when a fixture is not present', function () {
        it('should not attempt to run fixtures', async function () {
          await mocha.runGlobalSetup();
          expect(mocha._runGlobalFixtures, 'was not called');
        });
      });
    });

    describe('runGlobalTeardown()', function () {
      let context;

      beforeEach(function () {
        sinon.stub(mocha, '_runGlobalFixtures').resolvesArg(1);
        context = {};
      });

      describe('when fixture(s) are present', function () {
        beforeEach(function () {
          mocha.options.globalTeardown = [sinon.spy()];
        });

        it('should attempt to run the fixtures', async function () {
          await mocha.runGlobalTeardown();
          expect(mocha._runGlobalFixtures, 'to have a call satisfying', [
            mocha.options.globalTeardown,
            context
          ]);
        });
      });

      describe('when a fixture is not present', function () {
        it('not attempt to run the fixtures', async function () {
          await mocha.runGlobalTeardown();
          expect(mocha._runGlobalFixtures, 'was not called');
        });
      });
    });

    describe('hasGlobalSetupFixtures()', function () {
      describe('when one or more global setup fixtures are present', function () {
        it('should return `true`', function () {
          mocha.options.globalSetup = [() => {}];
          expect(mocha.hasGlobalSetupFixtures(), 'to be true');
        });
      });

      describe('when no global setup fixtures are present', function () {
        it('should return `false`', function () {
          mocha.options.globalSetup = [];
          expect(mocha.hasGlobalSetupFixtures(), 'to be false');
        });
      });
    });

    describe('hasGlobalTeardownFixtures()', function () {
      describe('when one or more global teardown fixtures are present', function () {
        it('should return `true`', function () {
          mocha.options.globalTeardown = [() => {}];
          expect(mocha.hasGlobalTeardownFixtures(), 'to be true');
        });
      });

      describe('when no global teardown fixtures are present', function () {
        it('should return `false`', function () {
          mocha.options.globalTeardown = [];
          expect(mocha.hasGlobalTeardownFixtures(), 'to be false');
        });
      });
    });

    describe('rootHooks()', function () {
      it('should be chainable', function () {
        expect(mocha.rootHooks(), 'to be', mocha);
      });

      describe('when provided a single "before all" hook', function () {
        it('should attach it to the root suite', function () {
          const beforeAll = () => {};
          mocha.rootHooks({beforeAll});
          expect(mocha.suite.beforeAll, 'to have a call satisfying', [
            beforeAll
          ]).and('was called once');
        });
      });

      describe('when provided a single "before each" hook', function () {
        it('should attach it to the root suite', function () {
          const beforeEach = () => {};
          mocha.rootHooks({beforeEach});
          expect(mocha.suite.beforeEach, 'to have a call satisfying', [
            beforeEach
          ]).and('was called once');
        });
      });

      describe('when provided a single "after all" hook', function () {
        it('should attach it to the root suite', function () {
          const afterAll = () => {};
          mocha.rootHooks({afterAll});
          expect(mocha.suite.afterAll, 'to have a call satisfying', [
            afterAll
          ]).and('was called once');
        });
      });

      describe('when provided a single "after each" hook', function () {
        it('should attach it to the root suite', function () {
          const afterEach = () => {};
          mocha.rootHooks({afterEach});
          expect(mocha.suite.afterEach, 'to have a call satisfying', [
            afterEach
          ]).and('was called once');
        });
      });

      describe('when provided multiple "before all" hooks', function () {
        it('should attach each to the root suite', function () {
          const beforeAll = [() => {}, () => {}];
          mocha.rootHooks({beforeAll});
          expect(mocha.suite.beforeAll, 'to have calls satisfying', [
            [beforeAll[0]],
            [beforeAll[1]]
          ]).and('was called twice');
        });
      });

      describe('when provided multiple "before each" hooks', function () {
        it('should attach each to the root suite', function () {
          const beforeEach = [() => {}, () => {}];
          mocha.rootHooks({beforeEach});
          expect(mocha.suite.beforeEach, 'to have calls satisfying', [
            [beforeEach[0]],
            [beforeEach[1]]
          ]).and('was called twice');
        });
      });

      describe('when provided multiple "after all" hooks', function () {
        it('should attach each to the root suite', function () {
          const afterAll = [() => {}, () => {}];
          mocha.rootHooks({afterAll});
          expect(mocha.suite.afterAll, 'to have calls satisfying', [
            [afterAll[0]],
            [afterAll[1]]
          ]).and('was called twice');
        });
      });

      describe('when provided multiple "after each" hooks', function () {
        it('should attach each to the root suite', function () {
          const afterEach = [() => {}, () => {}];
          mocha.rootHooks({afterEach});
          expect(mocha.suite.afterEach, 'to have calls satisfying', [
            [afterEach[0]],
            [afterEach[1]]
          ]).and('was called twice');
        });
      });
    });
  });
});
