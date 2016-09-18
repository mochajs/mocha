describe('spec 1', function () {
  afterEach(function () {
    this.test.error(new Error('something went wrong'));
  });
  it('should be set to failure in the afterEach', function () {
    console.log('test 1');
  });
  it('should be set to failure in the afterEach', function () {
    console.log('test 2');
  });
});
describe('spec 2', function () {
  it('should succeed', function () {
    console.log('test 3');
  });
});
