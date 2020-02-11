'use strict';

// we cannot recover gracefully if a Runnable has already passed
// then fails asynchronously
it('test 1', function () {
  process.nextTick(function () {
    throw new Error('Too bad');
  });
});

it('test 2', function () {
  throw new Error('should not run - test 2');
});

it('test 3', function () {
  throw new Error('should not run - test 3');
});
