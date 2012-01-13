
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , Progress = require('../browser/progress')
  , escape = utils.escape;

/**
 * Expose `Doc`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

var statsTemplate = '<ul id="stats">'
  + '<li class="progress"><canvas width="50" height="50"></canvas></li>'
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
    , root = document.getElementById('mocha')
    , stack = [root]
    , stat = Fragment(statsTemplate).firstChild
    , canvas = stat.getElementsByTagName('canvas')[0]
    , progress
    , ctx

  if (root === null) return error('#mocha div missing, add it to your document');

  root.appendChild(stat);

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    progress = new Progress;
  }

  if (progress) progress.size(50);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = Fragment('<div class="suite"><h1>' + suite.title + '</h1></div>').firstChild;

    // container
    stack[0].appendChild(el);
    stack.unshift(Fragment('<div>').firstChild);
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('fail', function(test, err){
    if (err.uncaught) runner.emit('test end', test);
  });

  runner.on('test end', function(test){
    // TODO: add to stats
    var percent = stats.tests / total * 100 | 0;

    if (progress) {
      progress.update(percent).draw(ctx);
    }

    // update stats
    var ms = new Date - stats.start;
    text(root.querySelector('.passes em'), stats.passes);
    text(root.querySelector('.failures em'), stats.failures);
    text(root.querySelector('.duration em'), (ms / 1000).toFixed(2));

    // test
    if (test.passed) {
      var el = Fragment('<div class="test pass"><h2>' + escape(test.title) + '</h2></div>').firstChild
    } else if (test.pending) {
      var el = Fragment('<div class="test pass pending"><h2>' + escape(test.title) + '</h2></div>').firstChild
    } else {
      var el = Fragment('<div class="test fail"><h2>' + escape(test.title) + '</h2></div>').firstChild;
      var str = test.err.stack || test.err;

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      el.appendChild(Fragment('<pre class="error">' + escape(str) + '</pre>'));
    }

    // toggle code
    var h2 = el.getElementsByTagName("h2")[0];

    addEvent(h2, "click", function () {
      if (pre.style.display === 'none') {
        pre.style.display = 'block';
      } else {
        pre.style.display = 'none';
      }
    });

    // code
    // TODO: defer
    if (!test.pending) {
      var code = escape(clean(test.fn.toString()))
        , pre = Fragment('<pre><code>' + code + '</code></pre>').firstChild;
      el.appendChild(pre);
      pre.style.display = 'none';
    }

    stack[0].appendChild(el);
  });
}

/**
 * Display error `msg`.
 */

function error(msg) {
  document.body.appendChild(Fragment('<div id="error">' + msg + '</div>'));
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

function Fragment(html) {
  var div = document.createElement("div")
    , fragment = document.createDocumentFragment();

  div.innerHTML = html;
  while (div.hasChildNodes()) fragment.appendChild(div.firstChild);
  return fragment;
}

function text(el, text) {
  if (el.textContent) {
    el.textContent = text;
  } else {
    el.innerText = text;
  }
}

function addEvent(el, event, callback) {
  if (el.addEventListener) {
    el.addEventListener(event, callback, false);
  } else {
    el.attachEvent("on" + event, callback);
  }
}