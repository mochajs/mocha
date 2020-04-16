'use strict';

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
    let warn;
    let cpuCount;

    beforeEach(function() {
      sandbox = createSandbox();
      cpuCount = 1;
      suite = new Suite('a root suite', {}, true);
      warn = sandbox.stub();

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
      BufferedRunner = rewiremock.proxy(BUFFERED_RUNNER_PATH, r => ({
        workerpool: {
          pool
        },
        os: {
          cpus: sandbox.stub().callsFake(() => new Array(cpuCount))
        },
        [require.resolve('../../lib/utils')]: r.with({warn}).callThrough()
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
            sandbox.spy(runner, 'uncaught');
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

        describe('when not provided a max job count', function() {
          it('should use a max job count based on CPU cores', function(done) {
            runner.run(
              () => {
                expect(pool, 'to have a call satisfying', {
                  args: [
                    expect.it('to be a', 'string'),
                    {
                      maxWorkers: Math.max(cpuCount - 1, 1)
                    }
                  ]
                });
                done();
              },
              {files: [], options: {}}
            );
          });
        });

        describe('when provided a max job count', function() {
          beforeEach(function() {
            cpuCount = 8;
          });

          it('should use the provided max count', function(done) {
            runner.run(
              () => {
                expect(pool, 'to have a call satisfying', {
                  args: [
                    expect.it('to be a', 'string'),
                    {
                      maxWorkers: 4
                    }
                  ]
                });
                done();
              },
              {
                files: [],
                options: {
                  jobs: 4
                }
              }
            );
          });

          describe('when the max job count exceeds the CPU count', function() {
            it('should warn', function(done) {
              run.resolves({failureCount: 0, events: []});
              runner.run(
                () => {
                  expect(warn, 'to have a call satisfying', [
                    /only enough cores available/
                  ]);
                  done();
                },
                {
                  files: [],
                  options: {jobs: 16}
                }
              );
            });
          });

          describe('when there are not enough CPU cores', function() {
            beforeEach(function() {
              cpuCount = 2;
            });

            it('should warn', function(done) {
              run.resolves({failureCount: 0, events: []});
              runner.run(
                () => {
                  expect(warn, 'to have a call satisfying', [
                    /avoid --parallel on this machine/
                  ]);
                  done();
                },
                {
                  files: [],
                  options: {jobs: 4}
                }
              );
            });
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
