describe('some suite', function() {
  this.bail(true);
  
  it('should bail', function() {
    throw new Error();
  });

  it('will not get run', function() {});
});
