var Dot = require('../../lib/reporters/dot')
  , Runner = require('../../lib/runner')
  , Suite = require('../../lib/suite')
  , util = require('util')

describe('dot reporter', function() {
  var suite, runner, output, unhook, dotReporter;

  // Using the idea from here: https://gist.github.com/729616
  function stdoutHook(callback) {
    var oldWrite = process.stdout.write

    process.stdout.write = (function(write) {
      return function(string, encoding, fd) {
        //write.apply(process.stdout, arguments)
        callback(string, encoding, fd)
      }
    })(process.stdout.write);

    return function() {
      process.stdout.write = oldWrite
    };
  };

  beforeEach(function() {
    suite = new Suite(null, 'root');
    runner = new Runner(suite);
    dotReporter = new Dot(runner);
    output = "";
    unhook = stdoutHook(function(string, encoding, fd) {
      output += util.inspect(string);
    });
  });

  it('start prints a line break', function() {
    runner.emit('start');
    output.should.equal('\'\\n  \'');

    unhook();
  });

  it('pending prints a dot in pending color', function() {
    runner.emit('pending');

    // 36 is the pending color
    output.should.equal('\'\\u001b[36m.\\u001b[0m\'');

    unhook();
  });

  it('fast pass prints a dot', function() {
    var test = {}
    runner.emit('pass', test);

    // 90 is the fast pass color
    output.should.equal('\'\\u001b[90m.\\u001b[0m\'');

    unhook();
  });
});
