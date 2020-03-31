'use strict';

const os = require('os');
const {
  EVENT_RUN_BEGIN,
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_SUITE_END,
  EVENT_SUITE_BEGIN
} = require('../../lib/runner').constants;
const rewiremock = require('rewiremock/node');
const BUFFERED_RUNNER_PATH = require.resolve('../../lib/buffered-runner.js');
const Suite = require('../../lib/suite');
const {createSandbox} = require('sinon');

describe('buffered-runner', function() {
  describe('BufferedRunner', function() {
    let sandbox;
    let pool;
    let run;
    let terminate;
    let BufferedRunner;
    let suite;

    beforeEach(function() {
      sandbox = createSandbox();

      suite = new Suite('a root suite', {}, true);

      // tests will want to further define the behavior of these.
      run = sandbox.stub();
      terminate = sandbox.stub();

      pool = sandbox.stub().returns({
        proxy: sandbox.stub().resolves({
          run
        }),
        terminate,
        stats: sandbox.stub().returns({})
      });
      BufferedRunner = rewiremock.proxy(BUFFERED_RUNNER_PATH, () => ({
        workerpool: {
          pool
        }
      }));
    });

    describe('instance method', function() {
      describe('run', function() {
        let runner;

        beforeEach(function() {
          runner = new BufferedRunner(suite);
        });

        // the purpose of this is to ensure that--despite using `Promise`s
        // internally--`BufferedRunner#run` does not return a `Promise`.
        it('should return `undefined`', function(done) {
          expect(runner.run(done, {files: [], opts: {}}), 'to be undefined');
        });

        it('should emit `EVENT_RUN_BEGIN`', async function() {
          return expect(
            () =>
              new Promise(resolve => {
                runner.run(resolve, {files: [], opts: {}});
              }),
            'to emit from',
            runner,
            EVENT_RUN_BEGIN
          );
        });

        describe('when a worker fails', function() {
          it('should cleanly force-terminate the thread pool', function(done) {
            const opts = {};
            run.withArgs('some-file.js', opts).rejects(new Error('whoops'));
            run.withArgs('some-other-file.js', opts).resolves({
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
                  {
                    args: [true]
                  },
                  {args: []}
                ]).and('was called twice');
                done();
              },
              {
                files: ['some-file.js', 'some-other-file.js'],
                opts
              }
            );
          });

          it('should delegate to Runner#uncaught', function(done) {
            const opts = {};
            sandbox.spy(runner, 'uncaught');
            const err = new Error('whoops');
            run.withArgs('some-file.js', opts).rejects(new Error('whoops'));
            run.withArgs('some-other-file.js', opts).resolves({
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
                opts
              }
            );
          });
        });

        describe('when not provided a max job count', function() {
          it('should use a max job count based on CPU cores', function(done) {
            runner.run(
              () => {
                expect(pool, 'to have a call satisfying', {
                  args: [
                    expect.it('to be a', 'string'),
                    {
                      maxWorkers: os.cpus().length - 1
                    }
                  ]
                });
                done();
              },
              {files: [], opts: {}}
            );
          });
        });

        describe('when provided a max job count', function() {
          it('should use the provided max count', function(done) {
            runner.run(
              () => {
                expect(pool, 'to have a call satisfying', {
                  args: [
                    expect.it('to be a', 'string'),
                    {
                      maxWorkers: 2
                    }
                  ]
                });
                done();
              },
              {
                files: [],
                opts: {
                  jobs: 2
                }
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
                  opts: {}
                }
              );
            });
          });

          describe('when an event contains an error and has positive failures', function() {
            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const opts = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', opts).resolves({
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
                run.withArgs('some-other-file.js', opts).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: [true]}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    opts
                  }
                );
              });
            });
            describe('when subsequent files already started running', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const opts = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', opts).resolves({
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
                run.withArgs('some-other-file.js', opts).resolves({
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
                      {args: [true]}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    opts
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
                  opts: {}
                }
              );
            });
          });
          describe('when an event contains an error and has positive failures', function() {
            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const opts = {bail: true};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', opts).resolves({
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
                        title: 'some suite'
                      }
                    }
                  ]
                });
                run.withArgs('some-other-file.js', opts).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: [true]}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    opts
                  }
                );
              });
            });

            describe('when subsequent files already started running', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const opts = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', opts).resolves({
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
                run.withArgs('some-other-file.js', opts).resolves({
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
                      {args: [true]}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    opts
                  }
                );
              });
            });

            describe('when subsequent files have not yet been run', function() {
              it('should cleanly terminate the thread pool', function(done) {
                const opts = {};
                const err = {
                  __type: 'Error',
                  message: 'oh no'
                };
                run.withArgs('some-file.js', opts).resolves({
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
                run.withArgs('some-other-file.js', opts).rejects();

                runner.run(
                  () => {
                    expect(terminate, 'to have calls satisfying', [
                      {args: [true]}, // this is the pool force-terminating
                      {args: []} // this will always be called, and will do nothing due to the previous call
                    ]).and('was called twice');
                    done();
                  },
                  {
                    files: ['some-file.js', 'some-other-file.js'],
                    opts
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
