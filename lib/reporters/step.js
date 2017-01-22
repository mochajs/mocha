'use strict';

var Base = require('./base');
var inherits = require('../utils').inherits;

function Step (runner) {
  Base.call(this, runner);

  var self = this;
  var suiteStack = [];
  var failingTestCount = 0;

  function indent (offset) {
    var indentCount = (offset || 0) + suiteStack.length;

    return Array(indentCount).fill('  ').join('');
  }

  runner.on('suite', function (suite) {
    suiteStack.push(suite);
    console.log(indent() + suite.title);
  });

  runner.on('suite end', function () {
    suiteStack.pop();
  });
  runner.on('hook', function (hook) {
    console.log(indent(1) + hook.title);
  });
  runner.on('pass', function (test) {
    var fmt;

    if (test.speed === 'fast') {
      fmt = indent() +
        Base.color('checkmark', '  ' + Base.symbols.ok) +
        Base.color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt = indent() +
        Base.color('checkmark', '  ' + Base.symbols.ok) +
        Base.color('pass', ' %s') +
        Base.color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });
  runner.on('fail', function (test) {
    console.log(indent() + Base.color('fail', '  %d) %s'), ++failingTestCount, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}
inherits(Step, Base);

exports = module.exports = Step;

