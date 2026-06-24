'use strict';

it('test 1', function () {
  process.nextTick(function () {
    throw new Error('Too bad');
  });
});

it('test 2', function () {});

it('test 3', function () {});
