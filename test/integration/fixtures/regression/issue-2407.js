describe('async thing', function() {
  it('should not just timeout if "done" never called (and report more info)', function(done) {
    return new Promise(function(resolve, reject) {
      reject('foo');
    });
  });

  it('should not just timeout if "done" called but Promise never fulfilled', function(done) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        done(null, 'bar');
      });
    });
  });

  it('should not just timeout if "done" called but Promise never fulfilled (but is also synchronous)', function(done) {
    return new Promise(function(resolve) {
      done(null, 'bar');
    });
  });
});
