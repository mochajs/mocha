'use strict';

describe('spec 1', function () {
  after(function (done) {
    console.log('after');
    process.nextTick(function () {
      throw new Error('after hook error');
    });
  });
  it('should be called because error is in after hook', function () {
    console.log('test 1');
  });
  it('should be called because error is in after hook', function () {
    console.log('test 2');
  });
});
describe('spec 2', function () {
  it('should be called, because hook error was in a sibling suite', function () {
    console.log('test 3');
  });
});
describe('spec 3', function () {
  after(function (done) {
    console.log('after 1');
    process.nextTick(function () {
      throw new Error('after hook error');
    });
  });
  after(function (done) {
    console.log('after 2');
    done();
  });
  it('should call all after hooks also if one fails', function () {
    console.log('test 4');
  });
});
