
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
		
		if('failed' == test.state){
		    output += '    <failure type="JavaScriptError"><![CDATA[\n' + 
		    		(err.stack ? err.stack : err) + ']]></failure>\n';
		    output += '<system-err><![CDATA[\n' + err + '\n]]></system-err>\n';
		}else{
			var code = escape(clean(test.fn.toString()));
			output += '    <system-out><![CDATA[\n' + code + '\n]]></system-out>\n';
		}
		
		output += '  </testcase>\n';
	});
  
	output += '</testsuite>';

    var fs = require('fs');
    var isDirectory = false;
    var dir = null;
    try{
      dir = fs.lstatSync('test-reports');
      isDirectory = dir.isDirectory();
    }catch(e){
    }
    
    if(!isDirectory){
      fs.mkdirSync('test-reports', 0755);
    }

    var fileName = 'test-reports/TEST-mocha-tests.xml';

    var fd = fs.openSync(fileName, 'w', 0644);
    fs.writeSync(fd, output);
    fs.closeSync(fd);
    
    console.log(' - Wrote: %s', fileName);
  });


}

Junit.prototype.__proto__ = Base.prototype;
