'use strict';

// this reporter does not actually output anything to the terminal, so we
// need to test it differently.

const {
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING,
  EVENT_TEST_BEGIN,
  EVENT_TEST_END,
  EVENT_TEST_RETRY,
  EVENT_DELAY_BEGIN,
  EVENT_DELAY_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_RUN_END
} = require('../../../lib/runner').constants;
const {EventEmitter} = require('node:events');
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

describe('ParallelBuffered', function () {
  let runner;
  let ParallelBuffered;

  beforeEach(function () {
    runner = new EventEmitter();
    ParallelBuffered = rewiremock.proxy(
      () => require('../../../lib/nodejs/reporters/parallel-buffered'),
      {
        '../../../lib/nodejs/serializer': {
          SerializableEvent: {
            create: (eventName, runnable, err) => ({
              eventName,
              data: runnable,
              error: err,
              __type: 'MockSerializableEvent'
            })
          },
          SerializableWorkerResult: {
            create: (events, failures) => ({
              events,
              failures,
              __type: 'MockSerializableWorkerResult'
            })
          }
        },
        '../../../lib/reporters/base': class MockBase {}
      }
    );
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('constructor', function () {
    it('should listen for Runner events', function () {
      // EventEmitter#once calls thru to EventEmitter#on, which
      // befouls our assertion below.
      sinon.stub(runner, 'once');
      sinon.stub(runner, 'on');
      // eslint-disable-next-line no-new
      new ParallelBuffered(runner);
      expect(runner.on, 'to have calls satisfying', [
        // via Buffered
        [EVENT_SUITE_BEGIN, expect.it('to be a function')],
        [EVENT_SUITE_END, expect.it('to be a function')],
        [EVENT_TEST_BEGIN, expect.it('to be a function')],
        [EVENT_TEST_PENDING, expect.it('to be a function')],
        [EVENT_TEST_FAIL, expect.it('to be a function')],
        [EVENT_TEST_PASS, expect.it('to be a function')],
        [EVENT_TEST_RETRY, expect.it('to be a function')],
        [EVENT_TEST_END, expect.it('to be a function')],
        [EVENT_HOOK_BEGIN, expect.it('to be a function')],
        [EVENT_HOOK_END, expect.it('to be a function')]
      ]);
    });

    it('should listen for Runner events expecting to occur once', function () {
      sinon.stub(runner, 'once');
      // eslint-disable-next-line no-new
      new ParallelBuffered(runner);
      expect(runner.once, 'to have calls satisfying', [
        [EVENT_DELAY_BEGIN, expect.it('to be a function')],
        [EVENT_DELAY_END, expect.it('to be a function')],
        [EVENT_RUN_END, expect.it('to be a function')]
      ]);
    });
  });

  describe('event', function () {
    let reporter;

    beforeEach(function () {
      reporter = new ParallelBuffered(runner);
    });

    describe('on EVENT_RUN_END', function () {
      it('should remove all listeners', function () {
        runner.emit(EVENT_RUN_END);
        expect(runner.listeners(), 'to be empty');
      });
    });

    describe('on any other event listened for', function () {
      it('should populate its `events` array with SerializableEvents', function () {
        const suite = {
          title: 'some suite'
        };
        const test = {
          title: 'some test'
        };
        runner.emit(EVENT_SUITE_BEGIN, suite);
        runner.emit(EVENT_TEST_BEGIN, test);
        runner.emit(EVENT_TEST_PASS, test);
        runner.emit(EVENT_TEST_END, test);
        runner.emit(EVENT_SUITE_END, suite);
        expect(reporter.events, 'to equal', [
          {
            eventName: EVENT_SUITE_BEGIN,
            data: suite,
            __type: 'MockSerializableEvent'
          },
          {
            eventName: EVENT_TEST_BEGIN,
            data: test,
            __type: 'MockSerializableEvent'
          },
          {
            eventName: EVENT_TEST_PASS,
            data: test,
            __type: 'MockSerializableEvent'
          },
          {
            eventName: EVENT_TEST_END,
            data: test,
            __type: 'MockSerializableEvent'
          },
          {
            eventName: EVENT_SUITE_END,
            data: suite,
            __type: 'MockSerializableEvent'
          }
        ]);
      });
    });
  });

  describe('instance method', function () {
    let reporter;

    beforeEach(function () {
      reporter = new ParallelBuffered(runner);
    });

    describe('done', function () {
      it('should execute its callback with a SerializableWorkerResult', function () {
        const suite = {
          title: 'some suite'
        };
        const test = {
          title: 'some test'
        };
        runner.emit(EVENT_SUITE_BEGIN, suite);
        runner.emit(EVENT_TEST_BEGIN, test);
        runner.emit(EVENT_TEST_PASS, test);
        runner.emit(EVENT_TEST_END, test);
        runner.emit(EVENT_SUITE_END, suite);
        const cb = sinon.stub();
        reporter.done(0, cb);
        expect(cb, 'to have a call satisfying', [
          {
            events: [
              {
                eventName: EVENT_SUITE_BEGIN,
                data: suite,
                __type: 'MockSerializableEvent'
              },
              {
                eventName: EVENT_TEST_BEGIN,
                data: test,
                __type: 'MockSerializableEvent'
              },
              {
                eventName: EVENT_TEST_PASS,
                data: test,
                __type: 'MockSerializableEvent'
              },
              {
                eventName: EVENT_TEST_END,
                data: test,
                __type: 'MockSerializableEvent'
              },
              {
                eventName: EVENT_SUITE_END,
                data: suite,
                __type: 'MockSerializableEvent'
              }
            ],
            failures: 0,
            __type: 'MockSerializableWorkerResult'
          }
        ]);
      });

      it('should reset its `events` prop', function () {
        const suite = {
          title: 'some suite'
        };
        const test = {
          title: 'some test'
        };
        runner.emit(EVENT_SUITE_BEGIN, suite);
        runner.emit(EVENT_TEST_BEGIN, test);
        runner.emit(EVENT_TEST_PASS, test);
        runner.emit(EVENT_TEST_END, test);
        runner.emit(EVENT_SUITE_END, suite);
        const cb = sinon.stub();
        reporter.done(0, cb);
        expect(reporter.events, 'to be empty');
      });
    });
  });
});
