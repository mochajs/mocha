
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
global = this;

process.nextTick = function(fn){ fn(); };

process.removeListener = function(ev){
  if ('uncaughtException' == ev) {
    window.onerror = null;
  }
};

process.on = function(ev, fn){
  if ('uncaughtException' == ev) {
    window.onerror = fn;
  }
};

mocha = require('mocha');

// boot
;(function(){
  var suite = new mocha.Suite;
  var Reporter = mocha.reporters.HTML;
  var hooks;

  function parse(qs) {
    return qs
      .replace('?', '')
      .split('&')
      .reduce(function(obj, pair){
        var i = pair.indexOf('=')
          , key = pair.slice(0, i)
          , val = pair.slice(++i);

        obj[key] = decodeURIComponent(val);
        return obj;
      }, {});
  }

  mocha.setup = function(ui, globalHooks){
    ui = mocha.interfaces[ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    ui(suite);
    suite.emit('pre-require', global);
    hooks = globalHooks;
  };

  mocha.run = function(){
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var reporter = new Reporter(runner);
    var query = parse(window.location.search || "");
    if (query.grep) runner.grep(new RegExp(query.grep));

    // inject global hooks given to setup
    var event;
    if (typeof(hooks) === 'object') {
      for (event in hooks) {
        if (typeof(hooks[event]) === 'function') {
          (function(event){
            runner.on(event, function(data) {
              hooks[event](typeof(data) === 'undefined' ? reporter.stats : data);
            });
          })(event);
        }
      }
    }

    return runner.run();
  };
})();
