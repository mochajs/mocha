var MS = 500,
  start = new Date().getTime();

setTimeout(function () {
  describe('delayed execution', function () {
    it('should have waited ' + MS + 'ms to run this suite', function () {
      (new Date().getTime() - MS >= start).should.be.true;
    });

    it('should have no effect if attempted twice in the same suite',
      function () {
        true.should.be.true;
        run();
        true.should.be.true;
      });
  });
  run();

}, MS);
