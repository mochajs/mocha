describe('slow suite', () => {
  it('should be slow', (done) => {
    setTimeout(200, done);
  });
});
