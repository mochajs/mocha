function usedToBeAsync (cb) {
  cb()
}

it('test', function() {
  this.timeout(4294967296);
  usedToBeAsync(done)
});

