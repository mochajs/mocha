
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , escape = utils.escape
  , clean = utils.clean;

/**
 * Expose `Junit`.
 */

exports = module.exports = Junit;

/**
 * Initialize a new `Junit` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Junit(runner) {
  Base.call(this, runner);

  var tests = [];

  runner.on('test end', function (test) {
    tests.push(test);
  });

  runner.on('end', function (suite) {

  var output = '<testsuite>';
    
  tests.forEach(function (test) {
    
    console.log('  <testcase ' + 
      'classname="' + escape(test.parent.title) + '" ' + 
      'name="' + escape(test.title) + '" ' + 
      'time="' + (test.duration/1000) + '">');
    
    if (test.failed || 'failed' == test.state) {
                    var err = test.err;
        console.log('    <failure type="JavaScriptError"><![CDATA[\n' + 
            (err.stack ? err.stack : err) + ']]></failure>\n');
        console.log('<system-err><![CDATA[\n' + err + '\n]]></system-err>\n');

    } else if (test.passed == true || 'passed' == test.state) {
      var code = escape(clean(test.fn.toString()));
      console.log('    <system-out><![CDATA[\n' + code + '\n]]></system-out>\n');
    
    } else {
      console.log('test.state not known, test not recorded: ' + test);
    }
    
    console.log('  </testcase>\n');
  });
  
  console.log('</testsuite>');

  console.log(output);
  });

}

Junit.prototype.__proto__ = Base.prototype;
