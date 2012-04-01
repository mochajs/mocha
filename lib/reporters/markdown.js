
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
    , level = 0
    , buf = '';

  function title(str) {
    return Array(level).join('#') + ' ' + str;
  }

  function indent() {
    return Array(level).join('  ');
  }

  function mapTOC(suite, obj) {
    var ret = obj;
    obj = obj[suite.title] = obj[suite.title] || { suite: suite };
    suite.suites.forEach(function(suite){
      mapTOC(suite, obj);
    });
    return ret;
  }

  function stringifyTOC(obj, level) {
    ++level;
    var buf = '';
    var link;
    for (var key in obj) {
      if ('suite' == key) continue;
      if (key) link = ' - [' + key + '](#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
      if (key) buf += Array(level).join('  ') + link;
      buf += stringifyTOC(obj[key], level);
    }
    --level;
    return buf;
  }

  function generateTOC(suite) {
    var obj = mapTOC(suite, {});
    return stringifyTOC(obj, 0);
  }

  generateTOC(runner.suite);

  runner.on('suite', function(suite){
    ++level;
    var slug = utils.slug(suite.fullTitle());
    buf += '<a name="' + slug + '" />' + '\n';
    buf += title(suite.title) + '\n';
  });

  runner.on('suite end', function(suite){
    --level;
  });

  runner.on('pass', function(test){
    var code = clean(test.fn.toString());
    buf += test.title + '.\n';
    buf += '\n```js';
    buf += code + '\n';
    buf += '```\n\n';
  });

  runner.on('end', function(){
    process.stdout.write('# TOC\n');
    process.stdout.write(generateTOC(runner.suite));
    process.stdout.write(buf);
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