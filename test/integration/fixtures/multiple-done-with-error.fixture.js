'use strict';

it('should fail in a test-case', function (done) {
  process.nextTick(function () {
    done();
    done(new Error('second error'));
  });
});
