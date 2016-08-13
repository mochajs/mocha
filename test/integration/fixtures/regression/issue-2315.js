describe('issue-2315: cannot read property currentRetry of undefined', function () {
  before(function () {
    require('http').createServer().listen(1);
  });

  it('something', function () {});
});
