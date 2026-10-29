"use strict";

const sinon = require("sinon");
const workerpool = require("workerpool");
const {
  BufferedWorkerPool,
} = require("../../lib/nodejs/buffered-worker-pool.js");
const { SerializableWorkerResult } = require("../../lib/nodejs/serializer.js");

describe("class BufferedWorkerPool", function () {
  let pool;
  let stats;
  let result;

  beforeEach(function () {
    stats = {
      totalWorkers: 10,
      busyWorkers: 8,
      idleWorkers: 2,
      pendingTasks: 3,
    };
    result = {
      __type: "SerializableWorkerResult",
      events: [],
      failureCount: 0,
    };
    pool = {
      terminate: sinon.stub().resolves(),
      exec: sinon.stub().resolves(result),
      stats: sinon.stub().returns(stats),
    };
    sinon.stub(workerpool, "pool").returns(pool);
    sinon.spy(BufferedWorkerPool, "serializeOptionsInternal");
    sinon.spy(SerializableWorkerResult, "deserialize");

    // reset cache
    BufferedWorkerPool.resetOptionsCache();
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("static method", function () {
    describe("create()", function () {
      it("should return a BufferedWorkerPool instance", function () {
        expect(
          BufferedWorkerPool.create({ foo: "bar" }),
          "to be a",
          BufferedWorkerPool,
        );
      });

      describe("when passed no arguments", function () {
        it("should not throw", function () {
          expect(BufferedWorkerPool.create, "not to throw");
        });
      });
    });

    describe("serializeOptions()", function () {
      describe("when passed no arguments", function () {
        it("should not throw", function () {
          expect(BufferedWorkerPool.serializeOptions, "not to throw");
        });
      });

      it("should return a serialized string", function () {
        expect(
          BufferedWorkerPool.serializeOptions({ foo: "bar" }),
          "to be a",
          "string",
        );
      });

      describe("when called multiple times with the same object", function () {
        it("should not perform serialization twice", function () {
          const obj = { foo: "bar" };
          BufferedWorkerPool.serializeOptions(obj);
          BufferedWorkerPool.serializeOptions(obj);
          expect(
            BufferedWorkerPool.serializeOptionsInternal,
            "was called once",
          );
        });

        it("should return the same value", function () {
          const obj = { foo: "bar" };
          expect(
            BufferedWorkerPool.serializeOptions(obj),
            "to be",
            BufferedWorkerPool.serializeOptions(obj),
          );
        });
      });
    });
  });

  describe("constructor", function () {
    it("should apply defaults", function () {
      expect(new BufferedWorkerPool(), "to satisfy", {
        options: {
          workerType: "process",
          forkOpts: { execArgv: process.execArgv },
          maxWorkers: expect.it("to be greater than or equal to", 1),
        },
      });
    });

    it("should safely resolve _removeWorker when worker is terminated", async function () {
      const origStub = sinon.stub().resolves();
      pool._removeWorker = origStub;
      pool._removeWorkerFromList = sinon.stub();
      pool._ensureMinWorkers = sinon.stub();
      const bwp = new BufferedWorkerPool();
      const terminatedWorker = { terminated: true };
      const res = await bwp._pool._removeWorker(terminatedWorker);
      expect(
        pool._removeWorkerFromList,
        "to have a call satisfying",
        [terminatedWorker],
      ).and("was called once");
      expect(pool._ensureMinWorkers, "was called once");
      expect(origStub, "was not called");
      expect(res, "to be", terminatedWorker);
    });

    it("should delegate to original _removeWorker when worker is not terminated", async function () {
      const origStub = sinon.stub().resolves("normal");
      pool._removeWorker = origStub;
      const bwp = new BufferedWorkerPool();
      const activeWorker = { terminated: false };
      const res = await bwp._pool._removeWorker(activeWorker);
      expect(origStub, "to have a call satisfying", [activeWorker]).and(
        "was called once",
      );
      expect(res, "to be", "normal");
    });
  });

  describe("instance method", function () {
    let workerPool;

    beforeEach(function () {
      workerPool = BufferedWorkerPool.create();
    });

    describe("stats()", function () {
      it("should return the object returned by `workerpool.Pool#stats`", function () {
        expect(workerPool.stats(), "to be", stats);
      });
    });

    describe("run()", function () {
      describe("when passed no arguments", function () {
        it("should reject", async function () {
          return expect(workerPool.run(), "to be rejected with", {
            code: "ERR_MOCHA_INVALID_ARG_TYPE",
          });
        });
      });

      describe("when passed a non-string filepath", function () {
        it("should reject", async function () {
          return expect(workerPool.run(123), "to be rejected with", {
            code: "ERR_MOCHA_INVALID_ARG_TYPE",
          });
        });
      });

      it("should serialize the options object", async function () {
        await workerPool.run("file.js", { foo: "bar" });

        expect(pool.exec, "to have a call satisfying", [
          "run",
          ["file.js", '{"foo":"bar"}'],
        ]).and("was called once");
      });

      it("should deserialize the result", async function () {
        await workerPool.run("file.js", { foo: "bar" });
        expect(
          SerializableWorkerResult.deserialize,
          "to have a call satisfying",
          [result],
        ).and("was called once");
      });
    });

    describe("terminate()", function () {
      describe("when called with `force`", function () {
        beforeEach(async function () {
          await workerPool.terminate(true);
        });

        it('should delegate to the underlying pool w/ "force" behavior', async function () {
          expect(pool.terminate, "to have a call satisfying", [true]).and(
            "was called once",
          );
        });
      });

      describe("when called without `force`", function () {
        beforeEach(async function () {
          await workerPool.terminate();
        });

        it('should delegate to the underlying pool w/o "force" behavior', async function () {
          expect(pool.terminate, "to have a call satisfying", [false]).and(
            "was called once",
          );
        });
      });
    });
  });
});
