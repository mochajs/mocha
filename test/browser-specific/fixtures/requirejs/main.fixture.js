define(['lib'], function(lib) {
  describe('lib', function() {
    it('should equal "foo"', function() {
      if (lib !== 'foo') {
        throw new Error('should be "foo"');
      }
    });
  });
});
