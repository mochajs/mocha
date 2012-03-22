
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Markdown`.
 */

exports = module.exports = Markdown;

/**
 * Initialize a new `Markdown` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Markdown(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , level = 0;

  function title(str) {
    return Array(level).join('#') + ' ' + str;
  }

  runner.on('suite', function(suite){
    ++level;
    process.stdout.write(title(suite.title) + '\n');
  });

  runner.on('suite end', function(suite){
    --level;
  });

  runner.on('pass', function(test){
    var code = utils.escape(clean(test.fn.toString()));
    process.stdout.write('\n ' + test.title + '.\n');
    process.stdout.write('\n```js');
    process.stdout.write(code + '\n');
    process.stdout.write('```\n\n');
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