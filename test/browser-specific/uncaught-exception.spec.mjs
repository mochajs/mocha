import '/base/mocha.js';

var Mocha = window.Mocha;
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;

mocha.allowUncaught()

it('should include the stack of uncaught exceptions', function(done) {
  var suite = new Suite('Suite', 'root');
  var runner = new Runner(suite);
  runner.allowUncaught = true;
  var err;
  runner.fail = function(e) {
    err = e;
  };

  setTimeout(function throwTestError() {
    throw new Error('test error');
  }, 1);

  setTimeout(function() {
    expect(err, 'to be an', Error);
    expect(err.stack, 'to contain', 'at throwTestError')
    done();
  }, 2);
});
