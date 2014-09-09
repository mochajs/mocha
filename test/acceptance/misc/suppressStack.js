describe('suppress-stack', function() {
  it('should not include a stack trace on failed tests', function() {
    (1).should.eql(2); 
  });
  it('should not include a stack trace on errors', function() {
    throw new Error('Uncaught error');
  });
});
