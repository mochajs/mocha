'use strict';

const path = require('path');
const rewiremock = require('rewiremock/node');
const {createSandbox} = require('sinon');
const {EventEmitter} = require('events');

const MODULE_PATH = require.resolve('../../lib/mocha.js');
const DUMB_FIXTURE_PATH = require.resolve('./fixtures/dumb-module.fixture.js');
const DUMBER_FIXTURE_PATH = require.resolve(
  './fixtures/dumber-module.fixture.js'
);

describe('Mocha', function() {
  let stubs;
  let opts;
  let Mocha;
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
    opts = {reporter: sandbox.stub()};

    stubs = {};
    stubs.utils = {
      supportsEsModules: sandbox.stub().returns(false),
      warn: sandbox.stub(),
      isString: sandbox.stub(),
      noop: sandbox.stub(),
      cwd: sandbox.stub().returns(process.cwd())
    };
    stubs.suite = Object.assign(sandbox.createStubInstance(EventEmitter), {
      slow: sandbox.stub(),
      timeout: sandbox.stub(),
      bail: sandbox.stub()
    });
    stubs.Suite = sandbox.stub().returns(stubs.suite);
    stubs.Suite.constants = {};

    Mocha = rewiremock.proxy(MODULE_PATH, r => ({
      '../../lib/utils': r.with(stubs.utils).callThrough(),
      '../../lib/suite': stubs.Suite
    }));
    delete require.cache[DUMB_FIXTURE_PATH];
    delete require.cache[DUMBER_FIXTURE_PATH];
  });

  afterEach(function() {
    delete require.cache[DUMB_FIXTURE_PATH];
    delete require.cache[DUMBER_FIXTURE_PATH];
    sandbox.restore();
  });

  describe('instance method', function() {
    let mocha;

    beforeEach(function() {
      mocha = new Mocha(opts);
    });

    describe('addFile()', function() {
      it('should add the given file to the files array', function() {
        mocha.addFile('some-file.js');
        expect(mocha.files, 'to exhaustively satisfy', ['some-file.js']);
      });

      it('should be chainable', function() {
        expect(mocha.addFile('some-file.js'), 'to be', mocha);
      });
    });

    describe('loadFiles()', function() {
      it('should load all files from the files array', function() {
        this.timeout(1000);
        mocha.files = [DUMB_FIXTURE_PATH, DUMBER_FIXTURE_PATH];
        mocha.loadFiles();
        expect(require.cache, 'to have keys', [
          DUMB_FIXTURE_PATH,
          DUMBER_FIXTURE_PATH
        ]);
      });

      it('should execute the optional callback if given', function() {
        expect(cb => {
          mocha.loadFiles(cb);
        }, 'to call the callback');
      });
    });

    describe('unloadFiles()', function() {
      it('should delegate Mocha.unloadFile() for each item in its list of files', function() {
        mocha.files = [DUMB_FIXTURE_PATH, DUMBER_FIXTURE_PATH];
        sandbox.stub(Mocha, 'unloadFile');
        mocha.unloadFiles();
        expect(Mocha.unloadFile, 'to have a call exhaustively satisfying', [
          DUMB_FIXTURE_PATH
        ])
          .and('to have a call exhaustively satisfying', [DUMBER_FIXTURE_PATH])
          .and('was called twice');
      });

      it('should be chainable', function() {
        expect(mocha.unloadFiles(), 'to be', mocha);
      });
    });

    describe('reporter()', function() {
      describe('when a reporter exists relative to the cwd', function() {
        beforeEach(function() {
          stubs.utils.cwd.returns(
            path.resolve(__dirname, '..', '..', 'lib', 'reporters')
          );
        });

        it('should load from current working directory', function() {
          expect(function() {
            mocha.reporter('./spec.js');
          }, 'not to throw');
        });

        describe('when the reporter throws upon load', function() {
          it('should throw "invalid reporter" exception', function() {
            expect(
              function() {
                mocha.reporter(
                  '../../test/node-unit/fixtures/wonky-reporter.fixture.js'
                );
              },
              'to throw',
              {
                code: 'ERR_MOCHA_INVALID_REPORTER'
              }
            );
          });

          it('should warn about the error before throwing', function() {
            try {
              mocha.reporter(
                '../../test/node-unit/fixtures/wonky-reporter.fixture.js'
              );
            } catch (ignored) {
            } finally {
              expect(stubs.utils.warn, 'to have a call satisfying', [
                expect.it('to match', /reporter blew up/)
              ]);
            }
          });
        });
      });

      describe('when a reporter exists relative to the "mocha" module path', function() {
        it('should load from module path', function() {
          expect(function() {
            mocha.reporter('./reporters/spec');
          }, 'not to throw');
        });

        describe('when the reporter throws upon load', function() {
          it('should throw "invalid reporter" exception', function() {
            expect(
              function() {
                mocha.reporter(
                  '../../test/node-nit/fixtures/wonky-reporter.fixture.js'
                );
              },
              'to throw',
              {
                code: 'ERR_MOCHA_INVALID_REPORTER'
              }
            );
          });

          it('should warn about the error before throwing', function() {
            try {
              mocha.reporter(
                require.resolve('./fixtures/wonky-reporter.fixture.js')
              );
            } catch (ignored) {
            } finally {
              expect(stubs.utils.warn, 'to have a call satisfying', [
                expect.it('to match', /reporter blew up/)
              ]);
            }
          });
        });
      });
    });
  });

  describe('static method', function() {
    describe('unloadFile()', function() {
      it('should unload a specific file from cache', function() {
        require(DUMB_FIXTURE_PATH);
        Mocha.unloadFile(DUMB_FIXTURE_PATH);
        expect(require.cache, 'not to have key', DUMB_FIXTURE_PATH);
      });
    });
  });
});
