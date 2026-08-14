'use strict';

// A test that already passed can still fail asynchronously; remaining
// tests must still run instead of being skipped (#5251).
it('test 1', function () {
  process.nextTick(function () {
    throw new Error('Too bad');
  });
});

it('test 2', function () {});

it('test 3', function () {});
