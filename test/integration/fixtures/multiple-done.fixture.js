'use strict';

// The suite below should result in an additional error, but does
// not. Uncomment once this bug is resolved.

// describe('suite', function() {
//   beforeEach(function(done) {
//     done();
//     done();
//   });

//   it('test', function() {});
// });

it('should fail in a test-case', function (done) {
  process.nextTick(function () {
    done();
    done();
  });
});
