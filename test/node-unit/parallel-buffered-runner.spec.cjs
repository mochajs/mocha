"use strict";

const {
  EVENT_RUN_BEGIN,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_SUITE_END,
  EVENT_SUITE_BEGIN,
} = require("../../lib/runner.cjs").constants;
const { Suite } = require("../../lib/suite.js");
const Runner = require("../../lib/runner.cjs");
const sinon = require("sinon");
const { constants } = require("../../lib/utils.cjs");
const {
  BufferedWorkerPool,
} = require("../../lib/nodejs/buffered-worker-pool.mjs");
const {
  ParallelBufferedRunner,
} = require("../../lib/nodejs/parallel-buffered-runner.mjs");
const { MOCHA_ID_PROP_NAME } = constants;

describe("parallel-buffered-runner", function () {
  describe("ParallelBufferedRunner", function () {
    let run;
    let terminate;
    let suite;

    beforeEach(function () {
      suite = new Suite("a root suite", {}, true);

      // tests will want to further define the behavior of these.
      run = sinon.stub();
      terminate = sinon.stub();
      sinon.stub(BufferedWorkerPool, "create").returns({
        run,
        terminate,
        stats: sinon.stub().returns({}),
      });
    });

    afterEach(function () {
      sinon.restore();
    });

    describe("constructor", function () {
      it('should start in "IDLE" state', function () {
        expect(
          new ParallelBufferedRunner(suite),
          "to have property",
          "_state",
          "IDLE",
        );
      });
    });

    describe("instance property", function () {
      let runner;

      beforeEach(function () {
        runner = new ParallelBufferedRunner(suite);
      });

      describe("_state", function () {
        it("should disallow an invalid state transition", function () {
          expect(
            () => {
              runner._state = "BAILED";
            },
            "to throw",
            /invalid state transition/,
          );
        });
      });
    });

    describe("event", function () {
      let runner;

      beforeEach(function () {
        runner = new ParallelBufferedRunner(suite);
      });

      describe("EVENT_RUN_END", function () {
        it("should change the state to COMPLETE", function () {
          runner._state = "RUNNING";
          runner.emit(Runner.constants.EVENT_RUN_END);
          expect(runner._state, "to be", "COMPLETE");
        });
      });
    });

    describe("instance method", function () {
      describe("run()", function () {
        let runner;

        beforeEach(function () {
          runner = new ParallelBufferedRunner(suite);
        });

        // the purpose of this is to ensure that--despite using `Promise`s
        // internally--`BufferedRunner#run` does not return a `Promise`.
        it("should be chainable", function (done) {
          expect(runner.run(done, { files: [], options: {} }), "to be", runner);
        });

        it("should emit `EVENT_RUN_BEGIN`", async function () {
          return expect(
            () =>
              new Promise((resolve) => {
                runner.run(resolve, { files: [], options: {} });
              }),
            "to emit from",
            runner,
            EVENT_RUN_BEGIN,
          );
        });

        it("should return without completing when aborting", function (done) {
          const callback = sinon.stub();
          run.callsFake(async () => {
            runner._state = "ABORTING";
            return { failureCount: 0, events: [] };
          });

          runner.run(callback, { files: ["some-file.js"], options: {} });

          setImmediate(() => {
            expect(callback, "was not called");
            expect(runner._state, "to be", "ABORTING");
            done();
          });
        });

        describe("when instructed to link objects", function () {
          beforeEach(function () {
            runner._linkPartialObjects = true;
          });

          it("should create object references", function () {
            const options = { reporter: runner._workerReporter };
            const someSuite = {
              title: "some suite",
              [MOCHA_ID_PROP_NAME]: "bar",
            };

            run.withArgs("some-file.js", options).resolves({
              failureCount: 0,
              events: [
                {
                  eventName: EVENT_SUITE_END,
                  data: someSuite,
                },
                {
                  eventName: EVENT_TEST_PASS,
                  data: {
                    title: "some test",
                    [MOCHA_ID_PROP_NAME]: "foo",
                    parent: {
                      // this stub object points to someSuite with id 'bar'
                      [MOCHA_ID_PROP_NAME]: "bar",
                    },
                  },
                },
                {
                  eventName: EVENT_SUITE_END,
                  // ensure we are not passing the _same_ someSuite,
                  // because we won't get the same one from the subprocess
                  data: { ...someSuite },
                },
              ],
            });

            return expect(
              () =>
                new Promise((resolve) => {
                  runner.run(resolve, { files: ["some-file.js"], options: {} });
                }),
              "to emit from",
              runner,
              EVENT_TEST_PASS,
              {
                title: "some test",
                [MOCHA_ID_PROP_NAME]: "foo",
                parent: expect
                  .it("to be", someSuite)
                  .and("to have property", "title", "some suite"),
              },
            );
          });

          describe("when event data object is missing an ID", function () {
            it("should result in an uncaught exception", function (done) {
              const options = { reporter: runner._workerReporter };
              sinon.spy(runner, "uncaught");
              const someSuite = {
                title: "some suite",
                [MOCHA_ID_PROP_NAME]: "bar",
              };

              run.withArgs("some-file.js", options).resolves({
                failureCount: 0,
                events: [
                  {
                    eventName: EVENT_SUITE_END,
                    data: someSuite,
                  },
                  {
                    eventName: EVENT_TEST_PASS,
                    data: {
                      title: "some test",
                      // note missing ID right here
                      parent: {
                        // this stub object points to someSuite with id 'bar'
                        [MOCHA_ID_PROP_NAME]: "bar",
                      },
                    },
                  },
                  {
                    eventName: EVENT_SUITE_END,
                    // ensure we are not passing the _same_ someSuite,
                    // because we won't get the same one from the subprocess
                    data: { ...someSuite },
                  },
                ],
              });

              runner.run(
                () => {
                  expect(runner.uncaught, "to have a call satisfying", [
                    expect.it("to have property", "code", "ERR_MOCHA_FATAL"),
                  ]);
                  done();
                },
                { files: ["some-file.js"], options: {} },
              );
            });
          });
        });

        describe("when a worker fails", function () {
          it("should force-terminate and reject when uncaught errors are allowed", async function () {
            const options = { reporter: runner._workerReporter };
            const err = new Error("whoops");
            runner.allowUncaught = true;
            runner._state = "RUNNING";
            run.withArgs("some-file.js", options).rejects(err);

            await expect(
              () =>
                runner._createFileRunner(
                  { run, terminate, stats: sinon.stub().returns({}) },
                  options,
                )("some-file.js"),
              "to be rejected with",
              err,
            );
            expect(terminate, "to have a call satisfying", [true]).and(
              "was called once",
            );
            expect(runner._state, "to be", "ABORTING");
          });

          it("should schedule uncaught worker failures to be rethrown", function (done) {
            const err = new Error("whoops");
            const originalNextTick = process.nextTick;
            runner.allowUncaught = true;
            run.rejects(err);
            sinon.stub(process, "nextTick").callsFake((callback, ...args) => {
              if (String(callback).includes("re-throwing uncaught exception")) {
                try {
                  callback(...args);
                } catch (thrownError) {
                  expect(thrownError, "to be", err);
                  done();
                }
                return;
              }
              return originalNextTick(callback, ...args);
            });

            runner.run(sinon.stub(), {
              files: ["some-file.js"],
              options: {},
            });
          });

          it("should recover", function (done) {
            const options = { reporter: runner._workerReporter };
            run.withArgs("some-file.js", options).rejects(new Error("whoops"));
            run.withArgs("some-other-file.js", options).resolves({
              failureCount: 0,
              events: [
                {
                  eventName: EVENT_TEST_PASS,
                  data: {
                    title: "some test",
                  },
                },
                {
                  eventName: EVENT_SUITE_END,
                  data: {
                    title: "some suite",
                  },
                },
              ],
            });

            runner.run(
              () => {
                expect(terminate, "to have calls satisfying", [{ args: [] }]);
                done();
              },
              {
                files: ["some-file.js", "some-other-file.js"],
                options,
              },
            );
          });

          it("should delegate to Runner#uncaught", function (done) {
            const options = { reporter: runner._workerReporter };
            sinon.spy(runner, "uncaught");
            const err = new Error("whoops");
            run.withArgs("some-file.js", options).rejects(new Error("whoops"));
            run.withArgs("some-other-file.js", options).resolves({
              failureCount: 0,
              events: [
                {
                  eventName: EVENT_TEST_PASS,
                  data: {
                    title: "some test",
                  },
                },
                {
                  eventName: EVENT_SUITE_END,
                  data: {
                    title: "some suite",
                  },
                },
              ],
            });

            runner.run(
              () => {
                expect(runner.uncaught, "to have a call satisfying", [err]);
                done();
              },
              {
                files: ["some-file.js", "some-other-file.js"],
                options,
              },
            );
          });
        });

        describe("when suite should bail", function () {
          describe("when no event contains an error", function () {
            it("should not force-terminate", function (done) {
              run.resolves({
                failureCount: 0,
                events: [
                  {
                    eventName: EVENT_SUITE_BEGIN,
                    data: {
                      title: "some suite",
                      _bail: true,
                    },
                  },
                  {
                    eventName: EVENT_TEST_PASS,
                    data: {
                      title: "some test",
                    },
                  },
                  {
                    eventName: EVENT_SUITE_END,
                    data: {
                      title: "some suite",
                      _bail: true,
                    },
                  },
                ],
              });

              runner.run(
                () => {
                  expect(terminate, "to have a call satisfying", {
                    args: [],
                  }).and("was called once");
                  done();
                },
                {
                  files: ["some-file.js", "some-other-file.js"],
                  options: {},
                },
              );
            });
          });

          describe("when an event contains an error and has positive failures", function () {
            describe("when subsequent files have not yet been run", function () {
              it("should cleanly terminate the thread pool", function (done) {
                const options = { reporter: runner._workerReporter };
                const err = {
                  __type: "Error",
                  message: "oh no",
                };
                run.withArgs("some-file.js", options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: "some test",
                      },
                      error: err,
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                  ],
                });
                run.withArgs("some-other-file.js", options).rejects();

                runner.run(
                  () => {
                    expect(terminate, "to have calls satisfying", [
                      { args: [] }, // this is the pool force-terminating
                      { args: [] }, // this will always be called, and will do nothing due to the previous call
                    ]).and("was called twice");
                    done();
                  },
                  {
                    files: ["some-file.js", "some-other-file.js"],
                    options,
                  },
                );
              });
            });

            describe("when subsequent files already started running", function () {
              it("should cleanly terminate the thread pool", function (done) {
                const options = { reporter: runner._workerReporter };
                const err = {
                  __type: "Error",
                  message: "oh no",
                };
                run.withArgs("some-file.js", options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: "some test",
                      },
                      error: err,
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                  ],
                });
                run.withArgs("some-other-file.js", options).resolves({
                  failureCount: 0,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: "some suite",
                      },
                    },
                    {
                      eventName: EVENT_TEST_PASS,
                      data: {
                        title: "some test",
                      },
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                      },
                    },
                  ],
                });

                runner.run(
                  () => {
                    expect(terminate, "to have calls satisfying", [
                      { args: [] }, // this is the pool force-terminating
                      { args: [] }, // this will always be called, and will do nothing due to the previous call
                    ]).and("was called twice");
                    done();
                  },
                  {
                    files: ["some-file.js", "some-other-file.js"],
                    options,
                  },
                );
              });
            });
          });
        });

        describe("when a suite has a bail flag", function () {
          describe("when no event contains an error", function () {
            it("should not force-terminate", function (done) {
              run.resolves({
                failureCount: 0,
                events: [
                  {
                    eventName: EVENT_TEST_PASS,
                    data: {
                      title: "some test",
                    },
                  },
                  {
                    eventName: EVENT_SUITE_END,
                    data: {
                      title: "some suite",
                      _bail: true,
                    },
                  },
                ],
              });

              runner.run(
                () => {
                  expect(terminate, "to have a call satisfying", {
                    args: [],
                  }).and("was called once");
                  done();
                },
                {
                  files: ["some-file.js", "some-other-file.js"],
                  options: {},
                },
              );
            });
          });

          describe("when an event contains an error and has positive failures", function () {
            describe("when subsequent files have not yet been run", function () {
              it("should cleanly terminate the thread pool", function (done) {
                const options = { reporter: runner._workerReporter };
                const err = {
                  __type: "Error",
                  message: "oh no",
                };
                run.withArgs("some-file.js", options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: "some test",
                      },
                      error: err,
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                  ],
                });
                run.withArgs("some-other-file.js", options).rejects();

                runner.run(
                  () => {
                    expect(terminate, "to have calls satisfying", [
                      { args: [] }, // this is the pool force-terminating
                      { args: [] }, // this will always be called, and will do nothing due to the previous call
                    ]).and("was called twice");
                    done();
                  },
                  {
                    files: ["some-file.js", "some-other-file.js"],
                    options,
                  },
                );
              });
            });

            describe("when subsequent files already started running", function () {
              it("should cleanly terminate the thread pool", function (done) {
                const options = { reporter: runner._workerReporter };
                const err = {
                  __type: "Error",
                  message: "oh no",
                };
                run.withArgs("some-file.js", options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: "some test",
                      },
                      error: err,
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                        _bail: true,
                      },
                    },
                  ],
                });
                run.withArgs("some-other-file.js", options).resolves({
                  failureCount: 0,
                  events: [
                    {
                      eventName: EVENT_TEST_PASS,
                      data: {
                        title: "some test",
                      },
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: "some suite",
                      },
                    },
                  ],
                });

                runner.run(
                  () => {
                    expect(terminate, "to have calls satisfying", [
                      { args: [] }, // this is the pool force-terminating
                      { args: [] }, // this will always be called, and will do nothing due to the previous call
                    ]).and("was called twice");
                    done();
                  },
                  {
                    files: ["some-file.js", "some-other-file.js"],
                    options,
                  },
                );
              });
            });
          });
        });
      });

      describe("linkPartialObjects()", function () {
        let runner;

        beforeEach(function () {
          runner = new ParallelBufferedRunner(suite);
        });

        it("should return the runner", function () {
          expect(runner.linkPartialObjects(), "to be", runner);
        });

        // avoid testing implementation details; don't check _linkPartialObjects
      });

      describe("isParallelMode()", function () {
        let runner;

        beforeEach(function () {
          runner = new ParallelBufferedRunner(suite);
        });

        it("should return true", function () {
          expect(runner.isParallelMode(), "to be true");
        });
      });

      describe("workerReporter()", function () {
        let runner;

        beforeEach(function () {
          runner = new ParallelBufferedRunner(suite);
        });

        it("should return its context", function () {
          expect(runner.workerReporter(), "to be", runner);
        });
      });

      describe("_bindSigIntListener()", function () {
        let runner;
        let pool;

        beforeEach(function () {
          runner = new ParallelBufferedRunner(suite);
          pool = {
            terminate: sinon.stub().resolves(),
          };
          sinon.stub(process, "kill");
          sinon.stub(process, "once");
        });

        it("should force-terminate the worker pool before re-sending SIGINT", async function () {
          const sigIntListener = runner._bindSigIntListener(pool);

          await sigIntListener();
          await new Promise((resolve) => setImmediate(resolve));

          expect(pool.terminate, "to have a call satisfying", [true]).and(
            "was called once",
          );
          expect(runner._state, "to be", "ABORTED");
          expect(process.kill, "to have a call satisfying", [
            process.pid,
            "SIGINT",
          ]);
        });

        it("should set the exit code when force-termination fails", async function () {
          const originalExitCode = process.exitCode;
          pool.terminate.rejects(new Error("nope"));
          sinon.stub(console, "error");

          try {
            process.exitCode = undefined;
            const sigIntListener = runner._bindSigIntListener(pool);

            await sigIntListener();
            await new Promise((resolve) => setImmediate(resolve));

            expect(console.error, "was called once");
            expect(process.exitCode, "to be", 1);
            expect(process.kill, "to have a call satisfying", [
              process.pid,
              "SIGINT",
            ]);
          } finally {
            process.exitCode = originalExitCode;
          }
        });
      });
    });
  });
});
