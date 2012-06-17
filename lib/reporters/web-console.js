
/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `WebConsole`.
 */

exports = module.exports = WebConsoleReporter;

/**
 * Initialize a new `WebConsole` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function WebConsoleReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []

  runner.on('end', function(){
    group(runner.suite.suites);
  });


  runner.on('suite', function(suite){
    if (suite.root) return;
    suite.completedTests = [];
    suite.passedCount = 0;
    suite.failedCount = 0;
    suite.pendingCount = 0;
    suite.totalCount = 0;
  });

  runner.on('test end', function(test){
    var suite = test.parent;
    suite.completedTests.push(test);
    while (suite && !suite.root) {
      suite.totalCount += 1;
      suite = suite.parent
    }
    suite = test.parent;
    if ('passed' == test.state) {
      while (suite && !suite.root) {
        suite.passedCount += 1;
        suite = suite.parent
      }
      // test.speed, test.title, test.duration
    } else if (test.pending) {
      // test.title
      while (suite && !suite.root) {
        suite.pendingCount += 1;
        suite.pending = true;
        suite = suite.parent
      }
    } else {
      while (suite && !suite.root) {
        suite.failed = true;
        suite.failedCount += 1;
        suite = suite.parent
      }
      // test.title
      var str = test.err.stack || test.err.toString();

      // FF / Opera do not add the message
      if (!~str.indexOf(test.err.message)) {
        str = test.err.message + '\n' + str;
      }

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      // Safari doesn't give you a stack. Let's at least provide a source line.
      if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
        str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
      }

      test.message = str;
    }  
    tests.push(test);
  });
}

/**
 * Group test output using console.group or console.groupCollapsed.
 */

function group(suites) {
  suites.forEach(function(suite) {
    consoleGroupStart(!suite.failed && !suite.pending, title(suite));
    
    if (suite.completedTests.length) {
      suite.completedTests.forEach(function(test) {
        switch (test.state) {
          case 'failed':
            consoleGroupStart(false, test.title);
            console.info(clean(test.fn.toString()));
            console.error(test.message);
            consoleGroupEnd();
            break;
          case 'passed':
            consoleGroupStart(true, test.title);
            console.info(clean(test.fn.toString()));
            consoleGroupEnd();
            break;
          default:
            console.warn(test.title);
        }
      });
    }

    if (suite.suites.length) {
      group(suite.suites);
    }

    consoleGroupEnd();
  });
}

function title(suite) {
  var title = suite.title + " (" + suite.passedCount + "/" + suite.totalCount + " passed";
  
  if (suite.failedCount) {
    title += ", " + suite.failedCount + " failures";
  }
  if (suite.pendingCount) {
    title += ", " + suite.pendingCount + " pending";
  }
  title += ")";
  
  return title;
}

function consoleGroupStart(collapse, string) {
  if (console.group) {
    return collapse && console.groupCollapsed ? console.groupCollapsed(string) : console.group(string);
  }
}

function consoleGroupEnd() {
  if (console.groupEnd) {
    console.groupEnd();
  }
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
 str = str
   .replace(/^function *\(.*\) *{/, '')
   .replace(/\s+\}$/, '');

 var spaces = str.match(/^\n?( *)/)[1].length
   , re = new RegExp('^ {' + spaces + '}', 'gm');

 str = str
   .replace(re, '')
   .replace(/^\s+/, '');

 return str;
}