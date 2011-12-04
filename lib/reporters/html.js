
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

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
  + '<li class="duration">duration: <em>0</em>s</li>'
  + '</ul>';

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
    , root = $('#mocha')
    , stack = [root]
    , stat = $(statsTemplate).appendTo(root);

  if (!root.length) return error('#mocha div missing, add it to your document');

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = $('<div class="suite"><h1>' + suite.title + '</h1></div>');

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
    // update stats
    var ms = new Date - stats.start;
    stat.find('.passes em').text(stats.passes);
    stat.find('.failures em').text(stats.failures);
    stat.find('.duration em').text((ms / 1000).toFixed(2));

    // test
    if (test.passed) {
      var el = $('<div class="test pass"><h2>' + test.title + '</h2></div>')
    } else if (test.pending) {
      var el = $('<div class="test pass pending"><h2>' + test.title + '</h2></div>')
    } else {
      var el = $('<div class="test fail"><h2>' + test.title + '</h2></div>');
      var str = test.err.stack || test.err;
      var err = $('<pre class="error">' + str + '</pre>');
      el.append(err);
    }

    // toggle code
    el.find('h2').toggle(function(){
      pre.slideDown('fast');
    }, function(){
      pre.slideUp('fast');
    });

    // code
    // TODO: defer
    if (!test.pending) {
      var code = utils.escape(clean(test.fn.toString()));
      var pre = $('<pre><code>' + code + '</code></pre>');
      pre.appendTo(el).hide();
    }
    stack[0].append(el);
  });
}

function error(msg) {
  $('<div id="error">' + msg + '</div>').appendTo('body');
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