var Dot = require('../../lib/reporters/dot')
  , Runner = require('../../lib/runner')
  , Suite = require('../../lib/suite')
  , util = require('util')
  , base = require('../../lib/reporters/base');

describe('dot reporter', function() {
  var suite, runner, output, dotReporter;

  // Using the idea from here: https://gist.github.com/729616
  // This could be in a test util file
  function stdoutHook(callback) {
    var oldWrite = process.stdout.write

    process.stdout.write = (function(write) {
      return function(string, encoding, fd) {
        callback(string, encoding, fd)
      }
    })(process.stdout.write);

    return function() {
      process.stdout.write = oldWrite
    };
  };

  var captureConsoleOutput = function(fn) {
    var unhook = stdoutHook(function(string, encoding, fd) {
      output += util.inspect(string);
    });

    fn.call();

    unhook();
    return output;
  };

  var dotPattern = function(color) {
    return '\'\\u001b[' + color + 'm.\\u001b[0m\''
  };

  beforeEach(function() {
    suite = new Suite(null, 'root');
    runner = new Runner(suite);
    dotReporter = new Dot(runner);
    output = "";
  });

  describe('- start -', function() { 
    it('prints a line break', function() {
      output = captureConsoleOutput(function() {
        runner.emit('start');
      });

      output.should.equal('\'\\n  \'');
    });
  });

  describe('- pending -', function() {
    it('pending prints a dot in pending color', function() {
      output = captureConsoleOutput(function() {
        runner.emit('pending');
      });

      var pending = base.colors['pending'];
      output.should.equal(dotPattern(pending));
    });
  });

  describe('- pass -', function() {
    it('fast pass prints a dot in base\'s pass color', function() {
      output = captureConsoleOutput(function() {
        var test = { duration: 37 }
        runner.emit('pass', test);
      });

      var pass = base.colors['pass'];
      output.should.equal(dotPattern(pass));
    });

    it('medium pass prints a dot in base\'s medium color', function() {
      output = captureConsoleOutput(function() {
        var test = { duration: 38 }
        runner.emit('pass', test);
      });

      var medium = base.colors['medium'];
      output.should.equal(dotPattern(medium));
    });

    it('slow pass prints a dot in bright yellow color', function() {
      output = captureConsoleOutput(function() {
        var test = { duration: 76 }
        runner.emit('pass', test);
      });

      var brightYellow = base.colors['bright yellow'];
      output.should.equal(dotPattern(brightYellow));
    });
  });

});
