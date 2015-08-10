describe('spec 1', function () {
  afterEach(function (done) {
    console.log('after');
    process.nextTick(function () {
      throw new Error('after each hook error');
    });
  });
  it('should be called because error is in after each hook', function () {
    console.log('test 1');
  });
  it('should not be called', function () {
    console.log('test 2');
  });
});
describe('spec 2', function () {
  it('should be called, because hook error was in a sibling suite', function () {
    console.log('test 3');
  });
});
