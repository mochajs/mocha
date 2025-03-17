'use strict';

const path = require('node:path');
const rewiremock = require('rewiremock/node');
const sinon = require('sinon');
const {EventEmitter} = require('node:events');

const DUMB_FIXTURE_PATH = require.resolve('./fixtures/dumb-module.fixture.js');
const DUMBER_FIXTURE_PATH = require.resolve(
  './fixtures/dumber-module.fixture.js'
);

describe('Mocha', function () {
  let stubs;
  let opts;
  let Mocha;

  beforeEach(function () {
    opts = {reporter: sinon.stub()};

    stubs = {};
    stubs.errors = {
      warn: sinon.stub(),
      createMochaInstanceAlreadyDisposedError: sinon
        .stub()
        .throws({code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED'}),
      createInvalidReporterError: sinon
        .stub()
        .throws({code: 'ERR_MOCHA_INVALID_REPORTER'}),
      createUnsupportedError: sinon
        .stub()
        .throws({code: 'ERR_MOCHA_UNSUPPORTED'})
    };
    stubs.utils = {
      supportsEsModules: sinon.stub().returns(false),
      isString: sinon.stub(),
      noop: sinon.stub(),
      cwd: sinon.stub().returns(process.cwd()),
      isBrowser: sinon.stub().returns(false)
    };
    stubs.suite = Object.assign(sinon.createStubInstance(EventEmitter), {
      slow: sinon.stub(),
      timeout: sinon.stub(),
      bail: sinon.stub(),
      reset: sinon.stub(),
      dispose: sinon.stub()
    });
    stubs.Suite = sinon.stub().returns(stubs.suite);
    stubs.Suite.constants = {};
    stubs.ParallelBufferedRunner = sinon.stub().returns({});
    stubs.esmUtils = {
      loadFilesAsync: sinon.stub()
    };
    const runner = Object.assign(sinon.createStubInstance(EventEmitter), {
      runAsync: sinon.stub().resolves(0),
      globals: sinon.stub(),
      grep: sinon.stub(),
      dispose: sinon.stub()
    });
    stubs.Runner = sinon.stub().returns(runner);
    // the Runner constructor is the main export, and constants is a static prop.
    // we don't need the constants themselves, but the object cannot be undefined
    stubs.Runner.constants = {};

    Mocha = rewiremock.proxy(
      () => require('../../lib/mocha'),
      r => ({
        '../../lib/utils.js': r.with(stubs.utils).callThrough(),
        '../../lib/suite.js': stubs.Suite,
        '../../lib/nodejs/parallel-buffered-runner.js':
          stubs.ParallelBufferedRunner,
        '../../lib/nodejs/esm-utils': stubs.esmUtils,
        '../../lib/runner.js': stubs.Runner,
        '../../lib/errors.js': stubs.errors
      })
    );
    delete require.cache[DUMB_FIXTURE_PATH];
    delete require.cache[DUMBER_FIXTURE_PATH];
  });

  afterEach(function () {
    delete require.cache[DUMB_FIXTURE_PATH];
    delete require.cache[DUMBER_FIXTURE_PATH];
    sinon.restore();
  });

  describe('instance method', function () {
    let mocha;

    beforeEach(function () {
      mocha = new Mocha(opts);
    });

    describe('parallelMode()', function () {
      describe('when `Mocha` is running in Node.js', function () {
        it('should return the Mocha instance', function () {
          expect(mocha.parallelMode(), 'to be', mocha);
        });

        describe('when parallel mode is already enabled', function () {
          beforeEach(function () {
            mocha.options.parallel = true;
            mocha._runnerClass = stubs.ParallelBufferedRunner;
            mocha._lazyLoadFiles = true;
          });

          it('should not swap the Runner, nor change lazy loading setting', function () {
            expect(mocha.parallelMode(true), 'to satisfy', {
              options: {parallel: true},
              _runnerClass: stubs.ParallelBufferedRunner,
              _lazyLoadFiles: true
            });
          });
        });

        describe('when parallel mode is already disabled', function () {
          beforeEach(function () {
            mocha.options.parallel = false;
            mocha._runnerClass = Mocha.Runner;
            mocha._lazyLoadFiles = false;
          });

          it('should not swap the Runner, nor change lazy loading setting', function () {
            expect(mocha.parallelMode(false), 'to satisfy', {
              options: {parallel: false},
              _runnerClass: Mocha.Runner,
              _lazyLoadFiles: false
            });
          });
        });

        describe('when `Mocha` instance in serial mode', function () {
          beforeEach(function () {
            mocha.options.parallel = false;
          });

          describe('when passed `true` value', function () {
            describe('when `Mocha` instance is in `INIT` state', function () {
              beforeEach(function () {
                mocha._state = 'init';
              });

              it('should enable parallel mode', function () {
                // FIXME: the dynamic require() call breaks the mock of
                // `ParallelBufferedRunner` and returns the real class.
                // don't know how to make this work or if it's even possible
                expect(mocha.parallelMode(true), 'to satisfy', {
                  _runnerClass: expect.it('not to be', Mocha.Runner),
                  options: {
                    parallel: true
                  },
                  _lazyLoadFiles: true
                });
              });
            });

            describe('when `Mocha` instance is not in `INIT` state', function () {
              beforeEach(function () {
                mocha._state = 'disposed';
              });

              it('should throw', function () {
                expect(
                  () => {
                    mocha.parallelMode(true);
                  },
                  'to throw',
                  {
                    code: 'ERR_MOCHA_UNSUPPORTED'
                  }
                );
              });
            });
          });

          describe('when passed non-`true` value', function () {
            describe('when `Mocha` instance is in `INIT` state', function () {
              beforeEach(function () {
                mocha._state = 'init';
              });

              it('should enable serial mode', function () {
                expect(mocha.parallelMode(0), 'to satisfy', {
                  _runnerClass: Mocha.Runner,
                  options: {
                    parallel: false
                  },
                  _lazyLoadFiles: false
                });
              });
            });
          });
        });
      });
    });

    describe('addFile()', function () {
      it('should add the given file to the files array', function () {
        mocha.addFile('some-file.js');
        expect(mocha.files, 'to exhaustively satisfy', ['some-file.js']);
      });

      it('should be chainable', function () {
        expect(mocha.addFile('some-file.js'), 'to be', mocha);
      });
    });

    describe('loadFiles()', function () {
      it('should load all files from the files array', function () {
        this.timeout(1000);
        mocha.files = [DUMB_FIXTURE_PATH, DUMBER_FIXTURE_PATH];
        mocha.loadFiles();
        expect(require.cache, 'to have keys', [
          DUMB_FIXTURE_PATH,
          DUMBER_FIXTURE_PATH
        ]);
      });

      it('should execute the optional callback if given', function () {
        expect(cb => {
          mocha.loadFiles(cb);
        }, 'to call the callback');
      });
    });

    describe('loadFilesAsync()', function () {
      it('shoud pass esmDecorator to actual load function', async function () {
        const esmDecorator = x => `${x}?foo=bar`;

        await mocha.loadFilesAsync({esmDecorator});

        expect(stubs.esmUtils.loadFilesAsync, 'was called once');
        expect(
          stubs.esmUtils.loadFilesAsync.firstCall.args[3],
          'to be',
          esmDecorator
        );
      });
    });

    describe('unloadFiles()', function () {
      it('should delegate Mocha.unloadFile() for each item in its list of files', function () {
        mocha.files = [DUMB_FIXTURE_PATH, DUMBER_FIXTURE_PATH];
        sinon.stub(Mocha, 'unloadFile');
        mocha.unloadFiles();
        expect(Mocha.unloadFile, 'to have a call exhaustively satisfying', [
          DUMB_FIXTURE_PATH
        ])
          .and('to have a call exhaustively satisfying', [DUMBER_FIXTURE_PATH])
          .and('was called twice');
      });

      it('should be chainable', function () {
        expect(mocha.unloadFiles(), 'to be', mocha);
      });
    });

    describe('reporter()', function () {
      describe('when a reporter exists relative to the cwd', function () {
        beforeEach(function () {
          stubs.utils.cwd.returns(
            path.resolve(__dirname, '..', '..', 'lib', 'reporters')
          );
        });

        it('should load from current working directory', function () {
          expect(function () {
            mocha.reporter('./lib/reporters/spec.js');
          }, 'not to throw');
        });

        describe('when the reporter throws upon load', function () {
          it('should throw "invalid reporter" exception', function () {
            expect(
              function () {
                mocha.reporter(
                  './test/node-unit/fixtures/wonky-reporter.fixture.js'
                );
              },
              'to throw',
              {
                code: 'ERR_MOCHA_INVALID_REPORTER'
              }
            );
          });
        });
      });

      describe('when a reporter exists relative to the "mocha" module path', function () {
        it('should load from module path', function () {
          expect(function () {
            mocha.reporter('./reporters/spec');
          }, 'not to throw');
        });

        describe('when the reporter throws upon load', function () {
          it('should throw "invalid reporter" exception', function () {
            expect(
              function () {
                mocha.reporter(
                  '../test/node-unit/fixtures/wonky-reporter.fixture.js'
                );
              },
              'to throw',
              {
                code: 'ERR_MOCHA_INVALID_REPORTER'
              }
            );
          });
        });
      });
    });

    describe('unloadFiles()', function () {
      it('should reset referencesCleaned and allow for next run', function (done) {
        mocha.run(function () {
          mocha.unloadFiles();
          mocha.run(done);
        });
      });

      it('should not be allowed when the current instance is already disposed', function () {
        mocha.dispose();
        expect(
          function () {
            mocha.unloadFiles();
          },
          'to throw',
          {code: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED'}
        );
      });
    });

    describe('lazyLoadFiles()', function () {
      it('should return the `Mocha` instance', function () {
        expect(mocha.lazyLoadFiles(), 'to be', mocha);
      });
      describe('when passed a non-`true` value', function () {
        it('should enable eager loading', function () {
          mocha.lazyLoadFiles(0);
          expect(mocha._lazyLoadFiles, 'to be false');
        });
      });

      describe('when passed `true`', function () {
        it('should enable lazy loading', function () {
          mocha.lazyLoadFiles(true);
          expect(mocha._lazyLoadFiles, 'to be true');
        });
      });
    });
  });

  describe('static method', function () {
    describe('unloadFile()', function () {
      it('should unload a specific file from cache', function () {
        require(DUMB_FIXTURE_PATH);
        Mocha.unloadFile(DUMB_FIXTURE_PATH);
        expect(require.cache, 'not to have key', DUMB_FIXTURE_PATH);
      });
    });
  });
});
