'use strict';

const {
  EVENT_RUN_BEGIN,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_SUITE_END,
  EVENT_SUITE_BEGIN
} = require('../../lib/runner').constants;
const rewiremock = require('rewiremock/node');
const BUFFERED_RUNNER_PATH = require.resolve(
  '../../lib/nodejs/parallel-buffered-runner.js'
);
const Suite = require('../../lib/suite');
const Runner = require('../../lib/runner');
const sinon = require('sinon');

describe('buffered-runner', function() {
  describe('BufferedRunner', function() {
    let run;
    let BufferedWorkerPool;
    let terminate;
    let BufferedRunner;
    let suite;
    let warn;
    let cpuCount;

    beforeEach(function() {
      cpuCount = 1;
      suite = new Suite('a root suite', {}, true);
      warn = sinon.stub();

      // tests will want to further define the behavior of these.
      run = sinon.stub();
      terminate = sinon.stub();
      BufferedWorkerPool = {
        create: sinon.stub().returns({
          run,
          terminate,
          stats: sinon.stub().returns({})
        })
      };
      BufferedRunner = rewiremock.proxy(BUFFERED_RUNNER_PATH, r => ({
        '../../lib/nodejs/buffered-worker-pool': {
          BufferedWorkerPool
        },
        os: {
          cpus: sinon.stub().callsFake(() => new Array(cpuCount))
        },
        '../../lib/utils': r.with({warn}).callThrough()
      }));
    });

    describe('constructor', function() {
      it('should start in "IDLE" state', function() {
        expect(new BufferedRunner(suite), 'to have property', '_state', 'IDLE');
      });
    });

    describe('instance property', function() {
      let runner;

      beforeEach(function() {
        runner = new BufferedRunner(suite);
      });

      describe('_state', function() {
        it('should disallow an invalid state transition', function() {
          expect(
            () => {
              runner._state = 'BAILED';
            },
            'to throw',
            /invalid state transition/
          );
        });
      });
    });

    describe('event', function() {
      let runner;

      beforeEach(function() {
        runner = new BufferedRunner(suite);
      });

      describe('EVENT_RUN_END', function() {
        it('should change the state to COMPLETE', function() {
          runner._state = 'RUNNING';
          runner.emit(Runner.constants.EVENT_RUN_END);
          expect(runner._state, 'to be', 'COMPLETE');
        });
      });
    });

    describe('instance method', function() {
      describe('run', function() {
        let runner;

        beforeEach(function() {
          runner = new BufferedRunner(suite);
        });

        // the purpose of this is to ensure that--despite using `Promise`s
        // internally--`BufferedRunner#run` does not return a `Promise`.
        it('should be chainable', function(done) {
          expect(runner.run(done, {files: [], options: {}}), 'to be', runner);
        });

        it('should emit `EVENT_RUN_BEGIN`', async function() {
          return expect(
            () =>
              new Promise(resolve => {
                runner.run(resolve, {files: [], options: {}});
              }),
            'to emit from',
            runner,
            EVENT_RUN_BEGIN
          );
        });

        describe('when a worker fails', function() {
          it('should recover', function(done) {
            const options = {};
            run.withArgs('some-file.js', options).rejects(new Error('whoops'));
            run.withArgs('some-other-file.js', options).resolves({
              failureCount: 0,
              events: [
                {
                  eventName: EVENT_TEST_PASS,
                  data: {
                    title: 'some test'
                  }
                },
                {
                  eventName: EVENT_SUITE_END,
                  data: {
                    title: 'some suite'
                  }
                }
              ]
            });

            runner.run(
              () => {
                expect(terminate, 'to have calls satisfying', [{args: []}]);
                done();
              },
              {
                files: ['some-file.js', 'some-other-file.js'],
                options
              }
            );
          });

          it('should delegate to Runner#uncaught', function(done) {
            const options = {};
            sinon.spy(runner, 'uncaught');
            const err = new Error('whoops');
            run.withArgs('some-file.js', options).rejects(new Error('whoops'));
            run.withArgs('some-other-file.js', options).resolves({
              failureCount: 0,
              events: [
                {
                  eventName: EVENT_TEST_PASS,
                  data: {
                    title: 'some test'
                  }
                },
                {
                  eventName: EVENT_SUITE_END,
                  data: {
                    title: 'some suite'
                  }
                }
              ]
            });

            runner.run(
              () => {
                expect(runner.uncaught, 'to have a call satisfying', [err]);
                done();
              },
              {
                files: ['some-file.js', 'some-other-file.js'],
                options
              }
            );
          });
        });

        describe('when suite should bail', function() {
          describe('when no event contains an error', function() {
            it('should not force-terminate', function(done) {
              run.resolves({
                failureCount: 0,
                events: [
                  {
                    eventName: EVENT_SUITE_BEGIN,
                    data: {
                      title: 'some suite',
                      _bail: true
                    }
                  },
                  {
                    eventName: EVENT_TEST_PASS,
                    data: {
                      title: 'some test'
                    }
                  },
                  {
                    eventName: EVENT_SUITE_END,
                    data: {
                      title: 'some suite',
                      _bail: true
                    }
                  }
                ]
              });

              runner.run(
                () => {
                  expect(terminate, 'to have a call satisfying', {
                    args: []
                  }).and('was called once');
                  done();
                },
                {
                  files: ['some-file.js', 'some-other-file.js'],
                  options: {}
                }
              );
            });
          });

          describe('when an event contains an error and has positive failures', function() {
            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const options = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    },
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: 'some test'
                      },
                      error: err
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', options).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: []}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    options
                  }
                );
              });
            });
            describe('when subsequent files already started running', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const options = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    },
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: 'some test'
                      },
                      error: err
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', options).resolves({
                  failureCount: 0,
                  events: [
                    {
                      eventName: EVENT_SUITE_BEGIN,
                      data: {
                        title: 'some suite'
                      }
                    },
                    {
                      eventName: EVENT_TEST_PASS,
                      data: {
                        title: 'some test'
                      }
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite'
                      }
                    }
                  ]
                });

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: []}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    options
                  }
                );
              });
            });
          });
        });

        describe('when a suite has a bail flag', function() {
          describe('when no event contains an error', function() {
            it('should not force-terminate', function(done) {
              run.resolves({
                failureCount: 0,
                events: [
                  {
                    eventName: EVENT_TEST_PASS,
                    data: {
                      title: 'some test'
                    }
                  },
                  {
                    eventName: EVENT_SUITE_END,
                    data: {
                      title: 'some suite',
                      _bail: true
                    }
                  }
                ]
              });

              runner.run(
                () => {
                  expect(terminate, 'to have a call satisfying', {
                    args: []
                  }).and('was called once');
                  done();
                },
                {
                  files: ['some-file.js', 'some-other-file.js'],
                  options: {}
                }
              );
            });
          });
          describe('when an event contains an error and has positive failures', function() {
            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const options = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: 'some test'
                      },
                      error: err
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', options).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: []}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    options
                  }
                );
              });
            });

            describe('when subsequent files already started running', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const options = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: 'some test'
                      },
                      error: err
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', options).resolves({
                  failureCount: 0,
                  events: [
                    {
                      eventName: EVENT_TEST_PASS,
                      data: {
                        title: 'some test'
                      }
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite'
                      }
                    }
                  ]
                });

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: []}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    options
                  }
                );
              });
            });

            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const options = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', options).resolves({
                  failureCount: 1,
                  events: [
                    {
                      eventName: EVENT_TEST_FAIL,
                      data: {
                        title: 'some test'
                      },
                      error: err
                    },
                    {
                      eventName: EVENT_SUITE_END,
                      data: {
                        title: 'some suite',
                        _bail: true
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', options).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: []}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    options
                  }
                );
              });
            });
          });
        });
      });
    });
  });
});
