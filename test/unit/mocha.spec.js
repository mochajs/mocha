'use strict';

var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var Mocha = require('../../lib/mocha');
var utils = require('../../lib/utils');

describe('Mocha', function() {
  /**
   * Options for `Mocha` constructor
   */
  var opts;

  /**
   * Sinon sandbox
   * @see https://sinonjs.org/releases/v9.0.2/sandbox/
   */
  var sandbox;

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

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    reporterInstance = {};
    opts = {reporter: sandbox.stub().returns(reporterInstance)};
    Base = sandbox.stub().returns({});
    runner = utils.assign(sandbox.createStubInstance(EventEmitter), {
      run: sandbox
        .stub()
        .callsArgAsync(0)
        .returnsThis(),
      globals: sandbox.stub(),
      grep: sandbox.stub(),
      dispose: sandbox.stub()
    });
    Runner = sandbox.stub().returns(runner);
    // the Runner constructor is the main export, and constants is a static prop.
    // we don't need the constants themselves, but the object cannot be undefined
    Runner.constants = {};
    suite = utils.assign(sandbox.createStubInstance(EventEmitter), {
      slow: sandbox.stub(),
      timeout: sandbox.stub(),
      bail: sandbox.stub(),
      dispose: sandbox.stub(),
      reset: sandbox.stub()
    });
    Suite = sandbox.stub().returns(suite);
    Suite.constants = {};

    sandbox.stub(utils, 'supportsEsModules').returns(false);
    sandbox.stub(utils, 'warn');
    sandbox.stub(utils, 'isString');
    sandbox.stub(utils, 'noop');

    Mocha.Runner = Runner;
    Mocha.reporters.Base = Mocha.reporters.base = Base;
    sandbox.stub(Mocha.reporters, 'spec');
    Mocha.Suite = Suite;
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

    describe('when `timeout` option is `undefined`', function() {
      it('should not attempt to set timeout', function() {
        // eslint-disable-next-line no-new
        new Mocha({timeout: undefined});
        expect(Mocha.prototype.timeout, 'was not called');
      });
    });

    describe('when `timeout` is `false`', function() {
      it('should set a timeout of 0', function() {
        // eslint-disable-next-line no-new
        new Mocha({timeout: false});
        expect(Mocha.prototype.timeout, 'to have a call satisfying', [0]).and(
          'was called once'
        );
      });
    });

    describe('when `global` option is provided', function() {
      it('should configure `global` option', function() {
        // eslint-disable-next-line no-new
        new Mocha({global: ['singular']});
        expect(Mocha.prototype.global, 'to have a call satisfying', [
          ['singular']
        ]).and('was called once');
      });
    });
  });

  describe('instance method', function() {
    var mocha;

    beforeEach(function() {
      mocha = new Mocha(opts);
    });

    describe('allowUncaught()', function() {
      it('should set the allowUncaught option to true', function() {
        mocha.allowUncaught();
        expect(mocha.options, 'to have property', 'allowUncaught', true);
      });

      it('should set the allowUncaught option to false', function() {
        mocha.allowUncaught(false);
        expect(mocha.options, 'to have property', 'allowUncaught', false);
      });

      it('should be chainable', function() {
        expect(mocha.allowUncaught(), 'to be', mocha);
      });
    });

    describe('asyncOnly()', function() {
      it('should set the asyncOnly option to true', function() {
        mocha.asyncOnly();
        expect(mocha.options, 'to have property', 'asyncOnly', true);
      });

      it('should set the asyncOnly option to false', function() {
        mocha.asyncOnly(false);
        expect(mocha.options, 'to have property', 'asyncOnly', false);
      });

      it('should be chainable', function() {
        expect(mocha.asyncOnly(), 'to be', mocha);
      });
    });

    describe('bail()', function() {
      describe('when provided no arguments', function() {
        it('should set the "bail" flag on the root suite', function() {
          mocha.bail();
          expect(suite.bail, 'to have a call satisfying', [true]).and(
            'was called once'
          );
        });
      });

      describe('when provided a falsy argument', function() {
        it('should unset the "bail" flag on the root suite', function() {
          mocha.bail(false);
          expect(suite.bail, 'to have a call satisfying', [false]).and(
            'was called once'
          );
        });
      });

      it('should be chainable', function() {
        expect(mocha.bail(), 'to be', mocha);
      });
    });

    describe('checkLeaks()', function() {
      it('should set the checkLeaks option to true', function() {
        mocha.checkLeaks();
        expect(mocha.options, 'to have property', 'checkLeaks', true);
      });
    });

    describe('cleanReferencesAfterRun()', function() {
      it('should set the _cleanReferencesAfterRun attribute', function() {
        mocha.cleanReferencesAfterRun();
        expect(mocha._cleanReferencesAfterRun, 'to be', true);
      });

      it('should set the _cleanReferencesAfterRun attribute to false', function() {
        mocha.cleanReferencesAfterRun(false);
        expect(mocha._cleanReferencesAfterRun, 'to be', false);
      });

      it('should be chainable', function() {
        expect(mocha.cleanReferencesAfterRun(), 'to be', mocha);
      });
    });

    describe('color()', function() {
      it('should set the color option to true', function() {
        mocha.color();
        expect(mocha.options, 'to have property', 'color', true);
      });

      it('should set the color option to false', function() {
        mocha.color(false);
        expect(mocha.options, 'to have property', 'color', false);
      });

      it('should be chainable', function() {
        expect(mocha.color(), 'to be', mocha);
      });
    });

    describe('delay()', function() {
      it('should set the delay option to true', function() {
        mocha.delay();
        expect(mocha.options, 'to have property', 'delay', true);
      });

      it('should be chainable', function() {
        expect(mocha.delay(), 'to be', mocha);
      });
    });

    describe('diff()', function() {
      it('should set the diff option to true', function() {
        mocha.diff();
        expect(mocha.options, 'to have property', 'diff', true);
      });

      describe('when provided `false` argument', function() {
        it('should set the diff option to false', function() {
          mocha.diff(false);
          expect(mocha.options, 'to have property', 'diff', false);
        });
      });
    });

    describe('dispose()', function() {
      it('should dispose the root suite', function() {
        mocha.dispose();
        expect(suite.dispose, 'was called once');
      });

      it('should dispose previous test runner', function() {
        mocha._previousRunner = runner;
        mocha.dispose();
        expect(runner.dispose, 'was called once');
      });

      it('should unload the files', function() {
        var unloadFilesStub = sandbox.stub(mocha, 'unloadFiles');
        mocha.dispose();
        expect(unloadFilesStub, 'was called once');
      });
    });

    describe('forbidOnly()', function() {
      it('should set the forbidOnly option to true', function() {
        mocha.forbidOnly();
        expect(mocha.options, 'to have property', 'forbidOnly', true);
      });

      it('should set the forbidOnly option to false', function() {
        mocha.forbidOnly(false);
        expect(mocha.options, 'to have property', 'forbidOnly', false);
      });

      it('should be chainable', function() {
        expect(mocha.forbidOnly(), 'to be', mocha);
      });
    });

    describe('forbidPending()', function() {
      it('should set the forbidPending option to true', function() {
        mocha.forbidPending();
        expect(mocha.options, 'to have property', 'forbidPending', true);
      });

      it('should set the forbidPending option to false', function() {
        mocha.forbidPending(false);
        expect(mocha.options, 'to have property', 'forbidPending', false);
      });

      it('should be chainable', function() {
        expect(mocha.forbidPending(), 'to be', mocha);
      });
    });

    describe('fullTrace()', function() {
      it('should set the fullTrace option to true', function() {
        mocha.fullTrace();
        expect(mocha.options, 'to have property', 'fullTrace', true);
      });

      it('should set the fullTrace option to false', function() {
        mocha.fullTrace(false);
        expect(mocha.options, 'to have property', 'fullTrace', false);
      });

      it('should be chainable', function() {
        expect(mocha.fullTrace(), 'to be', mocha);
      });
    });

    describe('global()', function() {
      it('should be an empty array initially', function() {
        expect(mocha.options.global, 'to be empty');
      });

      it('should be chainable', function() {
        expect(mocha.global(), 'to be', mocha);
      });

      describe('when argument is invalid', function() {
        it('should not modify the whitelist when given empty string', function() {
          mocha.global('');
          expect(mocha.options.global, 'to be empty');
        });

        it('should not modify the whitelist when given empty array', function() {
          mocha.global([]);
          expect(mocha.options.global, 'to be empty');
        });
      });

      describe('when argument is valid', function() {
        var elem = 'foo';
        var elem2 = 'bar';
        var elem3 = 'baz';

        it('should add string to the whitelist', function() {
          mocha.global(elem);
          expect(mocha.options.global, 'to contain', elem);
          expect(mocha.options.global, 'to have length', 1);
        });

        it('should add contents of string array to the whitelist', function() {
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

    describe('growl()', function() {
      describe('if capable of notifications', function() {
        it('should set the growl option to true', function() {
          mocha.isGrowlCapable = function forceEnable() {
            return true;
          };
          mocha.growl();
          expect(mocha.options, 'to have property', 'growl', true);
        });
      });

      describe('if not capable of notifications', function() {
        it('should set the growl option to false', function() {
          mocha.isGrowlCapable = function forceDisable() {
            return false;
          };
          mocha.growl();
          expect(mocha.options, 'to have property', 'growl', false);
        });
      });

      it('should be chainable', function() {
        expect(mocha.growl(), 'to be', mocha);
      });
    });

    describe('inlineDiffs()', function() {
      it('should set the inlineDiffs option to true', function() {
        mocha.inlineDiffs();
        expect(mocha.options, 'to have property', 'inlineDiffs', true);
      });

      it('should set the inlineDiffs option to false', function() {
        mocha.inlineDiffs(false);
        expect(mocha.options, 'to have property', 'inlineDiffs', false);
      });

      it('should be chainable', function() {
        expect(mocha.inlineDiffs(), 'to be', mocha);
      });
    });

    describe('invert()', function() {
      it('should set the invert option to true', function() {
        mocha.invert();
        expect(mocha.options, 'to have property', 'invert', true);
      });

      it('should be chainable', function() {
        expect(mocha.invert(), 'to be', mocha);
      });
    });

    describe('noHighlighting()', function() {
      // :NOTE: Browser-only option...
      it('should set the noHighlighting option to true', function() {
        mocha.noHighlighting();
        expect(mocha.options, 'to have property', 'noHighlighting', true);
      });

      it('should be chainable', function() {
        expect(mocha.noHighlighting(), 'to be', mocha);
      });
    });

    describe('reporter()', function() {
      it('should throw reporter error if an invalid reporter is given', function() {
        expect(
          function() {
            mocha.reporter('invalidReporter');
          },
          'to throw',
          {
            message: "invalid reporter 'invalidReporter'",
            code: 'ERR_MOCHA_INVALID_REPORTER',
            reporter: 'invalidReporter'
          }
        );
      });

      it('should be chainable', function() {
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

      describe('when a reporter does not exist', function() {
        it('should throw an "invalid reporter" exception', function() {
          expect(
            function() {
              mocha.reporter('no such thing');
            },
            'to throw',
            {code: 'ERR_MOCHA_INVALID_REPORTER'}
          );
        });
      });
    });

    describe('run()', function() {
      describe('when files have been added to the Mocha instance', function() {
        beforeEach(function() {
          sandbox.stub(mocha, 'loadFiles');
          mocha.addFile('some-file.js');
        });

        describe('when Mocha is set to eagerly load files', function() {
          it('should eagerly load files', function(done) {
            mocha.run(function() {
              expect(mocha.loadFiles, 'was called once');
              done();
            });
          });
        });

        describe('when Mocha is set to lazily load files', function() {
          beforeEach(function() {
            mocha.loadAsync = true;
          });

          it('should not eagerly load files', function(done) {
            mocha.run(function() {
              expect(mocha.loadFiles, 'was not called');
              done();
            });
          });
        });
      });

      describe('Runner initialization', function() {
        it('should instantiate a Runner', function(done) {
          mocha.run(function() {
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

        describe('when "grep" option is present', function() {
          beforeEach(function() {
            mocha.options.grep = /foo/;
            mocha.options.invert = false;
          });

          it('should configure "grep"', function(done) {
            mocha.run(function() {
              expect(runner.grep, 'to have a call satisfying', [
                mocha.options.grep,
                mocha.options.invert
              ]).and('was called once');
              done();
            });
          });
        });

        describe('when "global" option is present', function() {
          beforeEach(function() {
            mocha.options.global = ['foo', 'bar'];
          });

          it('should configure global vars', function(done) {
            mocha.run(function() {
              expect(runner.globals, 'to have a call satisfying', [
                mocha.options.global
              ]).and('was called once');
              done();
            });
          });
        });
      });

      describe('when "growl" option is present', function() {
        beforeEach(function() {
          mocha.options.growl = true;
          sandbox.stub(Mocha.prototype, '_growl').returnsThis();
        });

        it('should initialize growl support', function(done) {
          mocha.run(function() {
            expect(mocha._growl, 'to have a call satisfying', [runner]);
            done();
          });
        });
      });

      describe('Base reporter initialization', function() {
        beforeEach(function() {
          mocha.options.inlineDiffs = 'some value';
          mocha.options.diff = false;
        });

        describe('when "color" options is set', function() {
          beforeEach(function() {
            mocha.options.color = 'truthy';
          });

          it('should configure the Base reporter', function(done) {
            mocha.run(function() {
              expect(Base, 'to exhaustively satisfy', {
                inlineDiffs: 'some value',
                hideDiff: true,
                useColors: 'truthy'
              });
              done();
            });
          });
        });

        it('should configure the Base reporter', function(done) {
          mocha.run(function() {
            expect(Base, 'to exhaustively satisfy', {
              inlineDiffs: 'some value',
              hideDiff: true
            });
            done();
          });
        });
      });

      it('should instantiate a reporter', function(done) {
        mocha.run(function() {
          expect(opts.reporter, 'to have a call satisfying', {
            calledWithNew: true,
            args: [runner, mocha.options]
          }).and('was called once');
          done();
        });
      });

      // TODO: figure out how to stub the stats collector
      it('should initialize the stats collector');

      describe('when a reporter instance has a "done" method', function() {
        beforeEach(function() {
          reporterInstance.done = sandbox.stub().callsArgAsync(1);
        });

        it('should call the reporter "done" method', function(done) {
          mocha.run(function() {
            expect(reporterInstance.done, 'was called once');
            done();
          });
        });
      });

      it('should execute the callback when complete', function(done) {
        mocha.run(done);
      });

      describe('when a run is in progress', function() {
        it('should throw', function(done) {
          mocha.run(done); // this is async!
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
        });

        it('should not call `Runner#run`', function(done) {
          mocha.run(done); // this is async!
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            expect(runner.run, 'was called once');
          }
        });
      });

      describe('when the `Mocha` instance is already disposed', function() {
        beforeEach(function() {
          mocha.dispose();
        });

        it('should throw', function() {
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
        });

        it('should not call `Runner#run`', function() {
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            expect(runner.run, 'was not called');
          }
        });
      });

      describe('when a run has finished and is called again', function() {
        beforeEach(function(done) {
          mocha.run(function() {
            runner.run.reset();
            done();
          });
        });

        it('should throw', function() {
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
        });

        it('should not call `Runner#run()`', function() {
          try {
            mocha.run();
          } catch (ignored) {
          } finally {
            expect(runner.run, 'was not called');
          }
        });
      });

      describe('when Mocha configured for multiple runs and multiple runs are attempted', function() {
        beforeEach(function() {
          mocha.cleanReferencesAfterRun(false);
        });

        it('should not throw', function(done) {
          mocha.run(function() {
            mocha.run(done);
          });
        });

        it('should call `Runner#run` for each call', function(done) {
          mocha.run(function() {
            mocha.run(function() {
              expect(runner.run, 'was called twice');
              done();
            });
          });
        });

        it('should reset the root Suite between runs', function(done) {
          mocha.run(function() {
            mocha.run(function() {
              expect(suite.reset, 'was called once');
              done();
            });
          });
        });

        it('should dispose the previous runner', function(done) {
          mocha.run(function() {
            mocha.run(function() {
              expect(runner.dispose, 'was called once');
              done();
            });
          });
        });
      });
    });

    describe('unloadFiles()', function() {
      it('should reset referencesCleaned and allow for next run', function(done) {
        mocha.run(function() {
          mocha.unloadFiles();
          mocha.run(done);
        });
      });

      it('should not be allowed when the current instance is already disposed', function() {
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
});
