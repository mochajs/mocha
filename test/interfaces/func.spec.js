'use strict';

var Promise = require('es6-promise');

describe('behavior', function(suite) {
  suite.timeout(200);

  it('should work synchronously', function(test) {
    expect(1 + 1, 'to be', 2);
    expect(2 + 2, 'to be', 4);
    test.done();
  });

  it('should work asynchronously', function(test) {
    expect(1 - 1, 'to be', 0);
    expect(2 - 1, 'to be', 1);
    process.nextTick(function() {
      test.done();
    });
  });

  it('should work with a Promise', function() {
    expect(1 - 1, 'to be', 0);
    expect(2 - 1, 'to be', 1);
    return Promise.resolve();
  });

  it('should work with context methods', function(test) {
    expect(1 - 1, 'to be', 0);
    expect(2 - 1, 'to be', 1);
    test.timeout(400);
    return Promise.resolve();
  });

  afterEach(function(hook) {
    hook.timeout(200);
    hook.done();
  });

  afterEach(function() {
    return Promise.resolve();
  });
});
