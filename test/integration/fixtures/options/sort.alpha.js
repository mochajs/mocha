describe('alpha', function(){
  it('should be executed first', function(){
    if (global.beta) {
      throw new Error('alpha was not executed first');
    }
  });
});
