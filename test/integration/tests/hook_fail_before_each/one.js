describe('one', function() {
  var increment = 0;

  beforeEach(function() {
    if (++increment === 2) {
      throw new Error('ouch');
    }
  });

  it('should work', function() {
  });

  it('should fail', function() {
  });
});
