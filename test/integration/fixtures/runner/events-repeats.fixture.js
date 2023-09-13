'use strict';
var Runner = require('../../../../lib/runner.js');
var assert = require('assert');
var constants = Runner.constants;
var EVENT_HOOK_BEGIN = constants.EVENT_HOOK_BEGIN;
var EVENT_HOOK_END = constants.EVENT_HOOK_END;
var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
var EVENT_RUN_END = constants.EVENT_RUN_END;
var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
var EVENT_SUITE_END = constants.EVENT_SUITE_END;
var EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
var EVENT_TEST_END = constants.EVENT_TEST_END;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_RETRY = constants.EVENT_TEST_RETRY;

var emitOrder = [
  EVENT_RUN_BEGIN,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_BEGIN,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_TEST_BEGIN,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_TEST_RETRY,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_TEST_BEGIN,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_TEST_PASS,
  EVENT_TEST_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_SUITE_END,
  EVENT_SUITE_END,
  EVENT_RUN_END
];

var realEmit = Runner.prototype.emit;
Runner.prototype.emit = function(event, ...args) {
  assert.strictEqual(event, emitOrder.shift());
  return realEmit.call(this, event, ...args);
};

describe('suite A', function() {
  before('before', function() {});
  beforeEach('beforeEach', function() {});
  it('test A', () => undefined);
  afterEach('afterEach', function() {});
  after('after', function() {});
});
