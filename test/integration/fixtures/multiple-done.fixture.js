'use strict';

describe('suite', function() {
  beforeEach(function(done) {
    done();
    done();
  });

  it('test', function() {});
});

it('should fail in a test-case', function (done) {
  process.nextTick(function () {
    done();
    done();
  });
});
