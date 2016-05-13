var delay = 500;
var start = new Date().getTime();

describe('delayed execution', function() {
  it('should define a global run function', function() {
    assert(typeof run === 'function', 'run function is not defined');
  });
  it('should have waited ' + delay + 'ms to run this suite', function() {
    assert(new Date().getTime() - delay >= start, 'did not delay');
  });
});

setTimeout(function() {
  describe('delayed execution', function() {
    it('should be able to define a suite asynchronously', function() {
      assert(true);
    });
  });

  if (typeof run === 'function') {
    run();
  } else {
    mocha.suite.run();
  }
}, delay);