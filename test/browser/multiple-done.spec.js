'use strict';

describe('Multiple Done calls', function () {
  it('should report an error if done was called more than once', function (done) {
    done();
    done();
  });

  it('should report an error if an exception happened async after done was called', function (done) {
    done();
    setTimeout(done, 50);
  });

  it('should report an error if an exception happened after done was called', function (done) {
    done();
    throw new Error('thrown error');
  });
});
