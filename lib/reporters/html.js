
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
  + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
  + '<li class="passes">passes: <em>0</em></li>'
  + '<li class="failures">failures: <em>0</em></li>'
  + '<li class="duration">duration: <em>0</em>s</li>'
  + '</ul>';

/**
 * Filters for tests results
 */

var resultFilterTemplate = '<ul id="result-filter">'
  + '<li class="select-all filter-selected">All</li>'
  + '<li class="select-pass">Pass</li>'
  + '<li class="select-fail">Fail</li>'
  + '</ul>';

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , root = document.getElementById('mocha')
    , stat = fragment(statsTemplate)
    , items = stat.getElementsByTagName('li')
    , passes = items[1].getElementsByTagName('em')[0]
    , failures = items[2].getElementsByTagName('em')[0]
    , duration = items[3].getElementsByTagName('em')[0]
    , canvas = stat.getElementsByTagName('canvas')[0]
    , filter = fragment(resultFilterTemplate)
    , filterItems = filter.getElementsByTagName('li')
    , stack = [root]
    , progress
    , ctx

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    progress = new Progress;
  }

  if (!root) return error('#mocha div missing, add it to your document');

  // Results filter

  root.appendChild(filter);

  function filterUpdate() {
    var selected = getElementsByClassName('filter-selected');
    var selectedClass = selected[0].className.split(" ")[0].split('-')[1];
    var selected = getElementsByClassName('t', filter);
    utils.forEach(getElementsByClassName('test'), function(el) {
      if(selectedClass === "all" || hasClass(el, selectedClass)) {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    });
  }

  on(filter, 'click', function(e) {
    utils.forEach(filterItems, function(el) {
      removeClass(el, 'filter-selected');
      addClass(e.target, 'filter-selected');
    });
    filterUpdate();
  });

  root.appendChild(stat);

  if (progress) progress.size(40);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = fragment('<div class="suite"><h1>%s</h1></div>', suite.title);

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('div'));
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('fail', function(test, err){
    if ('hook' == test.type || err.uncaught) runner.emit('test end', test);
  });

  runner.on('test end', function(test){
    // TODO: add to stats
    var percent = stats.tests / total * 100 | 0;
    if (progress) progress.update(percent).draw(ctx);

    // update stats
    var ms = new Date - stats.start;
    text(passes, stats.passes);
    text(failures, stats.failures);
    text(duration, (ms / 1000).toFixed(2));

    // test
    if ('passed' == test.state) {
      var el = fragment('<div class="test pass"><h2>%e</h2></div>', test.title);
    } else if (test.pending) {
      var el = fragment('<div class="test pass pending"><h2>%e</h2></div>', test.title);
    } else {
      var el = fragment('<div class="test fail"><h2>%e</h2></div>', test.title);
      var str = test.err.stack || test.err.toString();

      // FF / Opera do not add the message
      if (!~str.indexOf(test.err.message)) {
        str = test.err.message + '\n' + str;
      }

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      // Safari doesn't give you a stack. Let's at least provide a source line.
      if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
        str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
      }

      el.appendChild(fragment('<pre class="error">%e</pre>', str));
    
      filterUpdate();
    }

    // toggle code
    var h2 = el.getElementsByTagName('h2')[0];

    on(h2, 'click', function(){
      pre.style.display = 'none' == pre.style.display
        ? 'block'
        : 'none';
    });

    // code
    // TODO: defer
    if (!test.pending) {
      var pre = fragment('<pre><code>%e</code></pre>', clean(test.fn.toString()));
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
  document.body.appendChild(fragment('<div id="error">%s</div>', msg));
}

/**
 * Return a DOM fragment from `html`.
 */

function fragment(html) {
  var args = arguments
    , div = document.createElement('div')
    , i = 1;

  div.innerHTML = html.replace(/%([se])/g, function(_, type){
    switch (type) {
      case 's': return String(args[i++]);
      case 'e': return escape(args[i++]);
    }
  });

  return div.firstChild;
}

/**
 * Set `el` text to `str`.
 */

function text(el, str) {
  if (el.textContent) {
    el.textContent = str;
  } else {
    el.innerText = str;
  }
}

/**
 * Listen on `event` with callback `fn`.
 */

function on(el, event, fn) {
  if (el.addEventListener) {
    el.addEventListener(event, fn, false);
  } else {
    el.attachEvent('on' + event, fn);
  }
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

/**
 * DOM - Returns all elements which have the class `className`
 *
 * @param {String} className
 * @return {Array}
 */
function getElementsByClassName(className) {
  if('getElementsByClassName' in document) {
    return document.getElementsByClassName(className);
  } else {
    var result = [];
    var root = document.getElementsByTagName("body")[0];
    var re = new RegExp('\\b' + className + '\\b');
    utils.forEach(root.getElementsByTagName("*"), function(el) {
      if(re.test(el.className)) result.push(el);
    });
    return result;
  }
}

/**
 * DOM - Returns true if the provided DOM element has 
 * `className` as a class
 *
 * @param {Object} el
 * @param {String} className
 * @return {Boolean} 
 */
function hasClass(el, className) {
  var re = new RegExp('\\b' + className + '\\b');
  return re.test(el.className);
}

/**
 * DOM - Removes the class `className` from the provided DOM
 * element, if it has the class
 *
 * @param {Object} el
 * @param {String} className
 * @return {Object} el
 */
function removeClass(el, className) {
  if(!hasClass(el, className)) return el;
  var previousClass = el.className;
  var re = new RegExp('(^| )' + className + '( |$)');
  var newClass = previousClass.replace(re, '$1');
  newClass = newClass.replace(/ $/, '');
  el.className = newClass;
  return el;
}

/**
 * DOM - Adds the class `className` from the provided DOM
 * element, if it hasn't already the class
 *
 * @param {Object} el
 * @param {String} className
 * @return {Object} el
 */
function addClass(el, className) {
  if(!hasClass(el, className)) {
    el.className = el.className + ' ' + className;
  }
  return el;
}


