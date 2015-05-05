describe('grep', function() {
  describe('match', function() {
    it('should run', function(){});
    it('should also run', function() {});
  });

  describe('fail', function(){
    it('should not be ran', function() {
      throw new Error('Spec should not run');
    });
  });
});
