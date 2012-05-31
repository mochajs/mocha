/**
 * Node shims.
 *
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

process = {};
process.exit = function(status){};
process.stdout = {};
global = window;

/**
 * next tick implementation.
 */

process.nextTick = (function(){
  // postMessage behaves badly on IE8
  if (window.ActiveXObject || !window.postMessage) {
    return function(fn){ fn() };
  }

  // based on setZeroTimeout by David Baron
  // - http://dbaron.org/log/20100309-faster-timeouts
  var timeouts = []
    , name = 'mocha-zero-timeout'

  window.addEventListener('message', function(e){
    if (e.source == window && e.data == name) {
      if (e.stopPropagation) e.stopPropagation();
      if (timeouts.length) timeouts.shift()();
    }
  }, true);

  return function(fn){
    timeouts.push(fn);
    window.postMessage(name, '*');
  }
})();

/**
 * Remove uncaughtException listener.
 */

process.removeListener = function(e){
  if ('uncaughtException' == e) {
    window.onerror = null;
  }
};

/**
 * Implements uncaughtException listener.
 */

process.on = function(e, fn){
  if ('uncaughtException' == e) {
    window.onerror = fn;
  }
};

/**
 * Expose mocha.
 */

window.mocha = require('mocha');

// boot
;(function(){
  var suite = new mocha.Suite('', new mocha.Context)
    , utils = mocha.utils
    , options = {}

  /**
   * Highlight the given string of `js`.
   */

  function highlight(js) {
    return js
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
      .replace(/('.*?')/gm, '<span class="string">$1</span>')
      .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
      .replace(/(\d+)/gm, '<span class="number">$1</span>')
      .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
      .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
  }

  /**
   * Highlight code contents.
   */

  function highlightCode() {
    var code = document.getElementsByTagName('code');
    for (var i = 0, len = code.length; i < len; ++i) {
      code[i].innerHTML = highlight(code[i].innerHTML);
    }
  }

  /**
   * Parse the given `qs`.
   */

  function parse(qs) {
    return utils.reduce(qs.replace('?', '').split('&'), function(obj, pair){
      var i = pair.indexOf('=')
        , key = pair.slice(0, i)
        , val = pair.slice(++i);

      obj[key] = decodeURIComponent(val);
      return obj;
    }, {});
  }

  /**
   * Setup mocha with the given setting options.
   */

  mocha.setup = function(opts){
    if ('string' === typeof opts) options.ui = opts;
    else options = opts;

    ui = mocha.interfaces[options.ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    if (options.timeout) suite.timeout(options.timeout);
    ui(suite);
    suite.emit('pre-require', window);
  };

  /**
   * Run mocha, returning the Runner.
   */

  mocha.run = function(fn){
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var Reporter = options.reporter || mocha.reporters.HTML;
    var reporter = new Reporter(runner);
    var query = parse(window.location.search || "");
    if (query.grep) runner.grep(new RegExp(query.grep));
    if (options.ignoreLeaks) runner.ignoreLeaks = true;
    if (options.globals) runner.globals(options.globals);
    runner.globals(['location']);
    runner.on('end', highlightCode);
    return runner.run(fn);
  };
})();
