
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Doc`.
 */

exports = module.exports = HTML;

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
    , stat = document.createElement('div');

  stat.innerHTML = '<ul id="stats">'
    + '<li class="passes">passes: <em>0</em></li>'
    + '<li class="failures">failures: <em>0</em></li>'
    + '</ul>';

  if (!root) error('#mocha div missing, add it to your document');

  document.body.appendChild(root);
  document.body.appendChild(stat);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = document.createElement('div');
    el.setAttribute('class', 'suite');

    // title
    var title = document.createElement('h1');
    title.textContent = suite.title;
    el.appendChild(title);

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('div'));
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('test end', function(test){
    console.log(stats);
    // test
    var el = document.createElement('div');
    el.setAttribute('class', 'test ' + (test.passed ? 'pass' : 'fail'));

    // title
    var title = document.createElement('h2');
    title.textContent = test.title;
    el.appendChild(title);

    // code
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    pre.appendChild(code);
    code.textContent = clean(test.fn.toString());
    el.appendChild(pre);

    stack[0].appendChild(el);
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