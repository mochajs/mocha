
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
  + '<li class="run-all"><a href="javascript:void(0)">Run All</a></li>'
  + '<li class=""><label for="hide-passed"><input type="checkbox" id="hide-passed" />hide passed</lable></li>'
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

  var self = this
    , stats = this.stats
    , total = runner.total
    , root = document.getElementById('mocha')
    , stat = fragment(statsTemplate)
    , items = stat.getElementsByTagName('li')
    , hidePassedCheck = stat.getElementsByTagName('input')[0]
    , runAll = items[1].getElementsByTagName('a')[0]
    , passes = items[3].getElementsByTagName('em')[0]
    , failures = items[4].getElementsByTagName('em')[0]
    , duration = items[5].getElementsByTagName('em')[0]
    , canvas = stat.getElementsByTagName('canvas')[0]
    , dots = fragment('<div class="dots"></div>')
    , stack = [root]
    , progress
    , ctx

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    progress = new Progress;
  }

  if (!root) return error('#mocha div missing, add it to your document');

  // ## focusing on runables

  // Changes window.location to grep for specified title
  function focusOn(title) {
    var search = "?";
    if(title) {
      // escape regex characters
      title = title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      // anchor at beginning
      title = "^" + title;
      // and URL-encode
      title = window.escape(title);
      search += "grep=" + title;
    }
    window.location.search = search;
    return false;
  }

  // Append a link to el's first child (h1 or h2) that, when clicked
  // changes window.location grep parameter to only include this runnable and its children
  function addFocusLink(el, runnable) {
    var a = fragment("<a href='javascript:void(0)' class='focus'>(focus)</a>");
    on(a, 'click', function() {
      focusOn(runnable.fullTitle());
      return false;
    });
    el.firstChild.appendChild(a);
  }

  on(runAll, 'click', function() {
    focusOn();
  });

  // if we're focusing on something, we don't want to show runnables without any tests
  if(window.location.search.indexOf("grep") >= 0) {
    root.className += " hide-empty";
  }
  
  // ## hiding runables that passed

  function hidePassed(val) {
    if(val != undefined) {
      var hash = window.location.hash.replace(/\&?hide-passed/, '');
      if(val) {
        hash += "&hide-passed";
      }
      window.location.hash = hash;
      return val;
    }
    return (window.location.hash.indexOf('hide-passed') >= 0);
  }

  function updateVisibilityOfPassed() {
    var className = root.className.replace(' hide-passed', '');
    if(window.location.hash.indexOf('hide-passed') >= 0) {
      className += ' hide-passed';
    }
    root.className = className;    
  }

  // propagates the test state up its parent suites
  function propageTestState(suite, state) {

    while(suite) {
      
      if(!suite.root) {
        if(state == 'failed' && !suite.failed) {
          suite.el.className = "suite failed";
        } else if(state == 'pending' && !suite.pending) {
          suite.el.className = "suite pending";        
        } else if(state == 'passed' && !suite.passed) {
          suite.el.className = "suite passed";
        }
      }

      suite[state] = (suite[state]||0) + 1;

      suite = suite.parent;
    }
  }

  updateVisibilityOfPassed();
  
  hidePassedCheck.checked = hidePassed();

  on(hidePassedCheck, 'click', function() {
    var hash = window.location.hash.replace(/\&?hide-passed/, '');
    hidePassed(hidePassedCheck.checked);
    updateVisibilityOfPassed();
  });

  root.appendChild(stat);
  root.appendChild(dots);

  if (progress) progress.size(40);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = fragment('<div class="suite"><h1>%s</h1></div>', suite.title);
    addFocusLink(el, suite);

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('div'));
    el.appendChild(stack[0]);
    suite.el = el;
  });

  runner.on('suite end', function(suite){
    if (suite.root) {
      dots.appendChild(fragment('<span class="totals"><strong class="passed">%s</strong>/<strong class="failed">%s</strong>/<strong class="pending">%s</strong></span>',
        suite.passed||0, suite.failed||0, suite.pending||0));
      return;
    }

    if(suite.parent.root) {
      // insert space between top-level suites
      dots.appendChild(document.createTextNode(' '));
    }

    stack.shift();
  });

  runner.on('fail', function(test, err){
    if (err.uncaught) runner.emit('test end', test);
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
    var state;
    if ('passed' == test.state) {
      state = 'passed';
      var el = fragment('<div class="test pass"><h2>%e</h2></div>', test.title);
    } else if (test.pending) {
      state = 'pending';
      var el = fragment('<div class="test pass pending"><h2>%e</h2></div>', test.title);
    } else {
      state = 'failed';
      var el = fragment('<div class="test failed"><h2>%e</h2></div>', test.title);
      var str = test.err.stack || test.err;

      // FF / Opera do not add the message
      if (!~str.indexOf(test.err.message)) {
        str = test.err.message + '\n' + str;
      }

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      el.appendChild(fragment('<pre class="error">%e</pre>', str));
    }
    addFocusLink(el, test);

    // update parent suites
    propageTestState(test.parent, state);

    dots.appendChild(fragment('<span class="%s">•</span>', state));

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
