describe('production mode - failed', function () {
  it('test1', function () {});
  it('test2', function () { throw new Error('fail'); });
  it('test3', function () {});
});
