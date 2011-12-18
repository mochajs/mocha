
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

process.nextTick = (function(){
  // postMessage behaves badly on IE8
  if (window.ActiveXObject || !window.postMessage) {
    return function(fn){ fn() };
  }

  // based on setZeroTimeout by David Baron
  // - http://dbaron.org/log/20100309-faster-timeouts
  var timeouts = []
    , name = 'mocha-zero-timeout'

  return function(fn){
    timeouts.push(fn);
    window.postMessage(name, '*');
    window.addEventListener('message', function(e){
      if (e.source == window && e.data == name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
      }
    }, true);
  }
})();

process.removeListener = function(e){
  if ('uncaughtException' == e) {
    window.onerror = null;
  }
};

process.on = function(e, fn){
  if ('uncaughtException' == e) {
    window.onerror = fn;
  }
};

window.mocha = require('mocha');

// boot
;(function(){
  var suite = new mocha.Suite
    , utils = mocha.utils
    , Reporter = mocha.reporters.HTML

  function parse(qs) {
    return utils.reduce(qs.replace('?', '').split('&'), function(obj, pair){
        var i = pair.indexOf('=')
          , key = pair.slice(0, i)
          , val = pair.slice(++i);

        obj[key] = decodeURIComponent(val);
        return obj;
      }, {});
  }

  mocha.setup = function(ui){
    ui = mocha.interfaces[ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    ui(suite);
    suite.emit('pre-require', window);
  };

  mocha.run = function(){
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    var query = parse(window.location.search || "");
    if (query.grep) runner.grep(new RegExp(query.grep));
    return runner.run();
  };
})();
