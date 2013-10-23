var calls = 0;

describe('flakey beforeEach', function() {
  beforeEach(function(done) {
    if (calls === 0) done(new Error("I flake the first time"));
    else done();
    calls++;
  });

  it('should error with hook error', function() {
    if (1 + 1 !== 2) throw new Error("you failed");
  });

  it('should not error because hook doesnt fail', function() {
    if (1 + 1 === 3) throw new Error("you failed again");
  });
});

