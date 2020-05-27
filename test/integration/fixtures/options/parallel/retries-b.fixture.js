describe('retry suite B', function() {
  let count = 0;
  it('should retry', function() {
    this.retries(3);
    console.log(`count: ${++count}`);
    throw new Error('failure');
  });
});