
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , escape = utils.escape;

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

  var clean = function(str) {
    str = str
      .replace(/^function *\(.*\) *{/, '')
      .replace(/\s+\}$/, '');

    var spaces = str.match(/^\n?( *)/)[1].length
      , re = new RegExp('^ {' + spaces + '}', 'gm');

    str = str.replace(re, '');

    return str;
  };

  
  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('end', function(suite){

	var output = '<testsuite>';
    
	tests.forEach(function(test){
		
		output += '  <testcase ' + 
			'classname="' + escape(test.parent.title) + '" ' + 
			'name="' + escape(test.title) + '" ' + 
			'time="' + (test.duration/1000) + '">';
		
		if(test.failed == true || 'failed' == test.state){
                    var err = test.err;
		    output += '    <failure type="JavaScriptError"><![CDATA[\n' + 
		    		(err.stack ? err.stack : err) + ']]></failure>\n';
		    output += '<system-err><![CDATA[\n' + err + '\n]]></system-err>\n';

		}else if(test.passed == true || 'passed' == test.state){
			var code = escape(clean(test.fn.toString()));
			output += '    <system-out><![CDATA[\n' + code + '\n]]></system-out>\n';
		
		}else{
			console.log('test.state not known, test not recorded: ' + test);
		}
		
		output += '  </testcase>\n';
	});
  
	output += '</testsuite>';

	console.log(output);
  });

}

Junit.prototype.__proto__ = Base.prototype;
