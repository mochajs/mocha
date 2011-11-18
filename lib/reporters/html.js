
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Doc`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

var statsTemplate = '<ul id="stats">'
  + '<li class="passes">passes: <em>0</em></li>'
  + '<li class="failures">failures: <em>0</em></li>'
  + '</ul>';

/**
 * $ is annoying.
 */

var o = $;

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  // TODO: clean up

  var self = this
    , stats = this.stats
    , total = runner.total
    , root = o('#mocha')
    , stack = [root]
    , stat = o(statsTemplate).appendTo(root);

  if (!root.length) error('#mocha div missing, add it to your document');

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = o('<div class="suite"><h1>' + suite.title + '</h1></div>');

    // container
    stack[0].append(el);
    stack.unshift($('<div>'));
    el.append(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('test end', function(test){
    console.log(stats);
    // test
    var str = test.passed ? 'pass' : 'fail';
    var el = o('<div class="test ' + str + '"><h2>' + test.title + '</h2></div>')

    // code
    var pre = o('<pre><code>' + clean(test.fn.toString()) + '</code></pre>');
    pre.appendTo(el);
    stack[0].append(el);
  });

  runner.on('end', function(){
    process.exit(stats.failures);
  });
}

function error(msg) {
  // TODO: nicer
  throw new Error(msg);
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