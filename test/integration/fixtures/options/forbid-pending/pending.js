'use strict';

describe('forbid pending - test without function', function () {
  it('test1', function () {});
  it('test2');
  it('test3', function () {});
});
