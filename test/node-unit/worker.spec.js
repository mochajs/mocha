'use strict';

const {SerializableWorkerResult} = require('../../lib/serializer');
const rewiremock = require('rewiremock/node');
const {createSandbox} = require('sinon');

const WORKER_PATH = require.resolve('../../lib/worker.js');

describe('worker', function() {
  let worker;
  let workerpoolWorker;
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
    workerpoolWorker = sandbox.stub();
    sandbox.spy(process, 'removeAllListeners');
  });

  describe('when run as main "thread"', function() {
    it('should throw', function() {
      expect(() => {
        rewiremock.proxy(WORKER_PATH, {
          workerpool: {
            isMainThread: true,
            worker: workerpoolWorker
          }
        });
      }, 'to throw');
    });
  });

  describe('when run as "worker thread"', function() {
    class MockMocha {}
    let serializer;
    let runHelpers;

    beforeEach(function() {
      MockMocha.prototype.addFile = sandbox.stub().returnsThis();
      MockMocha.prototype.loadFilesAsync = sandbox.stub();
      MockMocha.prototype.run = sandbox.stub();
      MockMocha.interfaces = {
        bdd: sandbox.stub()
      };

      serializer = {
        serialize: sandbox.stub()
      };

      runHelpers = {
        handleRequires: sandbox.stub(),
        validatePlugin: sandbox.stub(),
        loadRootHooks: sandbox.stub().resolves()
      };

      worker = rewiremock.proxy(WORKER_PATH, {
        workerpool: {
          isMainThread: false,
          worker: workerpoolWorker
        },
        '../../lib/mocha': MockMocha,
        '../../lib/serializer': serializer,
        '../../lib/cli/run-helpers': runHelpers
      });
    });

    it('should register itself with workerpool', function() {
      expect(workerpoolWorker, 'to have a call satisfying', [
        {run: worker.run}
      ]);
    });

    describe('function', function() {
      describe('run', function() {
        describe('when called without arguments', function() {
          it('should reject', async function() {
            return expect(worker.run, 'to be rejected with error satisfying', {
              code: 'ERR_MOCHA_INVALID_ARG_TYPE'
            });
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
            MockMocha.prototype.loadFilesAsync.rejects();
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

            MockMocha.prototype.loadFilesAsync.resolves();
            MockMocha.prototype.run.yields(result);
          });

          it('should handle "--require"', async function() {
            await worker.run('some-file.js', {require: 'foo'});
            expect(runHelpers.handleRequires, 'to have a call satisfying', [
              'foo'
            ]).and('was called once');
          });

          it('should handle "--ui"', async function() {
            const argv = {};
            await worker.run('some-file.js', argv);

            expect(runHelpers.validatePlugin, 'to have a call satisfying', [
              argv,
              'ui',
              MockMocha.interfaces
            ]).and('was called once');
          });

          it('should call Mocha#run', async function() {
            await worker.run('some-file.js');
            expect(MockMocha.prototype.run, 'was called once');
          });

          it('should remove all uncaughtException listeners', async function() {
            await worker.run('some-file.js');
            expect(process.removeAllListeners, 'to have a call satisfying', [
              'uncaughtException'
            ]);
          });

          describe('when serialization succeeds', function() {
            beforeEach(function() {
              serializer.serialize.returnsArg(0);
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
              serializer.serialize.throws();
            });

            it('should reject', async function() {
              return expect(worker.run('some-file.js'), 'to be rejected');
            });
          });

          describe('when run twice', function() {
            it('should initialize only once', async function() {
              await worker.run('some-file.js');
              await worker.run('some-other-file.js');

              expect(runHelpers, 'to satisfy', {
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
