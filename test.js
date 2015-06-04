function usedToBeAsync (cb) {
  cb()
}

it('test', function(done) {
  this.timeout(4294967296);
  usedToBeAsync(done)
});

