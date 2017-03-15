'use strict';

describe('spec 1', function () {
  before(function () {
    console.log('before');
    throw new Error('before hook error');
  });
  it('should not be called because of error in before hook', function () {
    console.log('test 1');
  });
  it('should not be called because of error in before hook', function () {
    console.log('test 2');
  });
});
describe('spec 2', function () {
  it('should be called, because hook error was in a sibling suite', function () {
    console.log('test 3');
  });
});
