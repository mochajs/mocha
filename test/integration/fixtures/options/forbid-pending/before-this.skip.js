'use strict';

describe('forbid pending - before calls `skip()`', function () {
  it('test', function () {});
  before(function () { this.skip(); });
});
