var semaphore = wait();

process.nextTick(function() {

  describe('test', function() {

    it('can be generated asynchronously', function(done) {
      done();
    });

  });

  semaphore.resume();

});
