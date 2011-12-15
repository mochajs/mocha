
/**
 * Node shims.
 *
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

module = {};
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

  mocha.setup = function(ui){
    ui = mocha.interfaces[ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    ui(suite);
    suite.emit('pre-require', global);
  };

  mocha.add = function(tests){
    suite.emit('require', tests);
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
