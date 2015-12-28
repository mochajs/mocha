var fn = function(){};

describe('production mode', function() {
  describe('suite 1', function() {
    it('should not allow a pending test');
    it('should only pass one test of a given title', fn);
    it('should only pass one test of a given title', fn);
    it('should pass the same title in a different suite', fn);
    it.skip('should fail a test marked skip', fn);
  });
  describe('suite 2', function() {
    it('should pass the same title in a different suite', fn);
  });
});
