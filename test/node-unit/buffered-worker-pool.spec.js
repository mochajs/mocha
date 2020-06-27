'use strict';

const rewiremock = require('rewiremock/node');
const sinon = require('sinon');

describe('class BufferedWorkerPool', function() {
  let BufferedWorkerPool;
  let pool;
  let stats;
  let serializeJavascript;
  let serializer;
  let result;

  beforeEach(function() {
    stats = {totalWorkers: 10, busyWorkers: 8, idleWorkers: 2, pendingTasks: 3};
    result = {failures: 0, events: []};
    pool = {
      terminate: sinon.stub().resolves(),
      exec: sinon.stub().resolves(result),
      stats: sinon.stub().returns(stats)
    };
    serializer = {
      deserialize: sinon.stub()
    };

    serializeJavascript = sinon.spy(require('serialize-javascript'));
    BufferedWorkerPool = rewiremock.proxy(
      require.resolve('../../lib/nodejs/buffered-worker-pool'),
      {
        workerpool: {
          pool: sinon.stub().returns(pool),
          cpus: 8
        },
        '../../lib/nodejs/serializer': serializer,
        'serialize-javascript': serializeJavascript
      }
    ).BufferedWorkerPool;

    // reset cache
    BufferedWorkerPool.resetOptionsCache();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('static method', function() {
    describe('create()', function() {
      it('should return a BufferedWorkerPool instance', function() {
        expect(
          BufferedWorkerPool.create({foo: 'bar'}),
          'to be a',
          BufferedWorkerPool
        );
      });

      describe('when passed no arguments', function() {
        it('should not throw', function() {
          expect(BufferedWorkerPool.create, 'not to throw');
        });
      });
    });

    describe('serializeOptions()', function() {
      describe('when passed no arguments', function() {
        it('should not throw', function() {
          expect(BufferedWorkerPool.serializeOptions, 'not to throw');
        });
      });

      it('should return a serialized string', function() {
        expect(
          BufferedWorkerPool.serializeOptions({foo: 'bar'}),
          'to be a',
          'string'
        );
      });

      describe('when called multiple times with the same object', function() {
        it('should not perform serialization twice', function() {
          const obj = {foo: 'bar'};
          BufferedWorkerPool.serializeOptions(obj);
          BufferedWorkerPool.serializeOptions(obj);
          expect(serializeJavascript, 'was called once');
        });

        it('should return the same value', function() {
          const obj = {foo: 'bar'};
          expect(
            BufferedWorkerPool.serializeOptions(obj),
            'to be',
            BufferedWorkerPool.serializeOptions(obj)
          );
        });
      });
    });
  });

  describe('constructor', function() {
    it('should apply defaults', function() {
      expect(new BufferedWorkerPool(), 'to satisfy', {
        options: {
          workerType: 'process',
          forkOpts: {execArgv: process.execArgv},
          maxWorkers: expect.it('to be greater than or equal to', 1)
        }
      });
    });
  });

  describe('instance method', function() {
    let workerPool;

    beforeEach(function() {
      workerPool = BufferedWorkerPool.create();
    });

    describe('stats()', function() {
      it('should return the object returned by `workerpool.Pool#stats`', function() {
        expect(workerPool.stats(), 'to be', stats);
      });
    });

    describe('run()', function() {
      describe('when passed no arguments', function() {
        it('should reject', async function() {
          return expect(workerPool.run(), 'to be rejected with', {
            code: 'ERR_MOCHA_INVALID_ARG_TYPE'
          });
        });
      });

      describe('when passed a non-string filepath', function() {
        it('should reject', async function() {
          return expect(workerPool.run(123), 'to be rejected with', {
            code: 'ERR_MOCHA_INVALID_ARG_TYPE'
          });
        });
      });

      it('should serialize the options object', async function() {
        await workerPool.run('file.js', {foo: 'bar'});

        expect(pool.exec, 'to have a call satisfying', [
          'run',
          ['file.js', '{"foo":"bar"}']
        ]).and('was called once');
      });

      it('should deserialize the result', async function() {
        await workerPool.run('file.js', {foo: 'bar'});
        expect(serializer.deserialize, 'to have a call satisfying', [
          result
        ]).and('was called once');
      });
    });

    describe('terminate()', function() {
      describe('when called with `force`', function() {
        beforeEach(async function() {
          await workerPool.terminate(true);
        });

        it('should delegate to the underlying pool w/ "force" behavior', async function() {
          expect(pool.terminate, 'to have a call satisfying', [true]).and(
            'was called once'
          );
        });
      });

      describe('when called without `force`', function() {
        beforeEach(async function() {
          await workerPool.terminate();
        });

        it('should delegate to the underlying pool w/o "force" behavior', async function() {
          expect(pool.terminate, 'to have a call satisfying', [false]).and(
            'was called once'
          );
        });
      });
    });
  });
});
