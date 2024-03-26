it('unrefs a timeout', function(done) {
  setTimeout(done, 10).unref();
});
