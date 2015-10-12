it('throwing an error after calling done()', function(done) {
  setImmediate(done);
  throw new Error('This error should not be masked');
});
