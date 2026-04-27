'use strict';

var assert = require('assert');

global.__delayPerSuiteEvents = global.__delayPerSuiteEvents || [];


describe('suite1', function () {
  enableDelay("suite1");
  it('suite1 waits for suite2', function () {
    assert.ok(
      global.__delayPerSuiteEvents.indexOf('suite2-ready') !== -1,
      'suite2 should be ready before root starts',
    );
    global.__delayPerSuiteEvents.push('suite1-test');
  });
});

describe('suite2', function () {
  enableDelay("suite2");
  it('suite2 runs after suite1 is ready', function () {
    global.__delayPerSuiteEvents.push('suite2-test');
  });
});

setTimeout(function () {
  global.__delayPerSuiteEvents.push('suite2-ready');
  run("suite2");
}, 50);

setTimeout(function () {
  global.__delayPerSuiteEvents.push('suite1-ready');
  run("suite1");
}, 100);