describe('suite1', function() {
  it('should display this spec', function() {});

  it('should only display this error', function(done) {
    throw new Error('this should be displayed');
  });

  it('should not display this error', function(done) {
    throw new Error('this should not be displayed');
  });
});

describe('suite2', function() {
  // TODO: When uncommented, the hook below is ran and throws an exception
  // despite the previous failure with the bail flag. This is a bug. Uncomment
  // once resolved

  // before(function(done) {
  //   throw new Error('this hook should not be displayed');
  // });

  it('should not display this error', function(done) {
    throw new Error('this should not be displayed');
  });
});
