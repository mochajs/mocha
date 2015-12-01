describe('retries', function() {
  this.retries(3);
  describe('nested', function () {
    it('should retry on test 3', function(){
      this.retries(1);
      throw new Error('retry error');
    });
  });
});
