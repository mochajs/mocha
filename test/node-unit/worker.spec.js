'use strict';

const serializeJavascript = require('serialize-javascript');
const rewiremock = require('rewiremock/node');
const {SerializableWorkerResult} = require('../../lib/nodejs/serializer');
const {createSandbox} = require('sinon');

const WORKER_PATH = require.resolve('../../lib/nodejs/worker.js');

describe('worker', function() {
  let worker;
  let sandbox;
  let stubs;

  beforeEach(function() {
    sandbox = createSandbox();
    stubs = {
      workerpool: {
        isMainThread: false,
        worker: sandbox.stub()
      }
    };
    sandbox.spy(process, 'removeAllListeners');
  });

  describe('when run as main process', function() {
    it('should throw', function() {
      expect(() => {
        rewiremock.proxy(WORKER_PATH, {
          workerpool: {
            isMainThread: true,
            worker: stubs.workerpool.worker
          }
        });
      }, 'to throw');
    });
  });

  describe('when run as worker process', function() {
    let mocha;

    beforeEach(function() {
      mocha = {
        addFile: sandbox.stub().returnsThis(),
        loadFilesAsync: sandbox.stub().resolves(),
        run: sandbox.stub().callsArgAsync(0),
        unloadFiles: sandbox.stub().returnsThis()
      };
      stubs.Mocha = Object.assign(sandbox.stub().returns(mocha), {
        bdd: sandbox.stub(),
        interfaces: {}
      });

      stubs.serializer = {
        serialize: sandbox.stub()
      };

      stubs.runHelpers = {
        handleRequires: sandbox.stub(),
        validatePlugin: sandbox.stub(),
        loadRootHooks: sandbox.stub().resolves()
      };

      worker = rewiremock.proxy(WORKER_PATH, {
        workerpool: stubs.workerpool,
        '../../lib/mocha': stubs.Mocha,
        '../../lib/nodejs/serializer': stubs.serializer,
        '../../lib/cli/run-helpers': stubs.runHelpers
      });
    });

    it('should register itself with workerpool', function() {
      expect(stubs.workerpool.worker, 'to have a call satisfying', [
        {run: worker.run}
      ]);
    });

    describe('function', function() {
      describe('run()', function() {
        describe('when called without arguments', function() {
          it('should reject', async function() {
            return expect(worker.run, 'to be rejected with error satisfying', {
              code: 'ERR_MOCHA_INVALID_ARG_TYPE'
            });
          });
        });

        describe('when passed a non-string `options` value', function() {
          it('should reject', async function() {
            return expect(
              () => worker.run('foo.js', 42),
              'to be rejected with error satisfying',
              {
                code: 'ERR_MOCHA_INVALID_ARG_TYPE'
              }
            );
          });
        });

        describe('when passed an invalid string `options` value', function() {
          it('should reject', async function() {
            return expect(
              () => worker.run('foo.js', 'tomfoolery'),
              'to be rejected with error satisfying',
              {
                code: 'ERR_MOCHA_INVALID_ARG_VALUE'
              }
            );
          });
        });

        describe('when called with empty "filepath" argument', function() {
          it('should reject', async function() {
            return expect(
              () => worker.run(''),
              'to be rejected with error satisfying',
              {
                code: 'ERR_MOCHA_INVALID_ARG_TYPE'
              }
            );
          });
        });

        describe('when the file at "filepath" argument is unloadable', function() {
          it('should reject', async function() {
            mocha.loadFilesAsync.rejects();
            return expect(
              () => worker.run('some-non-existent-file.js'),
              'to be rejected'
            );
          });
        });

        describe('when the file at "filepath" is loadable', function() {
          let result;
          beforeEach(function() {
            result = SerializableWorkerResult.create();

            mocha.loadFilesAsync.resolves();
            mocha.run.yields(result);
          });

          it('should handle "--require"', async function() {
            await worker.run(
              'some-file.js',
              serializeJavascript({require: 'foo'})
            );
            expect(
              stubs.runHelpers.handleRequires,
              'to have a call satisfying',
              ['foo']
            ).and('was called once');
          });

          it('should handle "--ui"', async function() {
            const argv = {foo: 'bar'};
            await worker.run('some-file.js', serializeJavascript(argv));

            expect(
              stubs.runHelpers.validatePlugin,
              'to have a call satisfying',
              [argv, 'ui', stubs.Mocha.interfaces]
            ).and('was called once');
          });

          it('should call Mocha#run', async function() {
            await worker.run('some-file.js');
            expect(mocha.run, 'was called once');
          });

          it('should remove all uncaughtException listeners', async function() {
            await worker.run('some-file.js');
            expect(process.removeAllListeners, 'to have a call satisfying', [
              'uncaughtException'
            ]);
          });

          describe('when serialization succeeds', function() {
            beforeEach(function() {
              stubs.serializer.serialize.returnsArg(0);
            });

            it('should resolve with a SerializedWorkerResult', async function() {
              return expect(
                worker.run('some-file.js'),
                'to be fulfilled with',
                result
              );
            });
          });

          describe('when serialization fails', function() {
            beforeEach(function() {
              stubs.serializer.serialize.throws();
            });

            it('should reject', async function() {
              return expect(worker.run('some-file.js'), 'to be rejected');
            });
          });

          describe('when run twice', function() {
            it('should initialize only once', async function() {
              await worker.run('some-file.js');
              await worker.run('some-other-file.js');

              expect(stubs.runHelpers, 'to satisfy', {
                handleRequires: expect.it('was called once'),
                validatePlugin: expect.it('was called once')
              });
            });
          });
        });
      });
    });
  });

  afterEach(function() {
    sandbox.restore();
    // this is needed due to `require.cache` getting dumped in watch mode
    process.removeAllListeners('beforeExit');
  });
});
