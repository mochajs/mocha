
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Doc`.
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

  var self = this
    , stats = this.stats
    , total = runner.total;

  var output = '';

  var log = function(msg){
    output += msg + '\n';
//    console.log(msg);
  };
  
  
  runner.on('start', function() {
    console.log("Starting...");
  });
  
  runner.on('pending', function(test) {
    console.log("Pending...", test.title);
  });

  runner.on('suite', function(suite){
    if (suite.root) return;
    output = '';
    log('<testsuite>');
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    log('</testsuite>');

    //console.log(output);
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

    var escapedTitle = suite.title
    	.replace(/[^a-zA-Z ]/g,"")
    	.replace(/ /g,"-");
    
    var fileName = 'test-reports/TEST-' + escapedTitle + '.xml';
    
    var writeStream = fs.createWriteStream(fileName, {
    	flags: 'w',
    	encoding: null,
    	mode: 0755 });
    
    writeStream.write(output);
    
    console.log(' - Wrote: %s', fileName);
  });

  runner.on('pass', function(test){
    log('  <testcase ' + 
    		'classname="' + test.parent.title + '" ' + 
    		'name="' + test.title + '" time="' + (test.duration/1000) + '">');
    var code = utils.escape(clean(test.fn.toString()));
    log('<system-out><![CDATA[\n' + code + '\n]]></system-out>');
    log('  </testcase>\n');
  });
  
  
  runner.on('fail', function(test, err){
    log('  <testcase classname="' + test.parent.title + '" name="' + test.title + '">');
    log('    <failure type="JavaScriptError"><![CDATA[\n' + 
    		(err.stack ? err.stack : err)
    		+ ']]></failure>');
    log('<system-err><![CDATA[\n' + err + '\n]]></system-err>');
    log('  </testcase>\n');
  });
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

  str = str.replace(re, '');

  return str;
}

